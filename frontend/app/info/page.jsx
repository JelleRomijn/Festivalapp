'use client';

import { useState, useEffect } from 'react';
import { useApp } from '@/components/AppContext';

const PLACEHOLDER = {
  nl: [
    {
      key: 'general',
      icon: '📍',
      title: 'Algemeen & contact',
      body: 'Het ❤️U Festival is voor (nieuwe) studenten in de regio Utrecht en is een aanvulling op UIT.',
      items: [
        {
          subtitle: 'Adres',
          body: 'Locatie: Strijkviertel, Utrecht\nNavigatieadres: Strijkviertelweg, Utrecht',
        },
        {
          subtitle: 'Datum & Openingstijden',
          body: 'Zaterdag 5 september 2026\n12:00 – 23:00 uur',
        },
      ],
    },
    {
      key: 'access',
      icon: '🚍',
      title: 'Bereikbaarheid',
      items: [
        {
          subtitle: 'Fiets',
          body: 'Er is een grote gratis fietsenstalling aanwezig waar je jouw fiets de gehele dag kunt stallen.',
        },
        {
          subtitle: 'Auto',
          body: 'Je kunt een parkingticket aanschaffen. Parkeren kan op P+R Papendorp — volg de borden \'P online ticket\'. Geen ticket gekocht? Dan kun je bij de parkeerwachter op locatie een parkeerticket aanschaffen (PIN ONLY). Let op: VOL=VOL.',
        },
        {
          subtitle: 'Openbaar vervoer',
          body: 'Kom je met het openbaar vervoer? Plan dan je trip via 9292.nl.',
        },
        {
          subtitle: 'Shuttlebus',
          body: 'Vanaf Utrecht Centraal kun je onze gratis shuttlebus richting het festivalterrein pakken. Je vindt deze bus op het centraal station aan de Mineurslaan. Volg de witte bordjes met zwarte pijlen én \'❤️U Festival\'.\n\nDe bus rijdt tussen 12:00 en 19:00 uur richting het festival. Vanaf 21:00 uur kun je weer instappen voor het station.',
        },
        {
          subtitle: 'Taxi & Kiss & Ride',
          body: 'Navigeer naar Strijkviertel, De Meern (Utrecht). Volg de borden "Kiss & Ride ❤️U Festival" zodra je in de buurt bent van het festivalterrein.',
        },
      ],
    },
    {
      key: 'lockers',
      icon: '🔐',
      title: 'Lockers',
      body: 'Op het festivalterrein zijn kluisjes aanwezig waar je je spullen veilig kunt opbergen. Hier passen 3 à 4 jassen in. Je kunt je kluisje gedurende de hele dag openen en sluiten zo vaak je wilt. Het is niet mogelijk om online een kluisje te reserveren.',
    },
    {
      key: 'faq',
      icon: '❓',
      title: 'Veelgestelde vragen',
      items: [
        {
          subtitle: 'Ik gebruik medicatie. Wat nu?',
          body: 'Het is toegestaan om medicijnen mee te nemen in een dosis die je maximaal nodig hebt op 1 dag. Een doktersverklaring of medicatiepaspoort is noodzakelijk.\n\nDe beveiliging zal jouw documentatie beoordelen en de medicijnen controleren. Het kan zijn dat de EHBO jouw medicijnen in bewaring neemt en je deze enkel kunt innemen bij de EHBO.',
        },
        {
          subtitle: 'Mag ik het festivalterrein tussentijds verlaten?',
          body: 'Nee, dat is helaas niet mogelijk. Om de veiligheid van alle bezoekers te waarborgen, kunnen we het niet toestaan dat het festivalterrein tussentijds verlaten wordt. Hier kunnen geen uitzonderingen voor gemaakt worden.',
        },
        {
          subtitle: 'Zijn er lockers?',
          body: 'Ja! Op het terrein kun je medium & grote lockers huren. Kijk bij het onderdeel Lockers voor meer informatie.',
        },
      ],
    },
    {
      key: 'golden-glu',
      icon: '⭐',
      title: 'Golden-GLU',
      body: 'Studenten van het GLU hebben tijdens het festival speciale privileges en zijn herkenbaar aan een gouden armbandje.\n\nMet dit gouden armbandje kunnen ze gebruik maken van de gouden toiletten en met goud gemarkeerde bestelpunten aan de bars — zonder in de rij te hoeven staan.',
      accent: 'gold',
    },
  ],
  en: [
    {
      key: 'general',
      icon: '📍',
      title: 'General & contact',
      body: 'The ❤️U Festival is for (new) students in the Utrecht region and complements UIT.',
      items: [
        {
          subtitle: 'Address',
          body: 'Location: Strijkviertel, Utrecht\nNavigation address: Strijkviertelweg, Utrecht',
        },
        {
          subtitle: 'Date & Opening hours',
          body: 'Saturday 5 September 2026\n12:00 – 23:00',
        },
      ],
    },
    {
      key: 'access',
      icon: '🚍',
      title: 'Getting there',
      items: [
        {
          subtitle: 'Bicycle',
          body: 'A large free bike storage is available where you can leave your bike for the entire day.',
        },
        {
          subtitle: 'Car',
          body: "You can purchase a parking ticket. Parking is available at P+R Papendorp — follow the signs 'P online ticket'. No ticket bought in advance? You can buy a parking ticket from the parking attendant on site (PIN ONLY). Note: FULL=FULL.",
        },
        {
          subtitle: 'Public transport',
          body: 'Coming by public transport? Plan your trip via 9292.nl.',
        },
        {
          subtitle: 'Shuttle bus',
          body: "From Utrecht Centraal you can take our free shuttle bus to the festival grounds. You'll find the bus at the central station on Mineurslaan. Follow the white signs with black arrows and '❤️U Festival'.\n\nThe bus runs from 12:00 to 19:00 towards the festival. From 21:00 you can board again to return to the station.",
        },
        {
          subtitle: 'Taxi & Kiss & Ride',
          body: 'Navigate to Strijkviertel, De Meern (Utrecht). Follow the signs "Kiss & Ride ❤️U Festival" when you are near the festival grounds.',
        },
      ],
    },
    {
      key: 'lockers',
      icon: '🔐',
      title: 'Lockers',
      body: 'Lockers are available on the festival grounds where you can safely store your belongings. They fit 3–4 jackets. You can open and close your locker as many times as you want throughout the day. It is not possible to reserve a locker online.',
    },
    {
      key: 'faq',
      icon: '❓',
      title: 'Frequently asked questions',
      items: [
        {
          subtitle: 'I use medication. What now?',
          body: 'You are allowed to bring medication in the dose needed for 1 day maximum. A doctor\'s note or medication passport is required.\n\nSecurity will assess your documentation and check the medication. The first aid team may hold your medication and you may only take it at the first aid station.',
        },
        {
          subtitle: 'Can I leave the festival grounds during the day?',
          body: 'No, unfortunately that is not possible. To ensure the safety of all visitors, we cannot allow leaving the festival grounds during the event. No exceptions can be made.',
        },
        {
          subtitle: 'Are there lockers?',
          body: 'Yes! On the grounds you can rent medium & large lockers. See the Lockers section for more information.',
        },
      ],
    },
    {
      key: 'golden-glu',
      icon: '⭐',
      title: 'Golden-GLU',
      body: 'GLU students have special privileges during the festival and are recognisable by a golden wristband.\n\nWith this golden wristband they can use the golden toilets and gold-marked order points at the bars — without having to queue.',
      accent: 'gold',
    },
  ],
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function InfoPage() {
  const { language } = useApp();
  const [sections, setSections] = useState(PLACEHOLDER[language]);
  const [loading, setLoading] = useState(false);
  const [openKey, setOpenKey] = useState(null);

  useEffect(() => {
    if (!API_URL) {
      setSections(PLACEHOLDER[language]);
      return;
    }
    setLoading(true);
    fetch(`${API_URL}/info.php?lang=${language}`, { signal: AbortSignal.timeout(8000) })
      .then(r => r.json())
      .then(data => setSections(data))
      .catch(() => setSections(PLACEHOLDER[language]))
      .finally(() => setLoading(false));
  }, [language]);

  function toggle(key) {
    setOpenKey(prev => (prev === key ? null : key));
  }

  return (
    <div className="page">
      <div className="page-content">
        <h1 className="page-title">
          {language === 'nl' ? 'Festivalinfo' : 'Festival info'}
        </h1>
        <p className="page-subtitle">
          {language === 'nl' ? 'Alles wat je moet weten' : 'Everything you need to know'}
        </p>

        {loading && (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 12 }}>
            {language === 'nl' ? 'Laden…' : 'Loading…'}
          </p>
        )}

        <div className="accordion">
          {sections.map(section => {
            const isOpen = openKey === section.key;
            const isGold = section.accent === 'gold';
            return (
              <div
                key={section.key}
                className={`accordion-item${isOpen ? ' accordion-item--open' : ''}${isGold ? ' accordion-item--gold' : ''}`}
              >
                <button
                  className="accordion-trigger"
                  onClick={() => toggle(section.key)}
                  aria-expanded={isOpen}
                >
                  <span className="accordion-trigger__inner">
                    {section.icon && (
                      <span className="accordion-icon" aria-hidden="true">{section.icon}</span>
                    )}
                    <span>{section.title}</span>
                  </span>
                  <svg className="accordion-chevron" viewBox="0 0 24 24" aria-hidden="true">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                <div className="accordion-body" aria-hidden={!isOpen}>
                  <div className="accordion-content">
                    {section.body && (
                      <p className="accordion-text accordion-text--intro">
                        {section.body}
                      </p>
                    )}
                    {section.items && section.items.map((item, i) => (
                      <div key={i} className="accordion-sub">
                        <p className="accordion-sub__title">{item.subtitle}</p>
                        <p className="accordion-text">{item.body}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
