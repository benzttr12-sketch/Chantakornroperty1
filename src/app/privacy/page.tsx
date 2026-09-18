import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE_CONFIG } from '@/config/site';

export const metadata: Metadata = {
  title: 'นโยบายความเป็นส่วนตัว | Chantakorn Property',
  description: 'นโยบายการเก็บ ใช้ และดูแลข้อมูลส่วนบุคคลของผู้ใช้บริการ Chantakorn Property',
};

export default function PrivacyPage() {
  return (
    <main className="bg-surface-bg py-14 sm:py-20">
      <article className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="rounded-3xl border border-surface-border bg-white p-6 shadow-sm sm:p-10">
          <p className="text-xs font-bold uppercase tracking-widest text-gold-600">Privacy Policy</p>
          <h1 className="mt-2 text-3xl font-extrabold text-navy-950">นโยบายความเป็นส่วนตัว</h1>
          <p className="mt-3 text-sm leading-relaxed text-gray-600">ปรับปรุงล่าสุด: 18 กันยายน 2569</p>

          <div className="mt-8 space-y-7 text-sm leading-7 text-gray-700">
            <section><h2 className="text-lg font-bold text-navy-950">1. ข้อมูลที่เราเก็บ</h2><p className="mt-2">เราอาจเก็บชื่อ นามสกุล อีเมล เบอร์โทรศัพท์ LINE ID ข้อมูลบัญชีสมาชิก ความสนใจเกี่ยวกับอสังหาริมทรัพย์ รายละเอียดทรัพย์ที่ฝากขาย ข้อความติดต่อ และไฟล์หรือรูปภาพที่ผู้ใช้ส่งให้ทีมงานผ่านช่องทางติดต่อที่เลือกใช้</p></section>
            <section><h2 className="text-lg font-bold text-navy-950">2. วัตถุประสงค์การใช้ข้อมูล</h2><p className="mt-2">ใช้เพื่อจัดการบัญชี ตอบคำถาม ติดต่อกลับ นัดหมายเข้าชม รับฝากขายหรือฝากเช่า ให้บริการที่ผู้ใช้ร้องขอ ดูแลความปลอดภัยของระบบ และปรับปรุงการให้บริการ เราจะไม่ใช้ข้อมูลเพื่อวัตถุประสงค์ที่ไม่เกี่ยวข้องโดยไม่มีฐานทางกฎหมายหรือความยินยอมที่เหมาะสม</p></section>
            <section><h2 className="text-lg font-bold text-navy-950">3. ผู้ให้บริการที่เกี่ยวข้อง</h2><p className="mt-2">เว็บไซต์ใช้บริการ Firebase ของ Google สำหรับการยืนยันตัวตน ฐานข้อมูล และพื้นที่จัดเก็บไฟล์ ข้อมูลจึงอาจถูกประมวลผลบนโครงสร้างพื้นฐานของผู้ให้บริการดังกล่าวตามข้อกำหนดและมาตรการรักษาความปลอดภัยของผู้ให้บริการ</p></section>
            <section><h2 className="text-lg font-bold text-navy-950">4. ระยะเวลาจัดเก็บ</h2><p className="mt-2">เราจะเก็บข้อมูลเท่าที่จำเป็นต่อการให้บริการ การติดตามงาน ข้อกำหนดทางกฎหมาย และการป้องกันข้อพิพาท เมื่อหมดความจำเป็นจะลบ ทำลาย หรือทำให้ข้อมูลไม่สามารถระบุตัวบุคคลได้ตามสมควร</p></section>
            <section><h2 className="text-lg font-bold text-navy-950">5. สิทธิ์ของเจ้าของข้อมูล</h2><p className="mt-2">คุณสามารถติดต่อเพื่อขอเข้าถึง แก้ไข ขอสำเนา ขอให้ลบหรือจำกัดการใช้ข้อมูล ถอนความยินยอม หรือสอบถามเกี่ยวกับการจัดการข้อมูลส่วนบุคคล ทั้งนี้สิทธิ์บางประการอาจมีข้อจำกัดตามกฎหมายที่เกี่ยวข้อง</p></section>
            <section><h2 className="text-lg font-bold text-navy-950">6. การรักษาความปลอดภัย</h2><p className="mt-2">เราใช้การยืนยันตัวตนและ Security Rules ของ Firebase เพื่อจำกัดการเข้าถึงข้อมูลหลังบ้านตามบทบาทของผู้ใช้งาน อย่างไรก็ตาม ไม่มีระบบออนไลน์ใดรับประกันความปลอดภัยได้ทั้งหมด ผู้ใช้จึงไม่ควรส่งรหัสผ่านหรือข้อมูลลับที่ไม่จำเป็นผ่านช่องข้อความทั่วไป</p></section>
            <section><h2 className="text-lg font-bold text-navy-950">7. ติดต่อเรื่องข้อมูลส่วนบุคคล</h2><p className="mt-2">ติดต่อ {SITE_CONFIG.legalName} ได้ที่ <a className="font-semibold text-navy-950 underline" href={`mailto:${SITE_CONFIG.privacyEmail}`}>{SITE_CONFIG.privacyEmail}</a> หรือโทร <a className="font-semibold text-navy-950 underline" href={SITE_CONFIG.phoneHref}>{SITE_CONFIG.phoneDisplay}</a></p></section>
          </div>
          <Link href="/contact" className="mt-6 inline-block rounded-xl bg-navy-950 px-5 py-2.5 text-xs font-bold text-gold-400">ติดต่อเรา</Link>
        </div>
      </article>
    </main>
  );
}
