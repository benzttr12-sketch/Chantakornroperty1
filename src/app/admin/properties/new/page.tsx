'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  ImagePlus,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Check, 
  MapPin, 
  Home, 
  Maximize, 
  Sparkles,
  X
} from 'lucide-react';
import { createProperty, updateProperty, fetchAdminProperties, fetchAgents } from '@/lib/store/properties-store';
import { Agent, PropertyType, PropertyStatus } from '@/lib/types';
import { slugify } from '@/lib/utils';
import { DISTRICTS_LIST } from '@/data/locations';
import { deleteManagedPropertyImage, uploadPropertyImages } from '@/lib/store/property-media';

function PropertyEditor() {
  const router = useRouter();
  const params = useSearchParams();
  const editId = params.get('id');
  const [loading, setLoading] = useState(Boolean(editId));
  const [error, setError] = useState('');
  const [editorLoaded, setEditorLoaded] = useState(!editId);
  const [slugEdited, setSlugEdited] = useState(Boolean(editId));
  const [published, setPublished] = useState(false);

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [propertyType, setPropertyType] = useState<PropertyType>('house');
  const [status, setStatus] = useState<PropertyStatus>('sale');
  const [price, setPrice] = useState('');
  const [province, setProvince] = useState('สงขลา');
  const [district, setDistrict] = useState('');
  const [subdistrict, setSubdistrict] = useState('');
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [bedrooms, setBedrooms] = useState('0');
  const [bathrooms, setBathrooms] = useState('0');
  const [parking, setParking] = useState('0');
  const [landSize, setLandSize] = useState('0');
  const [usableArea, setUsableArea] = useState('0');
  const [yearBuilt, setYearBuilt] = useState('');
  const [furniture, setFurniture] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [originalImages, setOriginalImages] = useState<string[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [featured, setFeatured] = useState(false);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [agentId, setAgentId] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    fetchAgents()
      .then(list => {
        if (!active) return;
        setAgents(list);
        if (!editId && list.length && !agentId) setAgentId(list[0].id);
      })
      .catch(err => { if (active) setError(err instanceof Error ? err.message : 'โหลดรายชื่อตัวแทนไม่สำเร็จ'); });
    return () => { active = false; };
  }, [editId]);

  useEffect(() => {
    if (!editId) return;
    let active = true;
    setLoading(true);
    fetchAdminProperties().then(list => {
      if (!active) return;
      const property = list.find(item => item.id === editId);
      if (!property) throw new Error('ไม่พบรายการที่ต้องการแก้ไข');
      setTitle(property.title);
      setSlug(property.slug);
      setPropertyType(property.property_type);
      setStatus(property.status);
      setPrice(String(property.price ?? ''));
      setProvince(property.province);
      setDistrict(property.district);
      setSubdistrict(property.subdistrict || '');
      setAddress(property.address || '');
      setLatitude(String(property.latitude ?? ''));
      setLongitude(String(property.longitude ?? ''));
      setBedrooms(String(property.bedrooms ?? ''));
      setBathrooms(String(property.bathrooms ?? ''));
      setParking(String(property.parking ?? ''));
      setLandSize(String(property.land_size ?? ''));
      setUsableArea(String(property.usable_area ?? ''));
      setYearBuilt(String(property.year_built ?? ''));
      setFurniture(property.furniture);
      setDescription(property.description);
      setCoverImage(property.cover_image);
      setImages(property.images);
      setOriginalImages(property.images);
      setSelectedFeatures(property.features);
      setFeatured(property.featured);
      setAgentId(property.agent_id || '');
      setPublished(property.published);
      setEditorLoaded(true);
    }).catch(err => { if (active) setError(err instanceof Error ? err.message : 'โหลดข้อมูลไม่สำเร็จ'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [editId]);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!slugEdited) {
      setSlug(slugify(val) || `property-${Date.now()}`);
    }
  };

  const featureOptions = [
    'เครื่องปรับอากาศ',
    'ที่จอดรถส่วนตัว',
    'สวนหย่อมส่วนตัว',
    'สระว่ายน้ำ',
    'ห้องครัวบิวท์อิน',
    'กล้องวงจรปิด CCTV',
    'ระบบรักษาความปลอดภัย 24 ชม.',
    'ติดถนนใหญ่',
    'ใกล้มหาวิทยาลัยสงขลานครินทร์ (ม.อ.)',
    'ใกล้เซ็นทรัลหาดใหญ่',
    'ใกล้สนามบินหาดใหญ่'
  ];

  const toggleFeature = (f: string) => {
    if (selectedFeatures.includes(f)) {
      setSelectedFeatures(selectedFeatures.filter(item => item !== f));
    } else {
      setSelectedFeatures([...selectedFeatures, f]);
    }
  };

  const handleImageFiles = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    event.target.value = '';
    if (!files.length || uploadingImages) return;
    setUploadingImages(true);
    setError('');
    try {
      const uploaded = await uploadPropertyImages(files, slug || title || `draft-${Date.now()}`, images.length);
      const next = [...images, ...uploaded];
      setImages(next);
      if (!coverImage && next[0]) setCoverImage(next[0]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'อัปโหลดรูปไม่สำเร็จ');
    } finally {
      setUploadingImages(false);
    }
  };

  const moveImage = (idx: number, direction: -1 | 1) => {
    const target = idx + direction;
    if (target < 0 || target >= images.length) return;
    const next = [...images];
    [next[idx], next[target]] = [next[target], next[idx]];
    setImages(next);
  };

  const handleRemoveImage = (idx: number) => {
    const removed = images[idx];
    const remaining = images.filter((_, i) => i !== idx);
    setImages(remaining);
    if (coverImage === removed) setCoverImage(remaining[0] || '');
    if (removed && !originalImages.includes(removed)) {
      void deleteManagedPropertyImage(removed);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting || loading) return;
    if (title.trim().length < 3 || !Number.isFinite(Number(price)) || Number(price) <= 0) { setError('กรุณาระบุชื่อประกาศและราคาที่ถูกต้อง'); return; }
    if (!slug.trim() || /[/?#\\]/.test(slug)) { setError('Slug ต้องไม่ว่างและไม่มี / ? # หรือเครื่องหมายทับ'); return; }
    if (description.trim().length < 10) { setError('กรุณาระบุรายละเอียดทรัพย์อย่างน้อย 10 ตัวอักษร'); return; }
    if (!district.trim()) { setError('กรุณาเลือกอำเภอ / โซนของทรัพย์'); return; }
    if (!images.length || !coverImage || !images.includes(coverImage)) { setError('กรุณาเพิ่มรูปภาพอย่างน้อย 1 รูปและเลือกรูปปก'); return; }
    if (!Number.isFinite(Number(latitude)) || Math.abs(Number(latitude)) > 90 || !Number.isFinite(Number(longitude)) || Math.abs(Number(longitude)) > 180) { setError('พิกัดละติจูดหรือลองจิจูดไม่ถูกต้อง'); return; }
    const integerFields = [Number(bedrooms), Number(bathrooms), Number(parking)];
    if (integerFields.some(value => !Number.isInteger(value) || value < 0)) { setError('จำนวนห้องและที่จอดรถต้องเป็นจำนวนเต็มตั้งแต่ 0 ขึ้นไป'); return; }
    if ([Number(landSize), Number(usableArea)].some(value => !Number.isFinite(value) || value < 0)) { setError('ขนาดที่ดินและพื้นที่ใช้สอยต้องเป็นตัวเลขตั้งแต่ 0 ขึ้นไป'); return; }
    if (yearBuilt && (!Number.isInteger(Number(yearBuilt)) || Number(yearBuilt) < 1800 || Number(yearBuilt) > 2100)) { setError('ปีที่สร้างไม่ถูกต้อง'); return; }
    setError('');

    setSubmitting(true);
    try {
      const selectedAgent = agents.find(a => a.id === agentId);

      const propertyData = {
        title: title.trim(),
        slug: slug.trim(),
        description: description.trim(),
        property_type: propertyType,
        status,
        price: Number(price),
        province: province.trim(),
        district: district.trim(),
        subdistrict: subdistrict.trim(),
        address: address.trim() || `${district.trim()}, ${province.trim()}`,
        latitude: Number(latitude),
        longitude: Number(longitude),
        bedrooms: Number(bedrooms) || 0,
        bathrooms: Number(bathrooms) || 0,
        parking: Number(parking) || 0,
        land_size: Number(landSize) || 0,
        usable_area: Number(usableArea) || 0,
        year_built: yearBuilt ? Number(yearBuilt) : undefined,
        furniture: furniture.trim(),
        features: selectedFeatures,
        cover_image: coverImage || images[0],
        images,
        featured,
        published,
        agent_id: agentId.trim() || undefined,
        agent: selectedAgent,
      };
      if (editId) await updateProperty(editId, propertyData);
      else await createProperty(propertyData);

      const removedManagedImages = originalImages.filter((url) => !images.includes(url));
      await Promise.all(removedManagedImages.map((url) => deleteManagedPropertyImage(url)));
      router.push('/admin/properties');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'บันทึกข้อมูลไม่สำเร็จ กรุณาลองอีกครั้ง');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="p-8 text-center" role="status">กำลังโหลดข้อมูลทรัพย์...</p>;

  if (!editorLoaded) return <p role="alert" className="p-8 text-red-700">{error || 'ไม่สามารถเปิดรายการนี้ได้'}</p>;

  return (
    <div className="space-y-6 pb-20">
      {error && <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}
      {/* Top Header */}
      <div className="flex items-center justify-between bg-white p-6 rounded-2xl border border-surface-border shadow-sm">
        <div className="flex items-center space-x-3">
          <Link
            href="/admin/properties"
            className="p-2 text-gray-500 hover:text-navy-950 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold text-navy-950">{editId ? 'แก้ไขอสังหาริมทรัพย์' : 'เพิ่มอสังหาริมทรัพย์ใหม่'}</h1>
            <p className="text-xs text-brand-muted">กรอกข้อมูลให้ครบถ้วนเพื่อลงประกาศบนเว็บไซต์ Chantakorn Property</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Card 1: Basic Information */}
        <div className="bg-white rounded-2xl p-6 border border-surface-border shadow-sm space-y-4">
          <h3 className="font-bold text-navy-950 text-base border-b border-gray-100 pb-3 flex items-center space-x-2">
            <Home className="w-4 h-4 text-gold-600" />
            <span>1. ข้อมูลพื้นฐานและราคา</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                ชื่อหัวข้อประกาศ (Title) *
              </label>
              <input
                type="text"
                required
                placeholder="เช่น บ้านเดี่ยว 2 ชั้น สไตล์โมเดิร์น ใกล้เซ็นทรัลหาดใหญ่"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs text-gray-900 focus:bg-white focus:ring-2 focus:ring-gold-500 outline-none font-semibold text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Slug (URL Address) *
              </label>
              <input
                type="text"
                required
                placeholder="modern-house-central-hatyai"
                value={slug}
                onChange={(e) => { setSlugEdited(true); setSlug(e.target.value); }}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs text-gray-900 focus:bg-white focus:ring-2 focus:ring-gold-500 outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                ราคา (บาท) *
              </label>
              <input
                type="number" step="any"
                required
                placeholder="เช่น 4,850,000 หรือ 15,000 (กรณีเช่า)"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs text-navy-950 font-bold text-sm focus:bg-white focus:ring-2 focus:ring-gold-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                ประเภททรัพย์ (Property Type) *
              </label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value as PropertyType)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs text-gray-900 font-medium focus:bg-white focus:ring-2 focus:ring-gold-500 outline-none"
              >
                <option value="house">บ้านเดี่ยว / ทาวน์โฮม</option>
                <option value="land">ที่ดินเปล่า</option>
                <option value="condo">คอนโดมิเนียม</option>
                <option value="commercial">อาคารพาณิชย์</option>
                <option value="investment">อสังหาฯ ลงทุน</option>
                <option value="consignment">ขายฝาก / จำนอง</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                สถานะการขาย (Status) *
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setStatus('sale')}
                  className={`py-2.5 rounded-xl text-xs font-bold transition-all ${
                    status === 'sale' ? 'bg-navy-950 text-gold-400' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  สำหรับขาย
                </button>
                <button
                  type="button"
                  onClick={() => setStatus('rent')}
                  className={`py-2.5 rounded-xl text-xs font-bold transition-all ${
                    status === 'rent' ? 'bg-navy-950 text-gold-400' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  สำหรับเช่า
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Location & Geo Coordinates */}
        <div className="bg-white rounded-2xl p-6 border border-surface-border shadow-sm space-y-4">
          <h3 className="font-bold text-navy-950 text-base border-b border-gray-100 pb-3 flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-gold-600" />
            <span>2. ทำเลที่ตั้งและพิกัดแผนที่ (หาดใหญ่–สงขลา)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                อำเภอ / โซน *
              </label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs text-gray-900 font-medium focus:bg-white focus:ring-2 focus:ring-gold-500 outline-none"
              >
                <option value="">เลือกอำเภอ / โซน</option>
                {DISTRICTS_LIST.map((dist) => (
                  <option key={dist} value={dist}>{dist}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                ตำบล
              </label>
              <input
                type="text"
                placeholder="เช่น ควนลัง, คลองแห, หาดใหญ่"
                value={subdistrict}
                onChange={(e) => setSubdistrict(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs text-gray-900 focus:bg-white focus:ring-2 focus:ring-gold-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                ที่อยู่เต็ม / ซอย
              </label>
              <input
                type="text"
                placeholder="เช่น ซอยเพชรเกษม 41 ถนนเพชรเกษม"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs text-gray-900 focus:bg-white focus:ring-2 focus:ring-gold-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Latitude (ละติจูด) *
              </label>
              <input
                type="number"
                step="any"
                required
                placeholder="7.0084"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs text-gray-900 font-mono focus:bg-white focus:ring-2 focus:ring-gold-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Longitude (ลองจิจูด) *
              </label>
              <input
                type="number"
                step="any"
                required
                placeholder="100.4705"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs text-gray-900 font-mono focus:bg-white focus:ring-2 focus:ring-gold-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Card 3: Specs & Measurements */}
        <div className="bg-white rounded-2xl p-6 border border-surface-border shadow-sm space-y-4">
          <h3 className="font-bold text-navy-950 text-base border-b border-gray-100 pb-3 flex items-center space-x-2">
            <Maximize className="w-4 h-4 text-gold-600" />
            <span>3. ขนาดและจำนวนห้อง</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">ห้องนอน</label>
              <input
                type="number"
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs text-gray-900 font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">ห้องน้ำ</label>
              <input
                type="number"
                value={bathrooms}
                onChange={(e) => setBathrooms(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs text-gray-900 font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">ที่จอดรถ</label>
              <input
                type="number"
                value={parking}
                onChange={(e) => setParking(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs text-gray-900 font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">ที่ดิน (ตร.ว.)</label>
              <input
                type="number"
                value={landSize}
                onChange={(e) => setLandSize(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs text-gray-900 font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">ใช้สอย (ตร.ม.)</label>
              <input
                type="number"
                value={usableArea}
                onChange={(e) => setUsableArea(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs text-gray-900 font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">ปีที่สร้าง</label>
              <input
                type="number"
                value={yearBuilt}
                onChange={(e) => setYearBuilt(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs text-gray-900 font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">รายละเอียดเฟอร์นิเจอร์</label>
            <input
              type="text"
              value={furniture}
              onChange={(e) => setFurniture(e.target.value)}
              placeholder="เช่น ตกแต่งครบพร้อมอยู่, พร้อมอยู่บางส่วน, ไม่มี"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs text-gray-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">คำอธิบายรายละเอียดทรัพย์ *</label>
            <textarea
              rows={4}
              required
              minLength={10}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="ระบุข้อความบรรยายความสวยงาม โครงสร้าง สิ่งแวดล้อม และข้อเสนอพิเศษ..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs text-gray-900 resize-none"
            />
          </div>
        </div>

        {/* Card 4: Features Checklist */}
        <div className="bg-white rounded-2xl p-6 border border-surface-border shadow-sm space-y-4">
          <h3 className="font-bold text-navy-950 text-base border-b border-gray-100 pb-3">
            4. สิ่งอำนวยความสะดวกและจุดเด่น
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {featureOptions.map((feat) => {
              const active = selectedFeatures.includes(feat);
              return (
                <button
                  key={feat}
                  type="button"
                  onClick={() => toggleFeature(feat)}
                  className={`p-3 rounded-xl border text-left text-xs font-semibold flex items-center space-x-2 transition-all ${
                    active ? 'bg-gold-50 border-gold-400 text-navy-950' : 'bg-gray-50 border-gray-200 text-gray-600'
                  }`}
                >
                  <div className={`w-4 h-4 rounded flex items-center justify-center ${
                    active ? 'bg-gold-500 text-navy-950' : 'bg-white border border-gray-300'
                  }`}>
                    {active && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span>{feat}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Card 5: Images & Agent Assignment */}
        <div className="bg-white rounded-2xl p-6 border border-surface-border shadow-sm space-y-4">
          <h3 className="font-bold text-navy-950 text-base border-b border-gray-100 pb-3">
            5. รูปภาพและผู้ดูแลทรัพย์
          </h3>

          <div className="rounded-2xl border border-dashed border-gold-300 bg-gold-50/40 p-5">
            <label className="flex cursor-pointer flex-col items-center justify-center gap-2 text-center">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy-950 text-gold-400">
                {uploadingImages ? <Loader2 className="h-5 w-5 animate-spin" /> : <ImagePlus className="h-5 w-5" />}
              </span>
              <span className="text-sm font-bold text-navy-950">{uploadingImages ? 'กำลังอัปโหลดรูป...' : 'เลือกรูปทรัพย์จากเครื่อง'}</span>
              <span className="text-xs text-gray-500">เลือกได้หลายรูป · JPG / PNG / WebP · รูปละไม่เกิน 10 MB · สูงสุด 20 รูป</span>
              <input type="file" accept="image/jpeg,image/png,image/webp" multiple disabled={uploadingImages} onChange={handleImageFiles} className="sr-only" />
            </label>
          </div>

          {/* Images preview and ordering */}
          {images.length > 0 && (
            <div className="grid grid-cols-2 gap-3 pt-2 sm:grid-cols-3 lg:grid-cols-4">
              {images.map((img, i) => (
                <div key={img} className={`overflow-hidden rounded-2xl border bg-white ${coverImage === img ? 'border-gold-500 ring-2 ring-gold-200' : 'border-gray-200'}`}>
                  <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img} alt={`รูปทรัพย์ ${i + 1}`} className="h-full w-full object-cover" />
                    {coverImage === img && <span className="absolute left-2 top-2 rounded-full bg-gold-500 px-2 py-1 text-[10px] font-extrabold text-navy-950">รูปปก</span>}
                    <button type="button" onClick={() => handleRemoveImage(i)} className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-white hover:bg-red-600" aria-label={`ลบรูปที่ ${i + 1}`}><X className="h-4 w-4" /></button>
                  </div>
                  <div className="flex items-center justify-between gap-1 p-2">
                    <button type="button" onClick={() => moveImage(i, -1)} disabled={i === 0} className="rounded-lg border p-1.5 text-gray-600 disabled:opacity-30" aria-label="เลื่อนรูปไปซ้าย"><ChevronLeft className="h-3.5 w-3.5" /></button>
                    <button type="button" onClick={() => setCoverImage(img)} className="flex-1 rounded-lg bg-navy-950 px-2 py-1.5 text-[10px] font-bold text-gold-400">{coverImage === img ? 'รูปปกปัจจุบัน' : 'ตั้งเป็นรูปปก'}</button>
                    <button type="button" onClick={() => moveImage(i, 1)} disabled={i === images.length - 1} className="rounded-lg border p-1.5 text-gray-600 disabled:opacity-30" aria-label="เลื่อนรูปไปขวา"><ChevronRight className="h-3.5 w-3.5" /></button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                นายหน้าที่รับผิดชอบทรัพย์นี้
              </label>
              <select
                value={agentId}
                onChange={(e) => setAgentId(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs text-gray-900 font-medium"
              >
                <option value="">ไม่ระบุผู้รับผิดชอบ</option>
                {agents.map((agent) => (
                  <option key={agent.id} value={agent.id}>
                    {agent.name} ({agent.title})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col items-start gap-3 pt-4">
              <label className="flex items-center space-x-2 text-xs font-bold text-navy-950"><input type="checkbox" checked={published} onChange={event => setPublished(event.target.checked)} /><span>เผยแพร่บนเว็บไซต์</span></label>
              {!editId && !published && <p className="text-[11px] leading-relaxed text-gray-500">รายการใหม่จะเริ่มเป็นฉบับร่าง เพื่อให้ตรวจข้อมูลและรูปภาพก่อนเผยแพร่</p>}
              <label className="flex items-center space-x-2 text-xs font-bold text-navy-950 cursor-pointer">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="w-4 h-4 text-gold-600 rounded border-gray-300 focus:ring-gold-500 cursor-pointer"
                />
                <span>ตั้งเป็นทรัพย์เด่นประจำหน้าแรก (Featured)</span>
              </label>
            </div>
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex items-center justify-end space-x-3 pt-4">
          <Link
            href="/admin/properties"
            className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 text-xs font-bold hover:bg-gray-50"
          >
            ยกเลิก
          </Link>
          <button
            type="submit"
            disabled={submitting || uploadingImages}
            className="px-8 py-3 bg-navy-950 hover:bg-navy-900 text-gold-400 rounded-xl text-xs font-bold shadow-lg transition-all flex items-center space-x-2 disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4 text-gold-400" />
            <span>{uploadingImages ? 'กำลังอัปโหลดรูป...' : submitting ? 'กำลังบันทึกข้อมูล...' : 'บันทึกข้อมูลทรัพย์'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

export default function AddPropertyPage() {
  return <Suspense fallback={<p className="p-8 text-center">กำลังโหลด...</p>}><PropertyEditor /></Suspense>;
}
