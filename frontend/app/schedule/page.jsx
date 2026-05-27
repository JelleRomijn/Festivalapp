'use client';

import { useState, useEffect } from 'react';
import { useApp } from '@/components/AppContext';

const STAGES = [
  { id: 1, name: { nl: 'Ponton',   en: 'Ponton'   }, color: '#E85D4A' },
  { id: 2, name: { nl: 'The Lake', en: 'The Lake'  }, color: '#2E7D8B' },
  { id: 3, name: { nl: 'The Club', en: 'The Club'  }, color: '#7B2D8B' },
  { id: 4, name: { nl: 'Hanggar',  en: 'Hanggar'   }, color: '#2E7D52' },
];

const ACTS = [
  // Zaterdag — Ponton (tijden uit DB: schema.sql)
  { id: 1,  name: 'Armin van Buuren',  stage_id: 1, day: 1, start: '10:15', end: '12:00', genre: 'Trance / EDM',
    bio_nl: 'Vijfvoudig "World\'s No. 1 DJ" en trance-icoon. Armin levert euforische, energieke sets die headliner zijn geweest op Tomorrowland en Ultra. Zijn opzwepende melodieën en onberispelijke mixing houden het publiek urenlang aan het dansen.',
    bio_en: 'Five-time "World\'s No. 1 DJ" and trance icon, Armin delivers euphoric, high-energy sets that have headlined festivals from Tomorrowland to Ultra. His uplifting melodies and impeccable mixing keep crowds dancing for hours.',
    youtube_url: 'https://www.youtube.com/embed/TxvpctgU_s8' },
  { id: 2,  name: 'Kensington',        stage_id: 1, day: 1, start: '12:30', end: '13:30', genre: 'Rock',
    bio_nl: 'Rotterdamse indie-rockband bekend om stijgende refreinen en gedreven gitaarriffs. Hits als "Streets" en "Riddles" tonen hun talent voor arena-klare hooks en emotioneel geladen lyriek.',
    bio_en: 'Rotterdam-born indie rock quintet known for soaring choruses and driving guitar riffs. Hits like "Streets" and "Riddles" showcase their knack for arena-ready hooks and emotionally charged lyricism.',
    youtube_url: 'https://www.youtube.com/embed/IH77eOyV95o' },
  { id: 3,  name: 'De Staat',          stage_id: 1, day: 1, start: '14:15', end: '16:00', genre: 'Rock',
    bio_nl: 'Experimentele rockband uit Nijmegen die funky grooves combineert met hoekig gitaarwerk en theatrale podiumkunst. Tracks als "Witch Doctor" en "Down Town" laten hun genre-overschrijdende aanpak zien.',
    bio_en: 'Experimental rock outfit from Nijmegen, blending funky grooves with angular guitar work and theatrical stagecraft. Tracks like "Witch Doctor" and "Down Town" highlight their genre-bending approach and infectious energy.',
    youtube_url: 'https://www.youtube.com/embed/0ttGgIQpAUc' },
  { id: 4,  name: 'Navarone',          stage_id: 1, day: 1, start: '16:45', end: '18:15', genre: 'Rock',
    bio_nl: 'Hard rockend viertal uit Utrecht met riff-gedreven anthems en dynamische vocalen. Met een liverepututie voor rauwe intensiteit zijn ze geknipt voor late-night mainstages.',
    bio_en: 'Utrecht\'s hard-hitting rock four-piece, delivering riff-driven anthems and dynamic vocals. With a live reputation for raw intensity, they\'re tailor-made for late-night main stages.',
    youtube_url: 'https://www.youtube.com/embed/EvLpaCSnc4k' },
  { id: 5,  name: 'Dotan',             stage_id: 1, day: 1, start: '19:15', end: '21:15', genre: 'Singer-songwriter',
    bio_nl: 'Folk-pop singer-songwriter wiens intieme stem en akoestische arrangementen (met name op "Home") hem platina-verkopen en uitverkochte shows hebben opgeleverd.',
    bio_en: 'Folk-pop singer-songwriter whose intimate voice and acoustic arrangements (notably on "Home") have earned him platinum sales and sell-out shows. His heartfelt storytelling connects deeply on festival acoustic stages.',
    youtube_url: 'https://www.youtube.com/embed/FZEuqzW16Nw' },
  { id: 6,  name: 'Froukje',           stage_id: 1, day: 1, start: '21:45', end: '23:30', genre: 'Pop',
    bio_nl: 'Debuterend poptalent Froukje Veenstra combineert oprechte teksten met aanstekelijke, synth-gedreven hooks. Sinds haar debuut in 2021 is ze uitgegroeid tot stem van haar generatie.',
    bio_en: 'Breakthrough pop singer Froukje Veenstra combines candid lyrics with catchy, synth-driven hooks. Since her 2021 debut, she\'s become a voice of her generation — ideal for mid-day festival stages.',
    youtube_url: 'https://www.youtube.com/embed/g4PlReX9e-E' },

  // Zaterdag — The Lake
  { id: 7,  name: 'Talent set 1', stage_id: 2, day: 1, start: '10:00', end: '10:45', genre: 'Talent' },
  { id: 8,  name: 'Talent set 2', stage_id: 2, day: 1, start: '11:00', end: '12:30', genre: 'Talent' },
  { id: 9,  name: 'Talent set 3', stage_id: 2, day: 1, start: '13:00', end: '14:15', genre: 'Talent' },
  { id: 10, name: 'Talent set 4', stage_id: 2, day: 1, start: '15:00', end: '16:30', genre: 'Talent' },
  { id: 11, name: 'Talent set 5', stage_id: 2, day: 1, start: '17:15', end: '18:45', genre: 'Talent' },
  { id: 12, name: 'Talent set 6', stage_id: 2, day: 1, start: '19:30', end: '21:15', genre: 'Talent' },
  { id: 13, name: 'Talent set 7', stage_id: 2, day: 1, start: '21:30', end: '23:15', genre: 'Talent' },

  // Zaterdag — The Club
  { id: 14, name: 'Comedy',      stage_id: 3, day: 1, start: '11:45', end: '13:00', genre: 'Cabaret' },
  { id: 15, name: 'Lecture',     stage_id: 3, day: 1, start: '13:30', end: '14:45', genre: 'Lezing' },
  { id: 16, name: 'Theater',     stage_id: 3, day: 1, start: '15:15', end: '16:45', genre: 'Theater' },
  { id: 17, name: 'Movie',       stage_id: 3, day: 1, start: '17:15', end: '18:45', genre: 'Film' },
  { id: 18, name: 'Performance', stage_id: 3, day: 1, start: '19:30', end: '21:15', genre: 'Performance' },
  { id: 19, name: 'Illusionist', stage_id: 3, day: 1, start: '21:30', end: '23:15', genre: 'Magie' },

  // Zaterdag — Hanggar
  { id: 20, name: 'DJ set 1', stage_id: 4, day: 1, start: '10:00', end: '11:00', genre: 'DJ' },
  { id: 21, name: 'DJ set 2', stage_id: 4, day: 1, start: '11:15', end: '12:15', genre: 'DJ' },
  { id: 22, name: 'DJ set 3', stage_id: 4, day: 1, start: '12:30', end: '13:45', genre: 'DJ' },
  { id: 23, name: 'DJ set 4', stage_id: 4, day: 1, start: '14:00', end: '15:00', genre: 'DJ' },
  { id: 24, name: 'DJ set 5', stage_id: 4, day: 1, start: '15:15', end: '16:45', genre: 'DJ' },
  { id: 25, name: 'DJ set 6', stage_id: 4, day: 1, start: '17:00', end: '18:30', genre: 'DJ' },
  { id: 26, name: 'DJ set 7', stage_id: 4, day: 1, start: '19:00', end: '21:00', genre: 'DJ' },
  { id: 27, name: 'DJ set 8', stage_id: 4, day: 1, start: '21:30', end: '23:30', genre: 'DJ' },

  // Zondag — Ponton
  { id: 28, name: 'Martin Garrix',     stage_id: 1, day: 2, start: '10:30', end: '12:15', genre: 'EDM',
    bio_nl: 'Als tiener brak hij door met "Animals". Martin Garrix is een van de grootste namen in de EDM-wereld. Zijn anthemische big-room tracks en stadiongrote drops maken hem een festivalfavoriet door heel Europa.',
    bio_en: 'Broke through as a teenager with "Animals," Martin Garrix has become one of the biggest names in EDM. His anthemic big-room tracks and stadium-sized drops make him a festival favorite across Europe.',
    youtube_url: 'https://www.youtube.com/embed/Zv1QV6lrc_Y' },
  { id: 29, name: 'Within Temptation', stage_id: 1, day: 2, start: '13:00', end: '15:00', genre: 'Symphonic metal',
    bio_nl: 'Symfonisch metalpioniers met Sharon den Adel als frontvrouw. Hun cinematische geluid en operatische vocalen (denk aan "Ice Queen" en "Mother Earth") resulteren in dramatische, visueel indrukwekkende festivaloptredens.',
    bio_en: 'Symphonic metal pioneers fronted by Sharon den Adel. Their cinematic soundscapes and operatic vocals (think "Ice Queen," "Mother Earth") translate into dramatic, visually stunning festival performances.',
    youtube_url: 'https://www.youtube.com/embed/iQVei5C2N4E' },
  { id: 30, name: "Chef'Special",      stage_id: 1, day: 2, start: '15:30', end: '17:15', genre: 'Pop / Rock',
    bio_nl: 'Een viertal uit Haarlem dat funk, pop, rock en hiphop mixt. Hun energieke, genreloze geluid op nummers als "Amigo" en "In Your Arms" zorgt voor uitbundige, dansbare liveshows.',
    bio_en: 'A four-piece from Haarlem mixing funk, pop, rock and hip-hop. Their upbeat, genre-fluid sound on songs like "Amigo" and "In Your Arms" makes for joyous, dance-floor-friendly live shows.',
    youtube_url: 'https://www.youtube.com/embed/l3jRIr44lss' },
  { id: 31, name: 'Eefje de Visser',   stage_id: 1, day: 2, start: '18:30', end: '20:30', genre: 'Indie pop',
    bio_nl: 'Indie-popartieste die atmosferische, elektronisch getinte songs maakt. Haar hypnotische vocalen en weelderige productie (te horen op "Ongeveer") creëren een dromerige sfeer, perfect voor schemersessies op festivals.',
    bio_en: 'Indie-pop artist crafting atmospheric, electronic-tinged songs. Her hypnotic vocals and lush production (as heard on "Ongeveer") create a dreamlike vibe perfect for twilight festival slots.',
    youtube_url: 'https://www.youtube.com/embed/6IlLJNmLDMg' },
  { id: 32, name: 'Spinvis',           stage_id: 1, day: 2, start: '21:15', end: '23:00', genre: 'Electro pop',
    bio_nl: 'Erik de Jong treedt op onder de naam Spinvis en maakt poëtische, collage-achtige songs die gesproken woord, lo-fi elektronica en weemoedige pop combineren. Geroemd om verhalen die tegelijk intiem en surreëel aanvoelen.',
    bio_en: 'Erik de Jong performs under the moniker Spinvis, crafting poetic, collage-like songs that blend spoken-word snippets, lo-fi electronics and wistful pop. Renowned for narratives that feel both intimate and surreal.',
    youtube_url: 'https://www.youtube.com/embed/F3ZTrGWSLf4' },

  // Zondag — The Lake
  { id: 33, name: 'Talent set 1', stage_id: 2, day: 2, start: '10:00', end: '10:45', genre: 'Talent' },
  { id: 34, name: 'Talent set 2', stage_id: 2, day: 2, start: '11:15', end: '12:30', genre: 'Talent' },
  { id: 35, name: 'Talent set 3', stage_id: 2, day: 2, start: '13:00', end: '14:15', genre: 'Talent' },
  { id: 36, name: 'Talent set 4', stage_id: 2, day: 2, start: '15:00', end: '16:30', genre: 'Talent' },
  { id: 37, name: 'Talent set 5', stage_id: 2, day: 2, start: '17:00', end: '18:30', genre: 'Talent' },
  { id: 38, name: 'Talent set 6', stage_id: 2, day: 2, start: '19:30', end: '21:15', genre: 'Talent' },

  // Zondag — The Club
  { id: 39, name: 'Comedy',     stage_id: 3, day: 2, start: '11:30', end: '12:45', genre: 'Cabaret' },
  { id: 40, name: 'Lecture',    stage_id: 3, day: 2, start: '13:15', end: '14:30', genre: 'Lezing' },
  { id: 41, name: 'Theater',    stage_id: 3, day: 2, start: '15:00', end: '16:30', genre: 'Theater' },
  { id: 42, name: 'Movie',      stage_id: 3, day: 2, start: '17:00', end: '18:30', genre: 'Film' },
  { id: 43, name: 'Magic Show', stage_id: 3, day: 2, start: '19:30', end: '21:15', genre: 'Magie' },

  // Zondag — Hanggar
  { id: 44, name: 'DJ set 1', stage_id: 4, day: 2, start: '10:00', end: '10:45', genre: 'DJ' },
  { id: 45, name: 'DJ set 2', stage_id: 4, day: 2, start: '11:00', end: '12:15', genre: 'DJ' },
  { id: 46, name: 'DJ set 3', stage_id: 4, day: 2, start: '12:30', end: '13:45', genre: 'DJ' },
  { id: 47, name: 'DJ set 4', stage_id: 4, day: 2, start: '14:00', end: '15:00', genre: 'DJ' },
  { id: 48, name: 'DJ set 5', stage_id: 4, day: 2, start: '15:15', end: '16:30', genre: 'DJ' },
  { id: 49, name: 'DJ set 6', stage_id: 4, day: 2, start: '17:00', end: '18:15', genre: 'DJ' },
  { id: 50, name: 'DJ set 7', stage_id: 4, day: 2, start: '18:30', end: '20:00', genre: 'DJ' },
  { id: 51, name: 'DJ set 8', stage_id: 4, day: 2, start: '20:30', end: '22:30', genre: 'DJ' },
];

const GRID_START = 10 * 60; // 10:00
const GRID_END   = 24 * 60; // 24:00
const GRID_SPAN  = GRID_END - GRID_START; // 840 minuten
const SLOT       = 5;
const ROW_HEIGHT = 8;

function parseMinutes(timeStr) {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}

function timeToRow(timeStr) {
  return Math.round((parseMinutes(timeStr) - GRID_START) / SLOT) + 2;
}

function buildHourLabels() {
  const labels = [];
  for (let h = 10; h <= 23; h++) {
    const row = timeToRow(`${h}:00`);
    labels.push({ hour: `${h}:00`, row });
  }
  return labels;
}

const HOUR_LABELS = buildHourLabels();
const TOTAL_ROWS = GRID_SPAN / SLOT + 1;

const TEXTS = {
  nl: {
    title: 'Programma',
    subtitle: 'HartjeU Festival 2026 — twee dagen vol muziek',
    day1: 'Za 15 aug',
    day2: 'Zo 16 aug',
    noActs: 'Geen optredens gepland',
  },
  en: {
    title: 'Schedule',
    subtitle: 'HartjeU Festival 2026 — two days of music',
    day1: 'Sat 15 Aug',
    day2: 'Sun 16 Aug',
    noActs: 'No acts scheduled',
  },
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function SchedulePage() {
  const { language } = useApp();
  const t = TEXTS[language];
  const [selectedDay, setSelectedDay] = useState(1);
  const [acts, setActs] = useState(ACTS);
  const [stages, setStages] = useState(STAGES);
  const [selectedAct, setSelectedAct] = useState(null);

  useEffect(() => {
    if (!API_URL) return;
    Promise.all([
      fetch(`${API_URL}/schedule.php`).then(r => r.json()),
      fetch(`${API_URL}/locations.php?type=stage`).then(r => r.json()),
    ])
      .then(([scheduleData, stageData]) => {
        setActs(scheduleData);
        setStages(stageData);
      })
      .catch(() => {});
  }, []);

  const dayActs = acts.filter(a => a.day === selectedDay);

  return (
    <div className="page">
      <div className="page-content" style={{ paddingBottom: 0 }}>
        <h1 className="page-title">{t.title}</h1>
        <p className="page-subtitle">{t.subtitle}</p>

        <div className="schedule-day-tabs">
          {[1, 2].map(day => (
            <button
              key={day}
              className={`day-tab${selectedDay === day ? ' active' : ''}`}
              onClick={() => setSelectedDay(day)}
            >
              {day === 1 ? t.day1 : t.day2}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: '0 16px 16px' }}>
        <div className="timetable-wrapper">
          <div
            className="timetable"
            style={{
              '--stage-count': stages.length,
              gridTemplateRows: `36px repeat(${TOTAL_ROWS}, ${ROW_HEIGHT}px)`,
            }}
          >
            {/* Header-rij */}
            <div className="timetable-header time-col" style={{ gridRow: 1, gridColumn: 1 }} />
            {stages.map((stage, i) => (
              <div
                key={stage.id}
                className="timetable-header"
                style={{
                  gridRow: 1,
                  gridColumn: i + 2,
                  color: stage.color,
                  borderBottom: `2px solid ${stage.color}`,
                }}
              >
                {stage.name[language]}
              </div>
            ))}

            {/* Tijdlabels */}
            {HOUR_LABELS.map(({ hour, row }) => (
              <div
                key={hour}
                className="timetable-time"
                style={{ gridRow: row, gridColumn: 1 }}
              >
                {hour}
              </div>
            ))}

            {/* Uurlijnen */}
            {HOUR_LABELS.map(({ hour, row }) => (
              <div
                key={`line-${hour}`}
                style={{
                  gridRow: row,
                  gridColumn: `2 / ${stages.length + 2}`,
                  borderTop: '1px solid var(--border)',
                }}
              />
            ))}

            {/* Act-blokken */}
            {dayActs.map(act => {
              const stageIndex = stages.findIndex(s => s.id === act.stage_id);
              if (stageIndex === -1) return null;
              const stage = stages[stageIndex];
              const rowStart = timeToRow(act.start);
              const rowEnd = timeToRow(act.end);

              return (
                <div
                  key={act.id}
                  className="act-block"
                  style={{
                    gridRow: `${rowStart} / ${rowEnd}`,
                    gridColumn: stageIndex + 2,
                    background: stage.color,
                  }}
                  onClick={() => setSelectedAct(act)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={e => e.key === 'Enter' && setSelectedAct(act)}
                  aria-label={`${act.name}, ${act.start}–${act.end}`}
                >
                  <span className="act-block__name">{act.name}</span>
                  <span className="act-block__time">{act.start}–{act.end}</span>
                  {rowEnd - rowStart >= 6 && (
                    <span className="act-block__genre">{act.genre}</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Overlay */}
      {selectedAct && (
        <div
          onClick={() => setSelectedAct(null)}
          style={{ position: 'fixed', inset: 0, background: 'var(--overlay)', zIndex: 200 }}
        />
      )}

      {/* Act-detail sheet */}
      <div
        style={{
          position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 201,
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
          boxShadow: '0 -4px 32px rgba(0,0,0,0.2)',
          maxHeight: '85dvh', overflowY: 'auto',
          transform: selectedAct ? 'translateY(0)' : 'translateY(110%)',
          transition: 'transform 300ms cubic-bezier(0.32,0.72,0,1)',
          paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 24px)',
          WebkitOverflowScrolling: 'touch',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Handle */}
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 10, paddingBottom: 2 }}>
          <div style={{ width: 40, height: 4, borderRadius: 2, background: 'rgba(128,128,128,0.35)' }} />
        </div>

        {selectedAct && <ActDetail act={selectedAct} stages={stages} language={language} onClose={() => setSelectedAct(null)} />}
      </div>
    </div>
  );
}

function ActDetail({ act, stages, language, onClose }) {
  const stage = stages.find(s => s.id === act.stage_id);
  const bio = language === 'nl' ? act.bio_nl : act.bio_en;
  const stageName = stage ? (typeof stage.name === 'object' ? stage.name[language] : stage.name) : null;

  return (
    <div>
      {/* Gekleurde header */}
      <div style={{
        background: stage ? `linear-gradient(135deg, ${stage.color}dd, ${stage.color}88)` : 'var(--border)',
        padding: '20px 20px 16px',
        position: 'relative',
      }}>
        <button
          onClick={onClose}
          aria-label="Sluiten"
          style={{
            position: 'absolute', top: 12, right: 12,
            width: 32, height: 32, borderRadius: '50%',
            background: 'rgba(0,0,0,0.25)', border: 'none',
            color: 'white', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.1rem', lineHeight: 1,
          }}
        >
          ×
        </button>

        <h2 style={{ fontSize: '1.5rem', fontWeight: 900, letterSpacing: '-0.5px', color: 'white', margin: '0 40px 10px 0', lineHeight: 1.2 }}>
          {act.name}
        </h2>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          {stageName && (
            <span style={{ fontSize: '0.72rem', background: 'rgba(255,255,255,0.25)', color: 'white', borderRadius: 20, padding: '3px 10px', fontWeight: 700, backdropFilter: 'blur(4px)' }}>
              {stageName}
            </span>
          )}
          <span style={{ fontSize: '0.72rem', background: 'rgba(255,255,255,0.15)', color: 'white', borderRadius: 20, padding: '3px 10px', backdropFilter: 'blur(4px)' }}>
            {act.genre}
          </span>
          <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.85)', display: 'flex', alignItems: 'center', gap: 4 }}>
            🕐 {act.start} – {act.end}
          </span>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '16px 20px 24px' }}>
        {bio ? (
          <p style={{ fontSize: '0.9rem', lineHeight: 1.75, color: 'var(--text-muted)', margin: '0 0 20px' }}>
            {bio}
          </p>
        ) : (
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic', margin: '0 0 20px' }}>
            {language === 'nl' ? 'Meer info volgt binnenkort.' : 'More info coming soon.'}
          </p>
        )}

        {act.youtube_url && (
          <>
            <p style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 8 }}>
              {language === 'nl' ? 'Beluisteren' : 'Listen'}
            </p>
            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, borderRadius: 10, overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.2)' }}>
              <iframe
                src={act.youtube_url}
                title={act.name}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
