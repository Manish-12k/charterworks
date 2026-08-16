/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Long-cache static assets; HTML/pages are revalidated by Next.js itself.
  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|jpeg|png|webp|avif|woff2)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },
};

export default nextConfig;
