import { MetadataRoute } from 'next';
import { getSiteUrl } from '@/config/site-url';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getSiteUrl();
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        `${basePath}/admin/`,
        `${basePath}/login/`,
        `${basePath}/register/`,
        `${basePath}/forgot-password/`,
        `${basePath}/favorites/`,
        `${basePath}/api/`,
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
