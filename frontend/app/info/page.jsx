'use client';

import { useState, useEffect } from 'react';
import { useApp } from '@/components/AppContext';

// Placeholder teksten — worden later vervangen door data uit de PHP API
const PLACEHOLDER = {
  nl: [
    {
      key: 'about',
      title: 'Over het festival',
      body: 'HartjeU is een tweedaags muziekfestival voor studenten in de regio Utrecht. Het festival vindt plaats op 15 en 16 augustus 2026 op de Grasweide Strijkviertel in Utrecht.',
    },
    {
      key: 'access',
      title: 'Bereikbaarheid',
      body: 'Het festivalterrein is bereikbaar met de bus vanaf Utrecht Centraal (lijn xx, halte Strijkviertel). Parkeren is mogelijk op parkeerterrein P•••. Fietsen kunnen worden gestald bij de fietsenrekken bij de hoofdingang.',
    },
    {
      key: 'tickets',
      title: 'Tickets',
      body: 'Tickets zijn verkrijgbaar via de website. Dagtickets en weekendtickets zijn beschikbaar. Studenten met een geldige studentenkaart krijgen korting.',
    },
    {
      key: 'rules',
      title: 'Huisregels',
      body: 'Geen eigen drank meenemen. Geen glaswerk. Leeftijdsgrens: 16 jaar. Geldig legitimatiebewijs verplicht. Het festival behoudt het recht iedereen zonder opgave van reden te weigeren.',
    },
    {
      key: 'facilities',
      title: 'Faciliteiten',
      body: 'Op het terrein zijn meerdere bars, foodtrucks en toiletgroepen aanwezig. Er is een EHBO-post aanwezig. Gevonden voorwerpen kunnen worden ingeleverd bij de infostand.',
    },
  ],
  en: [
    {
      key: 'about',
      title: 'About the festival',
      body: 'HartjeU is a two-day music festival for students in the Utrecht region. The festival takes place on 15 and 16 August 2026 at Grasweide Strijkviertel in Utrecht.',
    },
    {
      key: 'access',
      title: 'Getting there',
      body: 'The festival site is accessible by bus from Utrecht Central Station (line xx, stop Strijkviertel). Parking is available at parking lot P•••. Bicycles can be parked at the bike racks near the main entrance.',
    },
    {
      key: 'tickets',
      title: 'Tickets',
      body: 'Tickets are available on the website. Day tickets and weekend tickets are available. Students with a valid student card receive a discount.',
    },
    {
      key: 'rules',
      title: 'House rules',
      body: 'No outside drinks allowed. No glassware. Minimum age: 16. Valid ID required. The festival reserves the right to refuse entry without explanation.',
    },
    {
      key: 'facilities',
      title: 'Facilities',
      body: 'The grounds have multiple bars, food trucks and toilet blocks. A first aid station is present. Lost and found items can be handed in at the info stand.',
    },
  ],
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function InfoPage() {
  const { language } = useApp();
  const [sections, setSections] = useState(PLACEHOLDER[language]);
  const [loading, setLoading] = useState(false);

  // Haal data op uit de PHP API zodra die beschikbaar is
  useEffect(() => {
    if (!API_URL) {
      // Geen API ingesteld: gebruik placeholder data
      setSections(PLACEHOLDER[language]);
      return;
    }

    setLoading(true);
    fetch(`${API_URL}/info.php?lang=${language}`)
      .then(r => r.json())
      .then(data => setSections(data))
      .catch(() => setSections(PLACEHOLDER[language])) // Fallback bij offline
      .finally(() => setLoading(false));
  }, [language]);

  return (
    <div className="page">
      <div className="page-content">
        <h1 className="page-title">
          {language === 'nl' ? 'Festivalinfo' : 'Festival info'}
        </h1>
        <p className="page-subtitle">
          {language === 'nl'
            ? 'Alles wat je moet weten'
            : 'Everything you need to know'}
        </p>

        {loading && (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            {language === 'nl' ? 'Laden…' : 'Loading…'}
          </p>
        )}

        {sections.map(section => (
          <div key={section.key} className="card info-section">
            <h2 className="info-section__title">{section.title}</h2>
            <p className="info-section__body">{section.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
