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
  quiz:     ['Take the tests', 'Passez les tests'],
  which:    ['Which of the six are you?', 'Lequel des six êtes-vous ?'],
  capacity: ['How much can be borrowed', "Combien on peut emprunter"],
  recap:    ['One day, one pool', 'Une journée, une réserve']
};
const GROUPS = [
  { label: [' ', ' '], ids: ['start'] },
  { label: ['Mechanics', 'Mécanique'], ids: ['overview', 'curve'] },
  { label: ['The six', 'Les six'], ids: ['which', 'trader', 'maker', 'lent', 'borrow', 'lev', 'lp'] },
  { label: ['Under the hood', 'Sous le capot'], ids: ['band', 'liq', 'capacity'] },
  { label: ['Putting it together', 'Tout ensemble'], ids: ['recap'] },
  { label: ['Test yourself', 'Testez-vous'], ids: ['quiz'] }
];
const ORDER = GROUPS.flatMap(g => g.ids);

const STATE = { tab: 'start', step: {} };
const CTRL = {};
/* Whether this reader has ever advanced a step. Until they have, the button
   that moves the walkthrough on is pulsed, because a diagram that only ever
   shows its first state reads as a diagram, not as a walkthrough. */
let NUDGED = (() => { try { return localStorage.getItem('ev-stepped') === '1'; } catch (e) { return true; } })();
function markNudged() {
  if (NUDGED) return;
  NUDGED = true;
  try { localStorage.setItem('ev-stepped', '1'); } catch (e) {}
  document.querySelectorAll('.btn.step.nudge').forEach(b => b.classList.remove('nudge'));
}
const MAIN = document.getElementById('main');
const NAV = document.getElementById('nav');
const SEENKEY = 'ev-seen';
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
  track('glossary', { term: T(g.t) });
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
  /* Every view opens on the same block: an eyebrow, a title, a line of
     explanation, the id card underneath, and the view's own figure ghosted
     into the corner. Views with nobody in them borrow the mark instead. The
     first view already has the hero, so it takes the plain variant. */
  const ART = v.id === 'start' ? ''
    : `<span class="mh-art${who ? '' : ' logo'}">${who ? MARK(v.id) : LOGOMARK}</span>`;
  const HEAD = `
    <header class="masthead${v.id === 'start' ? ' bare' : ''}">
      ${ART}
      <div class="lead">
        <div class="eyebrow">${T(v.eyebrow)}</div>
        <h2>${T(v.title)}</h2>
        <p class="sub">${T(v.sub)}</p>
      </div>
      <div class="idcard">${v.id_card.map(([k, val, c]) =>
        `<div class="stat"><div class="k">${T(k)}</div><div class="v ${c}">${T(val)}</div></div>`).join('')}</div>
    </header>`;
  const NAV = `
    <nav class="viewnav">
      ${[[prev, 'prev'], [next, 'next']].map(([id, dir]) => id ? `
        <button class="navcard ${dir}" type="button" data-goto="${id}">
          <span class="nc-art">${WHO[id] ? MARK(id) : LOGOMARK}</span>
          <span class="nc-dir">${dir === 'prev' ? '&larr; ' : ''}${T(dir === 'prev' ? UI.prevView : UI.nextView)}${dir === 'next' ? ' &rarr;' : ''}</span>
          <span class="nc-t">${T(TABLABEL[id])}</span>
        </button>` : '<span></span>').join('')}
    </nav>`;
  // the tests are a destination, not a step in the reading sequence
  const TOP = v.top ? v.top() : '';
  if (v.custom) { p.innerHTML = TOP + HEAD + v.custom(); return p; }
  p.innerHTML = TOP + HEAD + `
    ${who ? `<div class="persona"><span class="av">${MARK(v.id)}</span><div>
        <span class="nm">${T(UI.meet)} ${who.n}</span><p>${T(who.l)}</p></div></div>` : ''}
    <div class="work">
      <div class="card">
        <div class="hd"><h3>${T(st.title)}</h3>
          <span class="hdr">
            <button class="ghost" type="button" data-copysvg title="${T(SH.copyDiagram)}">
              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V6a2 2 0 0 1 2-2h9"/></svg>
              ${T(SH.copyDiagram)}</button>
            <span class="tag">${T(st.tag)}</span></span></div>
        <div class="stagewrap"><div class="stagebox"><svg class="stage" viewBox="${st.vb}" role="img" aria-label="${T(st.title).replace(/"/g, '')}">${st.svg()}</svg></div></div>
        <div class="caption" data-cap aria-live="polite">
          <div class="ct"></div>
          <div class="cp"><span class="cplabel">${T(UI.inPlain)}</span><span class="cptext"></span></div>
          <div class="cd"></div>
        </div>
        <div class="ctrl">
          <button class="btn" data-prev type="button">${T(UI.prev)}</button>
          <div class="dots" data-dots></div>
          <span class="stepof mono" data-count></span>
          <span class="keyhint">${T(UI.keyHint)}</span>
          <button class="btn primary step" data-next type="button">
            <span data-nextlabel>${T(UI.nextStep)}</span></button>
        </div>
      </div>
    </div>
    ${v.pnl ? `<div class="pnl">
      <div class="pnlcard win"><h4>${T(UI.win)}</h4><ul>${v.pnl.win.map(x => `<li>${T(x)}</li>`).join('')}</ul></div>
      <div class="pnlcard lose"><h4>${T(UI.lose)}</h4><ul>${v.pnl.lose.map(x => `<li>${T(x)}</li>`).join('')}</ul></div>
      <div class="pnlcard trap"><h4>${T(UI.trap)}</h4><ul>${v.pnl.trap.map(x => `<li>${T(x)}</li>`).join('')}</ul></div>
    </div>` : ''}
    ${v.extra ? v.extra() : ''}
    ${QUOTES[v.id] ? `<figure class="pull">
      <blockquote>${T(QUOTES[v.id])}</blockquote>
    </figure>` : ''}
    <nav class="viewnav">
      ${[[prev, 'prev'], [next, 'next']].map(([id, dir]) => id ? `
        <button class="navcard ${dir}" type="button" data-goto="${id}">
          <span class="nc-art">${WHO[id] ? MARK(id) : LOGOMARK}</span>
          <span class="nc-dir">${dir === 'prev' ? '&larr; ' : ''}${T(dir === 'prev' ? UI.prevView : UI.nextView)}${dir === 'next' ? ' &rarr;' : ''}</span>
          <span class="nc-t">${T(TABLABEL[id])}</span>
        </button>` : '<span></span>').join('')}
    </nav>`;
  return p;
}

function wireShare(p, v) {
  const cs = p.querySelector('[data-copysvg]');
  if (cs) cs.addEventListener('click', async () => {
    try {
      await copyBlob(await svgToPng(p.querySelector('svg.stage'), { footer: T(v.title) }));
      track('copy_diagram', { view: v.id });
      flash(cs, true);
    } catch (e) { flash(cs, false); }
  });
}

function wire(p, v) {
  wireShare(p, v);
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
  const dots  = p.querySelector('[data-dots]');
  const cap   = p.querySelector('[data-cap]');
  const bPrev  = p.querySelector('[data-prev]');
  const bNext  = p.querySelector('[data-next]');
  const bCount = p.querySelector('[data-count]');
  const bLabel = p.querySelector('[data-nextlabel]');

  dots.innerHTML = steps.map((s, i) =>
    `<button class="dot" type="button" data-i="${i}" aria-label="${T(UI.step)} ${i + 1}/${steps.length}"></button>`).join('');

  let i = 0;
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
    if (STATE.tab === v.id) paintSteps();
    dots.querySelectorAll('.dot').forEach((b, k) => {
      b.setAttribute('aria-current', k === i ? 'true' : 'false');
      b.classList.toggle('done', k < i);
    });
    bPrev.disabled = i === 0;
    const last = i === steps.length - 1;
    bNext.disabled = last;
    bLabel.innerHTML = T(last ? UI.lastStep : UI.nextStep);
    bCount.textContent = (i + 1) + ' / ' + steps.length;
    /* The button is nudged until somebody has advanced a step once, ever.
       After that the guide assumes they know how it works. */
    bNext.classList.toggle('nudge', !last && !NUDGED);
    depthStep(v.id, i);
    if (last) track('view_complete', { view: v.id, of: steps.length });
    if (!silent && STATE.tab === v.id) writePath(false);
  }
  /* Kept as a no-op: the search palette and the deep-link router both stop a
     view's controller before scrubbing it to a step. There is nothing left to
     stop, but there is no reason to make every caller check. */
  function stop() {}
  const step = d => { markNudged(); render(i + d); };
  bPrev.addEventListener('click', () => step(-1));
  bNext.addEventListener('click', () => step(1));
  dots.addEventListener('click', e => { const b = e.target.closest('.dot'); if (b) { markNudged(); render(+b.dataset.i); } });
  p.addEventListener('keydown', e => {
    if (e.target.closest('.tabs') || e.target.closest('.gl')) return;
    if (e.key === 'ArrowRight') { step(1); e.preventDefault(); }
    if (e.key === 'ArrowLeft')  { step(-1); e.preventDefault(); }
  });
  render(STATE.step[v.id] || 0, true);
  decorate(p);
  /* the fade on the right of a scrolling diagram, only while there is more */
  const sw = p.querySelector('.stagewrap'), sb = p.querySelector('.stagebox');
  if (sw && sb) {
    const edge = () => sw.classList.toggle('atend', sb.scrollLeft >= sb.scrollWidth - sb.clientWidth - 2);
    sb.addEventListener('scroll', edge, { passive: true });
    addEventListener('resize', edge);
    requestAnimationFrame(edge);
  }
  if (v.wireExtra) v.wireExtra(p);
  return { stop, render };
}

/* ── chrome ────────────────────────────────────────────────────── */
function buildNav() {
  let n = 0;
  NAV.innerHTML = GROUPS.map(g =>
    `<div class="navgroup${g.ids.includes('quiz') ? ' navpin' : ''}">${T(g.label).trim() ? `<div class="navlabel">${T(g.label)}</div>` : ''}` +
    g.ids.map(id => {
      const num = String(n++).padStart(2, '0');
      return `<button class="navitem${(id === 'quiz' || id === 'which') ? ' navcta' : ''}" type="button" role="tab"
        id="n-${id}" aria-controls="p-${id}" aria-selected="false" data-nav="${id}">
        <span class="ni mono">${num}</span><span class="nt">${T(TABLABEL[id])}</span>
        <span class="nk" data-tick="${id}"></span></button>
      <div class="navsteps" data-steps="${id}"></div>`;
    }).join('') + '</div>').join('');
  NAV.querySelectorAll('[data-nav]').forEach(b =>
    b.addEventListener('click', () => { show(b.dataset.nav); closeNav(); }));
  paintTicks();
}

function seen() { try { return JSON.parse(localStorage.getItem(SEENKEY) || '[]'); } catch (e) { return []; } }
function markSeen(id) {
  const a = seen();
  if (a.includes(id)) return;
  a.push(id);
  try { localStorage.setItem(SEENKEY, JSON.stringify(a)); } catch (e) {}
}
function paintTicks() {
  const a = seen();
  NAV.querySelectorAll('[data-tick]').forEach(el => {
    const id = el.dataset.tick;
    if (id === 'which') { el.textContent = '30s'; return; }
    if (id === 'quiz') {
      const prog = (typeof myProg === 'function') ? myProg() : {};
      const done = QUIZZES.filter(q => prog[q.id] && prog[q.id].s >= needOf(q)).length;
      el.textContent = `${done}/${QUIZZES.length}`;
    } else {
      el.textContent = a.includes(id) ? '✓' : '';
      el.closest('.navitem').classList.toggle('seen', a.includes(id));
    }
  });
}

/* the open view's steps, nested under it */
function paintSteps() {
  NAV.querySelectorAll('.navsteps').forEach(el => { el.className = 'navsteps'; el.innerHTML = ''; });
  const v = V.find(x => x.id === STATE.tab);
  if (!v || !v.stage) return;
  const box = NAV.querySelector(`[data-steps="${STATE.tab}"]`);
  if (!box) return;
  const cur = STATE.step[STATE.tab] || 0;
  box.className = 'navsteps open';
  box.innerHTML = v.stage.steps.map((s, i) =>
    `<button class="navstep${i < cur ? ' done' : ''}" type="button" data-i="${i}" aria-current="${i === cur}">
      <b>${String(i + 1).padStart(2, '0')}</b><span>${T(s.t)}</span></button>`).join('');
  box.querySelectorAll('[data-i]').forEach(b =>
    b.addEventListener('click', () => { const c = CTRL[STATE.tab]; if (c) { c.stop(); c.render(+b.dataset.i); } }));
}

function closeNav() {
  NAV.classList.remove('open');
  document.getElementById('veil').hidden = true;
  document.getElementById('menu').setAttribute('aria-expanded', 'false');
}

function show(id, keepScroll, fromPop) {
  if (!ORDER.includes(id)) id = 'start';
  STATE.tab = id;
  closePop();
  markSeen(id);
  NAV.querySelectorAll('.navitem').forEach(t => {
    const on = t.id === 'n-' + id;
    t.setAttribute('aria-selected', on ? 'true' : 'false');
    t.setAttribute('aria-current', on ? 'true' : 'false');
    t.tabIndex = on ? 0 : -1;
  });
  paintTicks();
  paintSteps();
  setTitle();
  V.forEach(v => {
    const panel = document.getElementById('p-' + v.id);
    if (panel) panel.hidden = (v.id !== id);
  });
  Object.keys(CTRL).forEach(k => { if (k !== id) CTRL[k].stop(); });
  const n = ORDER.indexOf(id) + 1;
  document.getElementById('prog').innerHTML = `${T(UI.view)} <b>${String(n).padStart(2, '0')}</b> / ${ORDER.length}`;
  // the whitepaper attribution belongs under the guide, not under the tests
  document.getElementById('foot').hidden = (id === 'quiz' || id === 'which');
  if (!keepScroll) window.scrollTo({ top: 0, behavior: 'smooth' });
  requestAnimationFrame(paintScroll);
  const vv = V.find(x => x.id === id);
  /* only a genuine change of view is an opening */
  if (depthIn(id, vv && vv.stage ? vv.stage.steps.length : 1)) track('view_open', { view: id });
  const panel = document.getElementById('p-' + id);
  if (panel) { panel.classList.remove('enter'); void panel.offsetWidth; panel.classList.add('enter'); }
  writePath(!fromPop);
}

/* jump buttons: cast cards and the prev/next view nav */
document.addEventListener('click', e => {
  const b = e.target.closest('[data-goto]');
  if (b) show(b.dataset.goto);
});

/* ── how far down the page you are ──────────────────────────── */
const SCROLLBAR = document.getElementById('scrollbar');
function paintScroll() {
  const d = document.documentElement;
  const max = d.scrollHeight - d.clientHeight;
  SCROLLBAR.style.transform = `scaleX(${max > 40 ? Math.min(1, d.scrollTop / max) : 0})`;
}
addEventListener('scroll', paintScroll, { passive: true });
addEventListener('resize', paintScroll);

/* ── search ─────────────────────────────────────────────────── */
function searchIndex() {
  const out = [];
  V.forEach(v => {
    out.push({ k: 'view', id: v.id, i: 0, t: T(v.title), s: T(v.eyebrow) });
    (v.stage ? v.stage.steps : []).forEach((st, i) =>
      out.push({ k: 'step', id: v.id, i, t: T(st.t), s: T(TABLABEL[v.id]) }));
  });
  GLOSS.forEach((g, i) => out.push({ k: 'term', gi: i, t: T(g.t), s: T(UI.glossary) }));
  return out;
}
function openSearch() {
  let box = document.getElementById('pal');
  if (!box) {
    box = document.createElement('div');
    box.id = 'pal';
    box.innerHTML = `<div class="palbox" role="dialog" aria-modal="true">
      <input class="palin" type="search" autocomplete="off" spellcheck="false" placeholder="${T(UI.searchPh)}">
      <div class="palout"></div>
      <div class="palfoot"><span><kbd>&uarr;</kbd><kbd>&darr;</kbd> ${T(UI.palMove)}</span><span><kbd>&crarr;</kbd> ${T(UI.palOpen)}</span><span><kbd>esc</kbd> ${T(UI.palClose)}</span></div></div>`;
    document.body.appendChild(box);
    box.addEventListener('click', e => { if (e.target === box) closeSearch(); });
  }
  box.hidden = false;
  const inp = box.querySelector('.palin'), out = box.querySelector('.palout');
  const idx = searchIndex();
  let sel = 0, hits = [];
  const paint = () => {
    const q = inp.value.trim().toLowerCase();
    hits = (q ? idx.filter(r => r.t.toLowerCase().includes(q) || r.s.toLowerCase().includes(q)) : idx.filter(r => r.k === 'view')).slice(0, 40);
    sel = Math.min(sel, Math.max(0, hits.length - 1));
    out.innerHTML = hits.map((r, i) =>
      `<button class="palrow${i === sel ? ' on' : ''}" data-i="${i}"><span class="palk">${r.k === 'term' ? '𝐚' : r.k === 'view' ? '§' : '›'}</span><span class="palt">${r.t}</span><em>${r.s}</em></button>`).join('')
      || `<div class="palnone">${T(UI.searchNone)}</div>`;
    out.querySelectorAll('.palrow').forEach(b => b.addEventListener('click', () => go(+b.dataset.i)));
  };
  const go = i => {
    const r = hits[i];
    if (!r) return;
    track('search_pick', { q: inp.value.trim().slice(0, 60), kind: r.k, to: r.id || r.t });
    closeSearch();
    if (r.k === 'term') { show('start'); setTimeout(() => {
      const rows = document.querySelectorAll('#p-start tbody tr');
      if (rows[r.gi]) { rows[r.gi].scrollIntoView({ block: 'center' }); rows[r.gi].classList.add('flashrow');
        setTimeout(() => rows[r.gi].classList.remove('flashrow'), 1800); }
    }, 120); return; }
    show(r.id);
    const c = CTRL[r.id];
    if (c) { c.stop(); c.render(r.i); }
  };
  inp.value = ''; paint(); inp.focus();
  track('search_open', {});
  let qt = null;
  inp.oninput = () => {
    paint();
    clearTimeout(qt);
    /* one event per query, once they have stopped typing it */
    qt = setTimeout(() => {
      const q = inp.value.trim();
      if (q.length >= 3) track('search', { q: q.slice(0, 60), hits: hits.length });
    }, 900);
  };
  inp.onkeydown = e => {
    if (e.key === 'ArrowDown') { sel = Math.min(sel + 1, hits.length - 1); paint(); e.preventDefault(); }
    if (e.key === 'ArrowUp') { sel = Math.max(sel - 1, 0); paint(); e.preventDefault(); }
    if (e.key === 'Enter') { go(sel); e.preventDefault(); }
    if (e.key === 'Escape') closeSearch();
  };
}
function closeSearch() { const b = document.getElementById('pal'); if (b) b.hidden = true; }
document.addEventListener('keydown', e => {
  if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !/input|textarea/i.test(e.target.tagName))) {
    e.preventDefault(); openSearch();
  }
});

/* ── routing: real paths, so every deep link carries its own card ── */
const PATHOF = {}, IDOF = {};
let ROOTID = 'start';
ROUTES.views.forEach(v => {
  PATHOF[v.id] = v.path;
  IDOF[v.path] = v.id;
  if (v.root) { ROOTID = v.id; IDOF[''] = v.id; }
});

const TITLEOF = {};
ROUTES.views.forEach(v => { TITLEOF[v.id] = v.title; });
function setTitle() {
  const site = LANG === 'fr' ? 'Everything, le guide' : 'Everything, the guide';
  const t = TITLEOF[STATE.tab];
  document.title = (t && STATE.tab !== ROOTID) ? `${t} · ${site}` : `${site} · ${ROUTES.site.tagline}`;
}

function urlFor(id, step) {
  const seg = PATHOF[id] || '';
  const n = (step || 0) + 1;
  if (id === ROOTID && n === 1) return '/';
  return '/' + seg + (n > 1 ? '/' + n : '');
}
const samePath = (a, b) => a.replace(/\/+$/, '') === b.replace(/\/+$/, '');
let navLock = false;
function writePath(push) {
  const u = urlFor(STATE.tab, STATE.step[STATE.tab]);
  if (samePath(location.pathname, u)) return;
  navLock = true;
  try { history[push ? 'pushState' : 'replaceState'](null, '', u); } catch (e) {}
  setTimeout(() => { navLock = false; }, 0);
}
function readPath() {
  const parts = location.pathname.split('/').filter(Boolean);
  const id = IDOF[parts[0] || ''];
  if (id === undefined) return false;
  STATE.tab = id;
  const n = parseInt(parts[1], 10);
  if (!isNaN(n)) STATE.step[id] = Math.max(0, n - 1);
  return true;
}
window.addEventListener('popstate', () => {
  if (navLock) return;
  if (!readPath()) return;
  const c = CTRL[STATE.tab];
  if (c) c.render(STATE.step[STATE.tab] || 0, true);
  show(STATE.tab, true, true);
});

/* ── build ─────────────────────────────────────────────────────── */
function build() {
  Object.keys(CTRL).forEach(k => { CTRL[k].stop(); delete CTRL[k]; });
  closePop();
  MAIN.innerHTML = '';
  buildNav();
  V.forEach(v => MAIN.appendChild(renderView(v)));
  V.forEach(v => { CTRL[v.id] = wire(document.getElementById('p-' + v.id), v); });
  show(STATE.tab, true);
  document.getElementById('kicker').textContent = T(UI.kicker);
  document.getElementById('foot').innerHTML = T(UI.foot);
  document.querySelector('.skip').textContent = T(UI.skip);
  paintWallet();
  setTitle();
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

NAV.addEventListener('keydown', e => {
  if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
  const items = Array.from(NAV.querySelectorAll('.navitem'));
  if (!items.includes(document.activeElement)) return;
  e.preventDefault();
  const cur = items.indexOf(document.activeElement);
  const nxt = (cur + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length;
  items[nxt].focus();
});
document.addEventListener('click', e => {
  const l = e.target.closest('.seg button[data-lang]');
  if (l) track('lang', { to: l.dataset.lang });
  if (e.target.closest('#theme')) track('theme', { to: document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark' });
  const n = e.target.closest('.navcard');
  if (n) track('view_next_card', { to: n.dataset.goto, dir: n.classList.contains('next') ? 'next' : 'prev' });
});
document.getElementById('search').addEventListener('click', openSearch);
document.getElementById('menu').addEventListener('click', () => {
  const open = NAV.classList.toggle('open');
  document.getElementById('veil').hidden = !open;
  document.getElementById('menu').setAttribute('aria-expanded', String(open));
});
document.getElementById('veil').addEventListener('click', closeNav);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeNav(); });

document.getElementById('wallet').addEventListener('click', () => {
  if (WALLET.addr) WALLET.disconnect(); else WALLET.connect();
});
if (WALLET.has()) {
  WALLET.provider.on && WALLET.provider.on('accountsChanged', a => WALLET._set(a && a[0]));
}
readPath();
syncToggles();
build();
WALLET.restore();
