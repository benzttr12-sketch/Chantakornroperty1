import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'CHANTAKORN PROPERTY',
    short_name: 'CHANTAKORN',
    description: 'ค้นหา ซื้อ ขาย เช่า และฝากขายอสังหาริมทรัพย์ในหาดใหญ่–สงขลา',
    start_url: './',
    display: 'standalone',
    background_color: '#F7F8FA',
    theme_color: '#0B1F3A',
    lang: 'th',
    categories: ['business', 'real estate'],
  };
}
