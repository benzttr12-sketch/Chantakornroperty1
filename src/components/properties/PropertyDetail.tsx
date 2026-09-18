'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  MapPin,
  Bed,
  Bath,
  Car,
  Maximize,
  Check,
  Phone,
  MessageCircle,
  Calendar,
  ChevronRight,
  ShieldCheck,
  Compass,
  ExternalLink
} from 'lucide-react';
import PropertyGallery from '@/components/properties/PropertyGallery';
import PropertySpecs from '@/components/properties/PropertySpecs';
import AgentCard from '@/components/properties/AgentCard';
import PropertyInquiryForm from '@/components/properties/PropertyInquiryForm';
import PropertyCard from '@/components/properties/PropertyCard';
import PropertyMap from '@/components/properties/PropertyMap';
import { propertyHref } from '@/components/properties/property-link';
import { fetchPropertyBySlug, fetchProperties } from '@/lib/store/properties-store';
import { formatPrice, getPropertyStatusBadge, formatThaiNumber } from '@/lib/utils';

import { Property } from '@/lib/types';
import { SITE_CONFIG } from '@/config/site';
import { getSiteUrl } from '@/config/site-url';

export default function PropertyDetail({ slug, initialProperty = null }: { slug: string; initialProperty?: Property | null }) {
  const [property, setProperty] = useState<Property | null>(initialProperty);
  const [relatedProperties, setRelatedProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(!initialProperty);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    async function load() {
      try {
        const current = slug ? await fetchPropertyBySlug(slug) : null;
        if (!active) return;
        setProperty(current);
        if (current) {
          const all = await fetchProperties();
          if (active) setRelatedProperties(all.filter(p => p.id !== current.id && (p.district === current.district || p.property_type === current.property_type)).slice(0, 4));
        }
      } catch (err) {
        if (active) {
          setProperty(null);
          setError(err instanceof Error ? err.message : 'ไม่สามารถโหลดข้อมูลทรัพย์ได้ กรุณาลองอีกครั้ง');
        }
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => { active = false; };
  }, [slug]);

  if (loading && !property) return <div className="p-16 text-center" role="status">กำลังโหลดรายละเอียดทรัพย์...</div>;
  if (!property) return <div className="p-16 text-center space-y-4"><h1 className="text-xl font-bold">{error || 'ไม่พบอสังหาริมทรัพย์นี้'}</h1><Link className="text-gold-700 underline" href="/properties">กลับไปค้นหาอสังหาริมทรัพย์</Link></div>;

  const statusBadge = getPropertyStatusBadge(property.status);

  // JSON-LD Structured Data for RealEstateListing
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: property.title,
    description: property.description,
    url: `${getSiteUrl()}${propertyHref(property.slug)}`,
    ...(property.created_at ? { datePosted: property.created_at } : {}),
    image: property.images,
    offers: {
      '@type': 'Offer',
      price: property.price,
      priceCurrency: 'THB',
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: property.district,
      addressRegion: property.province,
      addressCountry: 'TH',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: property.latitude,
      longitude: property.longitude,
    },
  };

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${property.latitude},${property.longitude}`;

  return (
    <div className="bg-surface-bg min-h-screen pb-24 md:pb-16">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\u003c') }}
      />

      {/* Breadcrumb Navigation Bar */}
      <div className="bg-white border-b border-surface-border py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center space-x-2 text-xs text-brand-muted">
          <Link href="/" className="hover:text-navy-950">หน้าแรก</Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <Link href="/properties" className="hover:text-navy-950">อสังหาริมทรัพย์</Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-gray-400 truncate max-w-xs sm:max-w-md">{property.title}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Main 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left / Main Column (8 Cols) */}
          <div className="lg:col-span-8 space-y-8">
            {/* 1. Header Section */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${statusBadge.bgClass} ${statusBadge.textClass}`}>
                  {statusBadge.text}
                </span>
                {property.featured && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-navy-950 text-gold-400 border border-gold-500/30">
                    ทรัพย์เด่นแนะนำ
                  </span>
                )}
                <span className="text-xs text-gray-500 flex items-center ml-auto">
                  <Compass className="w-3.5 h-3.5 mr-1 text-gold-600" />
                  รหัสทรัพย์: <strong className="ml-1 text-navy-950">{property.id.toUpperCase()}</strong>
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-navy-950 tracking-tight leading-snug">
                {property.title}
              </h1>

              <div className="flex items-center text-brand-muted text-xs sm:text-sm mt-2">
                <MapPin className="w-4 h-4 text-gold-600 mr-1.5 flex-shrink-0" />
                <span>{property.address || `${property.district}, ${property.province}`}</span>
              </div>

              {/* Price Banner */}
              <div className="mt-4 p-4 rounded-2xl bg-navy-950 text-white flex flex-wrap items-center justify-between gap-2 shadow-sm border border-navy-800">
                <div>
                  <span className="text-xs text-gray-400 uppercase tracking-wider block">
                    {property.status === 'rent' ? 'ค่าเช่าต่อเดือน' : 'ราคาเสนอขาย'}
                  </span>
                  <span className="text-3xl font-extrabold text-gold-400">
                    {formatPrice(property.price, property.status)}
                  </span>
                </div>
                <div className="text-right text-xs text-gray-300">
                  <span>โปรดสอบถามสถานะล่าสุดก่อนนัดหมายหรือทำธุรกรรม</span>
                </div>
              </div>
            </div>

            {/* 2. Photo Gallery Component */}
            <PropertyGallery
              id={property.id}
              title={property.title}
              images={property.images.length ? property.images : property.cover_image ? [property.cover_image] : []}
            />

            {/* 3. Quick Stats Bar */}
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 p-4 bg-white rounded-2xl border border-surface-border shadow-card text-center">
              {property.bedrooms > 0 && (
                <div className="p-2 border-r border-gray-100 last:border-0">
                  <Bed className="w-5 h-5 mx-auto text-gold-600 mb-1" />
                  <span className="text-xs text-gray-500 block">ห้องนอน</span>
                  <span className="text-sm font-bold text-navy-950">{property.bedrooms}</span>
                </div>
              )}
              {property.bathrooms > 0 && (
                <div className="p-2 border-r border-gray-100 last:border-0">
                  <Bath className="w-5 h-5 mx-auto text-gold-600 mb-1" />
                  <span className="text-xs text-gray-500 block">ห้องน้ำ</span>
                  <span className="text-sm font-bold text-navy-950">{property.bathrooms}</span>
                </div>
              )}
              {property.parking > 0 && (
                <div className="p-2 border-r border-gray-100 last:border-0">
                  <Car className="w-5 h-5 mx-auto text-gold-600 mb-1" />
                  <span className="text-xs text-gray-500 block">ที่จอดรถ</span>
                  <span className="text-sm font-bold text-navy-950">{property.parking} คัน</span>
                </div>
              )}
              {property.land_size > 0 && (
                <div className="p-2 border-r border-gray-100 last:border-0">
                  <Maximize className="w-5 h-5 mx-auto text-gold-600 mb-1" />
                  <span className="text-xs text-gray-500 block">ขนาดที่ดิน</span>
                  <span className="text-sm font-bold text-navy-950">{formatThaiNumber(property.land_size)} ตร.ว.</span>
                </div>
              )}
              {property.usable_area > 0 && (
                <div className="p-2">
                  <Maximize className="w-5 h-5 mx-auto text-gold-600 mb-1" />
                  <span className="text-xs text-gray-500 block">พื้นที่ใช้สอย</span>
                  <span className="text-sm font-bold text-navy-950">{formatThaiNumber(property.usable_area)} ตร.ม.</span>
                </div>
              )}
            </div>

            {/* 4. Description */}
            <div className="bg-white rounded-2xl p-6 border border-surface-border shadow-card">
              <h3 className="text-lg font-bold text-navy-950 mb-4 pb-2 border-b border-gray-100">
                รายละเอียดทรัพย์
              </h3>
              <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed space-y-3 whitespace-pre-line">
                {property.description}
              </div>

              <div className="mt-6 flex items-start space-x-3 rounded-xl border border-amber-200 bg-amber-50/70 p-4">
                <ShieldCheck className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-700" />
                <p className="text-xs leading-relaxed text-amber-900">
                  ข้อมูลประกาศอาจมีการเปลี่ยนแปลง ผู้สนใจควรตรวจสอบเอกสารสิทธิ์ ภาระผูกพัน ราคา และรายละเอียดสำคัญกับเจ้าของทรัพย์หรือหน่วยงานที่เกี่ยวข้องก่อนทำธุรกรรม
                </p>
              </div>
            </div>

            {/* 5. Property Information Specifications */}
            <PropertySpecs property={property} />

            {/* 6. Features & Amenities */}
            {property.features && property.features.length > 0 && (
              <div className="bg-white rounded-2xl p-6 border border-surface-border shadow-card">
                <h3 className="text-lg font-bold text-navy-950 mb-4 pb-2 border-b border-gray-100">
                  สิ่งอำนวยความสะดวกและจุดเด่น
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {property.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center space-x-2.5 text-xs sm:text-sm text-gray-800">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 7. Location & Interactive Map */}
            <div className="bg-white rounded-2xl p-6 border border-surface-border shadow-card">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
                <h3 className="text-lg font-bold text-navy-950">
                  ทำเลที่ตั้ง
                </h3>
                <span className="text-xs text-gray-500 flex items-center">
                  <MapPin className="w-3.5 h-3.5 text-gold-600 mr-1" />
                  {property.district}, {property.province}
                </span>
              </div>

              {/* Map View */}
              <div className="h-72 w-full rounded-xl overflow-hidden mb-6 border border-gray-200">
                <PropertyMap
                  properties={[property]}
                  selectedProperty={property}
                  zoom={14}
                  height="100%"
                />
              </div>

              <div className="flex flex-col gap-3 rounded-xl bg-gray-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-bold text-navy-950">พิกัดประกาศ</p>
                  <p className="mt-1 text-xs text-gray-600">{property.latitude.toFixed(6)}, {property.longitude.toFixed(6)}</p>
                </div>
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-bold text-navy-950 hover:border-gold-300 hover:text-gold-700"
                >
                  เปิดใน Google Maps
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Right / Sticky Sidebar Column (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="sticky top-20 space-y-6">
              {/* Agent profile */}
              <AgentCard agent={property.agent} property={property} />

              {/* Contact / Lead Inquiry Form */}
              <PropertyInquiryForm property={property} />
            </div>
          </div>
        </div>

        {/* 8. Related Properties (Bottom) */}
        {relatedProperties.length > 0 && (
          <div className="mt-16 pt-12 border-t border-surface-border">
            <div className="mb-8">
              <span className="text-xs font-bold text-gold-600 uppercase tracking-widest bg-gold-50 px-3.5 py-1 rounded-full border border-gold-200">
                รายการที่เกี่ยวข้อง
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-950 mt-2">
                ทรัพย์ที่น่าสนใจใกล้เคียง
              </h2>
              <p className="text-xs sm:text-sm text-brand-muted mt-1">
                รายการอื่นในทำเลเดียวกันหรือประเภททรัพย์ใกล้เคียง
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProperties.map((rel) => (
                <PropertyCard
                  key={rel.id}
                  id={rel.id}
                  title={rel.title}
                  type={rel.property_type}
                  status={rel.status}
                  price={rel.price}
                  location={rel.address || `${rel.district}, ${rel.province}`}
                  district={rel.district}
                  province={rel.province}
                  coverImage={rel.cover_image}
                  images={rel.images}
                  bedrooms={rel.bedrooms}
                  bathrooms={rel.bathrooms}
                  landSize={rel.land_size}
                  usableArea={rel.usable_area}
                  featured={rel.featured}
                  slug={rel.slug}
                  createdAt={rel.created_at}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sticky Bottom CTA Bar on Mobile */}
      <div className="md:hidden fixed bottom-14 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-surface-border p-3 shadow-lg flex items-center space-x-2">
        <a
          href={SITE_CONFIG.phoneHref}
          className="flex-1 py-2.5 bg-navy-950 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-1"
        >
          <Phone className="w-3.5 h-3.5 text-gold-400" />
          <span>โทรด่วน</span>
        </a>

        <a
          href={SITE_CONFIG.lineUrl}
          target="_blank"
          rel="noreferrer"
          className="flex-1 py-2.5 bg-[#06C755] text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-1"
        >
          <MessageCircle className="w-3.5 h-3.5 fill-current" />
          <span>แชท LINE</span>
        </a>

        <a
          href="#inquiry"
          className="flex-1 py-2.5 bg-gradient-to-r from-gold-400 to-gold-500 text-navy-950 rounded-xl text-xs font-bold flex items-center justify-center space-x-1 shadow-sm"
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>นัดชม</span>
        </a>
      </div>
    </div>
  );
}
