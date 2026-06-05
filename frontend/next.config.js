const withPWA = require('@ducanh2912/next-pwa').default;

const BASE_PATH = '';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath: BASE_PATH,
  env: {
    NEXT_PUBLIC_BASE_PATH: BASE_PATH,
  },
  images: {
    unoptimized: true,
  },
};

module.exports = withPWA({
  dest: 'public',
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  disable: process.env.NODE_ENV === 'development',
  workboxOptions: {
    disableDevLogs: true,
    runtimeCaching: [
      // Admin nooit cachen
      {
        urlPattern: /\/admin(\/|$)/,
        handler: 'NetworkOnly',
      },
      // Pagina-HTML's: cache zodat directe URL's offline werken
      {
        urlPattern: /\/(map|schedule|info)(\/|$)/,
        handler: 'StaleWhileRevalidate',
        options: {
          cacheName: 'page-cache',
          expiration: {
            maxEntries: 20,
            maxAgeSeconds: 60 * 60 * 24 * 7, // 7 dagen
          },
        },
      },
      // API: probeer netwerk, val terug op cache (24u geldig)
      {
        urlPattern: /\/api\//,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'api-cache',
          networkTimeoutSeconds: 6,
          expiration: {
            maxEntries: 60,
            maxAgeSeconds: 60 * 60 * 24, // 24 uur
          },
        },
      },
    ],
  },
})(nextConfig);
