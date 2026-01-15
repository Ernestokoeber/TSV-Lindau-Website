
// =========================
// Slider Steuerung
// =========================

// Warten bis alles geladen ist
document.addEventListener('DOMContentLoaded', () => {

    const track = document.getElementById('secTrack'); // Container mit allen Slides
    const prevBtn = document.getElementById('secPrev'); // Linker Pfeil
    const nextBtn = document.getElementById('secNext'); // Rechter Pfeil

    if (!track || !prevBtn || !nextBtn) {
        console.error('Slider-Elemente nicht gefunden');
        return;
    }

    let index = 0; // Start bei Slide 0
    const maxIndex = track.children.length - 1;

    // Funktion zum Aktualisieren der Position
    function updateSlider() {
        track.style.transform = `translateX(-${index * 100}%)`;
    }

    // Klick-Events
    prevBtn.addEventListener('click', () => {
        index = Math.max(0, index - 1);
        updateSlider();
    });

    nextBtn.addEventListener('click', () => {
        index = Math.min(maxIndex, index + 1);
        updateSlider();
    });

    // Swipe-Unterstützung für Touch-Geräte
    let startX = 0;

    track.addEventListener('touchstart', e => {
        startX = e.touches[0].clientX;
    });

    track.addEventListener('touchend', e => {
        const diff = e.changedTouches[0].clientX - startX;
        if (diff > 50) {
            prevBtn.click();
        } else if (diff < -50) {
            nextBtn.click();
        }
    });

});

// =========================
// Tabelle automatisch laden
// =========================

const API_URL = '/api/standings'; // HIER die URL zur JSON-Datenquelle eintragen

// Funktion zum Mapping der Felder (flexibel für verschiedene Quellen)
function mapRow(r, i) {
    const rank = r.rank ?? r.rang ?? (i + 1);
    const name = r.name ?? r.team ?? r.teamName ?? '';
    const games = r.games ?? r.spiele ?? '';
    const wins = r.wins ?? r.s ?? '';
    const losses = r.losses ?? r.n ?? '';
    const points = r.points ?? r.punkte ?? '';
    const gf = r.goalsFor ?? r.gf ?? '';
    const ga = r.goalsAgainst ?? r.ga ?? '';
    const baskets = r.baskets ?? (gf && ga ? `${gf}:${ga}` : '');
    return { rank, name, games, wins, losses, points, baskets };
}

// Funktion zum Einfügen der Tabellenzeilen
function renderTable(tbody, rows) {
    tbody.innerHTML = '';
    rows.forEach((row, i) => {
        const { rank, name, games, wins, losses, points, baskets } = mapRow(row, i);
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${rank}</td>
            <td>${name}</td>
            <td>${games}</td>
            <td>${wins}</td>
            <td>${losses}</td>
            <td><strong>${points}</strong></td>
            <td>${baskets}</td>
        `;
        tbody.appendChild(tr);
    });
}

// Funktion zum Laden der Tabelle in alle Slides
async function loadStandings() {
    const bodies = document.querySelectorAll('.js-standings-body');
    const loaders = document.querySelectorAll('.standings-loading');
    const errors = document.querySelectorAll('.standings-error');

    // Loader anzeigen
    loaders.forEach(el => el.hidden = false);
    errors.forEach(el => el.hidden = true);

    try {
        const res = await fetch(API_URL, { cache: 'no-store' });
        if (!res.ok) throw new Error('HTTP ' + res.status);

        const data = await res.json();
        const rows = Array.isArray(data) ? data :
                     Array.isArray(data.table) ? data.table :
                     Array.isArray(data.rows) ? data.rows : [];

        // Tabellen in allen Slides füllen
        bodies.forEach(tbody => renderTable(tbody, rows));

    } catch (err) {
        errors.forEach(el => el.hidden = false);
        console.error('Fehler beim Laden der Tabelle:', err);
    } finally {
        loaders.forEach(el => el.hidden = true);
    }
}

// Tabelle laden, sobald DOM bereit
document.addEventListener('DOMContentLoaded', loadStandings);

/* ============================================
   LIVE-SPIELPLAN (Top-Leiste zwischen Pfeilen)
   ============================================ */

// 1) Deine Spiele – Beispielstruktur (ersetzen/erweitern)

const fixtures = [
  {
    datetime: '2025-10-18T18:00:00',
    matchday: 'BK • 1. Spieltag',
    home: { name: 'DJK Kaufbeuren', logo: 'DJKKaufbeurenLogo.png' },
    away: { name: 'TSV Lindau', logo: 'TSVLindauLogo.png' },
    score: '71 : 45', live: false
  },
  {
    datetime: '2025-11-08T15:30:00',
    matchday: 'BK • 3. Spieltag',
    home: { name: 'TSV Sonthofen 2', logo: 'TSVSonthofenLogo.png' },
    away: { name: 'TSV Lindau', logo: 'TSVLindauLogo.png' },
    score: '58 : 62', live: false
  },
  {
    datetime: '2025-11-16T17:00:00',
    matchday: 'BK • 4. Spieltag',
    home: { name: 'TSV Lindau', logo: 'TSVLindauLogo.png' },
    away: { name: 'TV Isny', logo: 'TVIsnyLogo.png' },
    score: '66 : 59', live: false
  },
  {
    datetime: '2025-11-23T17:00:00',
    matchday: 'BK • 5. Spieltag',
    home: { name: 'TSV Lindau', logo: 'TSVLindauLogo.png'},
    away: { name: 'VFL Buchloe 2', logo: 'VFLBuchloeLogo.png'},
    score: '– : –', live: false
  },
  {
    datetime: '2025-11-30T15:30:00',
    matchday: 'BK • 6. Spieltag',
    home: { name: 'TSV Ottobeuren 2', logo: 'TSVOttobeurenLogo.png'},
    away: { name: 'TSV Lindau', logo: 'TSVLindauLogo.png'},
    score: '– : –', live: false
  },
  {
    datetime: '2025-12-07T17:00:00',
    matchday: 'BK • 7. Spieltag',
    home: { name: 'TSV Lindau', logo: 'TSVLindauLogo.png'},
    away: { name: 'BG Illertal 3', logo: 'BGIllertalLogo.png'},
    score: '– : –', live: false
  },
];

// 2) Pfad für Logos – passe an deine Struktur an
//    Wenn du die beiden Dateien im Ordner "assets/logos" hast, setze:
//    Falls die Dateien direkt im Wurzelverzeichnis liegen, setze: const LOGO_BASE = '';
const depth = window.location.pathname.split('/').length - 2;
const LOGO_BASE = '../'.repeat(depth) + 'assets/logos/';

function logoUrl(file) {
  if (!file) return '';
  // Absolute URLs unverändert lassen
  if (/^https?:\/\//i.test(file)) return file;
  return LOGO_BASE + file;
}

// 3) Elemente aus dem DOM holen
const track   = document.getElementById('live-fixtures');
const vp      = document.querySelector('.lp-viewport');
const prevBtn = document.querySelector('.lp-prev');
const nextBtn = document.querySelector('.lp-next');

// 4) Datum/Zeit Formatierer (Deutsch)
const dfDate = new Intl.DateTimeFormat('de-DE', { weekday: 'short', day: '2-digit', month: '2-digit' });
const dfTime = new Intl.DateTimeFormat('de-DE', { hour: '2-digit', minute: '2-digit' });

// 5) Render-Funktion
function renderFixtures(list) {
  track.innerHTML = '';
  list.forEach((g) => {
    const dt = new Date(g.datetime);
    const card = document.createElement('div');
    card.className = 'lp-card';
    card.innerHTML = `
      <div class="lp-meta">
        <div class="lp-date">${dfDate.format(dt).replace('.', '')}</div>
        <div class="lp-time">${dfTime.format(dt)} Uhr</div>
        <div class="lp-md">${g.matchday ?? ''}</div>
      </div>

      <div class="lp-team lp-home">
        <div class="lp-logo"><img alt="" src="${logoUrl(g.home?.logo)}"></div>
        <div class="lp-name">${g.home?.name ?? ''}</div>
      </div>

      <div class="lp-score">${g.score || '– : –'}</div>

      <div class="lp-team lp-away">
        <div class="lp-logo"><img alt="" src="${logoUrl(g.away?.logo)}"></div>
        <div class="lp-name">${g.away?.name ?? ''}</div>
      </div>
    `;
    track.appendChild(card);
  });
}

// 6) Scroll-Logik (Pfeile, Wheel, Drag)
function getStep() {
  // Ein Schritt = Breite einer Karte + Lücke
  const first = track.querySelector('.lp-card');
  if (!first) return vp.clientWidth * 0.8;
  const style = getComputedStyle(track);
  const gap = parseInt(style.columnGap || style.gap || 14, 10);
  return first.getBoundingClientRect().width + gap;
}

function scrollByStep(dir = 1) {
  vp.scrollBy({ left: getStep() * dir, behavior: 'smooth' });
}

prevBtn?.addEventListener('click', () => scrollByStep(-1));
nextBtn?.addEventListener('click', () => scrollByStep(1));

// Maus-Wheel horizontal
vp.addEventListener('wheel', (e) => {
  if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
    vp.scrollLeft += e.deltaY;
    e.preventDefault();
  }
}, { passive: false });

// Drag/Swipe
let isDown = false, startX = 0, startScroll = 0;
vp.addEventListener('pointerdown', (e) => {
  isDown = true; startX = e.clientX; startScroll = vp.scrollLeft;
  vp.setPointerCapture(e.pointerId);
});
vp.addEventListener('pointermove', (e) => {
  if (!isDown) return;
  const dx = e.clientX - startX;
  vp.scrollLeft = startScroll - dx;
});
vp.addEventListener('pointerup', () => { isDown = false; });
vp.addEventListener('pointercancel', () => { isDown = false; });

// Keyboard (links/rechts)
vp.setAttribute('tabindex', '0');
vp.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft')  { scrollByStep(-1); e.preventDefault(); }
  if (e.key === 'ArrowRight') { scrollByStep(1);  e.preventDefault(); }
});

// 7) Init
renderFixtures(fixtures);

function getStep() {
  const first = track.querySelector('.lp-card');
  if (!first) return vp.clientWidth * 0.8;
  return first.getBoundingClientRect().width + 14; // Breite + Abstand
}

function scrollByStep(dir = 1) {
  vp.scrollBy({ left: getStep() * dir, behavior: 'smooth' });
}

prevBtn?.addEventListener('click', () => scrollByStep(-1));
nextBtn?.addEventListener('click', () => scrollByStep(1));

// Adresse kopieren
document.querySelectorAll('.hi-copy').forEach(btn=>{
  btn.addEventListener('click', async ()=>{
    const txt = btn.getAttribute('data-copy') || '';
    try{
      await navigator.clipboard.writeText(txt);
      const old = btn.textContent;
      btn.textContent = '✓ Adresse kopiert';
      setTimeout(()=> btn.textContent = old, 1500);
    }catch{
      alert('Adresse: ' + txt);
    }
  });
});
