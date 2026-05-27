'use client';

import { useState, useEffect, useRef } from 'react';
import { useApp } from '@/components/AppContext';

const FESTIVAL_LAT = 52.067;
const FESTIVAL_LNG = 5.0831;

const TEXTS = {
  nl: {
    title: 'Festivalkaart',
    subtitle: 'Grasweide Strijkviertel, Utrecht',
    gpsBtn: 'Toon mijn locatie',
    gpsActive: 'GPS actief',
    gpsDenied: 'GPS-toegang geweigerd',
    gpsUnsupported: 'GPS niet beschikbaar',
    distance: 'Je bent ~{d} van het festival',
    openMaps: 'Open in kaarten-app',
    locating: 'Locatie bepalen…',
    close: 'Sluiten',
    back: 'Terug',
    day1: 'Zaterdag 15 aug',
    day2: 'Zondag 16 aug',
    watchVideo: 'Bekijk video',
    actsAt: 'Acts op',
    noActs: 'Nog geen acts bekend',
  },
  en: {
    title: 'Festival map',
    subtitle: 'Grasweide Strijkviertel, Utrecht',
    gpsBtn: 'Show my location',
    gpsActive: 'GPS active',
    gpsDenied: 'GPS access denied',
    gpsUnsupported: 'GPS not available',
    distance: 'You are ~{d} from the festival',
    openMaps: 'Open in maps app',
    locating: 'Finding location…',
    close: 'Close',
    back: 'Back',
    day1: 'Saturday 15 Aug',
    day2: 'Sunday 16 Aug',
    watchVideo: 'Watch video',
    actsAt: 'Acts at',
    noActs: 'No acts announced yet',
  },
};

const ARTISTS = [
  {
    name: 'Armin van Buuren',
    genre: 'Trance / Dance',
    descNl: 'Five-time "World\'s No. 1 DJ" en trance-icoon. Zijn euforische, energierijke sets zijn headliner geweest op festivals van Tomorrowland tot Ultra. Zijn opzwepende melodieën en makeloos mixwerk houden het publiek urenlang aan het dansen.',
    descEn: 'Five-time "World\'s No. 1 DJ" and trance icon, Armin delivers euphoric, high-energy sets that have headlined festivals from Tomorrowland to Ultra. His uplifting melodies and impeccable mixing keep crowds dancing for hours.',
    youtubeId: 'TxvpctgU_s8',
    day: 1,
    time: '10:15–12:00',
    stage: 'Ponton',
  },
  {
    name: 'Kensington',
    genre: 'Rock / Pop',
    descNl: 'Indie-rockband uit Rotterdam, bekend om hun swingerende refreinen en drijvende gitaarriffs. Hits als "Streets" en "Riddles" tonen hun gave voor arena-ready hooks en emotioneel geladen lyriek.',
    descEn: 'Rotterdam-born indie rock quintet known for soaring choruses and driving guitar riffs. Hits like "Streets" and "Riddles" showcase their knack for arena-ready hooks and emotionally charged lyricism.',
    youtubeId: 'IH77eOyV95o',
    day: 1,
    time: '12:30–13:30',
    stage: 'Ponton',
  },
  {
    name: 'De Staat',
    genre: 'Rock / Funk',
    descNl: 'Experimentele rockband uit Nijmegen die funky grooves mengt met hoekig gitaarwerk en theatrale podiumkunst. "Witch Doctor" en "Down Town" benadrukken hun genre-overstijgende aanpak.',
    descEn: 'Experimental rock outfit from Nijmegen, blending funky grooves with angular guitar work and theatrical stagecraft. Tracks like "Witch Doctor" and "Down Town" highlight their genre-bending approach and infectious energy.',
    youtubeId: '0ttGgIQpAUc',
    day: 1,
    time: '14:15–16:00',
    stage: 'Ponton',
  },
  {
    name: 'Navarone',
    genre: 'Rock',
    descNl: 'Hard-rakkend rock-viertal uit Utrecht met riff-gedreven anthems en dynamische vocalen. Met een live-reputatie voor rauwe intensiteit zijn ze gemaakt voor laat-nacht-mainstages.',
    descEn: 'Utrecht\'s hard-hitting rock four-piece, delivering riff-driven anthems and dynamic vocals. With a live reputation for raw intensity, they\'re tailor-made for late-night main stages.',
    youtubeId: 'EvLpaCSnc4k',
    day: 1,
    time: '16:45–18:15',
    stage: 'Ponton',
  },
  {
    name: 'Dotan',
    genre: 'Pop / Folk',
    descNl: 'Folk-pop singer-songwriter wiens intieme stem en akoestische arrangementen hem platina-verkopen en uitverkochte shows hebben opgeleverd. Zijn hartverwarmende storytelling raakt diep op festivalpodia.',
    descEn: 'Folk-pop singer-songwriter whose intimate voice and acoustic arrangements (notably on "Home") have earned him platinum sales and sell-out shows. His heartfelt storytelling connects deeply on festival acoustic stages.',
    youtubeId: 'FZEuqzW16Nw',
    day: 1,
    time: '19:15–21:15',
    stage: 'Ponton',
  },
  {
    name: 'Froukje',
    genre: 'Indie Pop',
    descNl: 'Breakthrough-zangeres Froukje Veenstra combineert eerlijke teksten met catchy, synth-gedreven hooks. Sinds haar debuut in 2021 is ze een stem van haar generatie.',
    descEn: 'Breakthrough pop singer Froukje Veenstra combines candid lyrics with catchy, synth-driven hooks. Since her 2021 debut, she\'s become a voice of her generation—ideal for mid-day festival stages.',
    youtubeId: 'g4PlReX9e-E',
    day: 1,
    time: '21:45–23:30',
    stage: 'Ponton',
  },
  {
    name: 'Martin Garrix',
    genre: 'EDM / Dance',
    descNl: 'Brak door als tiener met "Animals". Martin Garrix is uitgegroeid tot een van de grootste namen in EDM. Zijn anthemische big-room tracks en stadiondrops maken hem een festivelfavoriet door heel Europa.',
    descEn: 'Broke through as a teenager with "Animals," Martin Garrix has become one of the biggest names in EDM. His anthemic big-room tracks and stadium-sized drops make him a festival favorite across Europe.',
    youtubeId: 'Zv1QV6lrc_Y',
    day: 2,
    time: '10:30–12:15',
    stage: 'Ponton',
  },
  {
    name: 'Within Temptation',
    genre: 'Symphonic Metal',
    descNl: 'Symfonische metal-pioniers geleid door Sharon den Adel. Hun cinematische soundscapes en operatische vocalen (denk "Ice Queen", "Mother Earth") resulteren in dramatische, visueel verbluffende optredens.',
    descEn: 'Symphonic metal pioneers fronted by Sharon den Adel. Their cinematic soundscapes and operatic vocals (think "Ice Queen," "Mother Earth") translate into dramatic, visually stunning festival performances.',
    youtubeId: 'iQVei5C2N4E',
    day: 2,
    time: '13:00–15:00',
    stage: 'Ponton',
  },
  {
    name: "Chef'Special",
    genre: 'Pop / Funk',
    descNl: 'Een viertal uit Haarlem dat funk, pop, rock en hip-hop mengt. Hun vrolijke, genre-vloeiende geluid op nummers als "Amigo" en "In Your Arms" maakt voor vreugdevolle liveshows.',
    descEn: 'A four-piece from Haarlem mixing funk, pop, rock and hip-hop. Their upbeat, genre-fluid sound on songs like "Amigo" and "In Your Arms" makes for joyous, dance-floor-friendly live shows.',
    youtubeId: 'l3jRIr44lss',
    day: 2,
    time: '15:30–17:15',
    stage: 'Ponton',
  },
  {
    name: 'Eefje de Visser',
    genre: 'Indie Pop',
    descNl: 'Indie-pop artieste die sfeervolle, elektronisch getinte nummers maakt. Haar hypnotiserende vocalen en weelderige productie (te horen op "Ongeveer") creëren een dromerige sfeer.',
    descEn: 'Indie-pop artist crafting atmospheric, electronic-tinged songs. Her hypnotic vocals and lush production (as heard on "Ongeveer") create a dreamlike vibe perfect for twilight festival slots.',
    youtubeId: '6IlLJNmLDMg',
    day: 2,
    time: '18:30–20:30',
    stage: 'Ponton',
  },
  {
    name: 'Spinvis',
    genre: 'Indie / Elektronisch',
    descNl: 'Erik de Jong treedt op als Spinvis en maakt poëtische, collage-achtige nummers die gesproken woord, lo-fi elektronica en weemoedige pop combineren. Zijn liveshows zetten alledaagse observaties om in gedeelde, droomachtige ervaringen.',
    descEn: 'Erik de Jong performs under the moniker Spinvis, crafting poetic, collage-like songs that blend spoken-word snippets, lo-fi electronics and wistful pop. Since his debut album in 2002—recorded in his attic—he\'s become a fixture of Dutch indie. His live shows turn everyday observations into shared, dreamlike experiences.',
    youtubeId: 'F3ZTrGWSLf4',
    day: 2,
    time: '21:15–23:00',
    stage: 'Ponton',
  },
];

// Stage marker positions as percentages of the map image (x: left%, y: top%)
// Adjust these values to match the actual stage positions on the SVG map
const STAGES = [
  { id: 1, name: 'Ponton',    color: '#E85D4A', x: 21.3, y: 62.8 },
  { id: 2, name: 'The Lake',  color: '#2E7D8B', x: 53.9, y: 45.5 },
  { id: 3, name: 'The Club',  color: '#7B2D8B', x: 69.3, y: 39.1 },
  { id: 4, name: 'Hanggar',   color: '#2E7D52', x: 90.2, y: 17.1 },
];

function haversineDistance(lat1, lng1, lat2, lng2) {
  const R = 6371000;
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(Δφ / 2) ** 2 +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function formatDistance(meters) {
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

export default function MapPage() {
  const { language } = useApp();
  const t = TEXTS[language];

  const [gpsState, setGpsState] = useState('idle');
  const [distance, setDistance] = useState(null);
  const [selectedStage, setSelectedStage] = useState(null);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [mapExpanded, setMapExpanded] = useState(false);

  const gmapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${FESTIVAL_LAT},${FESTIVAL_LNG}`;
  const appleMapsUrl = `https://maps.apple.com/?ll=${FESTIVAL_LAT},${FESTIVAL_LNG}&q=HartjeU+Festival`;
  const [mapsUrl, setMapsUrl] = useState(gmapsUrl);

  useEffect(() => {
    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
      setMapsUrl(appleMapsUrl);
    }
  }, []);

  function requestGps() {
    if (!('geolocation' in navigator)) {
      setGpsState('unsupported');
      return;
    }
    setGpsState('loading');
    navigator.geolocation.getCurrentPosition(
      pos => {
        const d = haversineDistance(pos.coords.latitude, pos.coords.longitude, FESTIVAL_LAT, FESTIVAL_LNG);
        setDistance(d);
        setGpsState('active');
      },
      () => setGpsState('denied'),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  const gpsLabel =
    gpsState === 'active' ? t.gpsActive :
    gpsState === 'denied' ? t.gpsDenied :
    gpsState === 'unsupported' ? t.gpsUnsupported :
    gpsState === 'loading' ? t.locating :
    t.gpsBtn;

  const stageArtists = selectedStage
    ? ARTISTS.filter(a => a.stage === selectedStage.name)
    : [];

  function closeSheet() {
    setSelectedArtist(null);
    setSelectedStage(null);
  }

  function goBackToStage() {
    setSelectedArtist(null);
  }

  const sheetOpen = selectedStage !== null;

  return (
    <div className="page">
      <div className="page-content">
        <h1 className="page-title">{t.title}</h1>
        <p className="page-subtitle">{t.subtitle}</p>

        {/* Map controls */}
        <div className="map-controls">
          <button
            className={`btn ${gpsState === 'active' ? 'btn-ghost' : 'btn-primary'}`}
            onClick={requestGps}
            disabled={gpsState === 'loading' || gpsState === 'denied' || gpsState === 'unsupported'}
            style={{ flex: 1 }}
          >
            <svg viewBox="0 0 24 24" style={{ width: 18, height: 18, stroke: 'currentColor', fill: 'none', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' }}>
              <circle cx="12" cy="12" r="3" />
              <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
            </svg>
            {gpsLabel}
          </button>
          <a
            href={mapsUrl}
            className="btn btn-ghost"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t.openMaps}
          </a>
        </div>

        {gpsState === 'active' && distance !== null && (
          <p className="gps-status">
            <svg viewBox="0 0 24 24" style={{ width: 14, height: 14, stroke: 'currentColor', fill: 'none', strokeWidth: 2.5, strokeLinecap: 'round', strokeLinejoin: 'round', flexShrink: 0 }}>
              <circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
            </svg>
            {t.distance.replace('{d}', formatDistance(distance))}
          </p>
        )}

        {/* SVG map with stage markers overlay */}
        <div
          className="map-container"
          onClick={() => setMapExpanded(true)}
          title="Klik om te vergroten"
        >
          <img
            src={`${BASE_PATH}/kaart_festival_markers (1).svg`}
            alt={t.title}
          />

          {/* Interactieve podiummarkers */}
          {STAGES.map(stage => (
            <button
              key={stage.id}
              className="stage-marker"
              style={{ left: `${stage.x}%`, top: `${stage.y}%`, color: stage.color }}
              onClick={e => { e.stopPropagation(); setSelectedStage(stage); }}
              title={stage.name}
            >
              <span className="stage-marker__ring" />
              <span
                className="stage-marker__dot"
                style={{ background: stage.color }}
              />
            </button>
          ))}

          {/* Vergroot-icoon hint */}
          <div style={{
            position: 'absolute', bottom: 8, right: 8,
            background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)',
            borderRadius: 8, padding: '4px 8px',
            display: 'flex', alignItems: 'center', gap: 4,
            color: 'white', fontSize: '0.7rem', fontWeight: 600, pointerEvents: 'none',
          }}>
            <svg viewBox="0 0 24 24" style={{ width: 13, height: 13, stroke: 'currentColor', fill: 'none', strokeWidth: 2 }}>
              <polyline points="15 3 21 3 21 9" /><polyline points="9 21 3 21 3 15" />
              <line x1="21" y1="3" x2="14" y2="10" /><line x1="3" y1="21" x2="10" y2="14" />
            </svg>
            Vergroten
          </div>
        </div>

        {/* Podium legenda */}
        <div className="stage-legend">
          {STAGES.map(stage => (
            <button
              key={stage.id}
              className="stage-legend-pill"
              onClick={() => setSelectedStage(stage)}
              style={{ '--stage-color': stage.color }}
            >
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: stage.color, display: 'inline-block', flexShrink: 0 }} />
              {stage.name}
            </button>
          ))}
        </div>

        {/* Expanded kaart overlay */}
        {mapExpanded && (
          <ExpandedMap
            basePath={BASE_PATH}
            t={t}
            stages={STAGES}
            onStageClick={stage => { setMapExpanded(false); setSelectedStage(stage); }}
            onClose={() => setMapExpanded(false)}
          />
        )}
      </div>

      {/* Bottom sheet overlay */}
      {sheetOpen && (
        <div
          onClick={closeSheet}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'var(--overlay)',
            zIndex: 200,
          }}
        />
      )}

      {/* Bottom sheet */}
      <div
        style={{
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 201,
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
          boxShadow: '0 -4px 32px rgba(0,0,0,0.2)',
          maxHeight: '80dvh',
          overflowY: 'auto',
          transform: sheetOpen ? 'translateY(0)' : 'translateY(110%)',
          transition: 'transform 300ms cubic-bezier(0.32,0.72,0,1)',
          paddingBottom: 'calc(var(--safe-bottom) + 16px)',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {/* Sheet handle */}
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 12, paddingBottom: 4 }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--border)' }} />
        </div>

        {selectedArtist ? (
          /* Artist detail view */
          <ArtistDetail
            artist={selectedArtist}
            language={language}
            t={t}
            onBack={goBackToStage}
          />
        ) : selectedStage ? (
          /* Stage acts list */
          <div style={{ padding: '8px 20px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: selectedStage.color, flexShrink: 0 }} />
                <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>
                  {t.actsAt} {selectedStage.name}
                </h2>
              </div>
              <button
                onClick={closeSheet}
                style={{ color: 'var(--text-muted)', fontSize: '0.85rem', background: 'var(--border)', border: 'none', borderRadius: 20, padding: '4px 12px', cursor: 'pointer' }}
              >
                {t.close}
              </button>
            </div>

            {stageArtists.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{t.noActs}</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {/* Day 1 */}
                {stageArtists.filter(a => a.day === 1).length > 0 && (
                  <>
                    <p style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--text-muted)', marginTop: 4 }}>
                      {t.day1}
                    </p>
                    {stageArtists.filter(a => a.day === 1).map(artist => (
                      <ArtistRow
                        key={artist.name}
                        artist={artist}
                        stageColor={selectedStage.color}
                        onClick={() => setSelectedArtist(artist)}
                      />
                    ))}
                  </>
                )}
                {/* Day 2 */}
                {stageArtists.filter(a => a.day === 2).length > 0 && (
                  <>
                    <p style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--text-muted)', marginTop: 8 }}>
                      {t.day2}
                    </p>
                    {stageArtists.filter(a => a.day === 2).map(artist => (
                      <ArtistRow
                        key={artist.name}
                        artist={artist}
                        stageColor={selectedStage.color}
                        onClick={() => setSelectedArtist(artist)}
                      />
                    ))}
                  </>
                )}
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}

const OVERLAY_BTN = {
  background: 'rgba(255,255,255,0.15)',
  border: '1px solid rgba(255,255,255,0.25)',
  borderRadius: 8, color: 'white', fontSize: '1.3rem',
  width: 36, height: 36, cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
};

function ExpandedMap({ basePath, t, stages, onStageClick, onClose }) {
  const containerRef = useRef(null);
  const stateRef = useRef({ scale: 1, tx: 0, ty: 0, gesture: null });
  const [, forceRender] = useState(0);

  function commit(scale, tx, ty) {
    const s = Math.min(5, Math.max(1, scale));
    const el = containerRef.current;
    if (el) {
      const cw = el.clientWidth;
      const ch = el.clientHeight;
      const ratio = 2330.58 / 1353.19;
      tx = Math.min(0, Math.max(cw - cw * s, tx));
      ty = Math.min(0, Math.max(ch - (cw / ratio) * s, ty));
    }
    stateRef.current = { ...stateRef.current, scale: s, tx, ty };
    forceRender(n => n + 1);
  }

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    function dist(t) {
      return Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY);
    }
    function mid(t) {
      return { x: (t[0].clientX + t[1].clientX) / 2, y: (t[0].clientY + t[1].clientY) / 2 };
    }

    function onTouchStart(e) {
      e.preventDefault();
      const { scale, tx, ty } = stateRef.current;
      const rect = el.getBoundingClientRect();
      if (e.touches.length >= 2) {
        stateRef.current.gesture = {
          type: 'pinch',
          d0: dist(e.touches), m0: mid(e.touches),
          scale0: scale, tx0: tx, ty0: ty,
        };
      } else {
        stateRef.current.gesture = {
          type: 'pan',
          x0: e.touches[0].clientX - rect.left,
          y0: e.touches[0].clientY - rect.top,
          tx0: tx, ty0: ty,
        };
      }
    }

    function onTouchMove(e) {
      e.preventDefault();
      const g = stateRef.current.gesture;
      if (!g) return;
      const rect = el.getBoundingClientRect();
      if (e.touches.length >= 2 && g.type === 'pinch') {
        const newScale = g.scale0 * dist(e.touches) / g.d0;
        const m = mid(e.touches);
        const mx = m.x - rect.left;
        const my = m.y - rect.top;
        const px = (mx - g.tx0) / g.scale0;
        const py = (my - g.ty0) / g.scale0;
        commit(newScale, mx - px * newScale, my - py * newScale);
      } else if (e.touches.length === 1 && g.type === 'pan') {
        const dx = (e.touches[0].clientX - rect.left) - g.x0;
        const dy = (e.touches[0].clientY - rect.top) - g.y0;
        commit(stateRef.current.scale, g.tx0 + dx, g.ty0 + dy);
      }
    }

    function onTouchEnd(e) {
      const { scale, tx, ty } = stateRef.current;
      if (e.touches.length === 0) {
        stateRef.current.gesture = null;
      } else if (e.touches.length === 1) {
        const rect = el.getBoundingClientRect();
        stateRef.current.gesture = {
          type: 'pan',
          x0: e.touches[0].clientX - rect.left,
          y0: e.touches[0].clientY - rect.top,
          tx0: tx, ty0: ty,
        };
      }
    }

    el.addEventListener('touchstart', onTouchStart, { passive: false });
    el.addEventListener('touchmove', onTouchMove, { passive: false });
    el.addEventListener('touchend', onTouchEnd, { passive: false });
    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onTouchEnd);
    };
  }, []);

  const { scale, tx, ty } = stateRef.current;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 300, background: '#111', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '10px 12px 8px', flexShrink: 0,
        background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <button style={OVERLAY_BTN} onClick={() => { const {scale:s,tx,ty}=stateRef.current; commit(s-0.25,tx,ty); }}>−</button>
          <button
            onClick={() => commit(1, 0, 0)}
            style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem', minWidth: 36, textAlign: 'center', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 2px' }}
          >
            {Math.round(scale * 100)}%
          </button>
          <button style={OVERLAY_BTN} onClick={() => { const {scale:s,tx,ty}=stateRef.current; commit(s+0.25,tx,ty); }}>+</button>
        </div>
        <button
          onClick={onClose}
          style={{ ...OVERLAY_BTN, width: 'auto', fontSize: '0.85rem', padding: '0 14px' }}
        >
          ✕ {t.close}
        </button>
      </div>

      {/* Kaartgebied */}
      <div ref={containerRef} style={{ flex: 1, overflow: 'hidden', position: 'relative', touchAction: 'none' }}>
        {/* Schaalplaatje met markers */}
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%',
          transformOrigin: '0 0',
          transform: `translate(${tx}px,${ty}px) scale(${scale})`,
        }}>
          <img
            src={`${basePath}/kaart_festival_markers (1).svg`}
            alt={t.title}
            draggable={false}
            style={{ width: '100%', height: 'auto', display: 'block', userSelect: 'none', pointerEvents: 'none' }}
          />
          {stages.map(stage => (
            <button
              key={stage.id}
              className="stage-marker"
              style={{
                left: `${stage.x}%`, top: `${stage.y}%`, color: stage.color,
                transform: `translate(-50%, -50%) scale(${1 / scale})`,
              }}
              onClick={() => onStageClick(stage)}
            >
              <span className="stage-marker__ring" />
              <span className="stage-marker__dot" style={{ background: stage.color }} />
            </button>
          ))}
        </div>

        {/* Legenda */}
        <img
          src={`${basePath}/legenda (1).svg`}
          alt="Legenda"
          style={{
            position: 'absolute', bottom: 10, right: 10, width: 90, height: 'auto',
            borderRadius: 'var(--radius-sm)', background: 'white',
            border: '1px solid rgba(255,255,255,0.15)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.4)', pointerEvents: 'none',
          }}
        />

        {scale === 1 && (
          <div style={{
            position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)',
            background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)',
            borderRadius: 20, padding: '5px 12px',
            color: 'rgba(255,255,255,0.75)', fontSize: '0.72rem',
            pointerEvents: 'none', whiteSpace: 'nowrap',
          }}>
            Knijp om in te zoomen · sleep om te bewegen
          </div>
        )}
      </div>
    </div>
  );
}

function ArtistRow({ artist, stageColor, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'var(--bg)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-sm)',
        padding: '12px 14px',
        cursor: 'pointer',
        width: '100%',
        textAlign: 'left',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      <div>
        <p style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 2 }}>{artist.name}</p>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{artist.genre} · {artist.time}</p>
      </div>
      <svg viewBox="0 0 24 24" style={{ width: 18, height: 18, stroke: stageColor, fill: 'none', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', flexShrink: 0 }}>
        <path d="M9 18l6-6-6-6" />
      </svg>
    </button>
  );
}

function ArtistDetail({ artist, language, t, onBack }) {
  return (
    <div style={{ padding: '8px 20px 20px' }}>
      {/* Back button + close */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <button
          onClick={onBack}
          style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontSize: '0.85rem', background: 'var(--border)', border: 'none', borderRadius: 20, padding: '4px 12px', cursor: 'pointer' }}
        >
          <svg viewBox="0 0 24 24" style={{ width: 14, height: 14, stroke: 'currentColor', fill: 'none', strokeWidth: 2.5, strokeLinecap: 'round', strokeLinejoin: 'round' }}>
            <path d="M15 18l-6-6 6-6" />
          </svg>
          {t.back}
        </button>
      </div>

      {/* Artist name + genre */}
      <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: 4, letterSpacing: '-0.5px' }}>
        {artist.name}
      </h2>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <span style={{ fontSize: '0.75rem', background: 'var(--color-primary)', color: 'white', borderRadius: 20, padding: '3px 10px', fontWeight: 600 }}>
          {artist.genre}
        </span>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          {artist.stage} · {artist.time}
        </span>
      </div>

      {/* YouTube embed */}
      <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, borderRadius: 'var(--radius-sm)', overflow: 'hidden', marginBottom: 16 }}>
        <iframe
          src={`https://www.youtube.com/embed/${artist.youtubeId}`}
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title={artist.name}
          loading="lazy"
        />
      </div>

      {/* Description */}
      <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>
        {language === 'nl' ? artist.descNl : artist.descEn}
      </p>
    </div>
  );
}
