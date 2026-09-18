import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MobileBottomNav from '@/components/layout/MobileBottomNav';
import FloatingLineButton from '@/components/layout/FloatingLineButton';
import { getSiteUrl } from '@/config/site-url';

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: {
    template: '%s | CHANTAKORN PROPERTY หาดใหญ่ สงขลา',
    default: 'CHANTAKORN PROPERTY | ซื้อ ขาย เช่า ฝากขาย บ้าน ที่ดิน คอนโด หาดใหญ่–สงขลา',
  },
  description: 'CHANTAKORN PROPERTY รวบรวมประกาศบ้าน ที่ดิน คอนโด และอสังหาริมทรัพย์ในหาดใหญ่–สงขลา พร้อมช่องทางสอบถาม นัดชม และฝากขายทรัพย์',
  keywords: [
    'บ้านเดี่ยวหาดใหญ่',
    'ที่ดินหาดใหญ่',
    'คอนโดหาดใหญ่',
    'อสังหาริมทรัพย์สงขลา',
    'ฝากขายบ้านหาดใหญ่',
    'เช่าบ้านหาดใหญ่',
    'นายหน้าหาดใหญ่',
    'Chantakorn Property',
    'ฉันทากร พร็อพเพอร์ตี้'
  ],
  applicationName: 'CHANTAKORN PROPERTY',
  authors: [{ name: 'CHANTAKORN PROPERTY' }],
  creator: 'CHANTAKORN PROPERTY',
  publisher: 'CHANTAKORN PROPERTY',
  category: 'real estate',
  referrer: 'origin-when-cross-origin',
  formatDetection: { email: false, address: false, telephone: false },
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: 'CHANTAKORN PROPERTY | นายหน้าอสังหาริมทรัพย์ หาดใหญ่–สงขลา',
    description: 'ค้นหาบ้าน ที่ดิน คอนโด และอสังหาริมทรัพย์ในหาดใหญ่–สงขลา พร้อมช่องทางสอบถาม นัดชม และฝากขายทรัพย์',
    url: siteUrl,
    siteName: 'CHANTAKORN PROPERTY',
    locale: 'th_TH',
    type: 'website',
  },
  robots: { index: true, follow: true },
  twitter: {
    card: 'summary_large_image',
    title: 'CHANTAKORN PROPERTY | หาดใหญ่–สงขลา',
    description: 'บริการซื้อ ขาย เช่า ฝากขาย อสังหาริมทรัพย์ในหาดใหญ่-สงขลา',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <body className="bg-surface-bg text-brand-text flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
        <MobileBottomNav />
        <FloatingLineButton />
      </body>
    </html>
  );
}
