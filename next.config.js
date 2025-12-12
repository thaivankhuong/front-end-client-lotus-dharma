/** @type {import('next').NextConfig} */
const nextConfig = {
  // Next.js 16: moved from experimental to root level
  serverExternalPackages: ['geojson', 'canvas'],
  async rewrites() {
    return [
      {
        source: '/api-proxy/:path*',
        destination: 'http://localhost:5000/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig;

