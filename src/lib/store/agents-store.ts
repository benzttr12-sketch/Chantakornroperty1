import { doc, getDocs, collection, updateDoc } from 'firebase/firestore';
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { auth, db, storage } from '@/lib/firebase/client';
import type { Agent } from '@/lib/types';

const MAX_AGENT_PHOTO_BYTES = 5 * 1024 * 1024;
const ALLOWED = new Set(['image/jpeg', 'image/png', 'image/webp']);

function requireFirebase() {
  if (!db || !storage) throw new Error('ยังไม่ได้ตั้งค่า Firebase สำหรับเว็บไซต์นี้');
  return { db, storage };
}

async function requireAdmin() {
  const user = auth?.currentUser;
  if (!user) throw new Error('กรุณาเข้าสู่ระบบผู้ดูแลก่อนจัดการรูปนายหน้า');
  const token = await user.getIdTokenResult();
  if (token.claims.role !== 'ADMIN') throw new Error('เฉพาะผู้ดูแลระบบเท่านั้นที่เปลี่ยนรูปนายหน้าได้');
}

export async function fetchAgentProfiles(): Promise<Agent[]> {
  const { db } = requireFirebase();
  const snap = await getDocs(collection(db, 'agents'));
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Agent)).sort((a, b) => a.name.localeCompare(b.name, 'th'));
}

function validate(file: File) {
  if (file.size <= 0) throw new Error('ไฟล์รูปไม่มีข้อมูล');
  if (!ALLOWED.has(file.type)) throw new Error('รองรับเฉพาะไฟล์ JPG, PNG หรือ WebP');
  if (file.size > MAX_AGENT_PHOTO_BYTES) throw new Error('รูปต้องมีขนาดไม่เกิน 5 MB');
}

function ext(file: File) {
  return file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg';
}

async function deleteManagedPhoto(url: string) {
  if (!url || !url.includes('firebasestorage.googleapis.com')) return;
  try { await deleteObject(ref(requireFirebase().storage, url)); } catch {}
}

export async function uploadAgentPhoto(agent: Agent, file: File): Promise<Agent> {
  validate(file);
  await requireAdmin();
  const { db, storage } = requireFirebase();
  const objectRef = ref(storage, `agent-photos/${agent.id}/${Date.now()}-${crypto.randomUUID()}.${ext(file)}`);
  let photoUrl = '';
  try {
    await uploadBytes(objectRef, file, { contentType: file.type, cacheControl: 'public,max-age=3600' });
    photoUrl = await getDownloadURL(objectRef);
    await updateDoc(doc(db, 'agents', agent.id), { photo_url: photoUrl });
  } catch (error) {
    await deleteObject(objectRef).catch(() => undefined);
    throw error;
  }
  if (agent.photo_url && agent.photo_url !== photoUrl) await deleteManagedPhoto(agent.photo_url);
  return { ...agent, photo_url: photoUrl };
}

export async function removeAgentPhoto(agent: Agent): Promise<Agent> {
  await requireAdmin();
  const { db } = requireFirebase();
  await updateDoc(doc(db, 'agents', agent.id), { photo_url: '' });
  await deleteManagedPhoto(agent.photo_url);
  return { ...agent, photo_url: '' };
}
