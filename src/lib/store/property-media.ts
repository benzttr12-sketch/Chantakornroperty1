'use client';

import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { auth, storage } from '@/lib/firebase/client';

const MAX_PROPERTY_IMAGE_BYTES = 10 * 1024 * 1024;
const MAX_PROPERTY_IMAGES = 20;
const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

async function requireStaffStorage() {
  const user = auth?.currentUser;
  if (!storage || !user) throw new Error('กรุณาเข้าสู่ระบบเจ้าหน้าที่ก่อนจัดการรูปทรัพย์');
  const token = await user.getIdTokenResult();
  if (token.claims.role !== 'ADMIN' && token.claims.role !== 'AGENT') {
    throw new Error('บัญชีนี้ไม่มีสิทธิ์จัดการรูปทรัพย์');
  }
  return { storage, user };
}

function extension(file: File) {
  if (file.type === 'image/png') return 'png';
  if (file.type === 'image/webp') return 'webp';
  return 'jpg';
}

export function validatePropertyImages(files: File[], existingCount = 0) {
  if (files.length + existingCount > MAX_PROPERTY_IMAGES) {
    throw new Error(`อัปโหลดรูปได้สูงสุด ${MAX_PROPERTY_IMAGES} รูปต่อประกาศ`);
  }
  for (const file of files) {
    if (!ALLOWED_IMAGE_TYPES.has(file.type)) throw new Error(`ไฟล์ ${file.name} ต้องเป็น JPG, PNG หรือ WebP`);
    if (file.size <= 0) throw new Error(`ไฟล์ ${file.name} ไม่มีข้อมูล`);
    if (file.size > MAX_PROPERTY_IMAGE_BYTES) throw new Error(`ไฟล์ ${file.name} ต้องมีขนาดไม่เกิน 10 MB`);
  }
}

function safeFolder(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9-_]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80) || 'property';
}

export async function uploadPropertyImages(files: File[], folder: string, existingCount = 0): Promise<string[]> {
  validatePropertyImages(files, existingCount);
  const { storage, user } = await requireStaffStorage();
  const safe = safeFolder(folder);
  const uploaded: string[] = [];
  const uploadedRefs: ReturnType<typeof ref>[] = [];

  try {
    for (const file of files) {
      const objectRef = ref(
        storage,
        `property-images/${user.uid}/${safe}/${Date.now()}-${crypto.randomUUID()}.${extension(file)}`
      );
      await uploadBytes(objectRef, file, {
        contentType: file.type,
        cacheControl: 'public,max-age=31536000,immutable',
      });
      uploadedRefs.push(objectRef);
      uploaded.push(await getDownloadURL(objectRef));
    }
    return uploaded;
  } catch (error) {
    await Promise.all(uploadedRefs.map(objectRef => deleteObject(objectRef).catch(() => undefined)));
    throw error;
  }
}

export async function deleteManagedPropertyImage(url: string) {
  if (!url || !url.includes('firebasestorage.googleapis.com')) return;
  const { storage } = await requireStaffStorage();
  try {
    await deleteObject(ref(storage, url));
  } catch {
    // Firestore remains the source of truth; inaccessible legacy files can be cleaned by an admin later.
  }
}
