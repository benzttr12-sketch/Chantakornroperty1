import Link from 'next/link';
import { ArrowRight, MapPin } from 'lucide-react';
import { LOCATIONS } from '@/data/locations';

export default function LocationHighlights() {
  return (
    <section className="border-y border-surface-border bg-white py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <span className="inline-flex rounded-full border border-gold-200 bg-gold-50 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-gold-700">
            พื้นที่ให้บริการ
          </span>
          <h2 className="mt-3 text-3xl font-extrabold text-navy-950 sm:text-4xl">ค้นหาทรัพย์ตามทำเล</h2>
          <p className="mt-3 text-sm text-brand-muted sm:text-base">
            เลือกพื้นที่ที่สนใจเพื่อดูประกาศอสังหาริมทรัพย์และทำเลที่ตรงกับความต้องการ
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {LOCATIONS.map((location) => (
            <Link
              key={location.id}
              href={`/properties?district=${encodeURIComponent(location.district)}`}
              className="group rounded-2xl border border-surface-border bg-surface-bg p-6 transition-all hover:-translate-y-0.5 hover:border-gold-300 hover:bg-white hover:shadow-card"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-navy-950 text-gold-400">
                  <MapPin className="h-5 w-5" />
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400 transition-transform group-hover:translate-x-1 group-hover:text-gold-600" />
              </div>
              <h3 className="mt-5 text-xl font-bold text-navy-950">{location.name}</h3>
              <p className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-gold-700">{location.nameEn}</p>
              <p className="mt-3 text-xs leading-relaxed text-gray-600">{location.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
