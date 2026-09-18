export function firebaseAuthMessage(error: unknown, fallback: string) {
  const code = typeof error === 'object' && error && 'code' in error
    ? String((error as { code?: unknown }).code || '')
    : '';

  const messages: Record<string, string> = {
    'auth/invalid-credential': 'อีเมลหรือรหัสผ่านไม่ถูกต้อง',
    'auth/user-not-found': 'อีเมลหรือรหัสผ่านไม่ถูกต้อง',
    'auth/wrong-password': 'อีเมลหรือรหัสผ่านไม่ถูกต้อง',
    'auth/invalid-email': 'รูปแบบอีเมลไม่ถูกต้อง',
    'auth/email-already-in-use': 'อีเมลนี้ถูกใช้สมัครสมาชิกแล้ว',
    'auth/weak-password': 'รหัสผ่านยังไม่ปลอดภัย กรุณาใช้รหัสผ่านที่ยาวและคาดเดายากขึ้น',
    'auth/user-disabled': 'บัญชีนี้ถูกระงับ กรุณาติดต่อผู้ดูแลเว็บไซต์',
    'auth/too-many-requests': 'มีการลองหลายครั้งเกินไป กรุณารอสักครู่แล้วลองใหม่',
    'auth/network-request-failed': 'เชื่อมต่อเครือข่ายไม่สำเร็จ กรุณาตรวจสอบอินเทอร์เน็ตแล้วลองใหม่',
    'auth/operation-not-allowed': 'ระบบเข้าสู่ระบบด้วยอีเมลยังไม่ได้เปิดใช้งาน กรุณาติดต่อผู้ดูแลเว็บไซต์',
  };

  return messages[code] || fallback;
}
