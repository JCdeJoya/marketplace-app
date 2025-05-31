/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
  },
  remotePatterns: [
    {
      protocol: 'http',
      hostname: 'localhost',
      port: '8000',
      pathname: '/images/**',
    },
  ],
  output: 'standalone',
  poweredByHeader: false,
};

module.exports = nextConfig;
