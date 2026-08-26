/* ══════════════ ENGINE ══════════════ */
const TABLABEL = {
  overview: ['The protocol', 'Le protocole'],
  trader:   ['Taker', 'Taker'],
  maker:    ['Maker', 'Maker'],
  lent:     ['Lent maker & Supplier', 'Maker lent & Supplier'],
  borrow:   ['Borrower', 'Borrower'],
  lev:      ['Leverage', 'Levier'],
  lp:       ['LP', 'LP'],
  band:     ['The band', 'Le band'],
  liq:      ['Liquidation', 'Liquidation']
};
const GROUPS = [
  { label: UI.gMech, ids: ['overview'] },
  { label: UI.gProf, ids: ['trader', 'maker', 'lent', 'borrow', 'lev', 'lp'] },
  { label: UI.gHood, ids: ['band', 'liq'] }
];

const STATE = { tab: 'overview', step: {} };
const CTRL = {};
const MAIN = document.getElementById('main');
const TABBAR = document.getElementById('tabs');

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

function renderView(v) {
  const p = document.createElement('section');
  p.className = 'panel';
  p.id = 'p-' + v.id;
  p.setAttribute('role', 'tabpanel');
  p.setAttribute('aria-labelledby', 't-' + v.id);
  p.tabIndex = 0;
  const st = v.stage;
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
    <div class="work">
      <div class="card">
        <div class="hd"><h3>${T(st.title)}</h3><span class="tag">${T(st.tag)}</span></div>
        <div class="stagebox"><svg class="stage" viewBox="${st.vb}" role="img" aria-label="${T(st.title).replace(/"/g, '')}">${st.svg()}</svg></div>
        <div class="caption" data-cap><div class="ct"></div><div class="cd"></div></div>
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
    ${v.extra ? v.extra() : ''}`;
  return p;
}

function wire(p, v) {
  const svg   = p.querySelector('svg.stage');
  const steps = v.stage.steps;
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
  function render(n) {
    i = Math.max(0, Math.min(steps.length - 1, n));
    STATE.step[v.id] = i;
    applyMap(svg, v.stage.base);
    for (let k = 0; k <= i; k++) applyMap(svg, steps[k].set || {});
    const s = steps[i];
    cap.className = 'caption' + (s.tone ? ' ' + s.tone : '');
    cap.querySelector('.ct').textContent = String(i + 1).padStart(2, '0') + ' · ' + T(s.t);
    cap.querySelector('.cd').innerHTML = T(s.d);
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
  }
  function stop() { if (timer) { clearInterval(timer); timer = null; bPlay.innerHTML = T(UI.play); } }
  function play() {
    if (timer) { stop(); return; }
    if (i === steps.length - 1) render(0);
    bPlay.innerHTML = T(UI.pause);
    timer = setInterval(() => { if (i >= steps.length - 1) { stop(); return; } render(i + 1); }, 3800);
  }
  bPrev.addEventListener('click', () => { stop(); render(i - 1); });
  bNext.addEventListener('click', () => { stop(); render(i + 1); });
  bPlay.addEventListener('click', play);
  rail.addEventListener('click', e => { const b = e.target.closest('.step'); if (b) { stop(); render(+b.dataset.i); } });
  dots.addEventListener('click', e => { const b = e.target.closest('.dot'); if (b) { stop(); render(+b.dataset.i); } });
  p.addEventListener('keydown', e => {
    if (e.target.closest('.tabs')) return;
    if (e.key === 'ArrowRight') { stop(); render(i + 1); }
    if (e.key === 'ArrowLeft')  { stop(); render(i - 1); }
  });
  render(STATE.step[v.id] || 0);
  return { stop, render };
}

function buildTabs() {
  let n = 0;
  TABBAR.innerHTML = GROUPS.map((g, gi) =>
    (gi ? '<div class="tabsep"></div>' : '') +
    `<span class="tabgroup">${T(g.label)}</span>` +
    g.ids.map(id => `<button class="tab" role="tab" id="t-${id}" aria-controls="p-${id}" aria-selected="false"><span class="idx">${String(n++).padStart(2, '0')}</span>${T(TABLABEL[id])}</button>`).join('')
  ).join('');
  TABBAR.querySelectorAll('.tab').forEach(t => {
    t.addEventListener('click', () => show(t.id.slice(2)));
  });
}

function show(id) {
  STATE.tab = id;
  TABBAR.querySelectorAll('.tab').forEach(t => {
    const on = t.id === 't-' + id;
    t.setAttribute('aria-selected', on ? 'true' : 'false');
    t.tabIndex = on ? 0 : -1;
  });
  V.forEach(v => {
    const panel = document.getElementById('p-' + v.id);
    if (panel) panel.hidden = (v.id !== id);
  });
  Object.keys(CTRL).forEach(k => { if (k !== id) CTRL[k].stop(); });
}

function build() {
  Object.keys(CTRL).forEach(k => { CTRL[k].stop(); delete CTRL[k]; });
  MAIN.innerHTML = '';
  buildTabs();
  V.forEach(v => { MAIN.appendChild(renderView(v)); });
  V.forEach(v => { CTRL[v.id] = wire(document.getElementById('p-' + v.id), v); });
  show(STATE.tab);
  document.getElementById('kicker').textContent = T(UI.kicker);
  document.getElementById('crumb').innerHTML = T(UI.crumb);
  document.getElementById('foot').innerHTML = T(UI.foot);
  document.title = LANG === 'fr' ? 'Everything, profil par profil' : 'Everything, profile by profile';
}

/* language toggle */
function setLang(l) {
  LANG = (l === 'fr') ? 'fr' : 'en';
  try { localStorage.setItem('ev-lang', LANG); } catch (e) {}
  document.documentElement.lang = LANG;
  document.querySelectorAll('[data-lang]').forEach(b =>
    b.setAttribute('aria-pressed', b.dataset.lang === LANG ? 'true' : 'false'));
  build();
}
document.querySelectorAll('[data-lang]').forEach(b =>
  b.addEventListener('click', () => { if (b.dataset.lang !== LANG) setLang(b.dataset.lang); }));

/* theme toggle */
document.getElementById('theme').addEventListener('click', () => {
  const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  try { localStorage.setItem('ev-theme', next); } catch (e) {}
});

/* tablist keyboard nav */
TABBAR.addEventListener('keydown', e => {
  if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
  e.preventDefault();
  const tabs = Array.from(TABBAR.querySelectorAll('.tab'));
  const cur = tabs.findIndex(t => t.getAttribute('aria-selected') === 'true');
  const nxt = (cur + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
  tabs[nxt].click();
  tabs[nxt].focus();
});

document.querySelectorAll('[data-lang]').forEach(b =>
  b.setAttribute('aria-pressed', b.dataset.lang === LANG ? 'true' : 'false'));
build();
