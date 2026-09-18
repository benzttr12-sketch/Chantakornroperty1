import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'รายละเอียดอสังหาริมทรัพย์',
  description: 'ดูรายละเอียด ราคา ทำเล รูปภาพ และช่องทางสอบถามเกี่ยวกับประกาศอสังหาริมทรัพย์จาก CHANTAKORN PROPERTY',
};

export default function PropertyDetailLayout({ children }: { children: React.ReactNode }) {
  return children;
}
