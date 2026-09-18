const phoneDisplay = process.env.NEXT_PUBLIC_CONTACT_PHONE?.trim() || '081-604-0097';
const phoneDigits = phoneDisplay.replace(/[^0-9+]/g, '');

export const SITE_CONFIG = {
  name: 'CHANTAKORN PROPERTY',
  legalName: 'ฉันทากร พร็อพเพอร์ตี้',
  serviceArea: 'หาดใหญ่ – สงขลา',
  address: process.env.NEXT_PUBLIC_OFFICE_ADDRESS?.trim() || 'อำเภอหาดใหญ่ จังหวัดสงขลา 90110',
  phoneDisplay,
  phoneHref: `tel:${phoneDigits}`,
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || 'contact@chantakornproperty.com',
  lineLabel: process.env.NEXT_PUBLIC_LINE_LABEL?.trim() || 'LINE Official Account',
  lineUrl: process.env.NEXT_PUBLIC_LINE_URL?.trim() || 'https://lin.ee/NMSe28T3',
  facebookUrl:
    process.env.NEXT_PUBLIC_FACEBOOK_URL?.trim() ||
    'https://www.facebook.com/people/Chantakorn-Property-%E0%B8%99%E0%B8%B2%E0%B8%A2%E0%B8%AB%E0%B8%99%E0%B9%89%E0%B8%B2-%E0%B8%9A%E0%B9%89%E0%B8%B2%E0%B8%99-%E0%B8%97%E0%B8%B5%E0%B9%88%E0%B8%94%E0%B8%B4%E0%B8%99-%E0%B8%84%E0%B8%AD%E0%B8%99%E0%B9%82%E0%B8%94-%E0%B8%AB%E0%B8%B2%E0%B8%94%E0%B9%83%E0%B8%AB%E0%B8%8D%E0%B9%88-%E0%B8%AA%E0%B8%87%E0%B8%82%E0%B8%A5%E0%B8%B2/61593092347613/',
  businessHours: process.env.NEXT_PUBLIC_BUSINESS_HOURS?.trim() || 'ทุกวัน 08:30 – 18:00 น.',
  privacyEmail: process.env.NEXT_PUBLIC_PRIVACY_EMAIL?.trim() || process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || 'contact@chantakornproperty.com',
} as const;

export function contactFallbackMessage(prefix: string) {
  return `${prefix} กรุณาลองอีกครั้ง หรือติดต่อโทร ${SITE_CONFIG.phoneDisplay}`;
}
