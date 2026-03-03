/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable Strict Mode to prevent double-initialization of Leaflet map in Dev
  reactStrictMode: false,
  // Next.js 15 App Router Configuration
  serverExternalPackages: ['geojson', 'canvas'],

  // Environment-based configuration
  ...(process.env.NODE_ENV === 'production' && {
    // Production optimizations
    swcMinify: true,
    compiler: {
      removeConsole: process.env.NODE_ENV === 'production',
    },
  }),

  // Image optimization
  images: {
    domains: [
      'localhost',
      'cdn.lotusdharm.com',
      'images.unsplash.com',
    ],
    formats: ['image/webp', 'image/avif'],
    dangerouslyAllowSVG: true,
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ]
      }
    ];
  },

  // ISR and caching configuration
  experimental: {
    // Disable custom cache handler to debug 404s
    // incrementalCacheHandlerPath: require.resolve('./cache-handler.js'),
  },

  // Development server configuration
  ...(process.env.NODE_ENV === 'development' && {
    rewrites: async () => {
      return [
        {
          source: '/api-proxy/:path*',
          destination: 'http://localhost:5000/api/:path*',
        },
      ];
    },
  }),
};

module.exports = nextConfig;

