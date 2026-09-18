import Link from 'next/link';
import { PlusCircle, CheckCircle2, ArrowRight } from 'lucide-react';

export default function SellPropertyCTA() {
  const benefits = [
    'ช่วยรวบรวมข้อมูลทรัพย์และวางแผนการนำเสนอ',
    'ประชาสัมพันธ์ผ่านช่องทางที่เหมาะสมกับประเภททรัพย์',
    'ประสานผู้สนใจ นัดหมายเข้าชม และติดตามการติดต่อ',
    'ช่วยประสานขั้นตอนเอกสารและการนัดหมายจนจบกระบวนการ'
  ];

  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950 p-8 sm:p-12 lg:p-16 overflow-hidden shadow-xl border border-navy-800">
          {/* Decorative Gold Accent Lines */}
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 rounded-full bg-gold-500/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-64 h-64 rounded-full bg-navy-800/40 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-4xl">
            {/* Left Content */}
            <div>
              <span className="inline-flex items-center space-x-1.5 text-xs font-bold text-gold-400 uppercase tracking-widest bg-navy-800 px-3.5 py-1 rounded-full border border-gold-500/30 mb-4">
                บริการรับฝากขายอสังหาริมทรัพย์
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight mb-4">
                มีบ้าน มีที่ดิน อยากขาย? <br />
                <span className="text-gold-400">ฝากทรัพย์กับเรา</span>
              </h2>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-6 max-w-xl">
                ส่งรายละเอียดทรัพย์ให้ทีมงานช่วยประสานการนำเสนอ นัดหมายผู้สนใจ และดูแลขั้นตอนที่เกี่ยวข้องอย่างเป็นระบบ
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                {benefits.map((b) => (
                  <div key={b} className="flex items-center space-x-2.5 text-xs sm:text-sm text-gray-200">
                    <CheckCircle2 className="w-4 h-4 text-gold-400 flex-shrink-0" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>

              <Link
                href="/sell"
                className="inline-flex items-center space-x-2.5 px-8 py-4 bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-300 hover:to-gold-400 text-navy-950 font-bold text-sm sm:text-base rounded-xl shadow-lg hover:shadow-gold-500/20 transition-all transform hover:-translate-y-0.5"
              >
                <PlusCircle className="w-5 h-5 text-navy-950" />
                <span>ฝากขายกับ Chantakorn Property</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
