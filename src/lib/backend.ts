import { isFirebaseConfigured } from '@/lib/firebase/client';

export const dataBackend = 'firebase' as const;
export const isBackendConfigured = isFirebaseConfigured;

export function backendConfigurationError(): Error {
  return new Error('ยังไม่ได้ตั้งค่า Firebase สำหรับเว็บไซต์นี้ กรุณาตรวจสอบ NEXT_PUBLIC_FIREBASE_*');
}
