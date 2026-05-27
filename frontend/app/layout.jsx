import { AppProvider } from '@/components/AppContext';
import Navigation from '@/components/Navigation';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import ThemeToggle from '@/components/ThemeToggle';
import './globals.css';

export const metadata = {
  title: {
    default: 'HartjeU Festival',
    template: '%s — HartjeU Festival',
  },
  description: 'De officiële app van het HartjeU festival in Utrecht — 15 & 16 augustus 2026',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'HartjeU',
  },
  openGraph: {
    title: 'HartjeU Festival',
    description: 'Tweedaags muziekfestival voor studenten in Utrecht — 15 & 16 augustus 2026',
    type: 'website',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0F0F1A' },
    { media: '(prefers-color-scheme: light)', color: '#F03228' },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="nl" data-theme="dark" suppressHydrationWarning>
      <head>
        {/* Voorkom flikkering bij laden: lees thema direct uit localStorage */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('hartjeu-theme')||((window.matchMedia('(prefers-color-scheme:dark)').matches)?'dark':'light');var l=localStorage.getItem('hartjeu-lang')||'nl';document.documentElement.setAttribute('data-theme',t);document.documentElement.setAttribute('lang',l);}catch(e){}})();`,
          }}
        />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
      </head>
      <body>
        <AppProvider>
          {/* Vaste header met logo en controls */}
          <header className="app-header">
            <div className="app-header__logo">
              <img src="/logowhite.png" alt="HartjeU Festival" className="logo-light" />
              <img src="/logoblack.png" alt="HartjeU Festival" className="logo-dark" />
            </div>
            <div className="app-header__controls">
              <ThemeToggle />
              <LanguageSwitcher />
            </div>
          </header>

          {/* Pagina-inhoud */}
          <main>{children}</main>

          {/* Vaste onderste navigatie */}
          <Navigation />
        </AppProvider>
      </body>
    </html>
  );
}
