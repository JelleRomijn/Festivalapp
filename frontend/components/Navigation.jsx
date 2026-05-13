'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from './AppContext';

const NAV_ITEMS = [
  {
    href: '/',
    label: { nl: 'Home', en: 'Home' },
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    href: '/info',
    label: { nl: 'Info', en: 'Info' },
    icon: (
      <svg viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
      </svg>
    ),
  },
  {
    href: '/schedule',
    label: { nl: 'Schema', en: 'Schedule' },
    icon: (
      <svg viewBox="0 0 24 24">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
  {
    href: '/map',
    label: { nl: 'Kaart', en: 'Map' },
    icon: (
      <svg viewBox="0 0 24 24">
        <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
        <line x1="8" y1="2" x2="8" y2="18" />
        <line x1="16" y1="6" x2="16" y2="22" />
      </svg>
    ),
  },
];

export default function Navigation() {
  const pathname = usePathname();
  const { language } = useApp();

  return (
    <nav className="app-nav" aria-label="Hoofdnavigatie">
      {NAV_ITEMS.map(item => (
        <Link
          key={item.href}
          href={item.href}
          className={`nav-item${pathname === item.href ? ' active' : ''}`}
          aria-current={pathname === item.href ? 'page' : undefined}
        >
          {item.icon}
          <span>{item.label[language]}</span>
        </Link>
      ))}
    </nav>
  );
}
