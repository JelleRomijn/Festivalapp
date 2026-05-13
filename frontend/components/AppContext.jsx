'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [language, setLanguage] = useState('nl');
  const [theme, setTheme] = useState('dark');
  const [mounted, setMounted] = useState(false);

  // Lees opgeslagen voorkeuren bij eerste render
  useEffect(() => {
    const savedLang = localStorage.getItem('hartjeu-lang') || 'nl';
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('hartjeu-theme') || (prefersDark ? 'dark' : 'light');

    setLanguage(savedLang);
    setTheme(savedTheme);
    setMounted(true);
  }, []);

  // Pas HTML-attributen aan bij thema- en taalwijziging
  useEffect(() => {
    if (!mounted) return;
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('lang', language);
    localStorage.setItem('hartjeu-theme', theme);
    localStorage.setItem('hartjeu-lang', language);
  }, [theme, language, mounted]);

  const toggleTheme = () => setTheme(t => (t === 'dark' ? 'light' : 'dark'));

  const toggleLanguage = () => setLanguage(l => (l === 'nl' ? 'en' : 'nl'));

  return (
    <AppContext.Provider value={{ language, theme, toggleTheme, toggleLanguage, mounted }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
