(() => {
'use strict';

/* ---------- helpers ---------- */
const $ = (s, r = document) => r.querySelector(s);
function h(tag, props, ...kids) {
  const el = document.createElement(tag);
  if (props) for (const [k, v] of Object.entries(props)) {
    if (v == null || v === false) continue;
    if (k === 'class') el.className = v;
    else if (k === 'style') el.style.cssText = v;
    else if (k === 'html') el.innerHTML = v;
    else if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
    else el.setAttribute(k, v === true ? '' : v);
  }
  for (const k of kids.flat(Infinity)) {
    if (k == null || k === false) continue;
    el.append(k.nodeType ? k : document.createTextNode(String(k)));
  }
  return el;
}
const svg = (s) => h('span', { html: s, style: 'display:contents' });

const store = {
  get(k, d) { try { const v = localStorage.getItem('gauntlet.' + k); return v ? JSON.parse(v) : d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem('gauntlet.' + k, JSON.stringify(v)); } catch { /* storage blocked */ } }
};

function hashStr(s) {
  let h1 = 1779033703 ^ s.length;
  for (let i = 0; i < s.length; i++) { h1 = Math.imul(h1 ^ s.charCodeAt(i), 3432918353); h1 = h1 << 13 | h1 >>> 19; }
  h1 = Math.imul(h1 ^ h1 >>> 16, 2246822507); h1 = Math.imul(h1 ^ h1 >>> 13, 3266489909);
  return (h1 ^= h1 >>> 16) >>> 0;
}
function mulberry32(a) {
  return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
}
const rngFor = (seed, key) => mulberry32(hashStr(seed + '|' + key));
function shuffle(rng, arr) { for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; } return arr; }

function fmt(ms) {
  if (ms == null || !isFinite(ms)) return '–';
  const neg = ms < 0; ms = Math.abs(ms);
  const m = Math.floor(ms / 60000), s = Math.floor(ms / 1000) % 60, cs = Math.floor(ms / 10) % 100;
  return (neg ? '−' : '') + (m ? m + ':' + String(s).padStart(2, '0') : s) + '.' + String(cs).padStart(2, '0');
}
const fmtDelta = (ms) => (ms > 0 ? '+' : ms < 0 ? '−' : '±') + (Math.abs(ms) / 1000).toFixed(1);
const todayStr = () => { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
const prettyDate = (s) => new Date(s + 'T12:00:00').toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' });

function words(s) {
  return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/['\u2019`.]/g, '')
    .replace(/&/g, ' and ').replace(/\+/g, 'plus').replace(/#/g, 'sharp')
    .replace(/[^a-z0-9]+/g, ' ').trim().split(' ').filter(Boolean);
}
function key(s, strip) {
  let w = words(s);
  if (w[0] === 'the' && w.length > 1) w = w.slice(1);
  w = w.map((x) => (x === 'st' ? 'saint' : x));
  if (strip) { const f = w.filter((x) => !strip.includes(x)); if (f.length) w = f; }
  return w.join('');
}

let toastTimer;
function toast(msg) {
  let t = $('.toast');
  if (!t) { t = h('div', { class: 'toast', role: 'status' }); document.body.append(t); }
  t.textContent = msg; t.hidden = false;
  clearTimeout(toastTimer); toastTimer = setTimeout(() => { t.hidden = true; }, 1600);
}
function shake(el) { el.classList.remove('shake'); void el.offsetWidth; el.classList.add('shake'); }

function openModal(title, body) {
  const close = () => { m.remove(); document.removeEventListener('keydown', onKey, true); };
  const onKey = (e) => { if (e.key === 'Escape') { e.stopPropagation(); close(); } };
  const m = h('div', { class: 'modal', onclick: (e) => { if (e.target === m) close(); } },
    h('div', { class: 'card', role: 'dialog', 'aria-modal': 'true', 'aria-label': title },
      h('button', { class: 'iconbtn modal-close', 'aria-label': 'Close', onclick: close }, svg(ICON.close)),
      h('h2', null, title), body));
  document.addEventListener('keydown', onKey, true);
  document.body.append(m);
  return close;
}

/* ---------- icons ---------- */
const S = (inner) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;
const ICON = {
  word: S('<rect x="2" y="8" width="6" height="8" rx="1.2"/><rect x="9" y="8" width="6" height="8" rx="1.2" fill="#a6e4b6"/><rect x="16" y="8" width="6" height="8" rx="1.2" fill="#fdf0b4"/>'),
  shape: S('<path d="M5 6.5 9 4l3 2 4-1 3 3-1 4 2 3-3 4-4-1-3 2-3-3-2-4 1-3z" fill="#ecd3fa"/>'),
  globe: S('<circle cx="12" cy="12" r="9" fill="#e8eef8"/><path d="M3 12h18"/><path d="M12 3c3 3.2 3 14.8 0 18M12 3c-3 3.2-3 14.8 0 18"/><circle cx="16.5" cy="8.5" r="2" fill="#f0532d" stroke="none"/>'),
  cryptic: S('<rect x="2" y="7" width="20" height="10" rx="1.5"/><path d="M7 7v10M12 7v10M17 7v10"/><rect x="2.8" y="7.8" width="3.4" height="8.4" fill="#ecd3fa" stroke="none"/>'),
  rare: S('<path d="M6 4h12l4 5-10 11L2 9z" fill="#a6e4b6"/><path d="M2 9h20M9 4l3 16 3-16"/>'),
  back: S('<path d="M19 12H5M11 6l-6 6 6 6"/>'),
  info: S('<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>'),
  close: S('<path d="M6 6l12 12M18 6 6 18"/>'),
  del: S('<path d="M9 6h11v12H9l-6-6z"/><path d="m12 10 4 4M16 10l-4 4"/>'),
  erase: S('<path d="M4 15c3-5 5 2 8-3s5 1 8-4"/><path d="M5 19c3-4 6 1 9-3"/>'),
  arrow: S('<path d="M12 20V4M6 10l6-6 6 6"/>'),
  check: S('<path d="m5 12 5 5 9-10"/>'),
  plus: S('<path d="M12 5v14M5 12h14"/>'),
  minus: S('<path d="M5 12h14"/>'),
  flag: S('<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>'),
  travel: S('<circle cx="5" cy="18" r="2.6" fill="#ecd3fa"/><circle cx="19" cy="6" r="2.6" fill="#ecd3fa"/><path d="M7.5 17c4 0 3-5 6-6s4-2 3.5-3"/><rect x="10" y="9.5" width="4" height="4" rx="1" fill="#a6e4b6"/>')
};

/* ---------- games registry ---------- */
const GAMES = [
  { key: 'word', name: 'Five Letters', like: 'Wordle-style', blurb: 'Guess the five-letter word in six tries.', mount: mountWord },
  { key: 'shape', name: 'Silhouette', like: 'Worldle-style', blurb: 'Name the country from its outline. Six guesses, with distance and direction.', mount: mountShape, geo: true },
  { key: 'globe', name: 'Hot & Cold', like: 'Globle-style', blurb: 'Find the mystery country. Every guess lights the globe up by how close it is.', mount: mountGlobe, geo: true },
  { key: 'travel', name: 'Border Hop', like: 'Travle-style', blurb: 'Get from one country to another by naming the countries in between.', mount: mountTravel, geo: true },
  { key: 'cryptic', name: 'One Clue', like: 'Minute Cryptic-style', blurb: 'Solve one cryptic crossword clue, with a full hint ladder.', mount: mountCryptic },
  { key: 'rare', name: 'Rare Pick', like: 'Krillion-style', blurb: 'Five quick prompts. The rarer your valid answer, the more it scores.', mount: mountRare }
];
const G = Object.fromEntries(GAMES.map((g) => [g.key, g]));
const PENALTY_TEXT = {
  word: 'Miss the word: +30s',
  shape: 'Miss the country: +30s',
  globe: 'Give up: +60s',
  travel: 'Run out of guesses: +30s. Give up: +60s',
  cryptic: 'Each hint or letter: +10s. Reveal: +60s',
  rare: 'Every 10 points: −1s'
};

/* ---------- geography ---------- */
const RENAME = { 'United States of America': 'United States', 'Dem. Rep. Congo': 'DR Congo', 'Congo': 'Republic of the Congo', 'Central African Rep.': 'Central African Republic', 'Bosnia and Herz.': 'Bosnia and Herzegovina', 'S. Sudan': 'South Sudan', 'eSwatini': 'Eswatini', 'Dominican Rep.': 'Dominican Republic', 'Eq. Guinea': 'Equatorial Guinea', 'Solomon Is.': 'Solomon Islands', 'Marshall Is.': 'Marshall Islands', 'St. Vin. and Gren.': 'Saint Vincent and the Grenadines', 'St. Kitts and Nevis': 'Saint Kitts and Nevis', 'Antigua and Barb.': 'Antigua and Barbuda', 'Macedonia': 'North Macedonia', "Côte d'Ivoire": 'Ivory Coast', 'São Tomé and Principe': 'Sao Tome and Principe', 'Timor-Leste': 'East Timor', 'Cabo Verde': 'Cape Verde', 'W. Sahara': 'Western Sahara', 'Falkland Is.': 'Falkland Islands', 'Faeroe Is.': 'Faroe Islands', 'N. Mariana Is.': 'Northern Mariana Islands', 'U.S. Virgin Is.': 'US Virgin Islands', 'British Virgin Is.': 'British Virgin Islands', 'Cayman Is.': 'Cayman Islands', 'Turks and Caicos Is.': 'Turks and Caicos Islands', 'Cook Is.': 'Cook Islands', 'Pitcairn Is.': 'Pitcairn Islands', 'N. Cyprus': 'Northern Cyprus', 'Fr. Polynesia': 'French Polynesia', 'Wallis and Futuna Is.': 'Wallis and Futuna', 'St. Pierre and Miquelon': 'Saint Pierre and Miquelon', 'St-Martin': 'Saint Martin', 'St-Barthélemy': 'Saint Barthelemy', 'S. Geo. and the Is.': 'South Georgia', 'Br. Indian Ocean Ter.': 'British Indian Ocean Territory', 'Fr. S. Antarctic Lands': 'French Southern Lands', 'Heard I. and McDonald Is.': 'Heard and McDonald Islands', 'Indian Ocean Ter.': 'Christmas Island', 'Ashmore and Cartier Is.': 'Ashmore and Cartier Islands', 'Åland': 'Aland Islands', 'Curaçao': 'Curacao', 'Vatican': 'Vatican City' };
const ALIAS = { 'United States': ['usa', 'us', 'america', 'united states of america'], 'United Kingdom': ['uk', 'britain', 'great britain', 'england', 'scotland', 'wales'], 'United Arab Emirates': ['uae', 'emirates'], 'DR Congo': ['drc', 'democratic republic of the congo', 'congo kinshasa', 'zaire'], 'Republic of the Congo': ['congo', 'congo brazzaville'], 'Czechia': ['czech republic'], 'Myanmar': ['burma'], 'Eswatini': ['swaziland'], 'Ivory Coast': ['cote divoire'], 'East Timor': ['timor leste'], 'Cape Verde': ['cabo verde'], 'North Macedonia': ['macedonia'], 'Netherlands': ['holland'], 'South Korea': ['korea', 'republic of korea'], 'North Korea': ['dprk'], 'Bosnia and Herzegovina': ['bosnia'], 'Central African Republic': ['car'], 'Vatican City': ['holy see', 'vatican'], 'Turkey': ['turkiye'], 'Russia': ['russian federation'], 'Laos': ['lao'], 'Gambia': ['the gambia'], 'Bahamas': ['the bahamas'], 'China': ['prc'] };
const SKIP = new Set(['Siachen Glacier', 'Ashmore and Cartier Is.', 'Indian Ocean Ter.', 'Heard I. and McDonald Is.', 'Br. Indian Ocean Ter.']);
const NON_TARGET = new Set(['Antarctica', 'Somaliland', 'N. Cyprus', 'W. Sahara', 'Kosovo', 'Taiwan', 'Palestine', 'N. Mariana Is.', 'U.S. Virgin Is.', 'Guam', 'American Samoa', 'Puerto Rico', 'S. Geo. and the Is.', 'Saint Helena', 'Pitcairn Is.', 'Anguilla', 'Falkland Is.', 'Cayman Is.', 'Bermuda', 'British Virgin Is.', 'Turks and Caicos Is.', 'Montserrat', 'Jersey', 'Guernsey', 'Isle of Man', 'Niue', 'Cook Is.', 'Aruba', 'Curaçao', 'St. Pierre and Miquelon', 'Wallis and Futuna Is.', 'St-Martin', 'St-Barthélemy', 'Fr. Polynesia', 'New Caledonia', 'Fr. S. Antarctic Lands', 'Åland', 'Greenland', 'Faeroe Is.', 'Macao', 'Hong Kong', 'Norfolk Island', 'Sint Maarten']);

let GEO = null, geoPromise = null;
function loadGeo() {
  if (!geoPromise) {
    geoPromise = fetch('countries.json').then((r) => { if (!r.ok) throw new Error('map ' + r.status); return r.json(); }).then(buildGeo)
      .catch((e) => { geoPromise = null; throw e; });
  }
  return geoPromise;
}
function polyArea(p) { let a = d3.geoArea({ type: 'Polygon', coordinates: p }); if (a > 2 * Math.PI) a = 4 * Math.PI - a; return a; }
function mainShape(g) {
  if (!g || g.type !== 'MultiPolygon') return g;
  const polys = g.coordinates.map((p) => ({ p, a: polyArea(p), c: d3.geoCentroid({ type: 'Polygon', coordinates: p }) }));
  polys.sort((a, b) => b.a - a.a);
  const c0 = polys[0].c;
  const keep = polys.filter((q) => d3.geoDistance(q.c, c0) * 6371 < 2500);
  return { type: 'MultiPolygon', coordinates: keep.map((q) => q.p) };
}
function samplePts(g) {
  const all = [];
  if (!g) return all;
  const push = (ring) => { for (const p of ring) all.push(p); };
  if (g.type === 'Polygon') g.coordinates.forEach(push); else g.coordinates.forEach((poly) => poly.forEach(push));
  const step = Math.max(1, Math.ceil(all.length / 500)), r = Math.PI / 180, out = [];
  for (let k = 0; k < all.length; k += step) { const [lo, la] = all[k]; out.push([la * r, lo * r, Math.cos(la * r)]); }
  return out;
}
function buildGeo(topo) {
  const geoms = topo.objects.countries.geometries;
  const feats = topojson.feature(topo, topo.objects.countries).features;
  const nb = topojson.neighbors(geoms);
  const all = feats.map((f, i) => {
    const raw = f.properties.name, name = RENAME[raw] || raw, main = mainShape(f.geometry);
    return {
      i, raw, name, feat: f, main, c: main ? d3.geoCentroid(main) : [0, 0], pts: samplePts(f.geometry),
      nb: new Set(nb[i]), area: f.geometry ? d3.geoArea(f) : 0,
      skip: SKIP.has(raw) || !f.geometry,
      target: !SKIP.has(raw) && !NON_TARGET.has(raw) && !!f.geometry,
      keys: [...new Set([key(name), key(raw), ...(ALIAS[name] || []).map((a) => key(a))])]
    };
  });
  const guessable = all.filter((c) => !c.skip && c.raw !== 'Antarctica').sort((a, b) => a.name.localeCompare(b.name));
  GEO = { all, guessable, targets: all.filter((c) => c.target).sort((a, b) => a.name.localeCompare(b.name)) };
  return GEO;
}
function borderKm(A, B) {
  if (A.i === B.i || A.nb.has(B.i)) return 0;
  let best = Infinity;
  for (const p of A.pts) for (const q of B.pts) {
    const s = Math.sin((q[0] - p[0]) / 2) ** 2 + p[2] * q[2] * Math.sin((q[1] - p[1]) / 2) ** 2;
    if (s < best) best = s;
  }
  return 2 * 6371 * Math.asin(Math.min(1, Math.sqrt(best)));
}
function bearing(a, b) {
  const r = Math.PI / 180, p1 = a[1] * r, p2 = b[1] * r, dl = (b[0] - a[0]) * r;
  const y = Math.sin(dl) * Math.cos(p2), x = Math.cos(p1) * Math.sin(p2) - Math.sin(p1) * Math.cos(p2) * Math.cos(dl);
  return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
}

/* country picker with autocomplete */
function countryInput({ onPick, signal, placeholder }) {
  let hi = 0, matches = [];
  const input = h('input', { id: 'country-guess', type: 'text', autocomplete: 'off', autocapitalize: 'off', spellcheck: 'false', placeholder: placeholder || 'Type a country…', 'aria-label': 'Country guess' });
  const list = h('ul', { role: 'listbox', hidden: true });
  const wrap = h('div', { class: 'ac' }, input, list);
  function search() {
    const q = key(input.value);
    if (!q) { matches = []; render(); return; }
    const scored = [];
    for (const c of GEO.guessable) {
      let best = 9;
      for (const k of c.keys) { if (k === q) best = Math.min(best, 0); else if (k.startsWith(q)) best = Math.min(best, 1); else if (k.includes(q)) best = Math.min(best, 2); }
      if (best < 9) scored.push([best, c]);
    }
    scored.sort((a, b) => a[0] - b[0] || a[1].name.localeCompare(b[1].name));
    matches = scored.slice(0, 6).map((s) => s[1]); hi = 0; render();
  }
  function render() {
    list.replaceChildren(...matches.map((c, i) => h('li', { class: i === hi ? 'on' : null, role: 'option', onmousedown: (e) => { e.preventDefault(); pick(c); } }, c.name)));
    list.hidden = !matches.length;
  }
  function pick(c) { input.value = ''; matches = []; render(); onPick(c); }
  input.addEventListener('input', search, { signal });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); hi = Math.min(hi + 1, matches.length - 1); render(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); hi = Math.max(hi - 1, 0); render(); }
    else if (e.key === 'Enter') {
      e.preventDefault(); e.stopPropagation();
      if (!input.value.trim()) return;
      if (matches[hi]) pick(matches[hi]); else { toast('Pick a country from the list'); shake(input); }
    } else if (e.key === 'Escape') { input.value = ''; matches = []; render(); }
  }, { signal });
  input.addEventListener('blur', () => setTimeout(() => { list.hidden = true; }, 120), { signal });
  input.addEventListener('focus', () => { if (matches.length) list.hidden = false; }, { signal });
  return { el: wrap, input, focus: () => input.focus({ preventScroll: true }), disable() { input.disabled = true; list.hidden = true; } };
}

/* on-screen keyboard */
function keyboard(onKey) {
  const keys = {};
  const rows = ['QWERTYUIOP', 'ASDFGHJKL', '>ZXCVBNM<'];
  const el = h('div', { class: 'kb', 'aria-label': 'Keyboard' }, rows.map((r) => h('div', { class: 'kb-row' }, [...r].map((ch) => {
    const k = ch === '>' ? 'ENTER' : ch === '<' ? 'BACK' : ch;
    const b = h('button', {
      class: 'key' + (k.length > 1 ? ' wide' : ''), tabindex: '-1', type: 'button', 'aria-label': k === 'BACK' ? 'Delete' : k === 'ENTER' ? 'Enter' : k,
      onmousedown: (e) => e.preventDefault(), onclick: () => onKey(k)
    }, k === 'BACK' ? svg(ICON.del) : k === 'ENTER' ? 'enter' : k);
    keys[k] = b; return b;
  }))));
  return { el, setState(map) { for (const [k, s] of Object.entries(map)) if (keys[k]) { keys[k].classList.remove('hit', 'near', 'miss'); keys[k].classList.add(s); } } };
}
function physicalKeys(signal, onKey) {
  document.addEventListener('keydown', (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey || e.defaultPrevented) return;
    if (e.target && e.target.closest && e.target.closest('input, textarea, .modal')) return;
    if ($('.modal')) return;
    if (e.key === 'Enter') { e.preventDefault(); onKey('ENTER'); }
    else if (e.key === 'Backspace') { e.preventDefault(); onKey('BACK'); }
    else if (/^[a-zA-Z]$/.test(e.key)) onKey(e.key.toUpperCase());
  }, { signal });
}

function stageTitle(g, extra) {
  return h('div', { class: 'stage-title' }, h('h2', null, g.name.toLowerCase()), h('small', null, g.like), extra);
}

/* ---------- game: Five Letters ---------- */
function mountWord(ctx) {
  const { answers, valid } = window.WORDS;
  const ans = ctx.pick(answers, (w) => w).toUpperCase();
  const tiles = [], rowEls = [];
  let row = 0, cur = '', over = false;
  const keyState = {};
  const board = h('div', { class: 'wboard' });
  for (let r = 0; r < 6; r++) {
    const re = h('div', { class: 'wrow' }); tiles[r] = [];
    for (let c = 0; c < 5; c++) { const t = h('div', { class: 'wtile' }); re.append(t); tiles[r].push(t); }
    rowEls.push(re); board.append(re);
  }
  const kb = keyboard(press);
  ctx.el.append(stageTitle(G.word), board, kb.el);
  physicalKeys(ctx.signal, press);

  function paint() { for (let c = 0; c < 5; c++) { tiles[row][c].textContent = cur[c] || ''; tiles[row][c].classList.toggle('filled', !!cur[c]); } }
  function press(k) {
    if (over) return;
    if (k === 'ENTER') submit();
    else if (k === 'BACK') { cur = cur.slice(0, -1); paint(); }
    else if (/^[A-Z]$/.test(k) && cur.length < 5) { cur += k; paint(); }
  }
  function score(g, a) {
    const res = Array(5).fill('miss'), left = {};
    for (let i = 0; i < 5; i++) { if (g[i] === a[i]) res[i] = 'hit'; else left[a[i]] = (left[a[i]] || 0) + 1; }
    for (let i = 0; i < 5; i++) if (res[i] !== 'hit' && left[g[i]] > 0) { res[i] = 'near'; left[g[i]]--; }
    return res;
  }
  function submit() {
    if (cur.length < 5) { shake(rowEls[row]); toast('Not enough letters'); return; }
    if (!valid.has(cur.toLowerCase())) { shake(rowEls[row]); toast('Not in word list'); return; }
    const res = score(cur, ans), r = row, guess = cur;
    res.forEach((s, c) => setTimeout(() => tiles[r][c].classList.add(s), c * 80));
    const rank = { miss: 0, near: 1, hit: 2 };
    res.forEach((s, c) => { const L = guess[c]; if (!keyState[L] || rank[s] > rank[keyState[L]]) keyState[L] = s; });
    setTimeout(() => kb.setState(keyState), 420);
    if (guess === ans) { over = true; setTimeout(() => ctx.done({ status: 'solved', summary: `${ans} in ${r + 1}/6` }), 650); return; }
    row++; cur = '';
    if (row === 6) { over = true; setTimeout(() => { toast(ans); ctx.done({ status: 'failed', penalty: 30, summary: `Missed: ${ans}` }); }, 650); }
  }
}

/* ---------- game: Silhouette ---------- */
function mountShape(ctx) {
  const T = ctx.pick(GEO.targets, (c) => c.name);
  const W = 360, H = 260;
  const proj = d3.geoAzimuthalEqualArea().rotate([-T.c[0], -T.c[1]]).fitExtent([[14, 14], [W - 14, H - 14]], T.main);
  const d = d3.geoPath(proj)(T.main);
  const sil = h('div', { class: 'sil card' }, h('div', { html: `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Outline of the mystery country"><path d="${d}"/></svg>`, style: 'width:100%;display:grid;justify-items:center' }));
  const slots = [], guessed = new Set();
  const list = h('div', { class: 'guesses' });
  for (let i = 0; i < 6; i++) { const s = h('div', { class: 'g' }, h('span', { class: 'nm muted' }, ''), h('span', { class: 'km' }), h('span'), h('span', { class: 'pc' })); slots.push(s); list.append(s); }
  let n = 0, over = false;
  const picker = countryInput({ onPick: guess, signal: ctx.signal });
  ctx.el.append(stageTitle(G.shape, h('small', null, `${GEO.targets.length} countries`)), sil, list, picker.el);
  setTimeout(picker.focus, 50);

  function guess(C) {
    if (over) return;
    if (guessed.has(C.i)) { toast('Already guessed'); return; }
    guessed.add(C.i);
    const win = C.i === T.i;
    const km = win ? 0 : Math.round(d3.geoDistance(C.c, T.c) * 6371);
    const pct = Math.round(Math.max(0, 1 - km / 20000) * 100);
    const s = slots[n];
    s.className = 'g full' + (win ? ' win' : '');
    s.replaceChildren(h('span', { class: 'nm' }, C.name), h('span', { class: 'km' }, km.toLocaleString() + ' km'),
      win ? svg(ICON.check) : h('span', { html: ICON.arrow, style: `display:block;transform:rotate(${bearing(C.c, T.c)}deg)`, 'aria-label': 'direction' }),
      h('span', { class: 'pc' }, pct + '%'));
    n++;
    if (win) { over = true; picker.disable(); reveal(); setTimeout(() => ctx.done({ status: 'solved', summary: `${T.name} in ${n}/6` }), 500); }
    else if (n === 6) { over = true; picker.disable(); reveal(); setTimeout(() => ctx.done({ status: 'failed', penalty: 30, summary: `Missed: ${T.name}` }), 500); }
  }
  function reveal() { sil.append(h('div', { class: 'reveal-name' }, T.name)); }
}

/* ---------- game: Hot & Cold ---------- */
const HEAT = ['#8a0f12', '#e2452a', '#fb923c', '#fcd34d', '#fff7d6'];
function heat(km) { const t = Math.min(km, 12000) / 12000; return d3.interpolateRgbBasis(HEAT)(Math.pow(t, 0.55)); }
function mountGlobe(ctx) {
  const T = ctx.pick(GEO.targets, (c) => c.name);
  const guesses = [], colors = new Map();
  let over = false, rot = [-(ctx.rng() * 360 - 180), -15], zoom = 1, size = 400, raf = 0;
  const canvas = h('canvas', { role: 'img', 'aria-label': 'Globe. Drag to spin, scroll or use the buttons to zoom.' });
  const c2 = canvas.getContext('2d');
  const zoomBtns = h('div', { class: 'zoom' },
    h('button', { class: 'iconbtn', 'aria-label': 'Zoom in', onclick: () => { zoom = Math.min(zoom * 1.4, 10); draw(); } }, svg(ICON.plus)),
    h('button', { class: 'iconbtn', 'aria-label': 'Zoom out', onclick: () => { zoom = Math.max(zoom / 1.4, 0.8); draw(); } }, svg(ICON.minus)));
  const wrap = h('div', { class: 'globe-wrap' }, canvas, zoomBtns);
  const status = h('div', { class: 'center', style: 'margin:8px 0 12px' });
  const list = h('div', { class: 'glist' });
  const picker = countryInput({ onPick: guess, signal: ctx.signal });
  const giveUp = h('button', { class: 'pill white small', onclick: () => {
    if (over) return;
    if (giveUp.dataset.arm !== '1') { giveUp.dataset.arm = '1'; giveUp.textContent = ctx.mode === 'run' ? 'sure? +60s' : 'sure?'; return; }
    over = true; picker.disable(); colors.set(T.i, '#3fbf6f'); spinTo(T.c);
    ctx.done({ status: 'gaveup', penalty: 60, summary: `Gave up: ${T.name}` });
  } }, 'give up');
  ctx.el.append(stageTitle(G.globe), wrap, h('div', { class: 'legend' }, 'close', h('b'), 'far'), status, h('div', { class: 'rare-row' }, picker.el, giveUp), list);
  renderStatus();

  const ro = new ResizeObserver(() => { size = Math.max(200, Math.min(canvas.clientWidth || 400, 460)); const dpr = window.devicePixelRatio || 1; canvas.width = size * dpr; canvas.height = size * dpr; c2.setTransform(dpr, 0, 0, dpr, 0, 0); draw(); });
  ro.observe(canvas);
  ctx.signal.addEventListener('abort', () => { ro.disconnect(); cancelAnimationFrame(raf); });
  setTimeout(picker.focus, 50);

  const proj = d3.geoOrthographic().clipAngle(90).precision(0.6);
  const grat = d3.geoGraticule10();
  function draw() {
    proj.scale((size / 2 - 3) * zoom).translate([size / 2, size / 2]).rotate(rot);
    const path = d3.geoPath(proj, c2);
    c2.clearRect(0, 0, size, size);
    c2.beginPath(); path({ type: 'Sphere' }); c2.fillStyle = '#dce9fb'; c2.fill();
    c2.beginPath(); path(grat); c2.strokeStyle = 'rgba(18,18,18,.08)'; c2.lineWidth = 1; c2.stroke();
    for (const C of GEO.all) {
      if (!C.feat.geometry) continue;
      c2.beginPath(); path(C.feat);
      c2.fillStyle = colors.get(C.i) || '#ffffff'; c2.fill();
      c2.strokeStyle = 'rgba(18,18,18,.55)'; c2.lineWidth = 0.6; c2.stroke();
    }
    const centre = [-rot[0], -rot[1]];
    for (const [i, col] of colors) {
      const C = GEO.all[i];
      if (C.area > 0.0004 || d3.geoDistance(C.c, centre) > Math.PI / 2) continue;
      const p = proj(C.c); if (!p) continue;
      c2.beginPath(); c2.arc(p[0], p[1], 5, 0, 2 * Math.PI); c2.fillStyle = col; c2.fill(); c2.strokeStyle = '#121212'; c2.lineWidth = 1.5; c2.stroke();
    }
    c2.beginPath(); path({ type: 'Sphere' }); c2.strokeStyle = '#121212'; c2.lineWidth = 2.5; c2.stroke();
  }
  function spinTo(c) {
    cancelAnimationFrame(raf);
    const from = rot.slice(), to = [-c[0], -c[1] * 0.8];
    if (to[0] - from[0] > 180) to[0] -= 360; if (from[0] - to[0] > 180) to[0] += 360;
    const t0 = performance.now(), dur = 650;
    const step = (now) => { const t = Math.min(1, (now - t0) / dur), e = d3.easeCubicInOut(t); rot = [from[0] + (to[0] - from[0]) * e, from[1] + (to[1] - from[1]) * e]; draw(); if (t < 1) raf = requestAnimationFrame(step); };
    raf = requestAnimationFrame(step);
  }
  let drag = null;
  canvas.addEventListener('pointerdown', (e) => { drag = [e.clientX, e.clientY]; canvas.setPointerCapture(e.pointerId); cancelAnimationFrame(raf); }, { signal: ctx.signal });
  canvas.addEventListener('pointermove', (e) => {
    if (!drag) return;
    const k = 0.35 / zoom; rot[0] += (e.clientX - drag[0]) * k; rot[1] = Math.max(-90, Math.min(90, rot[1] - (e.clientY - drag[1]) * k));
    drag = [e.clientX, e.clientY]; draw();
  }, { signal: ctx.signal });
  canvas.addEventListener('pointerup', () => { drag = null; }, { signal: ctx.signal });
  canvas.addEventListener('wheel', (e) => { e.preventDefault(); zoom = Math.max(0.8, Math.min(10, zoom * (e.deltaY < 0 ? 1.15 : 1 / 1.15))); draw(); }, { signal: ctx.signal, passive: false });

  function guess(C) {
    if (over) return;
    if (guesses.some((g) => g.C.i === C.i)) { toast('Already guessed'); return; }
    const win = C.i === T.i;
    const km = win ? 0 : borderKm(C, T);
    guesses.push({ C, km, win });
    colors.set(C.i, win ? '#3fbf6f' : heat(km));
    spinTo(C.c); renderList(); renderStatus();
    if (win) { over = true; picker.disable(); giveUp.disabled = true; ctx.done({ status: 'solved', summary: `${T.name} in ${guesses.length} guesses` }); }
  }
  function renderStatus() {
    const best = guesses.filter((g) => !g.win).sort((a, b) => a.km - b.km)[0];
    status.replaceChildren(h('span', { class: 'chip' }, `${guesses.length} guess${guesses.length === 1 ? '' : 'es'}`),
      best ? h('span', { class: 'chip' }, 'closest: ' + best.C.name + (best.km === 0 ? ' (borders it)' : ` · ${Math.round(best.km).toLocaleString()} km`)) : h('span', { class: 'chip' }, 'drag to spin the globe'));
  }
  function renderList() {
    list.replaceChildren(...guesses.slice().sort((a, b) => a.km - b.km || b.win - a.win).map((g) =>
      h('div', { class: 'gl' }, h('i', { style: `background:${colors.get(g.C.i)}` }), h('span', null, g.C.name),
        h('em', null, g.win ? 'found it' : g.km === 0 ? 'borders it' : Math.round(g.km).toLocaleString() + ' km'))));
  }
}

/* ---------- game: One Clue ---------- */
function mountCryptic(ctx) {
  const P = ctx.pick(window.CRYPTIC, (p) => p.a);
  const TY = window.CRYPTIC_TYPES[P.t];
  const A = P.a, n = A.length;
  const letters = Array(n).fill(''), locked = Array(n).fill(false);
  const shown = { def: false, type: false, ind: false, fod: false };
  let hintsUsed = 0, over = false, panelOpen = false;
  const PAR = 2;

  const clueEl = h('div', { class: 'clue' });
  const boxRow = h('div', { class: 'boxes', 'aria-label': `Answer, ${n} letters` });
  const boxEls = Array.from({ length: n }, () => { const b = h('div', { class: 'box' }); boxRow.append(b); return b; });
  const dots = h('div', { class: 'dots', 'aria-label': 'Hints used' });
  const checkBtn = h('button', { class: 'pill', disabled: true, onclick: check }, 'check');
  const hintBtn = h('button', { class: 'pill butter', onclick: () => { panelOpen = !panelOpen; renderHints(); } }, 'hints');
  const clearBtn = h('button', { class: 'iconbtn', 'aria-label': 'Clear letters', onclick: () => { for (let i = 0; i < n; i++) if (!locked[i]) letters[i] = ''; paint(); } }, svg(ICON.erase));
  const guideBtn = h('button', { class: 'iconbtn flat', 'aria-label': 'Cryptic 101 guide', onclick: openGuide }, svg(ICON.info));
  const hintsEl = h('div', { class: 'hints' });
  const after = h('div');
  const kb = keyboard(press);
  ctx.el.append(stageTitle(G.cryptic, guideBtn), clueEl, h('div', { class: 'cboxes' }, boxRow), dots, h('div', { class: 'actions' }, clearBtn, hintBtn, checkBtn), hintsEl, after, kb.el);
  physicalKeys(ctx.signal, press);
  renderClue(); paint(); renderDots(); renderHints();

  function findRange(text, frag) { if (!frag) return null; const i = text.toLowerCase().indexOf(frag.toLowerCase()); return i < 0 ? null : [i, i + frag.length]; }
  function renderClue() {
    const text = P.c, marks = [];
    if (shown.def) (Array.isArray(P.d) ? P.d : [P.d]).forEach((d) => { const r = findRange(text, d); if (r) marks.push([...r, 'def']); });
    if (shown.ind && P.i) { const r = findRange(text, P.i); if (r) marks.push([...r, 'ind']); }
    marks.sort((a, b) => a[0] - b[0]);
    const parts = []; let pos = 0;
    for (const [s, e, cls] of marks) { if (s < pos) continue; parts.push(text.slice(pos, s), h('mark', { class: cls }, text.slice(s, e))); pos = e; }
    parts.push(text.slice(pos));
    clueEl.replaceChildren(...parts);
  }
  function paint() {
    const curIdx = letters.findIndex((l, i) => !l && !locked[i]);
    boxEls.forEach((b, i) => { b.textContent = letters[i]; b.className = 'box' + (locked[i] ? ' locked' : '') + (i === curIdx && !over ? ' cur' : ''); });
    checkBtn.disabled = over || letters.some((l) => !l);
  }
  function renderDots() {
    const total = Math.max(6, hintsUsed + 1);
    dots.replaceChildren(...Array.from({ length: total }, (_, i) => h('div', { class: 'dot' + (i < hintsUsed ? ' used' : '') + (i === PAR ? ' par' : '') }, h('i'), i === PAR ? h('small', null, 'par') : null)));
  }
  function press(k) {
    if (over) return;
    if (k === 'ENTER') { if (!checkBtn.disabled) check(); else toast(`Fill all ${n} letters`); return; }
    if (k === 'BACK') { for (let i = n - 1; i >= 0; i--) if (letters[i] && !locked[i]) { letters[i] = ''; break; } paint(); return; }
    if (/^[A-Z]$/.test(k)) { const i = letters.findIndex((l, j) => !l && !locked[j]); if (i >= 0) { letters[i] = k; paint(); } }
  }
  function check() {
    if (over) return;
    if (letters.join('') === A) { finish('solved'); return; }
    shake(boxRow); toast('Not quite');
    for (let i = 0; i < n; i++) if (!locked[i]) letters[i] = '';
    paint();
  }
  function spend(label) { hintsUsed++; renderDots(); if (ctx.mode === 'run') ctx.penalty(10, label); }
  function revealLetter() {
    const i = locked.findIndex((l, j) => !l && letters[j] !== A[j]);
    const j = i >= 0 ? i : locked.findIndex((l) => !l);
    if (j < 0) return;
    locked[j] = true; letters[j] = A[j]; spend('letter'); paint();
    if (letters.every((l, q) => l === A[q])) finish('solved');
  }
  function renderHints() {
    hintBtn.textContent = panelOpen ? 'hide hints' : 'hints';
    if (!panelOpen) { hintsEl.replaceChildren(); return; }
    const steps = [
      { k: 'def', title: 'Definition', body: () => (Array.isArray(P.d) ? `Both ends of the clue are definitions: "${P.d[0]}" and "${P.d[1]}".` : `The definition is "${P.d}". It's highlighted in the clue.`) },
      { k: 'type', title: 'Clue type', body: () => `${TY.name}. ${TY.how}` },
      { k: 'ind', title: 'Indicator', body: () => (P.i ? `"${P.i}" is the indicator. It tells you which trick is in play.` : 'This clue has no indicator word. The pieces just sit side by side.') },
      { k: 'fod', title: 'Wordplay', body: () => P.f }
    ];
    const rows = steps.map((s) => {
      const open = shown[s.k];
      return h('div', { class: 'hint' + (open ? ' open' : '') },
        h('div', { class: 'txt' }, h('b', null, s.title), open ? h('p', null, s.body()) : h('p', null, ctx.mode === 'run' ? 'Costs 10 seconds' : 'Tap to reveal')),
        open ? null : h('button', { class: 'pill white small', onclick: () => { shown[s.k] = true; spend(s.title.toLowerCase()); renderClue(); renderHints(); } }, 'show'));
    });
    rows.push(h('div', { class: 'hint' }, h('div', { class: 'txt' }, h('b', null, 'Reveal a letter'), h('p', null, ctx.mode === 'run' ? 'Costs 10 seconds each' : 'Locks in one correct letter')),
      h('button', { class: 'pill white small', onclick: revealLetter }, 'reveal')));
    rows.push(h('div', { class: 'hint' }, h('div', { class: 'txt' }, h('b', null, 'Show the answer'), h('p', null, ctx.mode === 'run' ? 'Ends the clue, +60 seconds' : 'Ends the clue and explains it')),
      h('button', { class: 'pill white small', onclick: () => { for (let i = 0; i < n; i++) { letters[i] = A[i]; locked[i] = true; } finish('revealed'); } }, 'show')));
    hintsEl.replaceChildren(...rows);
  }
  function finish(status) {
    over = true; panelOpen = false; shown.def = true; shown.ind = true;
    renderClue(); renderHints(); paint(); kb.el.hidden = true;
    after.replaceChildren(h('div', { class: 'explain card' },
      h('div', null, h('span', { class: 'hl' }, status === 'solved' ? 'solved' : 'revealed'), hintsUsed ? ` with ${hintsUsed} hint${hintsUsed === 1 ? '' : 's'}` : ' with no hints', hintsUsed <= PAR ? ', at or under par.' : '.'),
      h('div', null, h('b', null, 'Answer: '), A),
      h('div', null, h('b', null, 'Definition: '), Array.isArray(P.d) ? P.d.join(' / ') : P.d),
      h('div', null, h('b', null, 'Wordplay: '), P.w),
      h('div', { class: 'muted' }, h('b', null, TY.name + ': '), TY.how)));
    ctx.done(status === 'solved'
      ? { status: 'solved', summary: `${A}, ${hintsUsed} hint${hintsUsed === 1 ? '' : 's'}` }
      : { status: 'revealed', penalty: 60, summary: `Revealed: ${A}` });
  }
}
function openGuide() {
  openModal('cryptic 101', h('div', null,
    h('p', null, 'Every cryptic clue has two halves. One end is a plain definition of the answer. The rest is wordplay that builds the same answer another way. The number in brackets is the letter count.'),
    h('p', null, 'Find the definition first: it is always at the very start or the very end.'),
    Object.values(window.CRYPTIC_TYPES).map((t) => h('div', null, h('h3', null, t.name), h('p', { style: 'margin:4px 0' }, t.how), h('p', { class: 'muted', style: 'margin:0;font-size:14px' }, 'Indicators: ' + t.ind))),
    h('h3', null, 'Handy abbreviations'),
    h('p', null, 'one = I, cold = C, hot = H, river = R, north/south/east/west = N/S/E/W, love/nothing = O, hundred = C, thousand = K or M, five = V, ten = X, king = K or R, queen = Q or ER, about = C or RE, holy = PI, student = L, sailor = AB, doctor = DR or MO.')));
}

/* ---------- game: Border Hop ---------- */
const BAD_EDGES = [['France', 'Brazil'], ['France', 'Suriname']];
function travelGraph() {
  if (GEO.graph) return GEO.graph;
  const ok = new Set(GEO.guessable.map((c) => c.i));
  const byRaw = Object.fromEntries(GEO.all.map((c) => [c.raw, c.i]));
  const bad = new Set(BAD_EDGES.flatMap(([a, b]) => [byRaw[a] + '|' + byRaw[b], byRaw[b] + '|' + byRaw[a]]));
  GEO.graph = new Map(GEO.guessable.map((c) => [c.i, [...c.nb].filter((j) => ok.has(j) && !bad.has(c.i + '|' + j))]));
  return GEO.graph;
}
function bfs(adj, s, allowed) {
  const d = new Map([[s, 0]]), parent = new Map(), q = [s];
  while (q.length) {
    const u = q.shift();
    for (const v of adj.get(u) || []) if (!d.has(v) && (!allowed || allowed.has(v))) { d.set(v, d.get(u) + 1); parent.set(v, u); q.push(v); }
  }
  return { d, parent };
}
function mountTravel(ctx) {
  const adj = travelGraph();
  const starts = GEO.targets.filter((c) => (adj.get(c.i) || []).length);
  let A, B, D, fromA;
  for (let t = 0; t < 400; t++) {
    A = ctx.pick(starts, (c) => c.name);
    fromA = bfs(adj, A.i);
    const ends = starts.filter((c) => { const x = fromA.d.get(c.i); return x >= 3 && x <= 6; });
    if (ends.length) { B = ends[Math.floor(ctx.rng() * ends.length)]; D = fromA.d.get(B.i); break; }
  }
  const fromB = bfs(adj, B.i);
  const minMid = D - 1, maxGuesses = minMid + 4;
  const guesses = [];
  let over = false;
  const COL = { green: '#3fbf6f', yellow: '#f7d154', orange: '#fb923c', red: '#ef6b6b' };
  const LABEL = { green: 'on a shortest route', yellow: 'close', orange: 'a detour', red: 'way off' };

  const canvas = h('canvas', { class: 'hopmap', role: 'img', 'aria-label': `Map from ${A.name} to ${B.name}` });
  const c2 = canvas.getContext('2d');
  const head = h('div', { class: 'hop-head' }, h('span', { class: 'hop-end' }, A.name), h('span', { class: 'hop-arrow', html: ICON.arrow }), h('span', { class: 'hop-end' }, B.name));
  const left = h('span', { class: 'chip num' });
  const list = h('div', { class: 'glist' });
  const picker = countryInput({ onPick: guess, signal: ctx.signal, placeholder: 'A country in between…' });
  const giveUp = h('button', { class: 'pill white small', onclick: () => {
    if (over) return;
    if (giveUp.dataset.arm !== '1') { giveUp.dataset.arm = '1'; giveUp.textContent = ctx.mode === 'run' ? 'sure? +60s' : 'sure?'; return; }
    end('gaveup');
  } }, 'give up');
  ctx.el.append(stageTitle(G.travel), head,
    h('div', { class: 'center', style: 'margin:4px 0 12px' }, h('span', { class: 'chip' }, `shortest route: ${minMid} in between`), left),
    h('div', { class: 'card', style: 'padding:6px;overflow:hidden' }, canvas),
    h('div', { class: 'rare-row', style: 'margin-top:14px' }, picker.el, giveUp), list);
  renderLeft();

  const view = { type: 'FeatureCollection', features: [A.feat, B.feat] };
  const mid = d3.geoCentroid(view);
  let W = 600, H = 380;
  const ro = new ResizeObserver(() => { W = Math.max(260, canvas.clientWidth || 600); H = Math.round(W * 0.62); const dpr = window.devicePixelRatio || 1; canvas.width = W * dpr; canvas.height = H * dpr; canvas.style.height = H + 'px'; c2.setTransform(dpr, 0, 0, dpr, 0, 0); draw(); });
  ro.observe(canvas);
  ctx.signal.addEventListener('abort', () => ro.disconnect());
  setTimeout(picker.focus, 50);

  function draw(reveal) {
    const proj = d3.geoAzimuthalEqualArea().rotate([-mid[0], -mid[1]]).fitExtent([[W * 0.18, H * 0.2], [W * 0.82, H * 0.8]], { type: 'FeatureCollection', features: [{ type: 'Feature', geometry: A.main }, { type: 'Feature', geometry: B.main }] });
    const path = d3.geoPath(proj, c2);
    c2.clearRect(0, 0, W, H);
    c2.fillStyle = '#dce9fb'; c2.fillRect(0, 0, W, H);
    const colorOf = new Map(guesses.map((g) => [g.C.i, COL[g.cls]]));
    if (reveal) for (const i of reveal) if (!colorOf.has(i)) colorOf.set(i, '#bfe8cb');
    colorOf.set(A.i, '#b98cf0'); colorOf.set(B.i, '#b98cf0');
    for (const C of GEO.all) {
      if (!C.feat.geometry || C.raw === 'Antarctica') continue;
      c2.beginPath(); path(C.feat);
      c2.fillStyle = colorOf.get(C.i) || '#ffffff'; c2.fill();
      c2.strokeStyle = 'rgba(18,18,18,.5)'; c2.lineWidth = 0.7; c2.stroke();
    }
    c2.font = '700 13px Figtree, system-ui, sans-serif'; c2.textAlign = 'center'; c2.textBaseline = 'middle';
    const label = (C) => {
      const p = proj(C.c); if (!p) return;
      const w = c2.measureText(C.name).width + 14, y = p[1] - 24;
      c2.fillStyle = '#121212'; c2.beginPath(); c2.moveTo(p[0] - 5, y + 10); c2.lineTo(p[0], p[1] - 4); c2.lineTo(p[0] + 5, y + 10); c2.fill();
      c2.beginPath(); c2.roundRect(p[0] - w / 2, y - 11, w, 22, 11); c2.fill();
      c2.fillStyle = '#ffffff'; c2.fillText(C.name, p[0], y + 1);
      c2.beginPath(); c2.arc(p[0], p[1], 3.5, 0, 6.283); c2.fillStyle = '#9b51e0'; c2.fill(); c2.strokeStyle = '#121212'; c2.lineWidth = 1.5; c2.stroke();
    };
    label(A); label(B);
  }
  function classify(C) {
    const a = fromA.d.get(C.i), b = fromB.d.get(C.i);
    if (a == null || b == null) return 'red';
    const extra = a + b - D;
    return extra === 0 ? 'green' : extra <= 2 ? 'yellow' : extra <= 4 ? 'orange' : 'red';
  }
  function renderLeft() { left.textContent = `${maxGuesses - guesses.length} guesses left`; }
  function connected() {
    const allowed = new Set([B.i, ...guesses.map((g) => g.C.i)]);
    return bfs(adj, A.i, allowed).d.has(B.i);
  }
  function guess(C) {
    if (over) return;
    if (C.i === A.i || C.i === B.i) { toast('That one is already on the map'); return; }
    if (guesses.some((g) => g.C.i === C.i)) { toast('Already guessed'); return; }
    guesses.push({ C, cls: classify(C) });
    renderLeft(); renderList(); draw();
    if (connected()) end('solved');
    else if (guesses.length >= maxGuesses) end('failed');
  }
  function renderList() {
    list.replaceChildren(...guesses.map((g) => h('div', { class: 'gl' }, h('i', { style: `background:${COL[g.cls]}` }), h('span', null, g.C.name), h('em', null, LABEL[g.cls]))));
  }
  function end(status) {
    over = true; picker.disable(); giveUp.disabled = true;
    const route = []; let u = B.i;
    while (u !== A.i) { u = fromA.parent.get(u); if (u !== A.i) route.unshift(u); }
    if (status !== 'solved') draw(route);
    const names = route.map((i) => GEO.all[i].name).join(' → ');
    list.prepend(h('div', { class: 'gl', style: 'background:var(--butter)' }, h('span', null, h('b', null, 'A shortest route: '), `${A.name} → ${names} → ${B.name}`)));
    const used = guesses.length;
    if (status === 'solved') ctx.done({ status: 'solved', summary: `${A.name} → ${B.name} in ${used} guess${used === 1 ? '' : 'es'} (best ${minMid})` });
    else if (status === 'failed') ctx.done({ status: 'failed', penalty: 30, summary: `Missed: ${A.name} → ${B.name}` });
    else ctx.done({ status: 'gaveup', penalty: 60, summary: `Gave up: ${A.name} → ${B.name}` });
  }
}

/* ---------- game: Rare Pick (the dive) ---------- */
const TIER_NAME = ['common', 'uncommon', 'rare', 'very rare', 'rarest'];
const ZONES = [
  { name: 'sunlight zone', note: 'The answer most people reach for.' },
  { name: 'twilight zone', note: 'Solid, but plenty of divers got here too.' },
  { name: 'midnight zone', note: 'Now you are thinking sideways.' },
  { name: 'the abyss', note: 'Very few divers make it this deep.' },
  { name: 'the trench', note: 'The single rarest answer on the list.' }
];
const SUB = `<svg viewBox="0 0 64 40" aria-hidden="true"><path d="M30 8h8l2-6h-10z" fill="#fdf0b4" stroke="#121212" stroke-width="2.5" stroke-linejoin="round"/><ellipse cx="32" cy="22" rx="24" ry="13" fill="#fdf0b4" stroke="#121212" stroke-width="3"/><circle cx="38" cy="21" r="6" fill="#9bd3ff" stroke="#121212" stroke-width="2.5"/><circle cx="24" cy="22" r="3.5" fill="#9bd3ff" stroke="#121212" stroke-width="2"/><path d="M8 22 1 15v14z" fill="#ecd3fa" stroke="#121212" stroke-width="2.5" stroke-linejoin="round"/></svg>`;
function buildRareIndex(cat) {
  if (cat._idx) return cat._idx;
  const m = new Map(), add = (raw, tier, pts) => { const names = raw.split('/'); for (const nm of names) { const k = key(nm, cat.s); if (k && !m.has(k)) m.set(k, { name: names[0].trim(), tier, pts }); } };
  add(cat.top, 4, 100);
  cat.t.forEach((list, tier) => list.split(',').forEach((raw) => add(raw.trim(), tier, window.RARE_POINTS[tier])));
  cat._idx = m; return m;
}
function mountRare(ctx) {
  const run = ctx.mode === 'run';
  const N = run ? 5 : 7, perPrompt = 20000, READ = run ? 900 : 1500;
  const cats = shuffle(ctx.rng, window.RARE.slice()).slice(0, N);
  const maxDepth = N * 1000;
  const reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  const results = [];
  let idx = 0, deadline = 0, state = 'read', raf = 0, total = 0, shownDepth = 0, boost = 0, wasTimed = true;
  const isTimed = () => !ctx.timed || ctx.timed();

  const fx = h('canvas', { class: 'dive-fx', 'aria-hidden': 'true' });
  const fc = fx.getContext('2d');
  const depthVal = h('div', { class: 'dive-num' }, '0 m');
  const scoreVal = h('div', { class: 'dive-num' }, '0');
  const pips = h('div', { class: 'dive-pips' }, Array.from({ length: N }, () => h('i')));
  const pipLabel = h('div', { class: 'dive-cap' });
  const sub = h('div', { class: 'dive-sub', html: SUB });
  const gauge = h('div', { class: 'dive-gauge' }, Array.from({ length: N + 1 }, (_, i) => h('span', { style: `top:${(i / N) * 100}%` }, i ? `${i}k` : '0')), sub);
  const panel = h('div', { class: 'dive-panel' });
  const ring = h('div', { class: 'dive-ring', html: '<svg viewBox="0 0 44 44"><circle cx="22" cy="22" r="19" class="track"/><circle cx="22" cy="22" r="19" class="bar" pathLength="100"/></svg>' }, h('b', null, '20'));
  const input = h('input', { id: 'rare-answer', type: 'text', autocomplete: 'off', autocapitalize: 'off', spellcheck: 'false', placeholder: 'type one answer…', 'aria-label': 'Answer' });
  const diveBtn = h('button', { class: 'dive-btn', onclick: submit }, 'dive');
  const passBtn = h('button', { class: 'dive-pass', onclick: () => resolve(null, 'pass') }, 'pass');
  const dock = h('div', { class: 'dive-dock' }, ring, input, diveBtn, passBtn);
  const box = h('div', { class: 'dive' }, fx,
    h('div', { class: 'dive-top' },
      h('div', { class: 'dive-stat' }, h('div', { class: 'dive-cap' }, 'depth'), depthVal),
      h('div', { style: 'display:grid;justify-items:center;gap:4px' }, pips, pipLabel),
      h('div', { class: 'dive-stat', style: 'text-align:right' }, h('div', { class: 'dive-cap' }, 'score'), scoreVal)),
    gauge, panel, dock);
  const body = h('div', null, box);
  ctx.el.append(stageTitle(G.rare), body);
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); e.stopPropagation(); submit(); } }, { signal: ctx.signal });
  document.addEventListener('keydown', (e) => { if (e.key === 'Enter' && state === 'reveal' && !run && document.activeElement !== input) { e.preventDefault(); e.stopPropagation(); next(); } }, { signal: ctx.signal, capture: true });

  /* marine snow */
  const motes = Array.from({ length: 70 }, () => ({ x: Math.random(), y: Math.random(), r: Math.random() * 1.6 + 0.4, s: Math.random() * 0.4 + 0.2, a: Math.random() * 0.5 + 0.2 }));
  const bubbles = [];
  let W = 0, H = 0;
  const ro = new ResizeObserver(() => { const r = box.getBoundingClientRect(); W = r.width; H = r.height; const dpr = window.devicePixelRatio || 1; fx.width = W * dpr; fx.height = H * dpr; fc.setTransform(dpr, 0, 0, dpr, 0, 0); });
  ro.observe(box);
  let last = performance.now();
  function frame(now) {
    const dt = Math.min(50, now - last) / 16.7; last = now;
    fc.clearRect(0, 0, W, H);
    if (!reduce) {
      boost *= 0.94;
      for (const m of motes) {
        m.y -= (m.s * 0.0009 + boost * 0.012 * m.s) * dt; if (m.y < -0.02) { m.y = 1.02; m.x = Math.random(); }
        fc.globalAlpha = m.a; fc.fillStyle = '#cfe6ff';
        fc.beginPath(); fc.arc(m.x * W, m.y * H, m.r, 0, 6.283); fc.fill();
      }
      for (let i = bubbles.length - 1; i >= 0; i--) {
        const b = bubbles[i]; b.y -= b.v * dt; b.x += Math.sin((b.y + b.p) / 9) * 0.3; b.life -= dt;
        if (b.life <= 0) { bubbles.splice(i, 1); continue; }
        fc.globalAlpha = Math.min(1, b.life / 30) * 0.8; fc.strokeStyle = '#d6efff'; fc.lineWidth = 1.2;
        fc.beginPath(); fc.arc(b.x, b.y, b.r, 0, 6.283); fc.stroke();
      }
      fc.globalAlpha = 1;
    }
    if (state === 'live' && !isTimed()) {
      wasTimed = false;
      ring.querySelector('.bar').style.strokeDashoffset = '0'; ring.lastChild.textContent = '∞'; ring.classList.remove('low');
    } else if (state === 'live') {
      if (!wasTimed) { wasTimed = true; deadline = now + perPrompt; }
      const left = deadline - now, f = Math.max(0, left / perPrompt);
      ring.querySelector('.bar').style.strokeDashoffset = String(100 - f * 100);
      ring.lastChild.textContent = String(Math.max(0, Math.ceil(left / 1000)));
      ring.classList.toggle('low', left < 5000);
      if (left <= 0) resolve(null, 'air');
    }
    raf = requestAnimationFrame(frame);
  }
  raf = requestAnimationFrame(frame);
  ctx.signal.addEventListener('abort', () => { cancelAnimationFrame(raf); ro.disconnect(); });

  function puff(n) {
    if (reduce) return;
    const sr = sub.getBoundingClientRect(), br = box.getBoundingClientRect();
    for (let i = 0; i < n; i++) bubbles.push({ x: sr.left - br.left + sr.width * 0.75 + Math.random() * 8, y: sr.top - br.top + 6, r: Math.random() * 3 + 1.5, v: Math.random() * 1.2 + 0.8, p: Math.random() * 40, life: 60 + Math.random() * 40 });
  }
  function setDepth(m) {
    sub.style.top = `${Math.min(1, m / maxDepth) * 100}%`;
    const from = shownDepth, t0 = performance.now(), dur = reduce ? 1 : 1300;
    const step = (now) => { const t = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - t, 3); shownDepth = Math.round(from + (m - from) * e); depthVal.textContent = `−${shownDepth.toLocaleString()} m`; if (t < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }
  function renderPips() { [...pips.children].forEach((p, i) => { p.className = i < idx ? 'done' : i === idx ? 'now' : ''; }); pipLabel.textContent = `prompt ${Math.min(idx + 1, N)} of ${N}`; }

  function start() {
    const cat = cats[idx];
    state = 'read'; renderPips();
    panel.replaceChildren(h('div', { class: 'dive-card' }, h('div', { class: 'dive-eyebrow' }, `prompt ${idx + 1} of ${N}`), h('div', { class: 'dive-q' }, cat.q), h('div', { class: 'dive-hint' }, 'rarer answers sink deeper')));
    input.value = ''; input.disabled = true; diveBtn.disabled = true; passBtn.disabled = true;
    ring.querySelector('.bar').style.strokeDashoffset = '0'; ring.lastChild.textContent = isTimed() ? String(perPrompt / 1000) : '∞'; ring.classList.remove('low');
    setTimeout(() => {
      if (ctx.signal.aborted) return;
      state = 'live'; deadline = performance.now() + perPrompt; wasTimed = isTimed();
      input.disabled = false; diveBtn.disabled = false; passBtn.disabled = false;
      input.focus({ preventScroll: true });
    }, READ);
  }
  function submit() {
    if (state !== 'live') return;
    const v = input.value.trim(); if (!v) return;
    const cat = cats[idx], m = buildRareIndex(cat), k = key(v, cat.s);
    const hit = m.get(k) || m.get(k.replace(/s$/, '')) || m.get(k + 's') || m.get(k.replace(/es$/, ''));
    if (hit) resolve(hit, 'hit', v);
    else { if (isTimed()) deadline -= 2000; shake(dock); ring.classList.add('hurt'); setTimeout(() => ring.classList.remove('hurt'), 400); toast(isTimed() ? 'Not on the list · −2s' : 'Not on the list'); input.select(); }
  }
  function resolve(hit, how, typed) {
    if (state !== 'live') return;
    state = 'reveal'; input.disabled = true; diveBtn.disabled = true; passBtn.disabled = true;
    const cat = cats[idx];
    results.push({ q: cat.q, hit, top: cat.top });
    let card;
    if (hit) {
      total += hit.pts; scoreVal.textContent = String(total);
      boost = 2 + hit.tier * 1.4; puff(6 + hit.tier * 4); setDepth(total * 10);
      const z = ZONES[hit.tier];
      card = h('div', { class: 'dive-reveal tier-' + hit.tier },
        h('div', { class: 'dive-zone' }, z.name),
        h('div', { class: 'dive-said' }, `"${typed}"`),
        h('div', { class: 'dive-pts' }, `+${hit.pts} pts · −${hit.pts * 10} m`),
        h('div', { class: 'dive-hint' }, z.note + (hit.tier < 4 ? ` Rarest was ${cat.top}.` : '')));
    } else {
      const ex = cat.t[3].split(',').slice(0, 3).map((s) => s.split('/')[0].trim());
      card = h('div', { class: 'dive-reveal miss' },
        h('div', { class: 'dive-zone' }, how === 'air' ? 'out of air' : 'surfaced'),
        h('div', { class: 'dive-pts' }, '+0 pts'),
        h('div', { class: 'dive-hint' }, `Deep answers: ${ex.join(', ')}. Rarest: ${cat.top}.`));
    }
    const last = idx === N - 1;
    const cont = h('button', { class: 'dive-btn wide', onclick: next }, last ? 'surface ▲' : 'descend ▼');
    panel.replaceChildren(card, run ? null : cont);
    if (run) setTimeout(next, hit ? 1300 : 1900); else setTimeout(() => cont.focus({ preventScroll: true }), 50);
  }
  function next() {
    if (state !== 'reveal') return;
    idx++;
    if (idx < N) start(); else finish();
  }
  function finish() {
    state = 'done'; renderPips(); dock.hidden = true;
    const deepest = results.reduce((a, r) => Math.max(a, r.hit ? r.hit.tier : -1), -1);
    panel.replaceChildren(h('div', { class: 'dive-reveal' },
      h('div', { class: 'dive-cap' }, 'dive complete'),
      h('div', { class: 'dive-zone' }, `−${(total * 10).toLocaleString()} m`),
      h('div', { class: 'dive-pts' }, `${total} points` + (run ? ` · −${(total / 10).toFixed(1)}s bonus` : '')),
      h('div', { class: 'dive-hint' }, deepest >= 0 ? `Deepest answer reached ${ZONES[deepest].name}.` : 'No answers landed this dive.')));
    body.append(h('div', { class: 'card', style: 'padding:14px 16px;margin-top:14px' }, h('div', { class: 'scroll-x' }, h('table', { class: 'rtable' }, h('tbody', null, results.map((r) =>
      h('tr', null, h('td', null, r.q, h('div', { class: 'muted', style: 'font-size:12px' }, 'rarest: ' + r.top)), h('td', null, r.hit ? r.hit.name : '–'), h('td', null, r.hit ? r.hit.pts : 0))))))));
    ctx.done({ status: 'solved', penalty: -total / 10, summary: `${total} pts · −${(total * 10).toLocaleString()} m` });
  }
  renderPips(); start();
}

/* ---------- shell ---------- */
const app = $('#app');
let RUN = null, stopRaf = 0, screenAC = null;
const DEFAULT_SET = GAMES.map((g) => g.key);
const setKey = (keys) => keys.join('+');

function screen() {
  if (screenAC) screenAC.abort();
  screenAC = new AbortController();
  cancelAnimationFrame(stopRaf);
  document.querySelectorAll('.modal, .countdown').forEach((m) => m.remove());
  app.replaceChildren();
  window.scrollTo(0, 0);
  return screenAC.signal;
}
function topBar(left, mid, right) { return h('header', { class: 'bar' }, h('div', { class: 'wrap' }, left, h('div', { class: 'mid' }, mid), right)); }
const infoBtn = () => h('button', { class: 'iconbtn flat', 'aria-label': 'How it works', onclick: openRules }, svg(ICON.info));

function openRules() {
  openModal('how it works', h('div', null,
    h('p', null, 'A speedrun is every puzzle back to back on one clock. Your split for each puzzle is the time you spent on it plus any penalties.'),
    h('h3', null, 'Penalties and bonuses'),
    h('ul', null, GAMES.map((g) => h('li', null, h('b', null, g.name + ': '), PENALTY_TEXT[g.key]))),
    h('h3', null, "Today's run vs random runs"),
    h('p', null, "Today's run uses the date as its seed, so it's the same set of puzzles all day. Replay it to chase a cleaner time. Random runs get a new seed each time, and you can rerun any seed from the results screen."),
    h('h3', null, 'Records'),
    h('p', null, 'Personal bests, best splits and your practice stats are saved in this browser only.'),
    h('h3', null, 'Practice and unlimited'),
    h('p', null, 'Every game has a practice mode with no penalties and no daily cap. Turn on the unlimited switch at the top of a game and the next puzzle loads by itself a few seconds after you finish, so you can grind without leaving.')));
}

/* records */
function getRecords() { return store.get('records', { pb: {}, gold: {}, history: [], daily: {} }); }
function getSel() { const s = store.get('selection', DEFAULT_SET).filter((k) => G[k]); return s.length ? s : DEFAULT_SET; }

/* home */
function renderHome() {
  screen();
  const rec = getRecords();
  let sel = getSel();
  const today = todayStr();
  const dailySeed = 'daily-' + today;

  const icons = h('div', { class: 'stage-icons' });
  const startBtn = h('button', { class: 'pill', onclick: () => go(dailySeed, 'daily', startBtn) }, "start today's run");
  const randBtn = h('button', { class: 'pill butter', onclick: () => go('r' + Math.floor(Math.random() * 1e6), 'random', randBtn) }, 'random run');
  const tagline = h('div', { class: 'tagline' });
  const statTiles = h('div', { class: 'tiles' });
  const chips = h('div', { class: 'tiles' });

  function refresh() {
    icons.replaceChildren(...sel.map((k) => h('span', { title: G[k].name }, svg(ICON[k]))));
    chips.replaceChildren(...GAMES.map((g) => h('button', {
      class: 'tile' + (sel.includes(g.key) ? ' on' : ''), 'aria-pressed': String(sel.includes(g.key)),
      onclick: () => {
        if (sel.includes(g.key)) { if (sel.length === 1) { toast('Keep at least one game'); return; } sel = sel.filter((k) => k !== g.key); }
        else sel = DEFAULT_SET.filter((k) => sel.includes(k) || k === g.key);
        store.set('selection', sel); refresh();
      }
    }, svg(ICON[g.key]), h('b', null, g.name), h('small', null, sel.includes(g.key) ? 'in the run' : 'skipped'))));
    const sk = setKey(sel), pb = rec.pb[sk], dailyBest = rec.daily[dailySeed + '|' + sk];
    const sob = sel.every((k) => rec.gold[k] != null) ? sel.reduce((a, k) => a + rec.gold[k], 0) : null;
    tagline.replaceChildren(pb ? h('span', { class: 'hl' }, `personal best ${fmt(pb.total)}`) : h('span', { class: 'hl' }, 'no runs yet. set your first time'));
    statTiles.replaceChildren(
      statTile('personal best', pb ? fmt(pb.total) : '–'),
      statTile('sum of best', sob != null ? fmt(sob) : '–'),
      statTile("today's best", dailyBest != null ? fmt(dailyBest) : '–'),
      statTile('runs', String(rec.history.filter((r) => r.set === sk).length)));
  }
  const statTile = (label, val) => h('div', { class: 'tile' }, h('div', { class: 'stat-val' }, val), h('small', null, label));

  async function go(seed, kind, btn) {
    if (sel.some((k) => G[k].geo)) {
      const old = btn.textContent; btn.textContent = 'loading map…'; btn.disabled = true;
      try { await loadGeo(); } catch { toast('The map data did not load. Check your connection and try again.'); btn.textContent = old; btn.disabled = false; return; }
    }
    startRun(sel.slice(), seed, kind);
  }

  const pstats = store.get('practice', {});
  const recent = rec.history.slice(-5).reverse();
  app.append(
    topBar(h('span', { class: 'wordmark' }, 'gauntlet'), null, infoBtn()),
    h('section', { class: 'sky' }, h('div', { class: 'wrap' },
      h('div', { class: 'hero card' },
        h('h1', null, "Today's gauntlet"),
        h('div', { class: 'lede' }, 'Six puzzles, one clock. Word, outline, globe, border hop, cryptic, rare answers.'),
        icons,
        h('div', { class: 'center' }, startBtn, randBtn),
        h('div', { class: 'hero-meta' }, prettyDate(today) + " · same puzzles all day")),
      tagline, statTiles,
      h('div', { class: 'section-title', style: 'margin-top:22px' }, 'In the run'),
      chips)),
    h('section', { class: 'paper' }, h('div', { class: 'wrap stack' },
      h('div', null, h('div', { class: 'section-title' }, 'Practice'),
        h('p', { class: 'muted', style: 'margin:-6px 0 12px;font-size:14px' }, 'Play any game on its own, as many times as you want. Flip the unlimited switch at the top and the next puzzle loads by itself.'),
        h('div', { class: 'list' }, GAMES.map((g) => {
          const st = pstats[g.key];
          return h('button', { class: 'item', onclick: () => openPractice(g.key) },
            h('span', { class: 'ic' }, svg(ICON[g.key])),
            h('span', { class: 'txt' }, h('small', null, g.like), h('b', null, g.name), h('p', null, g.blurb)),
            h('span', { class: 'chip' }, st ? `${st.solved} solved` : 'play'));
        }))),
      h('div', null, h('div', { class: 'section-title' }, 'Recent runs'),
        recent.length ? h('div', { class: 'list' }, recent.map((r) => h('div', { class: 'item' },
          h('span', { class: 'txt' }, h('small', null, (r.kind === 'daily' ? 'daily · ' : 'random · ') + new Date(r.at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) + ' · ' + r.keys.length + ' games'),
            h('b', { class: 'num' }, fmt(r.total))),
          r.pb ? h('span', { class: 'chip', style: 'background:var(--mint)' }, 'PB') : null)))
          : h('div', { class: 'empty' }, 'Finished runs show up here with their times. Your first run sets the personal best to chase.')))));
  refresh();
  loadGeo().catch(() => {});
}

/* run */
function startRun(keys, seed, kind) {
  const signal = screen();
  const rec = getRecords();
  RUN = { keys, seed, kind, idx: 0, splits: [], stageStart: 0, pen: 0, frozen: null, ac: null, pb: rec.pb[setKey(keys)] || null, gold: rec.gold };
  const timerEl = h('div', { class: 'timer', 'aria-live': 'off' }, '0.00');
  let armed = false;
  const quit = h('button', { class: 'iconbtn flat', 'aria-label': 'Quit run', onclick: () => {
    if (!armed) { armed = true; toast('Tap back again to quit the run'); setTimeout(() => { armed = false; }, 2500); return; }
    RUN.ac && RUN.ac.abort(); RUN = null; renderHome();
  } }, svg(ICON.back));
  const title = h('div', { class: 'bar-title' }), sub = h('div', { class: 'bar-sub' }, kind === 'daily' ? "today's run" : 'seed ' + seed);
  const strip = h('div', { class: 'splits', style: `--n:${keys.length}` });
  const stageEl = h('div', { class: 'stage' });
  RUN.ui = { timerEl, title, strip, stageEl };
  app.append(topBar(quit, h('div', null, title, sub), timerEl), h('section', { class: 'sky', style: 'min-height:100vh' }, h('div', { class: 'wrap' }, strip, stageEl)));
  renderStrip();
  const loop = () => { if (!RUN) return; timerEl.textContent = fmt(runTotal()); stopRaf = requestAnimationFrame(loop); };
  countdown(signal, () => { if (!RUN) return; mountStage(); loop(); });
}
function runTotal() {
  if (!RUN) return 0;
  const done = RUN.splits.reduce((a, s) => a + s.time, 0);
  if (RUN.idx >= RUN.keys.length) return done;
  if (!RUN.stageStart) return 0;
  return done + (RUN.frozen != null ? RUN.frozen : performance.now() - RUN.stageStart + RUN.pen);
}
function countdown(signal, then) {
  const n = h('span', null, '3'), ov = h('div', { class: 'countdown', 'aria-live': 'assertive' }, n);
  document.body.append(ov);
  let c = 3;
  const t = setInterval(() => {
    c--;
    if (c > 0) { n.textContent = String(c); n.style.animation = 'none'; void n.offsetWidth; n.style.animation = ''; }
    else { clearInterval(t); ov.remove(); then(); }
  }, 650);
  signal.addEventListener('abort', () => { clearInterval(t); ov.remove(); });
}
function renderStrip() {
  const { strip } = RUN.ui;
  strip.replaceChildren(...RUN.keys.map((k, i) => {
    const s = RUN.splits[i];
    let d = null;
    if (s && RUN.pb && RUN.pb.splits && RUN.pb.splits[k] != null) { const dm = s.time - RUN.pb.splits[k]; d = h('div', { class: 'd ' + (dm <= 0 ? 'good' : 'bad') }, fmtDelta(dm)); }
    else if (s && RUN.gold[k] == null) d = h('div', { class: 'd muted' }, 'new');
    return h('div', { class: 'split' + (i === RUN.idx ? ' now' : s ? ' done' : ''), title: G[k].name }, svg(ICON[k]), h('div', { class: 't' }, s ? fmt(s.time) : '–'), d || h('div', { class: 'd' }));
  }));
}
function flash(text, bonus) {
  const f = h('div', { class: 'penflash' + (bonus ? ' bonus' : '') }, text);
  document.body.append(f); setTimeout(() => f.remove(), 1500);
}
function mountStage() {
  const k = RUN.keys[RUN.idx], g = G[k];
  RUN.ui.stageEl.replaceChildren();
  RUN.ui.title.textContent = `${RUN.idx + 1}/${RUN.keys.length} · ${g.name}`;
  RUN.ui.timerEl.classList.remove('frozen');
  const ac = new AbortController(); RUN.ac = ac;
  RUN.stageStart = performance.now(); RUN.pen = 0; RUN.frozen = null;
  renderStrip();
  const rng = rngFor(RUN.seed, k);
  g.mount({
    el: RUN.ui.stageEl, rng, mode: 'run', signal: ac.signal, toast,
    pick: (arr) => arr[Math.floor(rng() * arr.length)],
    penalty: (sec, why) => { if (!RUN || RUN.frozen != null) return; RUN.pen += sec * 1000; flash(`+${sec}s ${why}`); },
    done: (res) => finishStage(k, res, ac)
  });
}
function finishStage(k, res, ac) {
  if (!RUN || RUN.ac !== ac || RUN.frozen != null) return;
  const extra = (res.penalty || 0) * 1000;
  const time = Math.max(0, performance.now() - RUN.stageStart + RUN.pen + extra);
  RUN.frozen = time;
  RUN.splits.push({ key: k, time, status: res.status, summary: res.summary, penalty: (RUN.pen + extra) / 1000 });
  if (extra > 0) flash(`+${res.penalty}s`); else if (extra < 0) flash(`${fmtDelta(extra)}s rarity bonus`, true);
  RUN.ui.timerEl.classList.add('frozen');
  renderStrip();
  const pbSplit = RUN.pb && RUN.pb.splits ? RUN.pb.splits[k] : null;
  const last = RUN.idx === RUN.keys.length - 1;
  RUN.ui.stageEl.append(h('div', { class: 'splitcard card' },
    h('div', { class: 'eyebrow' }, res.summary),
    h('div', { class: 'big' }, fmt(time)),
    pbSplit != null ? h('div', { class: time <= pbSplit ? 'good' : 'bad', style: 'font-weight:800' }, `${fmtDelta(time - pbSplit)} vs your PB split`) : h('div', { class: 'muted' }, 'first split on record'),
    h('div', { class: 'muted', style: 'font-size:13px' }, last ? 'finishing…' : 'next: ' + G[RUN.keys[RUN.idx + 1]].name.toLowerCase())));
  const card = RUN.ui.stageEl.lastChild; card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  const wait = k === 'cryptic' || k === 'rare' ? 2600 : 1700;
  setTimeout(() => {
    if (!RUN || RUN.ac !== ac) return;
    ac.abort(); RUN.idx++;
    if (RUN.idx < RUN.keys.length) mountStage(); else endRun();
  }, wait);
}
function endRun() {
  const R = RUN; RUN = null;
  const total = R.splits.reduce((a, s) => a + s.time, 0);
  const rec = getRecords(), sk = setKey(R.keys);
  const prev = rec.pb[sk];
  const isPB = !prev || total < prev.total;
  const splitsMap = Object.fromEntries(R.splits.map((s) => [s.key, s.time]));
  const golds = [];
  for (const s of R.splits) if (rec.gold[s.key] == null || s.time < rec.gold[s.key]) { if (rec.gold[s.key] != null) golds.push(s.key); rec.gold[s.key] = s.time; }
  if (isPB) rec.pb[sk] = { total, splits: splitsMap, at: Date.now(), seed: R.seed };
  if (R.kind === 'daily') { const dk = R.seed + '|' + sk; if (rec.daily[dk] == null || total < rec.daily[dk]) rec.daily[dk] = total; }
  rec.history.push({ at: Date.now(), seed: R.seed, kind: R.kind, keys: R.keys, set: sk, total, splits: splitsMap, pb: isPB });
  rec.history = rec.history.slice(-40);
  store.set('records', rec);
  renderResults(R, total, prev, isPB, golds);
}
function renderResults(R, total, prev, isPB, golds) {
  screen();
  const shareText = [`gauntlet · ${R.kind === 'daily' ? prettyDate(todayStr()) : 'seed ' + R.seed}`, `total ${fmt(total)}${isPB ? ' (PB)' : ''}`,
    ...R.splits.map((s) => `${G[s.key].name}: ${fmt(s.time)} · ${s.summary}`)].join('\n');
  const copyBtn = h('button', { class: 'pill white small', onclick: () => {
    const fallback = () => { pre.hidden = false; const r = document.createRange(); r.selectNodeContents(pre); const sel = getSelection(); sel.removeAllRanges(); sel.addRange(r); toast('Select and copy the text below'); };
    try { navigator.clipboard.writeText(shareText).then(() => toast('Copied'), fallback); } catch { fallback(); }
  } }, 'copy result');
  const pre = h('pre', { hidden: true, style: 'text-align:left;white-space:pre-wrap;font-size:13px;background:var(--tile);padding:10px;border-radius:8px;margin:0' }, shareText);
  const again = h('button', { class: 'pill', onclick: () => startRun(R.keys, R.seed, R.kind) }, 'same seed again');
  const fresh = h('button', { class: 'pill butter', onclick: () => startRun(R.keys, 'r' + Math.floor(Math.random() * 1e6), 'random') }, 'new random run');
  app.append(
    topBar(h('button', { class: 'iconbtn flat', 'aria-label': 'Home', onclick: renderHome }, svg(ICON.back)), h('div', null, h('div', { class: 'bar-title' }, 'run complete'), h('div', { class: 'bar-sub' }, R.kind === 'daily' ? "today's run" : 'seed ' + R.seed)), infoBtn()),
    h('section', { class: 'sky', style: 'min-height:100vh' }, h('div', { class: 'wrap' },
      h('div', { class: 'results card' },
        h('div', null, isPB ? h('span', { class: 'hl' }, prev ? 'new personal best' : 'first run on the board') : h('span', { class: 'muted' }, `PB ${fmt(prev.total)} · ${fmtDelta(total - prev.total)}s`)),
        h('div', { class: 'big' }, fmt(total)),
        h('div', { class: 'scroll-x' }, h('table', { class: 'stable' }, h('tbody', null, R.splits.map((s) => {
          const pbs = prev && prev.splits ? prev.splits[s.key] : null;
          return h('tr', null,
            h('td', { style: 'width:28px' }, svg(ICON[s.key])),
            h('td', null, h('b', null, G[s.key].name), golds.includes(s.key) ? h('span', { class: 'chip', style: 'background:var(--butter);margin-left:6px;padding:1px 8px' }, 'best split') : null,
              h('div', { class: 'muted', style: 'font-size:12px' }, s.summary + (s.penalty ? ` · ${s.penalty > 0 ? '+' : '−'}${Math.abs(s.penalty).toFixed(1)}s` : ''))),
            h('td', { class: 'r' }, fmt(s.time), pbs != null ? h('div', { class: s.time <= pbs ? 'good' : 'bad', style: 'font-size:12px' }, fmtDelta(s.time - pbs)) : null));
        })))),
        h('div', { class: 'center' }, again, fresh),
        h('div', { class: 'center' }, copyBtn, h('button', { class: 'pill white small', onclick: renderHome }, 'home')),
        pre))));
}

/* practice */
const AUTO_DELAY = { word: 2200, shape: 2600, globe: 3000, travel: 3500, cryptic: 6000, rare: 4500 };
async function openPractice(k) {
  const g = G[k];
  if (g.geo && !GEO) {
    screen(); app.append(topBar(h('button', { class: 'iconbtn flat', 'aria-label': 'Home', onclick: renderHome }, svg(ICON.back)), null, null), h('div', { class: 'loading' }, 'loading the map…'));
    try { await loadGeo(); } catch { toast('The map data did not load. Check your connection and try again.'); renderHome(); return; }
  }
  const signal = screen();
  const stats = h('div', { class: 'bar-sub' });
  const clock = h('div', { class: 'timer', style: 'min-width:80px;font-size:16px' }, '0.00');
  const stageEl = h('div', { class: 'stage' });
  let unlimited = store.get('unlimited', false), timed = store.get('timer', false), pending = null, countdownEl = null, timeEl = null;
  clock.hidden = !timed;
  const tsw = h('button', { class: 'switch', role: 'switch', 'aria-checked': String(timed), title: 'Show the clock (and the Rare Pick countdown)',
    onclick: () => { timed = !timed; store.set('timer', timed); tsw.setAttribute('aria-checked', String(timed)); clock.hidden = !timed; if (timeEl) timeEl.hidden = !timed; } },
    h('i'), h('span', null, 'timer'));
  const sw = h('button', { class: 'switch', role: 'switch', 'aria-checked': String(unlimited), title: 'Unlimited: load the next puzzle automatically',
    onclick: () => { unlimited = !unlimited; store.set('unlimited', unlimited); sw.setAttribute('aria-checked', String(unlimited)); if (unlimited && stopped != null && !pending) scheduleNext(); if (!unlimited) cancelNext(); } },
    h('i'), h('span', null, 'unlimited'));
  app.append(
    topBar(h('button', { class: 'iconbtn flat', 'aria-label': 'Home', onclick: renderHome }, svg(ICON.back)), h('div', null, h('div', { class: 'bar-title' }, g.name + ' · practice'), stats), h('div', { class: 'row', style: 'gap:6px;flex-wrap:nowrap' }, sw, tsw, clock)),
    h('section', { class: 'sky', style: 'min-height:100vh' }, h('div', { class: 'wrap' }, stageEl)));
  let ac = null, t0 = 0, stopped = null;
  const session = { played: 0, solved: 0 };
  const showStats = () => { const s = (store.get('practice', {}))[k] || { played: 0, solved: 0, streak: 0 }; stats.textContent = `session ${session.solved}/${session.played} · all-time ${s.solved} · streak ${s.streak}` + (s.best ? ` · best ${fmt(s.best)}` : ''); };
  const loop = () => { clock.textContent = fmt(stopped != null ? stopped : performance.now() - t0); stopRaf = requestAnimationFrame(loop); };
  function cancelNext() { if (pending) { clearInterval(pending); pending = null; } if (countdownEl) countdownEl.textContent = 'Press Enter for the next one'; }
  function scheduleNext() {
    cancelNext();
    const until = performance.now() + (AUTO_DELAY[k] || 3000);
    const tick = () => { const left = Math.ceil((until - performance.now()) / 1000); if (left <= 0) { cancelNext(); next(); return; } if (countdownEl) countdownEl.textContent = `Next puzzle in ${left}… (switch off unlimited to stay)`; };
    pending = setInterval(tick, 200); tick();
  }
  signal.addEventListener('abort', cancelNext);
  function next() {
    cancelNext();
    if (ac) ac.abort();
    ac = new AbortController();
    signal.addEventListener('abort', () => ac.abort());
    stageEl.replaceChildren(); window.scrollTo(0, 0);
    t0 = performance.now(); stopped = null; countdownEl = null; clock.classList.remove('frozen'); showStats();
    const rng = mulberry32((Math.random() * 4294967296) >>> 0);
    const my = ac;
    g.mount({
      el: stageEl, rng, mode: 'practice', signal: my.signal, toast, timed: () => timed,
      pick: (arr, id) => {
        const rk = 'recent.' + k, recent = store.get(rk, []);
        let c = arr[0];
        for (let t = 0; t < 30; t++) { c = arr[Math.floor(rng() * arr.length)]; if (!recent.includes(id(c))) break; }
        recent.push(id(c)); store.set(rk, recent.slice(-Math.max(1, Math.floor(arr.length * 0.6))));
        return c;
      },
      penalty: () => {},
      done: (res) => {
        if (my.signal.aborted || stopped != null) return;
        stopped = performance.now() - t0; clock.classList.add('frozen');
        const all = store.get('practice', {}), s = all[k] || { played: 0, solved: 0, streak: 0, best: null };
        const ok = res.status === 'solved';
        session.played++; if (ok) session.solved++;
        s.played++; if (ok) { s.solved++; s.streak++; if (s.best == null || stopped < s.best) s.best = stopped; } else s.streak = 0;
        all[k] = s; store.set('practice', all); showStats();
        const nextBtn = h('button', { class: 'pill', onclick: next }, 'next puzzle');
        countdownEl = h('div', { class: 'muted', style: 'font-size:13px' }, 'Press Enter for the next one');
        stageEl.append(h('div', { class: 'practice-done card' },
          h('span', { class: 'hl', style: ok ? '' : 'background:var(--rose)' }, ok ? 'solved' : res.status === 'gaveup' ? 'gave up' : res.status === 'revealed' ? 'revealed' : 'missed'),
          h('div', null, res.summary, timeEl = h('span', { hidden: !timed }, ' · ' + fmt(stopped))),
          h('div', { class: 'center' }, nextBtn, h('button', { class: 'pill white small', onclick: renderHome }, 'home')),
          countdownEl));
        if (unlimited) scheduleNext();
        setTimeout(() => {
          if (my.signal.aborted) return;
          if (k !== 'cryptic' && k !== 'rare') nextBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          document.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !$('.modal')) { e.preventDefault(); next(); } }, { signal: my.signal });
        }, 700);
      }
    });
  }
  next(); loop();
}

renderHome();
})();
