'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Building2, CheckCircle2, Mail } from 'lucide-react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase/client';
import { firebaseAuthMessage } from '@/lib/firebase/auth-errors';
import { getSiteUrl } from '@/config/site-url';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!auth || loading) return;
    const cleanEmail = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError('กรุณากรอกอีเมลให้ถูกต้อง');
      return;
    }
    setLoading(true);
    setError('');
    try {
      auth.languageCode = 'th';
      await sendPasswordResetEmail(auth, cleanEmail, { url: `${getSiteUrl()}/login` });
      setSent(true);
    } catch (err) {
      const code = typeof err === 'object' && err && 'code' in err ? String((err as { code?: unknown }).code || '') : '';
      if (code === 'auth/user-not-found') {
        // Keep the response identical for existing and non-existing accounts.
        setSent(true);
      } else {
        setError(firebaseAuthMessage(err, 'ไม่สามารถส่งอีเมลรีเซ็ตรหัสผ่านได้ กรุณาลองใหม่'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-surface-bg px-4 py-16">
      <div className="mx-auto max-w-md rounded-3xl border border-surface-border bg-white p-7 shadow-xl sm:p-9">
        <Link href="/" className="mb-7 inline-flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-gold-400 to-gold-600"><Building2 className="h-6 w-6 text-navy-950" /></span>
          <span className="font-extrabold tracking-wider text-navy-950">CHANTAKORN PROPERTY</span>
        </Link>
        <h1 className="text-2xl font-extrabold text-navy-950">ลืมรหัสผ่าน</h1>
        <p className="mt-2 text-sm text-brand-muted">กรอกอีเมลที่ใช้สมัครสมาชิก ระบบจะส่งลิงก์สำหรับตั้งรหัสผ่านใหม่ไปยังอีเมลของคุณ</p>

        {sent ? (
          <div className="mt-7 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-sm text-emerald-900">
            <div className="flex items-center gap-2 font-bold"><CheckCircle2 className="h-5 w-5" />ส่งอีเมลแล้ว</div>
            <p className="mt-2 leading-relaxed">หากอีเมลนี้มีบัญชีอยู่ กรุณาตรวจสอบ Inbox และ Spam แล้วเปิดลิงก์รีเซ็ตรหัสผ่าน</p>
            <Link href="/login" className="mt-4 inline-flex items-center gap-1 font-bold underline"><ArrowLeft className="h-4 w-4" />กลับหน้าเข้าสู่ระบบ</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-7 space-y-4">
            {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
            {!auth && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">ระบบกู้รหัสผ่านยังไม่พร้อมใช้งาน กรุณาติดต่อผู้ดูแลเว็บไซต์</p>}
            <label htmlFor="forgot-email" className="block text-xs font-bold text-gray-700">อีเมล</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input id="forgot-email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-3 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-gold-500" />
            </div>
            <button type="submit" disabled={!auth || loading} className="w-full rounded-xl bg-navy-950 py-3 text-sm font-bold text-gold-400 disabled:opacity-50">{loading ? 'กำลังส่ง...' : 'ส่งลิงก์ตั้งรหัสผ่านใหม่'}</button>
            <Link href="/login" className="flex items-center justify-center gap-1 text-xs font-semibold text-gray-600 hover:text-navy-950"><ArrowLeft className="h-3.5 w-3.5" />กลับหน้าเข้าสู่ระบบ</Link>
          </form>
        )}
      </div>
    </main>
  );
}
