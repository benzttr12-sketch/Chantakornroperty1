'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  Check,
  Mail,
  Pencil,
  Phone,
  Search,
  Shield,
  ShieldCheck,
  UserCheck,
  Users,
  X,
} from 'lucide-react';
import type { UserProfile } from '@/lib/types';
import { fetchUsers, updateUserProfile } from '@/lib/store/properties-store';

const ROLE_LABEL: Record<UserProfile['role'], string> = {
  ADMIN: 'ผู้ดูแลระบบ',
  AGENT: 'นายหน้า / ตัวแทน',
  USER: 'สมาชิกทั่วไป',
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'ALL' | UserProfile['role']>('ALL');
  const [notification, setNotification] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [editFullName, setEditFullName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchUsers()
      .then((list) => { if (active) setUsers(list); })
      .catch(() => { if (active) setError('โหลดรายชื่อผู้ใช้ไม่ได้ กรุณาตรวจสอบสิทธิ์ผู้ดูแลระบบ'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const triggerNotification = (message: string) => {
    setNotification(message);
    window.setTimeout(() => setNotification(null), 3000);
  };

  const openEditModal = (user: UserProfile) => {
    setEditingUser(user);
    setEditFullName(user.full_name || '');
    setEditEmail(user.email || '');
    setEditPhone(user.phone || '');
    setError('');
  };

  const handleSaveEdit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!editingUser || saving) return;
    const fullName = editFullName.trim().replace(/\s+/g, ' ');
    if (fullName.length < 2) {
      setError('กรุณากรอกชื่อ-นามสกุลให้ถูกต้อง');
      return;
    }

    setSaving(true);
    setError('');
    try {
      const updated = await updateUserProfile(editingUser.id, {
        full_name: fullName,
        phone: editPhone.trim() || undefined,
      });
      setUsers(updated);
      setEditingUser(null);
      triggerNotification('บันทึกข้อมูลสมาชิกแล้ว');
    } catch {
      setError('บันทึกข้อมูลผู้ใช้ไม่สำเร็จ กรุณาตรวจสอบสิทธิ์และลองใหม่');
    } finally {
      setSaving(false);
    }
  };

  const counts = useMemo(() => ({
    ADMIN: users.filter((user) => user.role === 'ADMIN').length,
    AGENT: users.filter((user) => user.role === 'AGENT').length,
    USER: users.filter((user) => user.role === 'USER').length,
  }), [users]);

  const filteredUsers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return users.filter((user) => {
      if (roleFilter !== 'ALL' && user.role !== roleFilter) return false;
      if (!q) return true;
      return [user.full_name, user.email || '', user.phone || '']
        .some((value) => value.toLowerCase().includes(q));
    });
  }, [roleFilter, searchQuery, users]);

  return (
    <div className="space-y-6 pb-20">
      {notification && (
        <div className="fixed right-6 top-6 z-50 flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-900 shadow-xl">
          <Check className="h-4 w-4" />
          <span>{notification}</span>
        </div>
      )}

      {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</p>}

      <div className="rounded-2xl border border-surface-border bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gold-600">
          <Shield className="h-4 w-4" />
          <span>Members & Access</span>
        </div>
        <h1 className="mt-2 text-2xl font-extrabold text-navy-950">สมาชิกและสิทธิ์การใช้งาน</h1>
        <p className="mt-1 max-w-3xl text-xs leading-relaxed text-brand-muted">
          หน้านี้ใช้ดูสมาชิกและแก้ไขข้อมูลติดต่อเท่านั้น การเปลี่ยนบทบาท ADMIN / AGENT / USER ต้องทำผ่านสคริปต์ผู้ดูแลเพื่อให้ Firestore และ Firebase Auth Custom Claims ตรงกัน
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex items-center justify-between rounded-2xl border border-surface-border bg-white p-5 shadow-sm">
          <div><p className="text-xs font-bold text-gray-500">ADMIN</p><p className="mt-1 text-2xl font-extrabold text-gold-600">{counts.ADMIN}</p></div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold-50 text-gold-600"><ShieldCheck className="h-5 w-5" /></div>
        </div>
        <div className="flex items-center justify-between rounded-2xl border border-surface-border bg-white p-5 shadow-sm">
          <div><p className="text-xs font-bold text-gray-500">AGENT</p><p className="mt-1 text-2xl font-extrabold text-navy-900">{counts.AGENT}</p></div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-navy-900"><UserCheck className="h-5 w-5" /></div>
        </div>
        <div className="flex items-center justify-between rounded-2xl border border-surface-border bg-white p-5 shadow-sm">
          <div><p className="text-xs font-bold text-gray-500">USER</p><p className="mt-1 text-2xl font-extrabold text-gray-700">{counts.USER}</p></div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 text-gray-600"><Users className="h-5 w-5" /></div>
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-surface-border bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            placeholder="ค้นหาชื่อ อีเมล หรือเบอร์โทร..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-xs text-navy-950 outline-none focus:ring-2 focus:ring-gold-500"
          />
        </div>
        <div className="flex gap-1.5 overflow-x-auto">
          {(['ALL', 'ADMIN', 'AGENT', 'USER'] as const).map((role) => {
            const count = role === 'ALL' ? users.length : counts[role];
            const label = role === 'ALL' ? 'ทั้งหมด' : role;
            return (
              <button
                key={role}
                type="button"
                onClick={() => setRoleFilter(role)}
                className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${roleFilter === role ? 'bg-navy-950 text-gold-400' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                {label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-surface-border bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-xs">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-gray-600">
                <th className="p-4 font-semibold">สมาชิก</th>
                <th className="p-4 font-semibold">ข้อมูลติดต่อ</th>
                <th className="p-4 font-semibold">บทบาท</th>
                <th className="p-4 text-right font-semibold">แก้ไข</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={4} className="p-10 text-center text-gray-500">กำลังโหลดสมาชิก...</td></tr>
              ) : filteredUsers.length === 0 ? (
                <tr><td colSpan={4} className="p-10 text-center text-gray-500">ไม่พบสมาชิกที่ตรงกับเงื่อนไข</td></tr>
              ) : filteredUsers.map((user) => (
                <tr key={user.id} className="transition-colors hover:bg-gray-50/80">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy-950 text-sm font-bold text-gold-400">
                        {user.full_name?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <p className="font-bold text-navy-950">{user.full_name || 'ไม่ระบุชื่อ'}</p>
                        <p className="mt-0.5 max-w-[220px] truncate font-mono text-[10px] text-gray-400">{user.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-gray-600">
                    <div className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5 text-gray-400" /><span>{user.email || '-'}</span></div>
                    <div className="mt-1 flex items-center gap-1.5 text-[11px] text-gray-500"><Phone className="h-3.5 w-3.5 text-gray-400" /><span>{user.phone || '-'}</span></div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-bold ${user.role === 'ADMIN' ? 'border-gold-300 bg-gold-50 text-gold-900' : user.role === 'AGENT' ? 'border-blue-200 bg-blue-50 text-blue-900' : 'border-gray-200 bg-gray-100 text-gray-700'}`}>
                      {ROLE_LABEL[user.role]}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      type="button"
                      onClick={() => openEditModal(user)}
                      className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 font-semibold text-navy-900 hover:bg-blue-50 hover:text-blue-700"
                    >
                      <Pencil className="h-3.5 w-3.5" /> แก้ไขโปรไฟล์
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-2xl border border-navy-800 bg-navy-950 p-5 text-xs leading-relaxed text-gray-300">
        <p className="font-bold text-gold-400">การเปลี่ยนสิทธิ์เจ้าหน้าที่</p>
        <p className="mt-1">ใช้คำสั่ง <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-white">npm run set-role -- EMAIL ADMIN</code> หรือเปลี่ยนเป็น AGENT / USER แล้วให้ผู้ใช้ออกจากระบบและเข้าสู่ระบบใหม่</p>
      </div>

      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-surface-border bg-white p-6 shadow-2xl sm:p-8">
            <div className="mb-5 flex items-center justify-between border-b border-gray-100 pb-4">
              <div><h2 className="text-lg font-bold text-navy-950">แก้ไขข้อมูลสมาชิก</h2><p className="mt-0.5 text-xs text-brand-muted">อีเมลและบทบาทแก้จากหน้านี้ไม่ได้</p></div>
              <button type="button" onClick={() => setEditingUser(null)} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700" aria-label="ปิด"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div><label className="mb-1 block text-xs font-semibold text-gray-700">ชื่อ-นามสกุล *</label><input type="text" required maxLength={120} value={editFullName} onChange={(event) => setEditFullName(event.target.value)} className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-xs outline-none focus:bg-white focus:ring-2 focus:ring-gold-500" /></div>
              <div><label className="mb-1 block text-xs font-semibold text-gray-700">อีเมล</label><input type="email" value={editEmail} disabled className="w-full cursor-not-allowed rounded-xl border border-gray-200 bg-gray-100 p-3 text-xs text-gray-500" /></div>
              <div><label className="mb-1 block text-xs font-semibold text-gray-700">เบอร์โทรศัพท์</label><input type="tel" maxLength={24} value={editPhone} onChange={(event) => setEditPhone(event.target.value)} className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-xs outline-none focus:bg-white focus:ring-2 focus:ring-gold-500" /></div>
              <div className="rounded-xl border border-gray-100 bg-gray-50 p-3 text-xs text-gray-600">บทบาท: <strong className="text-navy-950">{ROLE_LABEL[editingUser.role]}</strong></div>
              <div className="flex gap-3 border-t border-gray-100 pt-4">
                <button type="button" onClick={() => setEditingUser(null)} className="flex-1 rounded-xl border border-gray-200 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-50">ยกเลิก</button>
                <button type="submit" disabled={saving} className="flex-1 rounded-xl bg-navy-950 py-2.5 text-xs font-bold text-gold-400 disabled:opacity-50">{saving ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
