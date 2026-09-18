'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Building2, Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';
import { sendEmailVerification, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/client';
import { backendConfigurationError } from '@/lib/backend';
import type { UserProfile } from '@/lib/types';
import { firebaseAuthMessage } from '@/lib/firebase/auth-errors';
import { getSiteUrl } from '@/config/site-url';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    if (!auth || !db) {
      setError(backendConfigurationError().message);
      setLoading(false);
      return;
    }
    try {
      const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
      if (!credential.user.emailVerified) {
        auth.languageCode = 'th';
        const resent = await sendEmailVerification(credential.user, { url: `${getSiteUrl()}/login` }).then(() => true).catch(() => false);
        await signOut(auth);
        throw new Error(resent
          ? 'บัญชียังไม่ได้ยืนยันอีเมล เราส่งลิงก์ยืนยันให้ใหม่แล้ว กรุณาตรวจสอบ Inbox และ Spam'
          : 'บัญชียังไม่ได้ยืนยันอีเมล กรุณาตรวจสอบอีเมลยืนยันที่ได้รับตอนสมัครสมาชิก');
      }
      const profileSnap = await getDoc(doc(db, 'profiles', credential.user.uid));
      if (!profileSnap.exists()) {
        await signOut(auth);
        throw new Error('ไม่พบข้อมูลโปรไฟล์ของบัญชีนี้');
      }
      const profile = profileSnap.data() as UserProfile;
      if (!['ADMIN', 'AGENT', 'USER'].includes(profile.role)) {
        await signOut(auth);
        throw new Error('บัญชีนี้ไม่มีสิทธิ์เข้าถึงระบบ');
      }
      const token = await credential.user.getIdTokenResult(true);
      const claimRole = token.claims.role;
      if (profile.role === 'ADMIN' || profile.role === 'AGENT') {
        if (claimRole !== profile.role) {
          await signOut(auth);
          throw new Error('สิทธิ์เจ้าหน้าที่ยังไม่พร้อมใช้งาน กรุณาติดต่อผู้ดูแลระบบแล้วเข้าสู่ระบบใหม่');
        }
      } else if (claimRole === 'ADMIN' || claimRole === 'AGENT') {
        await signOut(auth);
        throw new Error('ข้อมูลสิทธิ์ของบัญชีไม่ตรงกัน กรุณาเข้าสู่ระบบใหม่หรือติดต่อผู้ดูแลระบบ');
      }
      router.push(profile.role === 'USER' ? '/favorites' : '/admin');
    } catch (err: unknown) {
      setError(firebaseAuthMessage(err, err instanceof Error ? err.message : 'เข้าสู่ระบบไม่สำเร็จ กรุณาลองใหม่'));
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-bg flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center space-x-3 group">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-navy-950 font-bold shadow-md"><Building2 className="w-7 h-7 text-navy-950" /></div>
          <div className="text-left"><span className="text-navy-950 font-extrabold text-xl tracking-wider block leading-none">CHANTAKORN</span><span className="text-gold-600 text-xs font-bold tracking-widest leading-tight block">PROPERTY</span></div>
        </Link>
        <h2 className="mt-6 text-2xl sm:text-3xl font-extrabold text-navy-950">เข้าสู่ระบบสมาชิก</h2>
        <p className="mt-2 text-xs text-brand-muted">เข้าสู่ระบบด้วยอีเมลและรหัสผ่านที่ลงทะเบียนไว้</p>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl border border-surface-border shadow-xl">
          {(!auth || !db) && <p className="mb-4 rounded-xl bg-red-50 p-3 text-xs text-red-700">ระบบสมาชิกยังไม่พร้อมใช้งาน กรุณาติดต่อผู้ดูแลเว็บไซต์</p>}
          {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 flex items-center space-x-2"><AlertCircle className="w-4 h-4 flex-shrink-0" /><span>{error}</span></div>}
          <form onSubmit={handleLogin} className="space-y-4">
            <div><label htmlFor="login-email" className="block text-xs font-semibold text-gray-700 mb-1">อีเมล (Email)</label><div className="relative"><input id="login-email" type="email" required autoComplete="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-3 py-2.5 text-xs text-gray-900 focus:bg-white focus:ring-2 focus:ring-gold-500 outline-none" /><Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" /></div></div>
            <div><div className="flex items-center justify-between mb-1"><label htmlFor="login-password" className="text-xs font-semibold text-gray-700">รหัสผ่าน (Password)</label><Link href="/forgot-password" className="text-[11px] text-gold-600 hover:underline">ลืมรหัสผ่าน?</Link></div><div className="relative"><input id="login-password" type="password" required autoComplete="current-password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-3 py-2.5 text-xs text-gray-900 focus:bg-white focus:ring-2 focus:ring-gold-500 outline-none" /><Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" /></div></div>
            <button type="submit" disabled={loading || !auth || !db} className="w-full py-3 bg-navy-950 hover:bg-navy-900 disabled:opacity-50 text-gold-400 font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"><span>{loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}</span><ArrowRight className="w-4 h-4" /></button>
          </form>
          <div className="mt-6 text-center text-xs text-gray-500">ยังไม่มีบัญชีสมาชิก?{' '}<Link href="/register" className="text-navy-950 font-bold hover:underline">สมัครสมาชิกใหม่</Link></div>
        </div>
      </div>
    </div>
  );
}
