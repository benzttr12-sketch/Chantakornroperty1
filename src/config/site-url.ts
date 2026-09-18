const PRODUCTION_FALLBACK = 'https://benzttr12-sketch.github.io/Chantakorn-Property-Production';

export function getSiteUrl() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const fallback = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : PRODUCTION_FALLBACK;
  const candidate = configured || fallback;

  try {
    return new URL(candidate).toString().replace(/\/$/, '');
  } catch {
    return fallback;
  }
}
