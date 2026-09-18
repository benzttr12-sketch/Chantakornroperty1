'use client';

import { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { Camera, ImagePlus, Loader2, RefreshCw, Trash2, UserRound } from 'lucide-react';
import { Agent } from '@/lib/types';
import { fetchAgentProfiles, removeAgentPhoto, uploadAgentPhoto } from '@/lib/store/agents-store';

export default function AdminAgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgentId, setSelectedAgentId] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const selectedAgent = useMemo(
    () => agents.find((agent) => agent.id === selectedAgentId) || null,
    [agents, selectedAgentId]
  );

  const loadAgents = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const list = await fetchAgentProfiles();
      setAgents(list);
      setSelectedAgentId((current) => {
        if (current && list.some((agent) => agent.id === current)) return current;
        return list[0]?.id || '';
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'โหลดข้อมูลคนขายไม่สำเร็จ');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAgents();
  }, [loadAgents]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const clearSelectedFile = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl('');
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setError('');
    setSuccess('');
    if (!file) {
      clearSelectedFile();
      return;
    }
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('รองรับเฉพาะไฟล์ JPG, PNG หรือ WebP');
      event.target.value = '';
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('รูปต้องมีขนาดไม่เกิน 5 MB');
      event.target.value = '';
      return;
    }
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const replaceAgent = (updated: Agent) => {
    setAgents((current) => current.map((agent) => (agent.id === updated.id ? updated : agent)));
  };

  const handleSavePhoto = async () => {
    if (!selectedAgent || !selectedFile || saving) return;
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const updated = await uploadAgentPhoto(selectedAgent, selectedFile);
      replaceAgent(updated);
      clearSelectedFile();
      setSuccess('เปลี่ยนรูปคนขายเรียบร้อยแล้ว รูปใหม่จะใช้ในหน้าทรัพย์และหน้าเกี่ยวกับเรา');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'บันทึกรูปไม่สำเร็จ');
    } finally {
      setSaving(false);
    }
  };

  const handleRemovePhoto = async () => {
    if (!selectedAgent || !selectedAgent.photo_url || saving) return;
    if (!window.confirm(`ลบรูปของ ${selectedAgent.name} ใช่หรือไม่?`)) return;
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const updated = await removeAgentPhoto(selectedAgent);
      replaceAgent(updated);
      clearSelectedFile();
      setSuccess('ลบรูปคนขายเรียบร้อยแล้ว');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'ลบรูปไม่สำเร็จ');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-5xl space-y-6 pb-20">
      <div className="rounded-2xl border border-surface-border bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-extrabold text-navy-950">
              <Camera className="h-6 w-6 text-gold-600" />
              เปลี่ยนรูปคนขาย / นายหน้า
            </h1>
            <p className="mt-2 text-sm text-brand-muted">
              รูปที่บันทึกจะถูกใช้กับข้อมูลนายหน้าบนหน้ารายละเอียดทรัพย์และหน้าเกี่ยวกับเราโดยอัตโนมัติ
            </p>
          </div>
          <button
            type="button"
            onClick={loadAgents}
            disabled={loading || saving}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            โหลดข้อมูลใหม่
          </button>
        </div>
      </div>

      {error && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}
      {success && <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">{success}</div>}

      {loading ? (
        <div className="flex min-h-64 items-center justify-center rounded-2xl border border-surface-border bg-white p-8 shadow-sm">
          <Loader2 className="h-7 w-7 animate-spin text-gold-600" />
        </div>
      ) : agents.length === 0 ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900">
          ยังไม่มีข้อมูลคนขายในตาราง <code className="font-bold">agents</code> กรุณาเพิ่มนายหน้าจริงใน Firebase Firestore ก่อน แล้วกลับมาหน้านี้เพื่ออัปโหลดรูป
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
          <section className="rounded-2xl border border-surface-border bg-white p-5 shadow-sm">
            <label className="mb-2 block text-xs font-bold text-gray-700">เลือกคนขาย / นายหน้า</label>
            <select
              value={selectedAgentId}
              onChange={(event) => {
                clearSelectedFile();
                setSelectedAgentId(event.target.value);
                setError('');
                setSuccess('');
              }}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 text-sm font-semibold text-navy-950 outline-none focus:ring-2 focus:ring-gold-500"
            >
              {agents.map((agent) => (
                <option key={agent.id} value={agent.id}>{agent.name}</option>
              ))}
            </select>

            <div className="mt-5 space-y-3">
              {agents.map((agent) => (
                <button
                  key={agent.id}
                  type="button"
                  onClick={() => {
                    clearSelectedFile();
                    setSelectedAgentId(agent.id);
                    setError('');
                    setSuccess('');
                  }}
                  className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition ${selectedAgentId === agent.id ? 'border-gold-400 bg-gold-50' : 'border-gray-100 hover:bg-gray-50'}`}
                >
                  <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full bg-navy-950">
                    {agent.photo_url ? (
                      <Image src={agent.photo_url} alt={agent.name} fill className="object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-gold-400"><UserRound className="h-6 w-6" /></div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-bold text-navy-950">{agent.name}</div>
                    <div className="truncate text-xs text-gray-500">{agent.title}</div>
                  </div>
                </button>
              ))}
            </div>
          </section>

          {selectedAgent && (
            <section className="rounded-2xl border border-surface-border bg-white p-6 shadow-sm">
              <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
                <div className="relative h-52 w-52 flex-shrink-0 overflow-hidden rounded-3xl border-2 border-gold-400 bg-navy-950 shadow-md">
                  {previewUrl || selectedAgent.photo_url ? (
                    <Image
                      src={previewUrl || selectedAgent.photo_url}
                      alt={`รูปของ ${selectedAgent.name}`}
                      fill
                      unoptimized={Boolean(previewUrl)}
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-gold-400">
                      <UserRound className="h-16 w-16" />
                      <span className="text-xs font-semibold">ยังไม่มีรูป</span>
                    </div>
                  )}
                </div>

                <div className="w-full flex-grow">
                  <div className="text-xs font-bold uppercase tracking-wider text-gold-600">โปรไฟล์คนขาย</div>
                  <h2 className="mt-1 text-xl font-extrabold text-navy-950">{selectedAgent.name}</h2>
                  <p className="mt-1 text-sm text-gray-500">{selectedAgent.title}</p>

                  <div className="mt-6 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-5">
                    <label className="block text-sm font-bold text-gray-800">เลือกรูปใหม่</label>
                    <p className="mt-1 text-xs leading-relaxed text-gray-500">แนะนำรูปบุคคลแนวตั้งหรือสี่เหลี่ยม JPG/PNG/WebP ขนาดไม่เกิน 5 MB</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleFileChange}
                      disabled={saving}
                      className="mt-4 block w-full text-xs text-gray-600 file:mr-3 file:rounded-lg file:border-0 file:bg-navy-950 file:px-4 file:py-2.5 file:text-xs file:font-bold file:text-gold-400 hover:file:bg-navy-900 disabled:opacity-50"
                    />
                    {selectedFile && <p className="mt-2 text-xs text-gray-600">ไฟล์ที่เลือก: <strong>{selectedFile.name}</strong></p>}
                  </div>

                  <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                    <button
                      type="button"
                      onClick={handleSavePhoto}
                      disabled={!selectedFile || saving}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-navy-950 px-5 py-3 text-sm font-bold text-gold-400 shadow-sm hover:bg-navy-900 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
                      {saving ? 'กำลังบันทึก...' : 'อัปโหลดและใช้รูปนี้'}
                    </button>
                    {selectedFile && (
                      <button type="button" onClick={clearSelectedFile} disabled={saving} className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-50">ยกเลิกรูปที่เลือก</button>
                    )}
                    {selectedAgent.photo_url && !selectedFile && (
                      <button
                        type="button"
                        onClick={handleRemovePhoto}
                        disabled={saving}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 px-5 py-3 text-sm font-bold text-red-600 hover:bg-red-50 disabled:opacity-50"
                      >
                        <Trash2 className="h-4 w-4" /> ลบรูปปัจจุบัน
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
