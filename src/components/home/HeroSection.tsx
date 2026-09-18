import Link from 'next/link';
import Image from 'next/image';
import { Search, PlusCircle } from 'lucide-react';
import FloatingSearchBox from './FloatingSearchBox';

export default function HeroSection() {
  return (
    <section className="relative min-h-[620px] lg:min-h-[680px] flex flex-col justify-between pt-16 pb-12 lg:pt-24 lg:pb-16 overflow-hidden">
      {/* Background Photography with Luxury Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=85"
          alt=""
          fill
          priority
          className="object-cover object-center"
        />
        {/* Deep Navy Subtle Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950/95 via-navy-950/80 to-navy-950/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-black/30" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-grow flex flex-col justify-center">
        <div className="max-w-3xl">
          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15] mb-5">
            ค้นหาอสังหาริมทรัพย์ที่ใช่ <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-300 via-gold-400 to-amber-200">
              สำหรับคุณ
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-gray-200 leading-relaxed font-normal mb-8 max-w-2xl">
            บ้าน ที่ดิน คอนโด และอสังหาริมทรัพย์ในหาดใหญ่–สงขลา <br className="hidden sm:inline" />
            ค้นหาประกาศ สอบถามรายละเอียด นัดชม และฝากขายทรัพย์ได้ในที่เดียว
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 mb-10">
            <Link
              href="/properties"
              className="px-7 py-3.5 bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-300 hover:to-gold-400 text-navy-950 font-bold text-sm rounded-lg shadow-lg hover:shadow-gold-500/30 flex items-center space-x-2 transition-all transform hover:-translate-y-0.5"
            >
              <Search className="w-4 h-4" />
              <span>ค้นหาอสังหาริมทรัพย์</span>
            </Link>

            <Link
              href="/sell"
              className="px-7 py-3.5 bg-navy-900/80 hover:bg-navy-800 text-white hover:text-gold-300 border border-white/20 hover:border-gold-400/50 font-semibold text-sm rounded-lg backdrop-blur-md flex items-center space-x-2 transition-all transform hover:-translate-y-0.5"
            >
              <PlusCircle className="w-4 h-4 text-gold-400" />
              <span>ฝากขายกับเรา</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Floating Search Panel Attached at Bottom */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-10">
        <FloatingSearchBox />
      </div>
    </section>
  );
}
