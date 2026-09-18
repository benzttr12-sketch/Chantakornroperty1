import Link from 'next/link';
import { 
  Building2, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  MessageCircle, 
  Facebook
} from 'lucide-react';
import { SITE_CONFIG } from '@/config/site';

export default function Footer() {
  return (
    <footer className="bg-navy-950 text-gray-300 pt-16 pb-24 md:pb-12 border-t border-navy-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-navy-800/80">
          {/* Col 1: Brand & Bio */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-navy-950 font-bold shadow-md">
                <Building2 className="w-6 h-6 text-navy-950" />
              </div>
              <div className="flex flex-col">
                <span className="text-white font-bold text-xl tracking-wider leading-none">
                  CHANTAKORN
                </span>
                <span className="text-gold-400 text-xs font-semibold tracking-widest leading-tight">
                  PROPERTY
                </span>
              </div>
            </Link>

            <p className="text-sm text-gray-300 leading-relaxed max-w-sm pt-2">
              บริการด้านอสังหาริมทรัพย์ในพื้นที่ <strong className="text-white font-semibold">หาดใหญ่ – สงขลา</strong> สำหรับผู้ที่ต้องการค้นหาทรัพย์ สอบถามรายละเอียด นัดชม หรือฝากขายบ้าน ที่ดิน คอนโด และอสังหาริมทรัพย์ประเภทต่าง ๆ
            </p>

            <div className="flex items-center space-x-3 pt-2">
              <a
                href={SITE_CONFIG.lineUrl}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-navy-800 hover:bg-[#06C755] flex items-center justify-center text-white transition-colors"
                title="LINE Official"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a
                href={SITE_CONFIG.facebookUrl}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-navy-800 hover:bg-[#1877F2] flex items-center justify-center text-white transition-colors"
                title="Facebook: Chantakorn Property นายหน้า บ้าน ที่ดิน คอนโด หาดใหญ่ สงขลา"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={SITE_CONFIG.phoneHref}
                className="w-9 h-9 rounded-full bg-navy-800 hover:bg-gold-500 hover:text-navy-950 flex items-center justify-center text-white transition-colors"
                title="โทรหาเรา"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Services */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4 border-l-2 border-gold-500 pl-2">
              บริการของเรา
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/services#sell" className="hover:text-gold-400 transition-colors">
                  รับฝากขายบ้านและที่ดิน
                </Link>
              </li>
              <li>
                <Link href="/services#rent" className="hover:text-gold-400 transition-colors">
                  บริการจัดหาผู้เช่า / ฝากเช่า
                </Link>
              </li>
              <li>
                <Link href="/buy" className="hover:text-gold-400 transition-colors">
                  ซื้อบ้าน คอนโด ที่ดิน
                </Link>
              </li>
              <li>
                <Link href="/services#consignment" className="hover:text-gold-400 transition-colors">
                  บริการขายฝาก / จำนอง
                </Link>
              </li>
              <li>
                <Link href="/services#consult" className="hover:text-gold-400 transition-colors">
                  ปรึกษาประเมินราคา & สินเชื่อ
                </Link>
              </li>
              <li>
                <Link href="/sell" className="text-gold-400 font-medium hover:underline flex items-center">
                  ฝากขายทรัพย์กับเรา
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Areas in Songkhla */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4 border-l-2 border-gold-500 pl-2">
              พื้นที่ให้บริการ
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/properties?district=หาดใหญ่" className="hover:text-gold-400 transition-colors flex justify-between">
                  <span>ตัวเมืองหาดใหญ่</span>
                </Link>
              </li>
              <li>
                <Link href="/properties?district=เมืองสงขลา" className="hover:text-gold-400 transition-colors flex justify-between">
                  <span>เมืองสงขลา (สมิหลา)</span>
                </Link>
              </li>
              <li>
                <Link href="/properties?district=ควนลัง" className="hover:text-gold-400 transition-colors flex justify-between">
                  <span>ควนลัง (สนามบิน)</span>
                </Link>
              </li>
              <li>
                <Link href="/properties?district=คลองแห" className="hover:text-gold-400 transition-colors flex justify-between">
                  <span>คลองแห</span>
                </Link>
              </li>
              <li>
                <Link href="/properties?district=บ้านพรุ" className="hover:text-gold-400 transition-colors flex justify-between">
                  <span>บ้านพรุ</span>
                </Link>
              </li>
              <li>
                <Link href="/properties?district=ทุ่งลุง" className="hover:text-gold-400 transition-colors flex justify-between">
                  <span>ทุ่งลุง – พะตง</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact Info */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4 border-l-2 border-gold-500 pl-2">
              ติดต่อสำนักงาน
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 text-gold-400 flex-shrink-0 mt-1" />
                <span className="text-gray-300 text-xs leading-relaxed">
                  {SITE_CONFIG.legalName} {SITE_CONFIG.address}
                </span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Phone className="w-4 h-4 text-gold-400 flex-shrink-0" />
                <a href={SITE_CONFIG.phoneHref} className="hover:text-gold-400 font-semibold text-white">
                  {SITE_CONFIG.phoneDisplay}
                </a>
              </li>
              <li className="flex items-center space-x-2.5">
                <MessageCircle className="w-4 h-4 text-[#06C755] flex-shrink-0" />
                <span className="text-gray-300">
                  LINE: <strong className="text-white">{SITE_CONFIG.lineLabel}</strong>
                </span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Facebook className="w-4 h-4 text-[#1877F2] flex-shrink-0" />
                <a
                  href={SITE_CONFIG.facebookUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-gold-400 text-xs text-gray-300"
                >
                  Facebook: <strong className="text-white">Chantakorn Property</strong>
                </a>
              </li>
              <li className="flex items-center space-x-2.5">
                <Mail className="w-4 h-4 text-gold-400 flex-shrink-0" />
                <a href={`mailto:${SITE_CONFIG.email}`} className="hover:text-gold-400 text-xs">
                  {SITE_CONFIG.email}
                </a>
              </li>
              <li className="flex items-center space-x-2.5">
                <Clock className="w-4 h-4 text-gold-400 flex-shrink-0" />
                <span className="text-gray-400 text-xs">
                  เปิดทำการ: {SITE_CONFIG.businessHours}
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Legal & Credits */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-gray-400 space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-gold-400" />
            <span>© {new Date().getFullYear()} CHANTAKORN PROPERTY. All rights reserved. บริการนายหน้าอสังหาริมทรัพย์ หาดใหญ่–สงขลา</span>
          </div>

          <div className="flex items-center space-x-6 text-gray-400">
            <Link href="/about" className="hover:text-white transition-colors">
              เกี่ยวกับเรา
            </Link>
            <Link href="/contact" className="hover:text-white transition-colors">
              แผนที่ติดต่อ
            </Link>
            <Link href="/privacy" className="hover:text-white transition-colors">นโยบายความเป็นส่วนตัว</Link>
            <Link href="/admin" className="hover:text-gold-400 transition-colors">
              เข้าสู่ระบบเจ้าหน้าที่
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
