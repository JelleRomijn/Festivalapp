'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import styles from './admin.module.css';

const API = process.env.NEXT_PUBLIC_API_URL || '';

const CATEGORIES = [
  { value: 'headliner', label: 'Headliner' },
  { value: 'talent',    label: 'Talent' },
  { value: 'dj',        label: 'DJ' },
  { value: 'activity',  label: 'Activiteit' },
];

const CAT_LABEL = { headliner: 'Headliners', talent: 'Talent', dj: 'DJ', activity: 'Activiteiten' };
const DAY_LABEL = { 1: 'Zaterdag 15 aug', 2: 'Zondag 16 aug' };

const EMPTY_ARTIST = {
  name: '', category: 'headliner', genre: '',
  description_nl: '', description_en: '',
  bio_nl: '', bio_en: '',
  youtube_url: '', image_url: '',
};

export default function AdminPage() {
  const [tab, setTab] = useState('artists');

  const [artists,      setArtists]      = useState([]);
  const [schedule,     setSchedule]     = useState([]);
  const [stages,       setStages]       = useState([]);
  const [infoSections, setInfoSections] = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [toast,        setToast]        = useState(null);

  // Artiesten
  const [editingArtist, setEditingArtist] = useState(null); // null | 'new' | id
  const [artistForm,    setArtistForm]    = useState(EMPTY_ARTIST);
  const [catFilter,     setCatFilter]     = useState('all');
  const [uploading,     setUploading]     = useState(false);
  const fileRef = useRef(null);

  // Programma
  const [editingSlot, setEditingSlot] = useState(null);
  const [slotForm,    setSlotForm]    = useState({});
  const [scheduleDay, setScheduleDay] = useState(1);

  // Info
  const [editingInfo, setEditingInfo] = useState(null);
  const [infoForm,    setInfoForm]    = useState({});

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [a, s, l, i] = await Promise.all([
        fetch(`${API}/admin.php?resource=artists`).then(r => r.json()),
        fetch(`${API}/admin.php?resource=schedule`).then(r => r.json()),
        fetch(`${API}/admin.php?resource=locations`).then(r => r.json()),
        fetch(`${API}/admin.php?resource=festival_info`).then(r => r.json()),
      ]);
      setArtists(Array.isArray(a) ? a : []);
      setSchedule(Array.isArray(s) ? s : []);
      setStages(Array.isArray(l) ? l : []);
      setInfoSections(Array.isArray(i) ? i : []);
    } catch {
      showToast('Kon data niet laden', 'error');
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // ── Artiesten ──────────────────────────────────────────
  const startEditArtist = (artist) => {
    setEditingArtist(artist.id);
    setArtistForm({ ...EMPTY_ARTIST, ...artist });
  };

  const cancelEditArtist = () => {
    setEditingArtist(null);
    setArtistForm(EMPTY_ARTIST);
  };

  const saveArtist = async () => {
    if (!artistForm.name.trim()) { showToast('Naam is verplicht', 'error'); return; }
    try {
      const isNew = editingArtist === 'new';
      const url   = isNew
        ? `${API}/admin.php?resource=artists`
        : `${API}/admin.php?resource=artists&id=${editingArtist}`;
      await fetch(url, {
        method:  isNew ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(artistForm),
      });
      cancelEditArtist();
      await fetchAll();
      showToast('Artiest opgeslagen');
    } catch {
      showToast('Opslaan mislukt', 'error');
    }
  };

  const deleteArtist = async (id, name) => {
    if (!confirm(`"${name}" verwijderen?\nBijbehorende programmaslots worden ook verwijderd.`)) return;
    try {
      await fetch(`${API}/admin.php?resource=artists&id=${id}`, { method: 'DELETE' });
      await fetchAll();
      showToast('Artiest verwijderd');
    } catch {
      showToast('Verwijderen mislukt', 'error');
    }
  };

  const uploadImage = async (file) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res  = await fetch(`${API}/upload.php`, { method: 'POST', body: fd });
      const data = await res.json();
      if (data.url) {
        setArtistForm(f => ({ ...f, image_url: data.url }));
        showToast('Foto geüpload');
      } else {
        showToast(data.error || 'Upload mislukt', 'error');
      }
    } catch {
      showToast('Upload mislukt', 'error');
    }
    setUploading(false);
  };

  // ── Programma ──────────────────────────────────────────
  const startEditSlot = (slot) => {
    setEditingSlot(slot.id);
    setSlotForm({ ...slot });
  };

  const cancelEditSlot = () => setEditingSlot(null);

  const startNewSlot = () => {
    setEditingSlot('new');
    setSlotForm({
      artist_id:  artists[0]?.id  || 1,
      stage_id:   stages[0]?.id   || 1,
      day:        scheduleDay,
      start_time: '10:00',
      end_time:   '11:00',
    });
  };

  const saveSlot = async () => {
    try {
      const isNew = editingSlot === 'new';
      const url   = isNew
        ? `${API}/admin.php?resource=schedule`
        : `${API}/admin.php?resource=schedule&id=${editingSlot}`;
      await fetch(url, {
        method:  isNew ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(slotForm),
      });
      cancelEditSlot();
      await fetchAll();
      showToast('Tijdslot opgeslagen');
    } catch {
      showToast('Opslaan mislukt', 'error');
    }
  };

  const deleteSlot = async (id, artistName) => {
    if (!confirm(`Tijdslot voor "${artistName}" verwijderen?`)) return;
    try {
      await fetch(`${API}/admin.php?resource=schedule&id=${id}`, { method: 'DELETE' });
      await fetchAll();
      showToast('Tijdslot verwijderd');
    } catch {
      showToast('Verwijderen mislukt', 'error');
    }
  };

  // ── Info ──────────────────────────────────────────────
  const startEditInfo = (section) => {
    setEditingInfo(section.id);
    setInfoForm({ ...section });
  };

  const cancelEditInfo = () => setEditingInfo(null);

  const saveInfo = async () => {
    try {
      await fetch(`${API}/admin.php?resource=festival_info&id=${editingInfo}`, {
        method:  'PUT',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(infoForm),
      });
      cancelEditInfo();
      await fetchAll();
      showToast('Infosectie opgeslagen');
    } catch {
      showToast('Opslaan mislukt', 'error');
    }
  };

  // ── Afgeleide data ─────────────────────────────────────
  const visibleArtists = catFilter === 'all'
    ? artists
    : artists.filter(a => a.category === catFilter);

  const daySlots     = schedule.filter(s => s.day === scheduleDay);
  const slotsByStage = Object.fromEntries(
    stages.map(st => [st.id, daySlots.filter(s => s.stage_id === st.id)])
  );

  const catCounts = CATEGORIES.reduce((acc, c) => {
    acc[c.value] = artists.filter(a => a.category === c.value).length;
    return acc;
  }, {});

  if (loading) return <div className={styles.loading}>Laden…</div>;

  return (
    <div className={styles.admin}>
      <div className={styles.header}>
        <h1>CMS Beheer</h1>
        <p className={styles.warning}>Intern gebruik — niet publiek delen</p>
      </div>

      {toast && (
        <div className={`${styles.toast} ${styles[toast.type]}`}>{toast.msg}</div>
      )}

      {/* ── Tabs ── */}
      <div className={styles.tabs}>
        <button className={tab === 'artists'  ? styles.active : ''} onClick={() => setTab('artists')}>
          Artiesten ({artists.length})
        </button>
        <button className={tab === 'schedule' ? styles.active : ''} onClick={() => setTab('schedule')}>
          Programma ({schedule.length} slots)
        </button>
        <button className={tab === 'info'     ? styles.active : ''} onClick={() => setTab('info')}>
          Info pagina ({infoSections.length})
        </button>
      </div>

      {/* ═══════════════════════════════════════
          TAB: ARTIESTEN
      ═══════════════════════════════════════ */}
      {tab === 'artists' && (
        <div className={styles.section}>
          <div className={styles.toolbar}>
            <div className={styles.filters}>
              <button
                className={catFilter === 'all' ? styles.filterActive : styles.filter}
                onClick={() => setCatFilter('all')}
              >
                Alle ({artists.length})
              </button>
              {CATEGORIES.map(c => (
                <button
                  key={c.value}
                  className={catFilter === c.value ? styles.filterActive : styles.filter}
                  onClick={() => setCatFilter(c.value)}
                >
                  {c.label} ({catCounts[c.value]})
                </button>
              ))}
            </div>
            <button className={styles.addBtn} onClick={() => {
              setEditingArtist('new');
              setArtistForm(EMPTY_ARTIST);
            }}>
              + Artiest toevoegen
            </button>
          </div>

          {/* Artiest edit paneel */}
          {editingArtist !== null && (
            <ArtistForm
              form={artistForm}
              onChange={setArtistForm}
              onSave={saveArtist}
              onCancel={cancelEditArtist}
              onUpload={uploadImage}
              uploading={uploading}
              fileRef={fileRef}
              isNew={editingArtist === 'new'}
              styles={styles}
            />
          )}

          <table className={styles.table}>
            <thead>
              <tr>
                <th>Foto</th>
                <th>Naam</th>
                <th>Type</th>
                <th>Genre</th>
                <th>Acties</th>
              </tr>
            </thead>
            <tbody>
              {visibleArtists.map(artist => (
                <tr key={artist.id}>
                  <td style={{ width: 48 }}>
                    {artist.image_url
                      ? <img src={artist.image_url} alt={artist.name} style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 6 }} />
                      : <div style={{ width: 40, height: 40, borderRadius: 6, background: 'var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>🎵</div>
                    }
                  </td>
                  <td className={styles.artistName}>{artist.name}</td>
                  <td>
                    <span className={`${styles.badge} ${styles[artist.category]}`}>
                      {artist.category}
                    </span>
                  </td>
                  <td className={styles.muted}>{artist.genre}</td>
                  <td>
                    <button className={styles.editBtn} onClick={() => startEditArtist(artist)}>
                      Bewerken
                    </button>
                    <button className={styles.deleteBtn} onClick={() => deleteArtist(artist.id, artist.name)}>
                      Verwijder
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ═══════════════════════════════════════
          TAB: PROGRAMMA
      ═══════════════════════════════════════ */}
      {tab === 'schedule' && (
        <div className={styles.section}>
          <div className={styles.toolbar}>
            <div className={styles.filters}>
              {[1, 2].map(day => (
                <button
                  key={day}
                  className={scheduleDay === day ? styles.filterActive : styles.filter}
                  onClick={() => setScheduleDay(day)}
                >
                  {DAY_LABEL[day]} ({schedule.filter(s => s.day === day).length})
                </button>
              ))}
            </div>
            <button className={styles.addBtn} onClick={startNewSlot}>
              + Tijdslot toevoegen
            </button>
          </div>

          {editingSlot === 'new' && (
            <SlotForm
              form={slotForm}
              onChange={setSlotForm}
              artists={artists}
              stages={stages}
              onSave={saveSlot}
              onCancel={cancelEditSlot}
              styles={styles}
            />
          )}

          {stages.map(stage => (
            <div key={stage.id} className={styles.stageSection}>
              <h2 className={styles.stageTitle}>{stage.name_nl}</h2>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Begin</th>
                    <th>Einde</th>
                    <th>Artiest</th>
                    <th>Type</th>
                    <th>Acties</th>
                  </tr>
                </thead>
                <tbody>
                  {slotsByStage[stage.id]?.length === 0 && (
                    <tr>
                      <td colSpan={5} className={styles.empty}>
                        Geen slots voor dit podium op deze dag
                      </td>
                    </tr>
                  )}
                  {(slotsByStage[stage.id] || []).map(slot =>
                    editingSlot === slot.id ? (
                      <SlotInlineRow
                        key={slot.id}
                        form={slotForm}
                        onChange={setSlotForm}
                        artists={artists}
                        onSave={saveSlot}
                        onCancel={cancelEditSlot}
                        styles={styles}
                      />
                    ) : (
                      <tr key={slot.id}>
                        <td className={styles.time}>{slot.start_time}</td>
                        <td className={styles.time}>{slot.end_time}</td>
                        <td className={styles.artistName}>{slot.artist_name}</td>
                        <td>
                          <span className={`${styles.badge} ${styles[slot.artist_category]}`}>
                            {slot.artist_category}
                          </span>
                        </td>
                        <td>
                          <button className={styles.editBtn} onClick={() => startEditSlot(slot)}>
                            Bewerken
                          </button>
                          <button className={styles.deleteBtn} onClick={() => deleteSlot(slot.id, slot.artist_name)}>
                            Verwijder
                          </button>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}

      {/* ═══════════════════════════════════════
          TAB: INFO PAGINA
      ═══════════════════════════════════════ */}
      {tab === 'info' && (
        <div className={styles.section}>
          <p className={styles.sectionHint}>
            Bewerk hier de teksten die op de info-pagina worden getoond (NL en EN).
          </p>

          {infoSections.map(section =>
            editingInfo === section.id ? (
              <InfoEditPanel
                key={section.id}
                form={infoForm}
                onChange={setInfoForm}
                onSave={saveInfo}
                onCancel={cancelEditInfo}
                styles={styles}
              />
            ) : (
              <div key={section.id} className={styles.infoCard}>
                <div className={styles.infoCardHeader}>
                  <div>
                    <span className={styles.infoKey}>{section.key}</span>
                    <strong className={styles.infoTitle}>{section.title_nl}</strong>
                    <span className={styles.infoTitleEn}> / {section.title_en}</span>
                  </div>
                  <button className={styles.editBtn} onClick={() => startEditInfo(section)}>
                    Bewerken
                  </button>
                </div>
                <p className={styles.infoBody}>{section.content_nl}</p>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}

// ── ArtistForm (paneel boven de tabel) ────────────────────

function ArtistForm({ form, onChange, onSave, onCancel, onUpload, uploading, fileRef, isNew, styles }) {
  const set = (field) => (e) => onChange(f => ({ ...f, [field]: e.target.value }));

  return (
    <div className={styles.artistFormPanel}>
      <h3>{isNew ? 'Nieuwe artiest' : `Bewerken: ${form.name}`}</h3>

      <div className={styles.artistFormGrid}>
        {/* Kolom 1 — basisinfo */}
        <div className={styles.artistFormCol}>
          <label className={styles.formLabel}>
            Naam *
            <input value={form.name || ''} onChange={set('name')} placeholder="Naam artiest" />
          </label>
          <label className={styles.formLabel}>
            Type
            <select value={form.category || 'headliner'} onChange={set('category')}>
              {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </label>
          <label className={styles.formLabel}>
            Genre
            <input value={form.genre || ''} onChange={set('genre')} placeholder="Genre" />
          </label>
          <label className={styles.formLabel}>
            Korte omschrijving (NL)
            <input value={form.description_nl || ''} onChange={set('description_nl')} placeholder="Korte omschrijving NL" />
          </label>
          <label className={styles.formLabel}>
            Korte omschrijving (EN)
            <input value={form.description_en || ''} onChange={set('description_en')} placeholder="Short description EN" />
          </label>
          <label className={styles.formLabel}>
            YouTube URL (embed)
            <input value={form.youtube_url || ''} onChange={set('youtube_url')} placeholder="https://www.youtube.com/embed/..." />
          </label>
        </div>

        {/* Kolom 2 — bio's */}
        <div className={styles.artistFormCol}>
          <label className={styles.formLabel}>
            Bio (NL)
            <textarea
              value={form.bio_nl || ''}
              onChange={set('bio_nl')}
              placeholder="Uitgebreide biografie in het Nederlands…"
              rows={5}
            />
          </label>
          <label className={styles.formLabel}>
            Bio (EN)
            <textarea
              value={form.bio_en || ''}
              onChange={set('bio_en')}
              placeholder="Extended biography in English…"
              rows={5}
            />
          </label>
        </div>

        {/* Kolom 3 — foto */}
        <div className={styles.artistFormCol}>
          <p className={styles.formLabel} style={{ fontWeight: 600, fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 6 }}>
            Foto
          </p>
          {form.image_url && (
            <img
              src={form.image_url}
              alt="Preview"
              style={{ width: '100%', maxWidth: 200, height: 160, objectFit: 'cover', borderRadius: 8, marginBottom: 10, display: 'block' }}
            />
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={e => e.target.files[0] && onUpload(e.target.files[0])}
          />
          <button
            className={styles.uploadBtn}
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            type="button"
          >
            {uploading ? 'Uploaden…' : '📷 Foto uploaden'}
          </button>
          <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 6 }}>
            Of plak een URL:
          </p>
          <input
            value={form.image_url || ''}
            onChange={set('image_url')}
            placeholder="https://…"
            style={{ width: '100%', padding: '0.3rem 0.5rem', fontSize: '0.82rem', background: 'var(--bg)', color: 'var(--text)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', fontFamily: 'inherit' }}
          />
        </div>
      </div>

      <div className={styles.artistFormActions}>
        <button className={styles.saveBtn} onClick={onSave}>Opslaan</button>
        <button className={styles.cancelBtn} onClick={onCancel}>Annuleer</button>
      </div>
    </div>
  );
}

// ── InfoEditPanel ──────────────────────────────────────────

function InfoEditPanel({ form, onChange, onSave, onCancel, styles }) {
  const set = (field) => (e) => onChange(f => ({ ...f, [field]: e.target.value }));

  return (
    <div className={styles.infoEditPanel}>
      <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: 12 }}>
        Sectie bewerken: <code style={{ fontWeight: 400 }}>{form.key}</code>
      </h3>
      <div className={styles.infoEditGrid}>
        <label className={styles.formLabel}>
          Titel (NL)
          <input value={form.title_nl || ''} onChange={set('title_nl')} />
        </label>
        <label className={styles.formLabel}>
          Titel (EN)
          <input value={form.title_en || ''} onChange={set('title_en')} />
        </label>
        <label className={styles.formLabel} style={{ gridColumn: '1 / -1' }}>
          Inhoud (NL)
          <textarea value={form.content_nl || ''} onChange={set('content_nl')} rows={4} />
        </label>
        <label className={styles.formLabel} style={{ gridColumn: '1 / -1' }}>
          Inhoud (EN)
          <textarea value={form.content_en || ''} onChange={set('content_en')} rows={4} />
        </label>
      </div>
      <div style={{ marginTop: 12 }}>
        <button className={styles.saveBtn} onClick={onSave}>Opslaan</button>
        <button className={styles.cancelBtn} onClick={onCancel}>Annuleer</button>
      </div>
    </div>
  );
}

// ── SlotInlineRow ──────────────────────────────────────────

function SlotInlineRow({ form, onChange, artists, onSave, onCancel, styles }) {
  const set = (field) => (e) => onChange(f => ({ ...f, [field]: e.target.type === 'number' ? +e.target.value : e.target.value }));
  return (
    <tr className={styles.editRow}>
      <td>
        <input type="time" value={form.start_time || ''} onChange={set('start_time')} />
      </td>
      <td>
        <input type="time" value={form.end_time || ''} onChange={set('end_time')} />
      </td>
      <td colSpan={2}>
        <select value={form.artist_id || ''} onChange={(e) => onChange(f => ({ ...f, artist_id: +e.target.value }))}>
          {artists.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
        </select>
      </td>
      <td>
        <button className={styles.saveBtn} onClick={onSave}>Opslaan</button>
        <button className={styles.cancelBtn} onClick={onCancel}>Annuleer</button>
      </td>
    </tr>
  );
}

// ── SlotForm ───────────────────────────────────────────────

function SlotForm({ form, onChange, artists, stages, onSave, onCancel, styles }) {
  return (
    <div className={styles.newSlotForm}>
      <h3>Nieuw tijdslot</h3>
      <div className={styles.formRow}>
        <label>
          Dag
          <select value={form.day || 1} onChange={(e) => onChange(f => ({ ...f, day: +e.target.value }))}>
            <option value={1}>Zaterdag 15 aug</option>
            <option value={2}>Zondag 16 aug</option>
          </select>
        </label>
        <label>
          Podium
          <select value={form.stage_id || ''} onChange={(e) => onChange(f => ({ ...f, stage_id: +e.target.value }))}>
            {stages.map(s => <option key={s.id} value={s.id}>{s.name_nl}</option>)}
          </select>
        </label>
        <label>
          Artiest
          <select value={form.artist_id || ''} onChange={(e) => onChange(f => ({ ...f, artist_id: +e.target.value }))}>
            {artists.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
        </label>
        <label>
          Begin
          <input type="time" value={form.start_time || ''} onChange={(e) => onChange(f => ({ ...f, start_time: e.target.value }))} />
        </label>
        <label>
          Einde
          <input type="time" value={form.end_time || ''} onChange={(e) => onChange(f => ({ ...f, end_time: e.target.value }))} />
        </label>
      </div>
      <div>
        <button className={styles.saveBtn} onClick={onSave}>Opslaan</button>
        <button className={styles.cancelBtn} onClick={onCancel}>Annuleer</button>
      </div>
    </div>
  );
}
