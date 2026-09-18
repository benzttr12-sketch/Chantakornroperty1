import { Award, FileCheck2, Handshake, MapPin } from 'lucide-react';

export default function WhyChooseUs() {
  const reasons = [
    {
      icon: Award,
      title: 'สื่อสารตรงไปตรงมา',
      description: 'ให้ข้อมูลตามที่มีอยู่ อธิบายขั้นตอนและเงื่อนไขที่เกี่ยวข้องอย่างชัดเจน เพื่อช่วยให้ลูกค้าพิจารณาได้สะดวกขึ้น',
    },
    {
      icon: FileCheck2,
      title: 'ข้อมูลชัดเจน',
      description: 'ช่วยรวบรวมข้อมูลทรัพย์ เอกสารที่ได้รับ และประเด็นสำคัญที่ควรตรวจสอบก่อนตัดสินใจซื้อ ขาย หรือเช่า',
    },
    {
      icon: Handshake,
      title: 'ประสานงานต่อเนื่อง',
      description: 'ช่วยประสานการนัดชม การสื่อสารระหว่างคู่สัญญา และขั้นตอนที่เกี่ยวข้องตามขอบเขตบริการที่ตกลงกัน',
    },
    {
      icon: MapPin,
      title: 'เน้นพื้นที่หาดใหญ่–สงขลา',
      description: 'ให้บริการค้นหาและนำเสนอทรัพย์ในหาดใหญ่ เมืองสงขลา ควนลัง คลองแห บ้านพรุ และพื้นที่ใกล้เคียง',
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-navy-950 text-white relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#C9A227_1px,transparent_1px)] [background-size:16px_16px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-gold-400 uppercase tracking-widest bg-navy-900 border border-gold-500/30 px-3.5 py-1 rounded-full">
            แนวทางการให้บริการ
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-3 mb-4">
            สิ่งที่เราให้ความสำคัญ
          </h2>
          <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
            เราเน้นข้อมูลที่เข้าใจง่าย การประสานงานที่ชัดเจน และการดูแลตามขอบเขตบริการที่ตกลงกันในแต่ละรายการ
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {reasons.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="bg-navy-900/80 border border-navy-800 hover:border-gold-500/40 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover group flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-400 mb-5 group-hover:bg-gold-500 group-hover:text-navy-950 transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-gold-300 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
