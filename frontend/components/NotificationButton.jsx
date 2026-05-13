'use client';

import { useState, useEffect } from 'react';
import { useApp } from './AppContext';

const TEXTS = {
  nl: {
    enable: 'Meldingen inschakelen',
    enabled: 'Meldingen ingeschakeld',
    denied: 'Meldingen geblokkeerd',
    unsupported: 'Meldingen niet beschikbaar',
    sub: 'Ontvang updates over het programma',
    subEnabled: 'Je ontvangt festivalupdates',
    subDenied: 'Sta meldingen toe in je browserinstellingen',
  },
  en: {
    enable: 'Enable notifications',
    enabled: 'Notifications enabled',
    denied: 'Notifications blocked',
    unsupported: 'Notifications unavailable',
    sub: 'Get updates about the programme',
    subEnabled: 'You will receive festival updates',
    subDenied: 'Allow notifications in your browser settings',
  },
};

export default function NotificationButton() {
  const { language } = useApp();
  const t = TEXTS[language];
  const [permission, setPermission] = useState('default');

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  async function handleClick() {
    if (!('Notification' in window)) return;
    if (permission === 'granted') return;

    const result = await Notification.requestPermission();
    setPermission(result);

    if (result === 'granted') {
      // Stuur een welkomstmelding
      new Notification('HartjeU Festival 🎉', {
        body: language === 'nl'
          ? 'Meldingen ingeschakeld! Tot 15 augustus!'
          : 'Notifications enabled! See you August 15th!',
        icon: '/icons/icon-192.png',
        badge: '/icons/icon-192.png',
      });
    }
  }

  const isUnsupported = typeof window === 'undefined' || !('Notification' in window);
  const isGranted = permission === 'granted';
  const isDenied = permission === 'denied';

  return (
    <button
      className="notif-btn"
      onClick={handleClick}
      disabled={isGranted || isDenied || isUnsupported}
      aria-disabled={isGranted || isDenied || isUnsupported}
    >
      <span className="notif-btn__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          {isGranted && <line x1="4" y1="4" x2="20" y2="20" strokeWidth="0" />}
        </svg>
      </span>
      <span>
        <strong style={{ display: 'block', fontSize: '0.9rem' }}>
          {isUnsupported ? t.unsupported : isGranted ? t.enabled : isDenied ? t.denied : t.enable}
        </strong>
        <span style={{ fontSize: '0.75rem', fontWeight: 400, color: 'var(--text-muted)' }}>
          {isGranted ? t.subEnabled : isDenied ? t.subDenied : t.sub}
        </span>
      </span>
    </button>
  );
}
