'use client';

import React, { useState } from 'react';
import { 
  Building2, 
  CheckCircle2, 
  Home, 
  User, 
  MessageCircle, 
  ShieldCheck, 
  Sparkles
} from 'lucide-react';
import { submitInquiry } from '@/lib/store/properties-store';
import { SITE_CONFIG, contactFallbackMessage } from '@/config/site';
import { DISTRICTS_LIST } from '@/data/locations';

export default function SellPage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [lineId, setLineId] = useState('');
  const [propertyType, setPropertyType] = useState('house');
  const [province] = useState('สงขลา');
  const [district, setDistrict] = useState('หาดใหญ่');
  const [subdistrict, setSubdistrict] = useState('');
  const [expectedPrice, setExpectedPrice] = useState('');
  const [landSize, setLandSize] = useState('');
  const [usableArea, setUsableArea] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    if (!name.trim() || !phone.trim() || Number(expectedPrice) <= 0) { setError('กรุณากรอกชื่อ เบอร์โทรศัพท์ และราคาที่ต้องการให้ถูกต้อง'); return; }

    setError('');
    setSubmitting(true);
    try {
      await submitInquiry({
        name: name.trim(),
        phone: phone.trim(),
        line_id: lineId,
        message: `ฝากขายทรัพย์ประเภท ${propertyType} ใน ${district} จ.${province} ราคาที่ต้องการ ${expectedPrice} บาท\nรายละเอียด: ${description}`,
        inquiry_type: 'consignment_sell',
        status: 'new',
        consignment_details: {
          property_type: propertyType,
          province,
          district,
          subdistrict,
          expected_price: Number(expectedPrice),
          land_size: landSize ? Number(landSize) : undefined,
          usable_area: usableArea ? Number(usableArea) : undefined,
        },
      });

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : contactFallbackMessage('ส่งข้อมูลไม่สำเร็จ'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-surface-bg min-h-screen pb-24">
      {/* Hero Section */}
      <div className="bg-navy-950 text-white py-16 lg:py-20 border-b border-navy-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#C9A227_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-navy-900 border border-gold-500/30 text-gold-400 text-xs font-semibold mb-4">
            <Building2 className="w-3.5 h-3.5 text-gold-400" />
            <span>บริการรับฝากขายอสังหาริมทรัพย์ หาดใหญ่–สงขลา</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            ต้องการขายบ้านหรือที่ดิน?
          </h1>

          <p className="text-base sm:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            ฝากทรัพย์กับ <strong className="text-gold-400 font-semibold">Chantakorn Property</strong> <br />
            ให้เราช่วยหาผู้ซื้อที่เหมาะสม วางแผนการตลาด และดูแลความเรียบร้อยจนจบขั้นตอน
          </p>

          <div className="mt-8 flex justify-center">
            <a
              href="#consignment-form"
              className="px-8 py-3.5 bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-300 hover:to-gold-400 text-navy-950 font-bold text-sm sm:text-base rounded-xl shadow-lg transition-all"
            >
              ฝากขายกับเรา
            </a>
          </div>
        </div>
      </div>

      {/* Form Container */}
      <div id="consignment-form" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-surface-border shadow-xl">
          {submitted ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-950">
                ได้รับข้อมูลของคุณแล้ว
              </h2>
              <p className="text-base text-gray-600 max-w-lg mx-auto leading-relaxed">
                ทีมงาน <strong className="text-navy-950">Chantakorn Property</strong> จะติดต่อกลับโดยเร็วที่สุดเพื่อยืนยันข้อมูล นัดหมายลงพื้นที่ถ่ายภาพ และเริ่มแผนการตลาดครับ
              </p>
              <div className="pt-6">
                <a
                  href={SITE_CONFIG.lineUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-[#06C755] hover:bg-[#05b34c] text-white font-bold text-sm rounded-xl shadow-md transition-all"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>แจ้งข้อมูลด่วนทาง LINE Official Account</span>
                </a>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
          {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
              {/* Section 1: ข้อมูลผู้ติดต่อ */}
              <div>
                <div className="flex items-center space-x-2 text-navy-950 font-bold text-base pb-3 border-b border-gray-100 mb-4">
                  <User className="w-4 h-4 text-gold-600" />
                  <span>1. ข้อมูลผู้ติดต่อ (เจ้าของทรัพย์หรือตัวแทน)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      ชื่อ-นามสกุล ผู้ติดต่อ *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="เช่น คุณสมชาย นวลศรี"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs text-gray-900 focus:bg-white focus:ring-2 focus:ring-gold-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      เบอร์โทรศัพท์ติดต่อ *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="081-xxx-xxxx"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs text-gray-900 focus:bg-white focus:ring-2 focus:ring-gold-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      LINE ID (ถ้ามี)
                    </label>
                    <input
                      type="text"
                      placeholder="ไอดีไลน์สำหรับการติดต่อ"
                      value={lineId}
                      onChange={(e) => setLineId(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs text-gray-900 focus:bg-white focus:ring-2 focus:ring-gold-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: ข้อมูลอสังหาริมทรัพย์ */}
              <div>
                <div className="flex items-center space-x-2 text-navy-950 font-bold text-base pb-3 border-b border-gray-100 mb-4">
                  <Home className="w-4 h-4 text-gold-600" />
                  <span>2. รายละเอียดอสังหาริมทรัพย์ที่ต้องการฝากขาย</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      ประเภททรัพย์ *
                    </label>
                    <select
                      value={propertyType}
                      onChange={(e) => setPropertyType(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs text-gray-900 font-medium cursor-pointer focus:bg-white focus:ring-2 focus:ring-gold-500 outline-none"
                    >
                      <option value="house">บ้านเดี่ยว / ทาวน์โฮม</option>
                      <option value="land">ที่ดินเปล่า</option>
                      <option value="condo">คอนโดมิเนียม</option>
                      <option value="commercial">อาคารพาณิชย์</option>
                      <option value="other">อื่น ๆ</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      จังหวัด
                    </label>
                    <input
                      type="text"
                      disabled
                      value={province}
                      className="w-full bg-gray-100 border border-gray-200 rounded-xl p-3 text-xs text-gray-600 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      อำเภอ / ทำเล *
                    </label>
                    <select
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs text-gray-900 font-medium cursor-pointer focus:bg-white focus:ring-2 focus:ring-gold-500 outline-none"
                    >
                      {DISTRICTS_LIST.map((dist) => (
                        <option key={dist} value={dist}>{dist}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      ตำบล (ถ้าทราบ)
                    </label>
                    <input
                      type="text"
                      placeholder="เช่น ควนลัง, คลองแห..."
                      value={subdistrict}
                      onChange={(e) => setSubdistrict(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs text-gray-900 focus:bg-white focus:ring-2 focus:ring-gold-500 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      ราคาที่ต้องการขาย (บาท) *
                    </label>
                    <input
                      type="number" min="0"
                      required
                      placeholder="เช่น 4,500,000"
                      value={expectedPrice}
                      onChange={(e) => setExpectedPrice(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs text-gray-900 focus:bg-white focus:ring-2 focus:ring-gold-500 outline-none font-semibold text-navy-950"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      ขนาดที่ดิน (ตร.ว. หรือ ไร่)
                    </label>
                    <input
                      type="text"
                      placeholder="เช่น 52 ตร.ว. หรือ 2 ไร่"
                      value={landSize}
                      onChange={(e) => setLandSize(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs text-gray-900 focus:bg-white focus:ring-2 focus:ring-gold-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      พื้นที่ใช้สอย (ตร.ม.)
                    </label>
                    <input
                      type="text"
                      placeholder="เช่น 180 ตร.ม."
                      value={usableArea}
                      onChange={(e) => setUsableArea(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs text-gray-900 focus:bg-white focus:ring-2 focus:ring-gold-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    รายละเอียดเพิ่มเติมเกี่ยวกับทรัพย์
                  </label>
                  <textarea
                    rows={4}
                    placeholder="เช่น จำนวนห้องนอน ห้องน้ำ จุดเด่น สถานที่ใกล้เคียง และข้อมูลโฉนด..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs text-gray-900 focus:bg-white focus:ring-2 focus:ring-gold-500 outline-none resize-none"
                  />
                </div>
              </div>

              {/* Section 3: ส่งรูปเพิ่มเติม */}
              <div className="rounded-2xl border border-gold-200 bg-gold-50/50 p-5">
                <div className="flex items-start gap-3">
                  <MessageCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-gold-700" />
                  <div>
                    <h3 className="text-sm font-bold text-navy-950">มีรูปหรือเอกสารของทรัพย์?</h3>
                    <p className="mt-1 text-xs leading-relaxed text-gray-600">
                      หลังส่งแบบฟอร์ม สามารถส่งรูปถ่าย โฉนด หรือเอกสารเพิ่มเติมผ่าน LINE Official Account ได้โดยตรง วิธีนี้ช่วยให้ไฟล์ต้นฉบับคมชัดและไม่ทำให้แบบฟอร์มช้า
                    </p>
                    <a href={SITE_CONFIG.lineUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-gold-800 hover:underline">
                      <MessageCircle className="h-3.5 w-3.5" /> ส่งรูปทาง LINE
                    </a>
                  </div>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-4 border-t border-gray-100">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 bg-navy-950 hover:bg-navy-900 text-gold-400 font-bold text-base rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  <Sparkles className="w-5 h-5 text-gold-400" />
                  <span>{submitting ? 'กำลังบันทึกข้อมูล...' : 'ส่งข้อมูลฝากขาย'}</span>
                </button>
                <p className="text-center text-xs text-gray-500 mt-3 flex items-center justify-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>ข้อมูลของท่านจะถูกเก็บเป็นความลับตามนโยบายความเป็นส่วนตัวของ Chantakorn Property</span>
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
