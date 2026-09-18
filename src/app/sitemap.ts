import { MetadataRoute } from 'next';
import { getSiteUrl } from '@/config/site-url';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getSiteUrl();

  return [
    { route: '', changeFrequency: 'daily' as const, priority: 1.0 },
    { route: '/properties', changeFrequency: 'daily' as const, priority: 0.9 },
    { route: '/buy', changeFrequency: 'daily' as const, priority: 0.8 },
    { route: '/rent', changeFrequency: 'daily' as const, priority: 0.8 },
    { route: '/sell', changeFrequency: 'weekly' as const, priority: 0.8 },
    { route: '/services', changeFrequency: 'monthly' as const, priority: 0.7 },
    { route: '/about', changeFrequency: 'monthly' as const, priority: 0.6 },
    { route: '/contact', changeFrequency: 'monthly' as const, priority: 0.7 },
    { route: '/privacy', changeFrequency: 'yearly' as const, priority: 0.3 },
  ].map(({ route, changeFrequency, priority }) => ({
    url: `${baseUrl}${route}`,
    changeFrequency,
    priority,
  }));
}
