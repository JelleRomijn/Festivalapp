'use client';

import { useState, useEffect, useCallback } from 'react';
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

const EMPTY_ARTIST = { name: '', category: 'headliner', genre: '', description_nl: '', description_en: '', image_url: '' };

export default function AdminPage() {
  const [tab, setTab] = useState('artists');

  const [artists,  setArtists]  = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [stages,   setStages]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [toast,    setToast]    = useState(null);

  const [editingArtist, setEditingArtist] = useState(null);
  const [artistForm,    setArtistForm]    = useState(EMPTY_ARTIST);
  const [catFilter,     setCatFilter]     = useState('all');

  const [editingSlot, setEditingSlot] = useState(null);
  const [slotForm,    setSlotForm]    = useState({});
  const [scheduleDay, setScheduleDay] = useState(1);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [a, s, l] = await Promise.all([
        fetch(`${API}/admin.php?resource=artists`).then(r => r.json()),
        fetch(`${API}/admin.php?resource=schedule`).then(r => r.json()),
        fetch(`${API}/admin.php?resource=locations`).then(r => r.json()),
      ]);
      setArtists(Array.isArray(a) ? a : []);
      setSchedule(Array.isArray(s) ? s : []);
      setStages(Array.isArray(l) ? l : []);
    } catch {
      showToast('Kon data niet laden', 'error');
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // ── Artiesten ──────────────────────────────────────────
  const startEditArtist = (artist) => {
    setEditingArtist(artist.id);
    setArtistForm({ ...artist });
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

  // ── Afgeleide data ─────────────────────────────────────
  const visibleArtists = catFilter === 'all'
    ? artists
    : artists.filter(a => a.category === catFilter);

  const daySlots       = schedule.filter(s => s.day === scheduleDay);
  const slotsByStage   = Object.fromEntries(
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
        <h1>Programma beheer</h1>
        <p className={styles.warning}>Intern gebruik — niet publiek delen</p>
      </div>

      {toast && (
        <div className={`${styles.toast} ${styles[toast.type]}`}>{toast.msg}</div>
      )}

      {/* ── Tabs ── */}
      <div className={styles.tabs}>
        <button
          className={tab === 'artists' ? styles.active : ''}
          onClick={() => setTab('artists')}
        >
          Artiesten ({artists.length})
        </button>
        <button
          className={tab === 'schedule' ? styles.active : ''}
          onClick={() => setTab('schedule')}
        >
          Programma ({schedule.length} slots)
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

          <table className={styles.table}>
            <thead>
              <tr>
                <th>Naam</th>
                <th>Type</th>
                <th>Genre</th>
                <th>Omschrijving (NL)</th>
                <th>Acties</th>
              </tr>
            </thead>
            <tbody>
              {/* Nieuw artiest rij */}
              {editingArtist === 'new' && (
                <ArtistEditRow
                  form={artistForm}
                  onChange={setArtistForm}
                  onSave={saveArtist}
                  onCancel={cancelEditArtist}
                  styles={styles}
                />
              )}

              {visibleArtists.map(artist =>
                editingArtist === artist.id ? (
                  <ArtistEditRow
                    key={artist.id}
                    form={artistForm}
                    onChange={setArtistForm}
                    onSave={saveArtist}
                    onCancel={cancelEditArtist}
                    styles={styles}
                  />
                ) : (
                  <tr key={artist.id}>
                    <td className={styles.artistName}>{artist.name}</td>
                    <td>
                      <span className={`${styles.badge} ${styles[artist.category]}`}>
                        {artist.category}
                      </span>
                    </td>
                    <td className={styles.muted}>{artist.genre}</td>
                    <td className={styles.muted}>{artist.description_nl}</td>
                    <td>
                      <button className={styles.editBtn} onClick={() => startEditArtist(artist)}>
                        Bewerken
                      </button>
                      <button className={styles.deleteBtn} onClick={() => deleteArtist(artist.id, artist.name)}>
                        Verwijder
                      </button>
                    </td>
                  </tr>
                )
              )}
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

          {/* Nieuw slot form */}
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

          {/* Per podium */}
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
    </div>
  );
}

// ── Sub-componenten ────────────────────────────────────────

function ArtistEditRow({ form, onChange, onSave, onCancel, styles }) {
  const set = (field) => (e) => onChange(f => ({ ...f, [field]: e.target.value }));
  return (
    <tr className={styles.editRow}>
      <td>
        <input value={form.name || ''} onChange={set('name')} placeholder="Naam artiest" />
      </td>
      <td>
        <select value={form.category || 'headliner'} onChange={set('category')}>
          {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
      </td>
      <td>
        <input value={form.genre || ''} onChange={set('genre')} placeholder="Genre" />
      </td>
      <td>
        <input value={form.description_nl || ''} onChange={set('description_nl')} placeholder="Omschrijving NL" />
      </td>
      <td>
        <button className={styles.saveBtn} onClick={onSave}>Opslaan</button>
        <button className={styles.cancelBtn} onClick={onCancel}>Annuleer</button>
      </td>
    </tr>
  );
}

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

function SlotForm({ form, onChange, artists, stages, onSave, onCancel, styles }) {
  const set = (field) => (e) => onChange(f => ({ ...f, [field]: e.target.type === 'select-one' && e.target.value !== '' ? +e.target.value : e.target.value }));
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
          <input type="time" value={form.start_time || ''} onChange={set('start_time')} />
        </label>
        <label>
          Einde
          <input type="time" value={form.end_time || ''} onChange={set('end_time')} />
        </label>
      </div>
      <div>
        <button className={styles.saveBtn} onClick={onSave}>Opslaan</button>
        <button className={styles.cancelBtn} onClick={onCancel}>Annuleer</button>
      </div>
    </div>
  );
}
