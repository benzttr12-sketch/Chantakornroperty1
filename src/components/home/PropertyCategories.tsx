import Link from 'next/link';
import Image from 'next/image';
import { Home, Trees, Building2, Store, TrendingUp, HandCoins, ArrowRight } from 'lucide-react';

export default function PropertyCategories() {
  const categories = [
    {
      name: 'บ้าน',
      type: 'house',
      description: 'บ้านเดี่ยว ทาวน์โฮม บ้านแฝด โซนหาดใหญ่และสงขลา',
      icon: Home,
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'ที่ดิน',
      type: 'land',
      description: 'ที่ดินเปล่าถมแล้ว ที่ดินติดถนนใหญ่ แปลงสร้างบ้านหรือจัดสรร',
      icon: Trees,
      image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'คอนโด',
      type: 'condo',
      description: 'คอนโดพร้อมอยู่ใกล้มหาวิทยาลัยสงขลานครินทร์ และเซ็นทรัลหาดใหญ่',
      icon: Building2,
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'อาคารพาณิชย์',
      type: 'commercial',
      description: 'ตึกแถวและโฮมออฟฟิศทำเลค้าขาย ใจกลางย่านธุรกิจหาดใหญ่',
      icon: Store,
      image: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'อสังหาริมทรัพย์เพื่อการลงทุน',
      type: 'investment',
      description: 'อพาร์ทเมนท์ หอพัก และอาคารสำหรับผู้ที่มองหาทรัพย์เพื่อการลงทุน',
      icon: TrendingUp,
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'ขายฝาก / จำนอง',
      type: 'consignment',
      description: 'ข้อมูลและช่องทางติดต่อสำหรับการขายฝากหรือจำนองอสังหาริมทรัพย์',
      icon: HandCoins,
      image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80',
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-surface-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-gold-600 uppercase tracking-widest bg-gold-50 px-3.5 py-1 rounded-full border border-gold-200">
            ประเภทอสังหาริมทรัพย์
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-950 mt-3 mb-3">
            ค้นหาอสังหาริมทรัพย์ตามประเภท
          </h2>
          <p className="text-brand-muted text-sm sm:text-base">
            เลือกประเภทอสังหาริมทรัพย์เพื่อดูประกาศ ราคา ทำเล และรายละเอียดที่เผยแพร่บนเว็บไซต์
          </p>
        </div>

        {/* Categories Grid (6 Cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.name}
                href={`/properties?type=${cat.type}`}
                className="group relative h-64 rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover border border-surface-border transition-all duration-300 transform hover:-translate-y-1 block"
              >
                {/* Background Image */}
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />

                {/* Dark Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/95 via-navy-950/50 to-navy-950/20 group-hover:via-navy-950/60 transition-colors" />

                {/* Content Overlay */}
                <div className="absolute inset-0 p-6 flex flex-col justify-between z-10">
                  <div className="w-11 h-11 rounded-xl bg-white/90 backdrop-blur-md flex items-center justify-center text-navy-900 group-hover:bg-gold-500 group-hover:text-navy-950 transition-colors shadow-md">
                    <Icon className="w-5 h-5" />
                  </div>

                  {/* Bottom Info */}
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1 group-hover:text-gold-300 transition-colors flex items-center justify-between">
                      <span>{cat.name}</span>
                      <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all text-gold-400" />
                    </h3>
                    <p className="text-xs text-gray-300 line-clamp-2 leading-relaxed">
                      {cat.description}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
