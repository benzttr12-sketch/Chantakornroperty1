'use client';

import { AlertTriangle, Home, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="min-h-[70vh] bg-surface-bg px-4 py-16 flex items-center justify-center">
      <div className="w-full max-w-md rounded-3xl border border-surface-border bg-white p-8 text-center shadow-card">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <h1 className="text-2xl font-extrabold text-navy-950">ไม่สามารถแสดงหน้านี้ได้</h1>
        <p className="mt-2 text-sm leading-relaxed text-gray-600">
          อาจเป็นปัญหาการเชื่อมต่อชั่วคราว กรุณาลองใหม่อีกครั้ง หากยังพบปัญหาสามารถกลับไปหน้าแรกได้
        </p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-navy-950 px-5 py-3 text-sm font-bold text-gold-400 hover:bg-navy-900"
          >
            <RefreshCw className="h-4 w-4" />
            ลองอีกครั้ง
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-5 py-3 text-sm font-bold text-navy-950 hover:bg-gray-50"
          >
            <Home className="h-4 w-4" />
            หน้าแรก
          </Link>
        </div>
      </div>
    </div>
  );
}
