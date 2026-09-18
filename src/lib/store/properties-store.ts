'use client';

import {
  collection,
  deleteDoc,
  deleteField,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { backendConfigurationError } from '@/lib/backend';
import { deleteManagedPropertyImage } from '@/lib/store/property-media';
import type { Agent, Inquiry, Property, PropertyFilters, UserProfile } from '@/lib/types';

const STORAGE_KEY_FAVORITES = 'chantakorn_favorites';
const MAX_PROPERTY_IMAGES = 20;

function requireDb() {
  if (!db) throw backendConfigurationError();
  return db;
}

function readArray<T>(key: string, fallback: T[], valid: (item: unknown) => item is T): T[] {
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(key);
      if (raw !== null) {
        const parsed: unknown = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed.filter(valid);
      }
    } catch {}
  }
  return [...fallback];
}

function writeArray<T>(key: string, value: T[]) {
  if (typeof window === 'undefined') throw new Error('กรุณาเปิดหน้านี้ในเว็บเบราว์เซอร์');
  localStorage.setItem(key, JSON.stringify(value));
}

function stripUndefined<T>(value: T): T {
  if (Array.isArray(value)) return value.map(stripUndefined) as T;
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .filter(([, v]) => v !== undefined)
        .map(([k, v]) => [k, stripUndefined(v)])
    ) as T;
  }
  return value;
}

function toIsoDate(value: unknown): string {
  if (typeof value === 'string') return value;
  if (value && typeof value === 'object' && 'toDate' in value) {
    const toDate = (value as { toDate?: () => Date }).toDate;
    if (typeof toDate === 'function') {
      try { return toDate.call(value).toISOString(); } catch {}
    }
  }
  return '';
}

function cleanText(value: string | undefined, maxLength: number): string {
  return (value || '').trim().slice(0, maxLength);
}

function assertPropertyData(property: Omit<Property, 'id' | 'created_at'> | Partial<Property>) {
  const title = cleanText(property.title, 240);
  const slug = cleanText(property.slug, 160);
  const description = cleanText(property.description, 12000);
  const province = cleanText(property.province, 100);
  const district = cleanText(property.district, 100);
  const price = Number(property.price);
  const latitude = Number(property.latitude);
  const longitude = Number(property.longitude);
  const images = Array.isArray(property.images) ? property.images.filter((url): url is string => typeof url === 'string' && Boolean(url.trim())) : [];
  const coverImage = cleanText(property.cover_image, 2048);

  if (title.length < 3) throw new Error('กรุณาระบุชื่อประกาศอย่างน้อย 3 ตัวอักษร');
  if (slug.length < 2 || /[/?#\\]/.test(slug)) throw new Error('Slug ไม่ถูกต้อง กรุณาใช้ข้อความที่ไม่มี / ? # หรือเครื่องหมายทับ');
  if (description.length < 10) throw new Error('กรุณาระบุรายละเอียดทรัพย์อย่างน้อย 10 ตัวอักษร');
  if (!['house', 'land', 'condo', 'commercial', 'investment', 'consignment'].includes(String(property.property_type))) throw new Error('ประเภททรัพย์ไม่ถูกต้อง');
  if (!['sale', 'rent'].includes(String(property.status))) throw new Error('สถานะประกาศไม่ถูกต้อง');
  if (!Number.isFinite(price) || price <= 0 || price > 1_000_000_000_000) throw new Error('ราคาทรัพย์ไม่ถูกต้อง');
  if (province.length < 2 || district.length < 2) throw new Error('กรุณาระบุจังหวัดและอำเภอ/เขตให้ครบถ้วน');
  if (!Number.isFinite(latitude) || Math.abs(latitude) > 90 || !Number.isFinite(longitude) || Math.abs(longitude) > 180) throw new Error('พิกัดละติจูดหรือลองจิจูดไม่ถูกต้อง');

  for (const [label, value, max] of [
    ['ห้องนอน', property.bedrooms, 200],
    ['ห้องน้ำ', property.bathrooms, 200],
    ['ที่จอดรถ', property.parking, 500],
  ] as const) {
    const numeric = Number(value);
    if (!Number.isInteger(numeric) || numeric < 0 || numeric > max) throw new Error(`${label}ต้องเป็นจำนวนเต็มที่ถูกต้อง`);
  }

  for (const [label, value] of [['ขนาดที่ดิน', property.land_size], ['พื้นที่ใช้สอย', property.usable_area]] as const) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric) || numeric < 0) throw new Error(`${label}ไม่ถูกต้อง`);
  }

  if (property.year_built !== undefined) {
    const year = Number(property.year_built);
    if (!Number.isInteger(year) || year < 1800 || year > 2100) throw new Error('ปีที่สร้างไม่ถูกต้อง');
  }
  if (images.length < 1 || images.length > MAX_PROPERTY_IMAGES) throw new Error(`ประกาศต้องมีรูป 1-${MAX_PROPERTY_IMAGES} รูป`);
  if (!coverImage || !images.includes(coverImage)) throw new Error('กรุณาเลือกรูปปกจากรูปที่อัปโหลด');
  if (Array.isArray(property.features) && property.features.length > 50) throw new Error('รายการจุดเด่นมีมากเกินไป');
}

async function assertSlugAvailable(slug: string, excludeId?: string) {
  const snap = await getDocs(query(collection(requireDb(), 'properties'), where('slug', '==', slug), limit(2)));
  if (snap.docs.some(item => item.id !== excludeId)) {
    throw new Error('Slug นี้ถูกใช้แล้ว กรุณาเปลี่ยน URL Address ของประกาศ');
  }
}

function filterProperties(properties: Property[], filters?: PropertyFilters): Property[] {
  const contains = (value: string | undefined, needle: string) => (value || '').toLowerCase().includes(needle.toLowerCase());
  return properties.filter(property => {
    if (filters?.type && filters.type !== 'all' && property.property_type !== filters.type) return false;
    if (filters?.status && filters.status !== 'all' && property.status !== filters.status) return false;
    if (filters?.province && !contains(property.province, filters.province)) return false;
    if (filters?.district && !contains(property.district, filters.district)) return false;
    if (filters?.subdistrict && !contains(property.subdistrict, filters.subdistrict)) return false;
    if (filters?.minPrice !== undefined && property.price < filters.minPrice) return false;
    if (filters?.maxPrice !== undefined && property.price > filters.maxPrice) return false;
    if (filters?.bedrooms && filters.bedrooms !== 'any' && property.bedrooms < filters.bedrooms) return false;
    if (filters?.bathrooms && filters.bathrooms !== 'any' && property.bathrooms < filters.bathrooms) return false;
    if (filters?.searchQuery && ![property.title, property.description, property.province, property.district, property.subdistrict]
      .some(v => contains(v, filters.searchQuery!))) return false;
    if (filters?.features?.length && !filters.features.every(feature => property.features.some(v => contains(v, feature)))) return false;
    return true;
  }).sort((a, b) => {
    if (filters?.sortBy === 'price_asc') return a.price - b.price;
    if (filters?.sortBy === 'price_desc') return b.price - a.price;
    if (filters?.sortBy === 'popular') return Number(b.featured) - Number(a.featured);
    return (b.created_at || '').localeCompare(a.created_at || '');
  });
}

async function attachAgents(properties: Property[]): Promise<Property[]> {
  const agents = await fetchAgents();
  const map = new Map(agents.map(agent => [agent.id, agent]));
  return properties.map(property => ({ ...property, agent: property.agent_id ? map.get(property.agent_id) : undefined }));
}

function snapshotToProperty(id: string, data: Record<string, unknown>): Property {
  return {
    id,
    ...data,
    features: Array.isArray(data.features) ? data.features : [],
    images: Array.isArray(data.images) ? data.images.filter((url): url is string => typeof url === 'string' && Boolean(url.trim())) : [],
    created_at: toIsoDate(data.created_at),
    updated_at: toIsoDate(data.updated_at),
  } as Property;
}

function snapshotToInquiry(id: string, data: Record<string, unknown>): Inquiry {
  return { id, ...data, created_at: toIsoDate(data.created_at) } as Inquiry;
}

export async function fetchProperties(filters?: PropertyFilters): Promise<Property[]> {
  const client = requireDb();
  const snap = await getDocs(query(collection(client, 'properties'), where('published', '==', true)));
  const rows = snap.docs.map(d => snapshotToProperty(d.id, d.data()));
  return filterProperties(await attachAgents(rows), filters);
}

export async function fetchAdminProperties(filters?: PropertyFilters): Promise<Property[]> {
  const client = requireDb();
  const snap = await getDocs(collection(client, 'properties'));
  const rows = snap.docs.map(d => snapshotToProperty(d.id, d.data()));
  return filterProperties(await attachAgents(rows), filters);
}

export async function fetchPropertyBySlug(slug: string): Promise<Property | null> {
  const cleanSlug = slug.trim();
  if (!cleanSlug) return null;
  const client = requireDb();
  const snap = await getDocs(query(collection(client, 'properties'), where('slug', '==', cleanSlug), where('published', '==', true), limit(1)));
  if (snap.empty) return null;
  return (await attachAgents([snapshotToProperty(snap.docs[0].id, snap.docs[0].data())]))[0];
}

export async function fetchAgents(): Promise<Agent[]> {
  const client = requireDb();
  const snap = await getDocs(collection(client, 'agents'));
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Agent)).sort((a, b) => a.name.localeCompare(b.name, 'th'));
}

export async function createProperty(property: Omit<Property, 'id' | 'created_at'>): Promise<Property> {
  assertPropertyData(property);
  const client = requireDb();
  const ref = doc(collection(client, 'properties'));
  const now = new Date().toISOString();
  const { agent, ...clean } = property;
  const normalized = stripUndefined({
    ...clean,
    title: clean.title.trim(),
    slug: clean.slug.trim(),
    description: clean.description.trim(),
    province: clean.province.trim(),
    district: clean.district.trim(),
    subdistrict: clean.subdistrict?.trim() || undefined,
    address: clean.address?.trim() || undefined,
    furniture: clean.furniture.trim(),
    agent_id: clean.agent_id?.trim() || undefined,
    id: ref.id,
  });
  await assertSlugAvailable(normalized.slug);
  await setDoc(ref, { ...normalized, created_at: serverTimestamp(), updated_at: serverTimestamp() });
  return { ...normalized, created_at: now, updated_at: now, agent } as Property;
}

export async function updateProperty(id: string, updates: Partial<Property>): Promise<Property | null> {
  const client = requireDb();
  const ref = doc(client, 'properties', id);
  const current = await getDoc(ref);
  if (!current.exists()) return null;
  const currentProperty = snapshotToProperty(current.id, current.data());
  const merged = { ...currentProperty, ...updates, id: currentProperty.id, created_at: currentProperty.created_at } as Property;
  assertPropertyData(merged);
  await assertSlugAvailable(merged.slug.trim(), id);

  const fields: Partial<Property> = { ...updates };
  delete fields.agent;
  delete fields.id;
  delete fields.created_at;
  delete fields.updated_at;
  const normalized: Record<string, unknown> = stripUndefined({
    ...fields,
    ...(typeof fields.title === 'string' ? { title: fields.title.trim() } : {}),
    ...(typeof fields.slug === 'string' ? { slug: fields.slug.trim() } : {}),
    ...(typeof fields.description === 'string' ? { description: fields.description.trim() } : {}),
    ...(typeof fields.province === 'string' ? { province: fields.province.trim() } : {}),
    ...(typeof fields.district === 'string' ? { district: fields.district.trim() } : {}),
    ...(typeof fields.subdistrict === 'string' ? { subdistrict: fields.subdistrict.trim() } : {}),
    ...(typeof fields.address === 'string' ? { address: fields.address.trim() } : {}),
    ...(typeof fields.agent_id === 'string' ? { agent_id: fields.agent_id.trim() } : {}),
    ...(typeof fields.furniture === 'string' ? { furniture: fields.furniture.trim() } : {}),
  });
  if (Object.prototype.hasOwnProperty.call(fields, 'year_built') && fields.year_built === undefined) normalized.year_built = deleteField();
  if (Object.prototype.hasOwnProperty.call(fields, 'agent_id') && !String(fields.agent_id || '').trim()) normalized.agent_id = deleteField();
  if (Object.prototype.hasOwnProperty.call(fields, 'subdistrict') && !String(fields.subdistrict || '').trim()) normalized.subdistrict = deleteField();
  if (Object.prototype.hasOwnProperty.call(fields, 'address') && !String(fields.address || '').trim()) normalized.address = deleteField();
  await updateDoc(ref, { ...normalized, updated_at: serverTimestamp() });
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return (await attachAgents([snapshotToProperty(snap.id, snap.data())]))[0];
}

export async function deleteProperty(id: string): Promise<boolean> {
  const client = requireDb();
  const ref = doc(client, 'properties', id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return false;
  const images = Array.isArray(snap.data().images)
    ? snap.data().images.filter((url): url is string => typeof url === 'string' && Boolean(url.trim()))
    : [];
  await deleteDoc(ref);
  await Promise.all(images.map((url) => deleteManagedPropertyImage(url)));
  return true;
}

export function getFavoriteIds(): string[] {
  return readArray(STORAGE_KEY_FAVORITES, [], (item): item is string => typeof item === 'string');
}

export function toggleFavoriteId(propertyId: string): boolean {
  const current = getFavoriteIds();
  const exists = current.includes(propertyId);
  writeArray(STORAGE_KEY_FAVORITES, exists ? current.filter(id => id !== propertyId) : [...current, propertyId]);
  window.dispatchEvent(new Event('favorites-updated'));
  return !exists;
}

export async function submitInquiry(inquiry: Omit<Inquiry, 'id' | 'created_at'>): Promise<Inquiry> {
  const name = cleanText(inquiry.name, 120);
  const phone = cleanText(inquiry.phone, 30);
  const lineId = cleanText(inquiry.line_id, 100);
  const message = cleanText(inquiry.message, 5000);
  if (name.length < 2 || phone.length < 8 || !message) {
    throw new Error('กรุณากรอกชื่อ เบอร์โทรศัพท์ และข้อความให้ครบถ้วน');
  }
  if (!['inquiry', 'viewing', 'consignment_sell'].includes(inquiry.inquiry_type)) throw new Error('ประเภทคำขอไม่ถูกต้อง');

  const client = requireDb();
  const ref = doc(collection(client, 'inquiries'));
  const now = new Date().toISOString();
  const row = stripUndefined({
    ...inquiry,
    id: ref.id,
    name,
    phone,
    line_id: lineId || undefined,
    message,
    property_id: cleanText(inquiry.property_id, 128) || undefined,
    property_title: cleanText(inquiry.property_title, 240) || undefined,
    status: 'new' as const,
  });
  await setDoc(ref, { ...row, created_at: serverTimestamp() });
  return { ...row, created_at: now } as Inquiry;
}

export async function fetchInquiries(): Promise<Inquiry[]> {
  const snap = await getDocs(collection(requireDb(), 'inquiries'));
  return snap.docs.map(d => snapshotToInquiry(d.id, d.data())).sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export async function updateInquiryStatus(id: string, status: Inquiry['status']): Promise<Inquiry | null> {
  if (!['new', 'contacted', 'scheduled', 'closed'].includes(status)) throw new Error('สถานะคำขอไม่ถูกต้อง');
  const client = requireDb();
  const ref = doc(client, 'inquiries', id);
  await updateDoc(ref, { status });
  const snap = await getDoc(ref);
  return snap.exists() ? snapshotToInquiry(snap.id, snap.data()) : null;
}

export async function fetchUsers(): Promise<UserProfile[]> {
  const snap = await getDocs(collection(requireDb(), 'profiles'));
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as UserProfile)).sort((a, b) => a.full_name.localeCompare(b.full_name, 'th'));
}

export async function updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile[]> {
  const fields: Record<string, unknown> = {};
  if (typeof updates.full_name === 'string') {
    const fullName = updates.full_name.trim().replace(/\s+/g, ' ');
    if (fullName.length < 2 || fullName.length > 120) throw new Error('ชื่อ-นามสกุลไม่ถูกต้อง');
    fields.full_name = fullName;
  }
  if (Object.prototype.hasOwnProperty.call(updates, 'phone')) {
    const phone = updates.phone?.trim() || '';
    if (phone.length > 24) throw new Error('เบอร์โทรศัพท์ยาวเกินไป');
    fields.phone = phone || deleteField();
  }
  if (Object.prototype.hasOwnProperty.call(updates, 'avatar_url')) {
    const avatarUrl = updates.avatar_url?.trim() || '';
    if (avatarUrl.length > 2000) throw new Error('URL รูปโปรไฟล์ยาวเกินไป');
    fields.avatar_url = avatarUrl || deleteField();
  }
  if (!Object.keys(fields).length) return fetchUsers();
  await updateDoc(doc(requireDb(), 'profiles', userId), fields);
  return fetchUsers();
}

export function addLocalUser(): never {
  throw new Error('เพิ่มบัญชีผ่านหน้าสมัครสมาชิกหรือ Firebase Authentication');
}

export function deleteLocalUser(): never {
  throw new Error('ลบบัญชีผ่าน Firebase Console > Authentication');
}
