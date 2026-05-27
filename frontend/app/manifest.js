const BASE = process.env.NEXT_PUBLIC_BASE_PATH || '';

export default function manifest() {
  return {
    name: 'HartjeU Festival',
    short_name: 'HartjeU',
    description: 'De officiële app van het HartjeU festival in Utrecht — 15 & 16 augustus 2026',
    start_url: `${BASE}/`,
    scope: `${BASE}/`,
    display: 'standalone',
    background_color: '#1A1A2E',
    theme_color: '#E85D4A',
    orientation: 'portrait-primary',
    lang: 'nl',
    categories: ['entertainment', 'music', 'lifestyle'],
    icons: [
      {
        src: `${BASE}/icons/icon-192.png`,
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any maskable',
      },
      {
        src: `${BASE}/icons/icon-512.png`,
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable',
      },
      {
        src: `${BASE}/icons/apple-touch-icon.png`,
        sizes: '180x180',
        type: 'image/png',
      },
    ],
    shortcuts: [
      {
        name: 'Programma',
        short_name: 'Schema',
        url: `${BASE}/schedule`,
        icons: [{ src: `${BASE}/icons/icon-192.png`, sizes: '192x192' }],
      },
      {
        name: 'Kaart',
        short_name: 'Map',
        url: `${BASE}/map`,
        icons: [{ src: `${BASE}/icons/icon-192.png`, sizes: '192x192' }],
      },
    ],
  };
}
