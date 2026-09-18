'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Building2,
  Lock,
  Mail,
  User,
  Phone,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { createUserWithEmailAndPassword, deleteUser, sendEmailVerification, signOut, updateProfile } from 'firebase/auth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/client';
import { firebaseAuthMessage } from '@/lib/firebase/auth-errors';
import { getSiteUrl } from '@/config/site-url';

function normalizePhone(value: string) {
  return value.replace(/[^0-9+]/g, '');
}

export default function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [verificationSent, setVerificationSent] = useState(true);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || registered) return;

    setError('');

    const cleanName = fullName.trim().replace(/\s+/g, ' ');
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = normalizePhone(phone.trim());

    if (cleanName.length < 2) {
      setError('กรุณากรอกชื่อ-นามสกุลให้ถูกต้อง');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError('กรุณากรอกอีเมลให้ถูกต้อง');
      return;
    }
    if (cleanPhone.length < 9 || cleanPhone.length > 15) {
      setError('กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง');
      return;
    }
    if (password.length < 8) {
      setError('รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร');
      return;
    }
    if (password !== confirmPassword) {
      setError('รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน');
      return;
    }
    if (!acceptedPrivacy) {
      setError('กรุณายินยอมให้ใช้ข้อมูลเพื่อจัดการบัญชีและติดต่อเกี่ยวกับบริการ');
      return;
    }
    if (!auth || !db) {
      setError('ระบบสมาชิกยังไม่พร้อมใช้งาน กรุณาติดต่อผู้ดูแลเว็บไซต์');
      return;
    }

    setLoading(true);
    try {
      const credential = await createUserWithEmailAndPassword(auth, cleanEmail, password);
      try {
        await updateProfile(credential.user, { displayName: cleanName });
        await setDoc(doc(db, 'profiles', credential.user.uid), {
          id: credential.user.uid,
          full_name: cleanName,
          email: cleanEmail,
          phone: cleanPhone,
          role: 'USER',
          avatar_url: '',
          created_at: serverTimestamp(),
          privacy_accepted_at: serverTimestamp(),
          privacy_version: '2026-09-18',
        });
      } catch (setupError) {
        await deleteUser(credential.user).catch(() => undefined);
        throw setupError;
      }

      auth.languageCode = 'th';
      const emailSent = await sendEmailVerification(credential.user, { url: `${getSiteUrl()}/login` }).then(() => true).catch(() => false);
      await signOut(auth).catch(() => undefined);
      setVerificationSent(emailSent);
      setRegisteredEmail(cleanEmail);
      setRegistered(true);
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(firebaseAuthMessage(err, 'สมัครสมาชิกไม่สำเร็จ กรุณาตรวจสอบข้อมูลและลองใหม่'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-bg flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center space-x-3 group">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-navy-950 font-bold shadow-md">
            <Building2 className="w-7 h-7 text-navy-950" />
          </div>
          <div className="text-left">
            <span className="text-navy-950 font-extrabold text-xl tracking-wider block leading-none">
              CHANTAKORN
            </span>
            <span className="text-gold-600 text-xs font-bold tracking-widest leading-tight block">
              PROPERTY
            </span>
          </div>
        </Link>
        <h1 className="mt-6 text-2xl sm:text-3xl font-extrabold text-navy-950">
          สมัครสมาชิกใหม่
        </h1>
        <p className="mt-2 text-xs text-brand-muted">
          สร้างบัญชีสมาชิกเพื่อจัดเก็บข้อมูลโปรไฟล์และเข้าใช้งานบริการสมาชิกของ Chantakorn Property
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl border border-surface-border shadow-xl">
          {(!auth || !db) && (
            <p className="mb-4 rounded-xl bg-red-50 p-3 text-xs text-red-700">
              ระบบสมาชิกยังไม่ได้เชื่อมต่อฐานข้อมูล กรุณาติดต่อผู้ดูแลเว็บไซต์
            </p>
          )}

          {registered && (
            <div role="status" className="mb-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0" />
                <div>
                  <p className="font-bold">สมัครสมาชิกสำเร็จ</p>
                  <p className="mt-1 text-xs leading-relaxed">
                    {verificationSent ? (
                      <>กรุณาเปิดอีเมล <strong>{registeredEmail}</strong> และกดลิงก์ยืนยันบัญชี จากนั้นจึงเข้าสู่ระบบได้</>
                    ) : (
                      <>สร้างบัญชีแล้ว แต่ยังส่งอีเมลยืนยันไม่สำเร็จ กรุณาลองเข้าสู่ระบบด้วย <strong>{registeredEmail}</strong> เพื่อให้ระบบส่งลิงก์ยืนยันให้อีกครั้ง</>
                    )}
                  </p>
                  <Link href="/login" className="mt-3 inline-block text-xs font-bold underline">
                    ไปหน้าเข้าสู่ระบบ
                  </Link>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div role="alert" className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label htmlFor="register-full-name" className="block text-xs font-semibold text-gray-700 mb-1">
                ชื่อ-นามสกุล *
              </label>
              <div className="relative">
                <input
                  id="register-full-name"
                  type="text"
                  required
                  autoComplete="name"
                  maxLength={120}
                  placeholder="เช่น กานดา วงศ์สวัสดิ์"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={registered}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-3 py-2.5 text-xs text-gray-900 focus:bg-white focus:ring-2 focus:ring-gold-500 outline-none disabled:opacity-60"
                />
                <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label htmlFor="register-email" className="block text-xs font-semibold text-gray-700 mb-1">
                อีเมล *
              </label>
              <div className="relative">
                <input
                  id="register-email"
                  type="email"
                  required
                  autoComplete="email"
                  inputMode="email"
                  maxLength={254}
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={registered}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-3 py-2.5 text-xs text-gray-900 focus:bg-white focus:ring-2 focus:ring-gold-500 outline-none disabled:opacity-60"
                />
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label htmlFor="register-phone" className="block text-xs font-semibold text-gray-700 mb-1">
                เบอร์โทรศัพท์ติดต่อ *
              </label>
              <div className="relative">
                <input
                  id="register-phone"
                  type="tel"
                  required
                  autoComplete="tel"
                  inputMode="tel"
                  maxLength={24}
                  placeholder="081-604-0097"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={registered}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-3 py-2.5 text-xs text-gray-900 focus:bg-white focus:ring-2 focus:ring-gold-500 outline-none disabled:opacity-60"
                />
                <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label htmlFor="register-password" className="block text-xs font-semibold text-gray-700 mb-1">
                รหัสผ่าน (อย่างน้อย 8 ตัวอักษร) *
              </label>
              <div className="relative">
                <input
                  id="register-password"
                  type="password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={registered}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-3 py-2.5 text-xs text-gray-900 focus:bg-white focus:ring-2 focus:ring-gold-500 outline-none disabled:opacity-60"
                />
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label htmlFor="register-confirm-password" className="block text-xs font-semibold text-gray-700 mb-1">
                ยืนยันรหัสผ่าน *
              </label>
              <div className="relative">
                <input
                  id="register-confirm-password"
                  type="password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={registered}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-3 py-2.5 text-xs text-gray-900 focus:bg-white focus:ring-2 focus:ring-gold-500 outline-none disabled:opacity-60"
                />
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <label className="flex items-start gap-2.5 rounded-xl border border-gray-200 bg-gray-50 p-3 text-xs leading-relaxed text-gray-600">
              <input
                type="checkbox"
                required
                checked={acceptedPrivacy}
                onChange={(e) => setAcceptedPrivacy(e.target.checked)}
                disabled={registered}
                className="mt-0.5 h-4 w-4 rounded border-gray-300 accent-[#C9A227]"
              />
              <span>
                ฉันยินยอมให้ Chantakorn Property ใช้ชื่อ อีเมล และเบอร์โทรศัพท์เพื่อจัดการบัญชี ติดต่อเกี่ยวกับบริการ และดูแลคำขอที่ฉันส่งเข้ามา ตาม <Link href="/privacy" target="_blank" rel="noopener noreferrer" className="font-bold text-navy-950 underline">นโยบายความเป็นส่วนตัว</Link>
              </span>
            </label>

            <button
              type="submit"
              disabled={loading || registered || !auth || !db}
              className="w-full py-3 bg-navy-950 hover:bg-navy-900 disabled:cursor-not-allowed disabled:opacity-60 text-gold-400 font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
            >
              <span>{loading ? 'กำลังสร้างบัญชี...' : registered ? 'สมัครสมาชิกแล้ว' : 'สมัครสมาชิก'}</span>
              {!registered && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-gray-500">
            มีบัญชีสมาชิกอยู่แล้ว?{' '}
            <Link href="/login" className="text-navy-950 font-bold hover:underline">
              เข้าสู่ระบบ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
