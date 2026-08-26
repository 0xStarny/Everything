/* Everything, profile by profile — animated whitepaper reader
   Bilingual (EN default) · light/dark · no dependencies.
   Every user-facing string is a ["English", "Français"] pair. */

let LANG = 'en';
try { LANG = (localStorage.getItem('ev-lang') === 'fr') ? 'fr' : 'en'; } catch (e) {}
const T = x => Array.isArray(x) ? (LANG === 'fr' ? x[1] : x[0]) : x;

const UI = {
  kicker: ['Guide', 'Guide'],
  crumb: ['Reading the whitepaper · <b>9 views</b>', 'Lecture du whitepaper · <b>9 vues</b>'],
  gMech: ['Mechanics', 'Mécanique'],
  gProf: ['Profiles', 'Profils'],
  gHood: ['Under the hood', 'Sous le capot'],
  prev: ['&larr; Previous', '&larr; Précédent'],
  next: ['Next &rarr;', 'Suivant &rarr;'],
  play: ['&#9654;&nbsp; Play', '&#9654;&nbsp; Lecture'],
  pause: ['&#10073;&#10073;&nbsp; Pause', '&#10073;&#10073;&nbsp; Pause'],
  win: ['How they make money', 'Comment il gagne'],
  lose: ['How they lose money', 'Comment il perd'],
  trap: ['The catch', 'Le piège à connaître'],
  step: ['Step', 'Étape'],
  foot: [
    'Rebuilt from the <a href="https://everything.inc/" target="_blank" rel="noopener">everything.inc</a> whitepaper (sections 1 to 12, published 21 August 2026). Visual identity borrowed from <a href="https://app.everything.inc/" target="_blank" rel="noopener">app.everything.inc</a>. Every number in these scenarios is a teaching example built on the paper\'s own formulas, not market data. The parameters (<span class="mono">π</span>, <span class="mono">τ</span>, <span class="mono">λ</span>, <span class="mono">β</span>, <span class="mono">u*</span>, <span class="mono">φ</span>) are given no values anywhere in the whitepaper: they are per-pair governance levers. This is an independent explainer, not affiliated with the protocol, and not financial advice.',
    'Reconstruit à partir du whitepaper <a href="https://everything.inc/" target="_blank" rel="noopener">everything.inc</a> (sections 1 à 12, publié le 21 août 2026). Habillage repris de <a href="https://app.everything.inc/" target="_blank" rel="noopener">app.everything.inc</a>. Tous les chiffres de ces scénarios sont des exemples pédagogiques construits sur les formules du papier, pas des données de marché. Les paramètres (<span class="mono">π</span>, <span class="mono">τ</span>, <span class="mono">λ</span>, <span class="mono">β</span>, <span class="mono">u*</span>, <span class="mono">φ</span>) ne sont chiffrés nulle part dans le whitepaper : ce sont des leviers de gouvernance réglés par paire. Explication indépendante, sans lien avec le protocole, et qui ne constitue pas un conseil financier.'
  ]
};

/* ── svg building blocks ───────────────────────────────────────────── */
const MK = ns => `<defs>${
  [['m', 'var(--strong)'], ['b', 'var(--accent-line)'], ['g', 'var(--ok)'], ['r', 'var(--bad)'], ['w', 'var(--warn)']]
    .map(([k, c]) => `<marker id="${ns}-${k}" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="5.5" markerHeight="5.5" orient="auto"><path d="M0 0.5 L9.5 5 L0 9.5 z" fill="${c}"/></marker>`).join('')
}</defs>`;

const BOX = (id, x, y, w, h, t, lines, fill = 'var(--elevated)', stroke = 'var(--border)') => `<g id="${id}" class="anim">
  <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="${fill}" stroke="${stroke}" stroke-width="1.2"/>
  <text class="lbl" x="${x + 14}" y="${y + 25}">${T(t)}</text>
  ${lines.map((l, i) => `<text class="sm" x="${x + 14}" y="${y + 44 + i * 14}">${T(l)}</text>`).join('')}</g>`;

const PILL = (id, x, y, w, h, t) => `<g id="${id}" class="anim">
  <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${h / 2}" fill="var(--accent-soft)" stroke="var(--accent-line)" stroke-width="1.1"/>
  <text class="cap" x="${x + w / 2}" y="${y + h / 2 + 3.5}" text-anchor="middle" fill="var(--accent-text)">${T(t)}</text></g>`;

const ARR = (id, d, mk, label, lx, ly, anchor = 'middle', color = 'var(--strong)', dash = '') => `<g id="${id}" class="anim">
  <path d="${d}" fill="none" stroke="${color}" stroke-width="1.6" ${dash ? `stroke-dasharray="${dash}"` : ''} marker-end="url(#${mk})"/>
  ${label ? T(label).split('|').map((l, i) => `<text class="sm" x="${lx}" y="${ly + i * 13}" text-anchor="${anchor}">${l}</text>`).join('') : ''}</g>`;

const AXES = (x0, x1, yb, ticks) => `
  <line x1="${x0}" y1="${yb}" x2="${x1}" y2="${yb}" stroke="var(--border)" stroke-width="1.3"/>
  ${ticks.map(([y, l]) => `<line x1="${x0}" y1="${y}" x2="${x1}" y2="${y}" stroke="var(--grid)" stroke-width="1" stroke-dasharray="3 6"/><text class="num" x="${x0 - 9}" y="${y + 4}" text-anchor="end" fill="var(--muted)">${l}</text>`).join('')}`;

const CALL = (id, x, y, w, h, ttl, lines, kind = 'b') => {
  const c = {
    b: ['var(--accent-soft)', 'var(--accent-line)', 'var(--accent-text)'],
    g: ['var(--ok-bg)', 'var(--ok-line)', 'var(--ok-text)'],
    r: ['var(--bad-bg)', 'var(--bad-line)', 'var(--bad-text)'],
    w: ['var(--warn-bg)', 'var(--warn-line)', 'var(--warn-text)'],
    n: ['var(--elevated)', 'var(--border)', 'var(--primary)']
  }[kind];
  return `<g id="${id}" class="anim"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="9" fill="${c[0]}" stroke="${c[1]}" stroke-width="1.2"/>
  <text class="cap" x="${x + 14}" y="${y + 20}" fill="${c[2]}">${T(ttl)}</text>
  ${lines.map((l, i) => `<text class="${i === 0 ? 'big' : 'sm'}" x="${x + 14}" y="${y + (i === 0 ? 43 : 43 + i * 15)}" fill="${c[2]}">${T(l)}</text>`).join('')}</g>`;
};

const V = [];
