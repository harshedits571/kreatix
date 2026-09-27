/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'firebasestorage.googleapis.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'i.ytimg.com' }
    ],
  },
  async redirects() {
    return [
      {
        source: '/works',
        destination: '/work',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
