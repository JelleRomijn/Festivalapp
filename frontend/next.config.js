const withPWA = require('@ducanh2912/next-pwa').default;

const BASE_PATH = process.env.NODE_ENV === 'production' ? '/Festival-app' : '';

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
  dest: 'public',           // Service Worker wordt gegenereerd in /public
  cacheOnFrontEndNav: true, // Cache bij navigatie binnen de app
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,     // Herlaad pagina als verbinding terugkomt
  disable: process.env.NODE_ENV === 'development', // SW uit in development
  workboxOptions: {
    disableDevLogs: true,
    // Voeg hier extra cache-strategieën toe voor API calls
    runtimeCaching: [
      {
        urlPattern: /\/api\//,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'api-cache',
          networkTimeoutSeconds: 10,
          expiration: {
            maxEntries: 50,
            maxAgeSeconds: 60 * 60, // 1 uur
          },
        },
      },
    ],
  },
})(nextConfig);
