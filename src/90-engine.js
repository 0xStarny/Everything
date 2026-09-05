/* ══════════════ ENGINE ══════════════ */
const TABLABEL = {
  start:    ['Start here', 'Commencez ici'],
  overview: ['The protocol', 'Le protocole'],
  curve:    ['Where the price comes from', "D'où vient le prix"],
  trader:   ['Bob · Taker', 'Bob · Taker'],
  maker:    ['Alice · Maker', 'Alice · Maker'],
  lent:     ['Nadia · Lent maker', 'Nadia · Maker lent'],
  borrow:   ['David · Borrower', 'David · Emprunteur'],
  lev:      ['Elena · Leverage', 'Elena · Levier'],
  lp:       ['Farid · LP', 'Farid · LP'],
  band:     ['The band', 'Le band'],
  liq:      ['Liquidation', 'Liquidation'],
  quiz:     ['Take the quiz', 'Passez le quiz']
};
const GROUPS = [
  { label: [' ', ' '], ids: ['start'] },
  { label: ['Mechanics', 'Mécanique'], ids: ['overview', 'curve'] },
  { label: ['The six', 'Les six'], ids: ['trader', 'maker', 'lent', 'borrow', 'lev', 'lp'] },
  { label: ['Under the hood', 'Sous le capot'], ids: ['band', 'liq'] },
  { label: ['Test yourself', 'Testez-vous'], ids: ['quiz'] }
];
const ORDER = GROUPS.flatMap(g => g.ids);

const STATE = { tab: 'start', step: {} };
const CTRL = {};
const MAIN = document.getElementById('main');
const TABBAR = document.getElementById('tabs');
let POP = null;

/* ── step painting ─────────────────────────────────────────────── */
function applyMap(root, map) {
  for (const sel in map) {
    const v = map[sel];
    root.querySelectorAll(sel).forEach(el => {
      if ('o'  in v) el.style.opacity = v.o;
      if ('t'  in v || 'sc' in v) {
        const t = v.t || [0, 0], s = v.sc || [1, 1];
        el.style.transform = `translate(${t[0]}px,${t[1]}px) scale(${s[0]},${s[1]})`;
      }
      if ('f'  in v) el.style.fill = v.f;
      if ('st' in v) el.style.stroke = v.st;
      if ('do' in v) el.style.strokeDashoffset = (+el.dataset.len || 0) * v.do;
      if ('txt' in v) el.textContent = T(v.txt);
    });
  }
}

/* ── glossary decoration ───────────────────────────────────────── */
const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
function decorateNode(node, terms, used) {
  const txt = node.nodeValue;
  let best = null;
  for (const t of terms) {
    if (used.has(t.i)) continue;
    for (const w of t.words) {
      let m = null;
      try { m = new RegExp('(?<![\\p{L}\\p{N}_-])' + esc(w) + '(?![\\p{L}\\p{N}_-])', 'iu').exec(txt); } catch (e) { m = null; }
      if (m && (best === null || m.index < best.idx)) best = { idx: m.index, len: m[0].length, i: t.i };
    }
  }
  if (!best) return null;
  used.add(best.i);
  const after = node.splitText(best.idx + best.len);
  const mid   = node.splitText(best.idx);
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'gl';
  btn.dataset.g = best.i;
  btn.setAttribute('aria-label', T(UI.glossary) + ': ' + T(GLOSS[best.i].t));
  btn.textContent = mid.nodeValue;
  mid.parentNode.replaceChild(btn, mid);
  return after;
}
function decorate(root) {
  const used = new Set();
  const terms = GLOSS.map((g, i) => ({ i, words: g.m[LANG === 'fr' ? 1 : 0] }));
  root.querySelectorAll('.cptext, .cd, .pnlcard li, .mini p, .note, .seclead, .persona p').forEach(el => {
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    const nodes = [];
    let n;
    while ((n = walker.nextNode())) nodes.push(n);
    nodes.forEach(node => {
      if (!node.parentElement || node.parentElement.closest('.gl, code, b, strong')) return;
      let cur = node;
      while (cur) cur = decorateNode(cur, terms, used);
    });
  });
}
function closePop() { if (POP) { POP.remove(); POP = null; } }
document.addEventListener('click', e => {
  const b = e.target.closest('.gl');
  if (!b) { if (!e.target.closest('.glpop')) closePop(); return; }
  closePop();
  const g = GLOSS[+b.dataset.g];
  POP = document.createElement('div');
  POP.className = 'glpop';
  POP.innerHTML = `<b>${T(g.t)}</b><p>${T(g.d)}</p>`;
  document.body.appendChild(POP);
  const r = b.getBoundingClientRect();
  const w = Math.min(320, window.innerWidth - 24);
  POP.style.width = w + 'px';
  POP.style.left = Math.max(12, Math.min(window.innerWidth - w - 12, r.left + r.width / 2 - w / 2)) + 'px';
  const below = r.bottom + 8 + POP.offsetHeight < window.innerHeight;
  POP.style.top = (below ? r.bottom + 8 : r.top - POP.offsetHeight - 8) + window.scrollY + 'px';
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') closePop(); });
window.addEventListener('scroll', closePop, { passive: true });

/* ── view rendering ────────────────────────────────────────────── */
function renderView(v) {
  const p = document.createElement('section');
  p.className = 'panel';
  p.id = 'p-' + v.id;
  p.setAttribute('role', 'tabpanel');
  p.setAttribute('aria-labelledby', 't-' + v.id);
  p.tabIndex = 0;
  const st = v.stage;
  const who = WHO[v.id];
  const i = ORDER.indexOf(v.id);
  const prev = i > 0 ? ORDER[i - 1] : null;
  const next = i < ORDER.length - 1 ? ORDER[i + 1] : null;
  const HEAD = `
    <div class="rolehead">
      <div class="lead">
        <div class="eyebrow">${T(v.eyebrow)}</div>
        <h2>${T(v.title)}</h2>
        <p class="sub">${T(v.sub)}</p>
      </div>
      <div class="idcard">${v.id_card.map(([k, val, c]) =>
        `<div class="stat"><div class="k">${T(k)}</div><div class="v ${c}">${T(val)}</div></div>`).join('')}</div>
    </div>`;
  const NAV = `
    <nav class="viewnav">
      ${prev ? `<button class="btn" type="button" data-goto="${prev}">&larr; ${T(UI.prevView)} · ${T(TABLABEL[prev])}</button>` : '<span></span>'}
      ${next ? `<button class="btn primary" type="button" data-goto="${next}">${T(UI.nextView)} · ${T(TABLABEL[next])} &rarr;</button>` : '<span></span>'}
    </nav>`;
  if (v.custom) { p.innerHTML = HEAD + v.custom() + NAV; return p; }
  p.innerHTML = `
    <div class="rolehead">
      <div class="lead">
        <div class="eyebrow">${T(v.eyebrow)}</div>
        <h2>${T(v.title)}</h2>
        <p class="sub">${T(v.sub)}</p>
      </div>
      <div class="idcard">${v.id_card.map(([k, val, c]) =>
        `<div class="stat"><div class="k">${T(k)}</div><div class="v ${c}">${T(val)}</div></div>`).join('')}</div>
    </div>
    ${who ? `<div class="persona"><span class="av">${who.k}</span><div>
        <span class="nm">${T(UI.meet)} ${who.n}</span><p>${T(who.l)}</p></div></div>` : ''}
    <div class="work">
      <div class="card">
        <div class="hd"><h3>${T(st.title)}</h3><span class="tag">${T(st.tag)}</span></div>
        <div class="stagebox"><svg class="stage" viewBox="${st.vb}" role="img" aria-label="${T(st.title).replace(/"/g, '')}">${st.svg()}</svg></div>
        <div class="caption" data-cap aria-live="polite">
          <div class="ct"></div>
          <div class="cp"><span class="cplabel">${T(UI.inPlain)}</span><span class="cptext"></span></div>
          <div class="cd"></div>
        </div>
        <div class="ctrl">
          <button class="btn" data-prev type="button">${T(UI.prev)}</button>
          <button class="btn primary" data-play type="button">${T(UI.play)}</button>
          <button class="btn" data-next type="button">${T(UI.next)}</button>
          <div class="dots" data-dots></div>
        </div>
      </div>
      <div class="card rail" data-rail></div>
    </div>
    ${v.pnl ? `<div class="pnl">
      <div class="pnlcard win"><h4>${T(UI.win)}</h4><ul>${v.pnl.win.map(x => `<li>${T(x)}</li>`).join('')}</ul></div>
      <div class="pnlcard lose"><h4>${T(UI.lose)}</h4><ul>${v.pnl.lose.map(x => `<li>${T(x)}</li>`).join('')}</ul></div>
      <div class="pnlcard trap"><h4>${T(UI.trap)}</h4><ul>${v.pnl.trap.map(x => `<li>${T(x)}</li>`).join('')}</ul></div>
    </div>` : ''}
    ${v.extra ? v.extra() : ''}
    <nav class="viewnav">
      ${prev ? `<button class="btn" type="button" data-goto="${prev}">&larr; ${T(UI.prevView)} · ${T(TABLABEL[prev])}</button>` : '<span></span>'}
      ${next ? `<button class="btn primary" type="button" data-goto="${next}">${T(UI.nextView)} · ${T(TABLABEL[next])} &rarr;</button>` : '<span></span>'}
    </nav>`;
  return p;
}

function wire(p, v) {
  if (v.custom) return v.wireup ? v.wireup(p) : { stop() {}, render() {} };
  const svg   = p.querySelector('svg.stage');
  const steps = v.stage.steps;
  const plain = PLAIN[v.id] || [];
  svg.querySelectorAll('.rev').forEach(el => {
    let L = 0;
    try { L = el.getTotalLength(); } catch (e) { L = 0; }
    el.dataset.len = L;
    el.style.strokeDasharray = L + ' ' + L;
  });
  const rail  = p.querySelector('[data-rail]');
  const dots  = p.querySelector('[data-dots]');
  const cap   = p.querySelector('[data-cap]');
  const bPrev = p.querySelector('[data-prev]');
  const bNext = p.querySelector('[data-next]');
  const bPlay = p.querySelector('[data-play]');

  rail.innerHTML = steps.map((s, i) =>
    `<button class="step" type="button" data-i="${i}"><span class="n">${String(i + 1).padStart(2, '0')}</span><span class="t">${T(s.t)}</span></button>`).join('');
  dots.innerHTML = steps.map((s, i) =>
    `<button class="dot" type="button" data-i="${i}" aria-label="${T(UI.step)} ${i + 1}/${steps.length}"></button>`).join('');

  let i = 0, timer = null;
  function render(n, silent) {
    i = Math.max(0, Math.min(steps.length - 1, n));
    STATE.step[v.id] = i;
    applyMap(svg, v.stage.base);
    for (let k = 0; k <= i; k++) applyMap(svg, steps[k].set || {});
    const s = steps[i];
    cap.className = 'caption' + (s.tone ? ' ' + s.tone : '');
    cap.querySelector('.ct').textContent = String(i + 1).padStart(2, '0') + ' · ' + T(s.t);
    const pt = s.plain ? T(s.plain) : (plain[i] ? T(plain[i]) : '');
    cap.querySelector('.cp').hidden = !pt;
    cap.querySelector('.cptext').innerHTML = pt;
    cap.querySelector('.cd').innerHTML = T(s.d);
    decorate(cap);
    rail.querySelectorAll('.step').forEach((b, k) => {
      b.setAttribute('aria-current', k === i ? 'true' : 'false');
      b.classList.toggle('done', k < i);
    });
    dots.querySelectorAll('.dot').forEach((b, k) => {
      b.setAttribute('aria-current', k === i ? 'true' : 'false');
      b.classList.toggle('done', k < i);
    });
    bPrev.disabled = i === 0;
    bNext.disabled = i === steps.length - 1;
    if (!silent && STATE.tab === v.id) writeHash();
  }
  function stop() { if (timer) { clearTimeout(timer); timer = null; bPlay.innerHTML = T(UI.play); } }
  function play() {
    if (timer) { stop(); return; }
    if (i === steps.length - 1) render(0);
    bPlay.innerHTML = T(UI.pause);
    const pace = () => {
      const words = (cap.textContent || '').trim().split(/\s+/).length;
      return Math.min(22000, Math.max(5000, words * 300));
    };
    const tick = () => {
      if (i >= steps.length - 1) { stop(); return; }
      render(i + 1);
      timer = setTimeout(tick, pace());
    };
    timer = setTimeout(tick, pace());
  }
  bPrev.addEventListener('click', () => { stop(); render(i - 1); });
  bNext.addEventListener('click', () => { stop(); render(i + 1); });
  bPlay.addEventListener('click', play);
  rail.addEventListener('click', e => { const b = e.target.closest('.step'); if (b) { stop(); render(+b.dataset.i); } });
  dots.addEventListener('click', e => { const b = e.target.closest('.dot'); if (b) { stop(); render(+b.dataset.i); } });
  p.addEventListener('keydown', e => {
    if (e.target.closest('.tabs') || e.target.closest('.gl')) return;
    if (e.key === 'ArrowRight') { stop(); render(i + 1); }
    if (e.key === 'ArrowLeft')  { stop(); render(i - 1); }
  });
  render(STATE.step[v.id] || 0, true);
  decorate(p);
  return { stop, render };
}

/* ── chrome ────────────────────────────────────────────────────── */
function buildTabs() {
  let n = 0;
  TABBAR.innerHTML = GROUPS.map((g, gi) =>
    (gi ? '<div class="tabsep"></div>' : '') +
    (T(g.label).trim() ? `<span class="tabgroup">${T(g.label)}</span>` : '') +
    g.ids.map(id => `<button class="tab${id === 'quiz' ? ' tabcta' : ''}" role="tab" id="t-${id}" aria-controls="p-${id}" aria-selected="false"><span class="idx">${String(n++).padStart(2, '0')}</span>${T(TABLABEL[id])}</button>`).join('')
  ).join('');
  TABBAR.querySelectorAll('.tab').forEach(t => t.addEventListener('click', () => show(t.id.slice(2))));
}

function show(id, keepScroll) {
  if (!ORDER.includes(id)) id = 'start';
  STATE.tab = id;
  closePop();
  TABBAR.querySelectorAll('.tab').forEach(t => {
    const on = t.id === 't-' + id;
    t.setAttribute('aria-selected', on ? 'true' : 'false');
    t.tabIndex = on ? 0 : -1;
    if (on) t.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  });
  V.forEach(v => {
    const panel = document.getElementById('p-' + v.id);
    if (panel) panel.hidden = (v.id !== id);
  });
  Object.keys(CTRL).forEach(k => { if (k !== id) CTRL[k].stop(); });
  const n = ORDER.indexOf(id) + 1;
  document.getElementById('prog').innerHTML = `${T(UI.view)} <b>${String(n).padStart(2, '0')}</b> / ${ORDER.length}`;
  if (!keepScroll) window.scrollTo({ top: 0, behavior: 'smooth' });
  writeHash();
}

/* jump buttons: cast cards and the prev/next view nav */
document.addEventListener('click', e => {
  const b = e.target.closest('[data-goto]');
  if (b) show(b.dataset.goto);
});

/* ── deep links: #/view/step ───────────────────────────────────── */
let hashLock = false;
function writeHash() {
  const s = (STATE.step[STATE.tab] || 0) + 1;
  const h = '#/' + STATE.tab + (s > 1 ? '/' + s : '');
  if (location.hash === h) return;
  hashLock = true;
  history.replaceState(null, '', h);
  setTimeout(() => { hashLock = false; }, 0);
}
function readHash() {
  const m = /^#\/([a-z]+)(?:\/(\d+))?$/.exec(location.hash);
  if (!m || !ORDER.includes(m[1])) return false;
  STATE.tab = m[1];
  if (m[2]) STATE.step[m[1]] = Math.max(0, +m[2] - 1);
  return true;
}
window.addEventListener('hashchange', () => {
  if (hashLock) return;
  if (!readHash()) return;
  const c = CTRL[STATE.tab];
  if (c) c.render(STATE.step[STATE.tab] || 0, true);
  show(STATE.tab, true);
});

/* ── build ─────────────────────────────────────────────────────── */
function build() {
  Object.keys(CTRL).forEach(k => { CTRL[k].stop(); delete CTRL[k]; });
  closePop();
  MAIN.innerHTML = '';
  buildTabs();
  V.forEach(v => MAIN.appendChild(renderView(v)));
  V.forEach(v => { CTRL[v.id] = wire(document.getElementById('p-' + v.id), v); });
  show(STATE.tab, true);
  document.getElementById('kicker').textContent = T(UI.kicker);
  document.getElementById('foot').innerHTML = T(UI.foot);
  paintWallet();
  document.title = LANG === 'fr' ? 'Everything, le guide' : 'Everything, the guide';
}

/* ── toggles ───────────────────────────────────────────────────── */
function setLang(l) {
  LANG = (l === 'fr') ? 'fr' : 'en';
  try { localStorage.setItem('ev-lang', LANG); } catch (e) {}
  document.documentElement.lang = LANG;
  syncToggles();
  build();
}
function syncToggles() {
  document.querySelectorAll('.seg button[data-lang]').forEach(b =>
    b.setAttribute('aria-pressed', b.dataset.lang === LANG ? 'true' : 'false'));
}
document.querySelectorAll('.seg button[data-lang]').forEach(b =>
  b.addEventListener('click', () => { if (b.dataset.lang !== LANG) setLang(b.dataset.lang); }));
document.getElementById('theme').addEventListener('click', () => {
  const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  try { localStorage.setItem('ev-theme', next); } catch (e) {}
});

TABBAR.addEventListener('keydown', e => {
  if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
  e.preventDefault();
  const tabs = Array.from(TABBAR.querySelectorAll('.tab'));
  const cur = tabs.findIndex(t => t.getAttribute('aria-selected') === 'true');
  const nxt = (cur + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
  tabs[nxt].click();
  tabs[nxt].focus();
});

document.getElementById('wallet').addEventListener('click', () => {
  if (WALLET.addr) WALLET.disconnect(); else WALLET.connect();
});
if (WALLET.has()) {
  WALLET.provider.on && WALLET.provider.on('accountsChanged', a => WALLET._set(a && a[0]));
}
readHash();
syncToggles();
build();
WALLET.restore();
