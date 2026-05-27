const withPWA = require('@ducanh2912/next-pwa').default;

/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: process.env.NODE_ENV === 'production' ? '/Festival-app' : '',
  // Voor statische export op shared hosting: uncomment onderstaande regel
  // output: 'export',
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
