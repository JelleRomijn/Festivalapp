'use client';

import { useApp } from './AppContext';

export default function LanguageSwitcher() {
  const { language, toggleLanguage } = useApp();

  return (
    <button
      className="lang-btn"
      onClick={toggleLanguage}
      aria-label={language === 'nl' ? 'Switch to English' : 'Schakel naar Nederlands'}
      title={language === 'nl' ? 'Switch to English' : 'Schakel naar Nederlands'}
    >
      <span className="flag" aria-hidden="true">
        {language === 'nl' ? '🇳🇱' : '🇬🇧'}
      </span>
      <span>{language === 'nl' ? 'NL' : 'EN'}</span>
    </button>
  );
}
