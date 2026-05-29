'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useApp } from '@/components/AppContext';
import NotificationButton from '@/components/NotificationButton';

// Festivaldatum: 15 augustus 2026 12:00
const FESTIVAL_DATE = new Date('2026-08-15T12:00:00');

const TEXTS = {
  nl: {
    tagline: 'HartjeU Festival',
    dates: '15 & 16 augustus 2026',
    location: 'Grasweide Strijkviertel, Utrecht',
    countdownDone: 'Het festival is begonnen!',
    days: 'Dagen',
    hours: 'Uren',
    minutes: 'Min',
    seconds: 'Sec',
    quickLinks: [
      { label: 'Programma', sub: 'Blokschema & artiesten', href: '/schedule', bg: '#F03228' },
      { label: 'Kaart', sub: 'Festivalterrein', href: '/map', bg: '#247BA0' },
      { label: 'Festival info', sub: 'Praktische info', href: '/info', bg: '#E3B505' },
    ],
    notifTitle: 'Meldingen',
    galleryLabel: 'Sfeerimpressie',
  },
  en: {
    tagline: 'HartjeU Festival',
    dates: '15 & 16 August 2026',
    location: 'Grasweide Strijkviertel, Utrecht',
    countdownDone: 'The festival has started!',
    days: 'Days',
    hours: 'Hours',
    minutes: 'Min',
    seconds: 'Sec',
    quickLinks: [
      { label: 'Schedule', sub: 'Timetable & artists', href: '/schedule', bg: '#F03228' },
      { label: 'Map', sub: 'Festival grounds', href: '/map', bg: '#247BA0' },
      { label: 'Festival info', sub: 'Practical info', href: '/info', bg: '#E3B505' },
    ],
    notifTitle: 'Notifications',
    galleryLabel: 'Atmosphere',
  },
};

const GALLERY_PHOTOS = [
  { src: '/festival1.webp', alt: 'Crowd inside the main tent' },
  { src: '/festival2.webp', alt: 'Outdoor stage with palm trees' },
  { src: '/festival3.webp', alt: 'Aerial view of the festival grounds' },
];

function useCountdown(target) {
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    function calculate() {
      const diff = target - Date.now();
      if (diff <= 0) return setTimeLeft(null);
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    }
    calculate();
    const id = setInterval(calculate, 1000);
    return () => clearInterval(id);
  }, [target]);

  return timeLeft;
}

// SVG-iconen per quicklink
const ICONS = {
  '/schedule': (
    <svg viewBox="0 0 24 24">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  '/map': (
    <svg viewBox="0 0 24 24">
      <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
      <line x1="8" y1="2" x2="8" y2="18" />
      <line x1="16" y1="6" x2="16" y2="22" />
    </svg>
  ),
  '/info': (
    <svg viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  ),
};

export default function HomePage() {
  const { language } = useApp();
  const t = TEXTS[language];
  const timeLeft = useCountdown(FESTIVAL_DATE);

  return (
    <div className="page">
      <div className="page-content">
        {/* Hero blok met countdown */}
        <div className="hero">
          <p className="hero__subtitle">{t.location}</p>
          <h1 className="hero__title">{t.tagline}</h1>
          <p className="hero__date">{t.dates}</p>

          {timeLeft ? (
            <div className="countdown" aria-label="Aftellen tot het festival">
              {[
                [timeLeft.days, t.days],
                [timeLeft.hours, t.hours],
                [timeLeft.minutes, t.minutes],
                [timeLeft.seconds, t.seconds],
              ].map(([val, label]) => (
                <div key={label} className="countdown__unit">
                  <span className="countdown__number">{String(val).padStart(2, '0')}</span>
                  <span className="countdown__label">{label}</span>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ marginTop: '16px', fontWeight: 700 }}>{t.countdownDone}</p>
          )}
        </div>

        {/* Snelkoppelingen */}
        <div className="quick-links">
          {t.quickLinks.map(link => (
            <Link key={link.href} href={link.href} className="quick-link">
              <span className="quick-link__icon" style={{ background: link.bg }} aria-hidden="true">
                {ICONS[link.href]}
              </span>
              <span>
                <strong className="quick-link__label">{link.label}</strong>
                <span className="quick-link__sub" style={{ display: 'block', marginTop: '2px' }}>
                  {link.sub}
                </span>
              </span>
            </Link>
          ))}
        </div>

        {/* Fotogalerij */}
        <p style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 12 }}>{t.galleryLabel}</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 20 }}>
          <div style={{ gridColumn: '1 / -1', borderRadius: 'var(--radius)', overflow: 'hidden', height: 180 }}>
            <img src={`${process.env.NEXT_PUBLIC_BASE_PATH}${GALLERY_PHOTOS[0].src}`} alt={GALLERY_PHOTOS[0].alt} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          </div>
          {GALLERY_PHOTOS.slice(1).map(photo => (
            <div key={photo.src} style={{ borderRadius: 'var(--radius)', overflow: 'hidden', height: 120 }}>
              <img src={`${process.env.NEXT_PUBLIC_BASE_PATH}${photo.src}`} alt={photo.alt} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
          ))}
        </div>

        {/* Meldingenknop */}
        <NotificationButton />
      </div>
    </div>
  );
}
