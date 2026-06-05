'use client';

import { useState, useEffect } from 'react';
import { useApp } from './AppContext';

export default function OfflineBanner() {
  const { language } = useApp();
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    setOffline(!navigator.onLine);
    const goOffline = () => setOffline(true);
    const goOnline  = () => setOffline(false);
    window.addEventListener('offline', goOffline);
    window.addEventListener('online',  goOnline);
    return () => {
      window.removeEventListener('offline', goOffline);
      window.removeEventListener('online',  goOnline);
    };
  }, []);

  if (!offline) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 'var(--header-height)',
      left: 0,
      right: 0,
      zIndex: 999,
      background: '#1a1a2e',
      borderBottom: '1px solid rgba(255,255,255,0.1)',
      padding: '6px 16px',
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      fontSize: '0.78rem',
      fontWeight: 600,
      color: 'rgba(255,255,255,0.85)',
    }}>
      <svg viewBox="0 0 24 24" style={{ width: 14, height: 14, fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', flexShrink: 0 }}>
        <line x1="1" y1="1" x2="23" y2="23" />
        <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55M5 12.55a10.94 10.94 0 0 1 5.17-2.39M10.71 5.05A16 16 0 0 1 22.56 9M1.42 9a15.91 15.91 0 0 1 4.7-2.88M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01" />
      </svg>
      {language === 'nl'
        ? 'Geen verbinding — je ziet opgeslagen gegevens'
        : 'No connection — showing cached data'}
    </div>
  );
}
