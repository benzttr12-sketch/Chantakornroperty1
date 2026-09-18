const staticExport = process.env.STATIC_EXPORT === 'true';

const rawBasePath = (process.env.NEXT_PUBLIC_BASE_PATH || '').trim();
const normalizedBasePath = rawBasePath
  ? (rawBasePath.startsWith('/') ? rawBasePath : `/${rawBasePath}`).replace(/\/+$/, '')
  : '';

/** @type {import('next').NextConfig} */
const nextConfig = {
  ...(staticExport ? { output: 'export', trailingSlash: true } : {}),
  ...(normalizedBasePath ? { basePath: normalizedBasePath } : {}),
  poweredByHeader: false,
  images: {
    unoptimized: staticExport,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
      },
    ],
  },
};

export default nextConfig;
