'use client';

import { AlertTriangle, CheckCircle2, Database, ShieldCheck } from 'lucide-react';
import { isBackendConfigured } from '@/lib/backend';
import { firebaseDatabaseId } from '@/lib/firebase/client';
import { SITE_CONFIG } from '@/config/site';

const appCheckConfigured = Boolean(process.env.NEXT_PUBLIC_FIREBASE_APPCHECK_SITE_KEY?.trim());

export default function AdminSettingsPage() {
  return (
    <div className="max-w-4xl space-y-6 pb-20">
      <div className="rounded-2xl border border-surface-border bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-extrabold text-navy-950">สถานะระบบ</h1>
        <p className="mt-2 text-sm text-brand-muted">ตรวจสอบค่าที่ฝังมากับ deployment ปัจจุบัน</p>
      </div>

      <section className="space-y-4 rounded-2xl border border-surface-border bg-white p-6 shadow-sm">
        <h2 className="flex items-center gap-2 text-base font-bold text-navy-950"><Database className="h-5 w-5 text-gold-600" />Firebase</h2>
        <div className={`flex items-start gap-2 rounded-xl p-4 text-sm ${isBackendConfigured ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'}`}>
          {isBackendConfigured ? <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0" /> : <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0" />}
          <div>
            <p className="font-bold">{isBackendConfigured ? 'ตั้งค่า Firebase แล้ว' : 'Firebase configuration ไม่ครบ'}</p>
            <p className="mt-1 text-xs opacity-80">Firestore database: {firebaseDatabaseId}</p>
          </div>
        </div>
        <p className="text-sm leading-relaxed text-gray-600">Authentication ใช้สำหรับสมาชิกและเจ้าหน้าที่, Firestore เก็บข้อมูลธุรกิจ และ Storage เก็บรูปนายหน้า/รูปประกาศ</p>
      </section>

      <section className="space-y-4 rounded-2xl border border-surface-border bg-white p-6 shadow-sm">
        <h2 className="flex items-center gap-2 text-base font-bold text-navy-950"><ShieldCheck className="h-5 w-5 text-gold-600" />App Check</h2>
        <div className={`rounded-xl p-4 text-sm ${appCheckConfigured ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-900'}`}>
          <p className="font-bold">{appCheckConfigured ? 'มี reCAPTCHA Enterprise site key ใน deployment' : 'ยังไม่ได้ตั้ง App Check site key'}</p>
          <p className="mt-1 text-xs leading-relaxed opacity-80">การมี key ในเว็บยังไม่เท่ากับเปิด enforcement ให้ตรวจสถานะ Firestore/Storage ใน Firebase Console ก่อนเปิดบังคับใช้งาน</p>
        </div>
      </section>

      <section className="space-y-3 rounded-2xl border border-surface-border bg-white p-6 shadow-sm">
        <h2 className="text-base font-bold text-navy-950">ข้อมูลหน่วยงาน</h2>
        <p className="text-sm text-gray-700">CHANTAKORN PROPERTY · โทร {SITE_CONFIG.phoneDisplay}</p>
        <p className="text-sm leading-relaxed text-gray-600">การเปลี่ยนค่า Firebase, App Check หรือข้อมูลติดต่อจาก Environment Variables ต้อง deploy เว็บไซต์ใหม่จึงจะมีผล</p>
      </section>
    </div>
  );
}
