/* ══════════════ WHAT THE GUIDE LEARNS ABOUT ITSELF ══════════════

   Page views tell you a page was opened. They do not tell you that eleven
   readers in twelve leave the LP view at step 5, or that the question about
   who absorbs a default is answered wrong two times in three. Those are the
   only numbers worth having, because they say where the explaining failed.

   This is a fan-out, not a provider. Whatever analytics is present receives
   the event; if none is, nothing happens and nothing throws. Everything sent
   is a short label or a number — no address, no wallet, no free text except a
   search query, truncated. The session id is random per tab and dies with it,
   so nobody is followed from one visit to the next. */

const TRACK = {
  /* Set to a path to also POST events to your own collector. api/e.js in this
     repo is one; it stays dormant until its store is configured. */
  endpoint: '/api/e',
  /* Flip to false to disable collection entirely. */
  on: true
};

const SESSION = (() => {
  try {
    let s = sessionStorage.getItem('ev-s');
    if (!s) { s = Math.random().toString(36).slice(2, 10); sessionStorage.setItem('ev-s', s); }
    return s;
  } catch (e) { return 'anon'; }
})();

const T0 = Date.now();
const QUEUE = [];
let FIRST = true;               /* the first batch of a visit carries context */

/* Where this reader came from, and under what campaign. Only the referrer's
   hostname is kept — never its path or query, which can carry things that are
   none of the guide's business. */
const CONTEXT = (() => {
  const q = new URLSearchParams(location.search);
  let ref = 'direct';
  try {
    if (document.referrer) {
      const h = new URL(document.referrer).hostname.replace(/^www\./, '');
      ref = h === location.hostname ? 'internal' : h;
    }
  } catch (e) {}
  const mq = m => { try { return matchMedia(m).matches; } catch (e) { return false; } };
  return {
    ref,
    src: (q.get('utm_source') || q.get('ref') || '').slice(0, 32) || null,
    campaign: (q.get('utm_campaign') || '').slice(0, 32) || null,
    medium: (q.get('utm_medium') || '').slice(0, 32) || null,
    landing: location.pathname.slice(0, 40),
    w: innerWidth < 400 ? '<400' : innerWidth < 700 ? '400-700'
      : innerWidth < 1100 ? '700-1100' : innerWidth < 1500 ? '1100-1500' : '1500+',
    dark: mq('(prefers-color-scheme: dark)') ? 1 : 0,
    slowmo: mq('(prefers-reduced-motion: reduce)') ? 1 : 0,
    touch: (navigator.maxTouchPoints || 0) > 0 ? 1 : 0,
    wallet: typeof window.ethereum !== 'undefined' ? 1 : 0
  };
})();

function track(name, props) {
  if (!TRACK.on) return;
  const d = { ...(props || {}), lang: typeof LANG === 'string' ? LANG : 'en' };
  try {
    /* Vercel Web Analytics. Custom events need a paid plan; on the free one
       this call is simply ignored, which is why it is not the only sink. */
    if (window.va) window.va('event', { name, data: d });
    /* Plausible, Umami and PostHog all take (name, props) in some shape. */
    if (window.plausible) window.plausible(name, { props: d });
    if (window.umami && window.umami.track) window.umami.track(name, d);
    if (window.posthog && window.posthog.capture) window.posthog.capture(name, d);
  } catch (e) { /* analytics must never break a page */ }
  if (TRACK.endpoint) {
    /* The properties are nested rather than spread. A property called `n` or
       `t` would otherwise overwrite the event's own name or timestamp, which
       is exactly what happened the first time this was written. */
    QUEUE.push({ n: name, t: Date.now() - T0, p: d });
    if (QUEUE.length >= 12) flush();
  }
}

/* Sent with sendBeacon so it survives the tab closing, which is exactly the
   moment the most interesting event — how far they got — is produced. */
function flush() {
  if (!QUEUE.length || !TRACK.endpoint) return;
  const body = JSON.stringify({
    s: SESSION,
    /* Context rides on the first batch only, so the country, the referrer and
       the device are counted once per visit rather than once per event. */
    f: FIRST ? 1 : 0,
    c: FIRST ? CONTEXT : undefined,
    e: QUEUE.splice(0, QUEUE.length)
  });
  FIRST = false;
  try {
    if (navigator.sendBeacon) {
      navigator.sendBeacon(TRACK.endpoint, new Blob([body], { type: 'application/json' }));
    } else {
      fetch(TRACK.endpoint, { method: 'POST', body, keepalive: true,
        headers: { 'Content-Type': 'application/json' } });
    }
  } catch (e) { /* nothing here is worth an error */ }
}
/* Hiding the tab is not leaving the view. Closing the view's record here
   would end the visit early — the rest of the reading, and every step they
   went back to after coming back, would never be counted — and it would post
   a second visit for the same view, which the drop-off curve counts as a
   second reader. So a hidden tab only stops the clock and sends what is
   already queued. The record itself closes when the view genuinely changes,
   or on pagehide, which fires on close and on mobile backgrounding alike. */
addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') flush(); });
addEventListener('pagehide', () => { viewOut(); sessionOut(); flush(); });

/* ── what a reader actually did inside a view ────────────────────
   One event per view, never one per step, but that one event carries the
   whole visit: how far they got, how long they sat on each step, which steps
   they showed more than once, and which steps they went back to. The last two
   are the interesting ones. Somebody moving forward is reading. Somebody
   moving backward has just decided that something did not make sense, and the
   step they land on is the one that failed them. */
const VIEW = {
  id: null, of: 0, at: 0, via: 'direct',
  max: 0, cur: -1, curAt: 0, moves: 0, scroll: 0,
  dwell: {}, shows: {}, backs: {}
};
let VIA = 'direct';                 /* how the next view is about to be reached */
const via = v => { VIA = v; };

function viewIn(id, of) {
  /* A language switch re-renders the view in place. That is the same visit,
     not a new one, so the window is kept and only its length is refreshed —
     otherwise every toggle would post a one-second visit that reached step 1
     and the drop-off curve would be mostly noise. */
  if (VIEW.id === id) { VIEW.of = of; return false; }
  viewOut();
  VIEW.id = id; VIEW.of = of; VIEW.at = Date.now(); VIEW.via = VIA;
  VIEW.max = 0; VIEW.cur = -1; VIEW.curAt = 0; VIEW.moves = 0; VIEW.scroll = 0;
  VIEW.dwell = {}; VIEW.shows = {}; VIEW.backs = {};
  VIA = 'direct';
  /* the actual reading path, as transitions: which view leads to which */
  const prev = SESSION_VIEWS[SESSION_VIEWS.length - 1];
  if (prev) track('path', { from: prev, to: id });
  SESSION_VIEWS.push(id);
  return true;
}

/* Close the running step's clock. Capped, because a tab left open overnight
   is not a reader thinking hard about step 4. */
function closeStep() {
  if (VIEW.cur < 0 || !VIEW.curAt) return;
  const s = Math.min(600, Math.round((Date.now() - VIEW.curAt) / 1000));
  VIEW.dwell[VIEW.cur] = (VIEW.dwell[VIEW.cur] || 0) + s;
  VIEW.curAt = 0;
}

function viewStep(id, i) {
  if (VIEW.id !== id) return;
  if (VIEW.cur === i) { if (!VIEW.curAt) VIEW.curAt = Date.now(); return; }
  if (VIEW.cur >= 0) {
    closeStep();
    VIEW.moves++;
    /* how long they looked at the first panel before deciding to move: the
       gap between arriving and understanding that this thing walks */
    if (VIEW.cur === 0 && VIEW.moves === 1)
      track('first_move', { view: id, secs: Math.min(300, Math.round((Date.now() - VIEW.at) / 1000)) });
    if (i < VIEW.cur) VIEW.backs[i] = (VIEW.backs[i] || 0) + 1;
  }
  VIEW.cur = i; VIEW.curAt = Date.now();
  VIEW.shows[i] = (VIEW.shows[i] || 0) + 1;
  if (i > VIEW.max) VIEW.max = i;
}

/* how far down the page they read, not just how far through the steps */
function viewScroll(pct) { if (pct > VIEW.scroll) VIEW.scroll = Math.min(100, pct); }

/* Only the steps with something to say are sent. A step nobody lingered on,
   replayed or came back to contributes nothing and costs nothing. */
const sparse = (obj, min) => {
  const out = {};
  for (const k in obj) if (obj[k] >= (min || 1)) out[k] = obj[k];
  return out;
};

function viewOut() {
  if (!VIEW.id || !VIEW.of) return;
  closeStep();
  const back = Object.values(VIEW.backs).reduce((a, b) => a + b, 0);
  const replays = sparse(VIEW.shows, 2);
  track('view_depth', {
    view: VIEW.id,
    step: VIEW.max + 1,
    of: VIEW.of,
    pct: Math.round(((VIEW.max + 1) / VIEW.of) * 100),
    done: VIEW.max === VIEW.of - 1 ? 1 : 0,
    secs: Math.min(3600, Math.round((Date.now() - VIEW.at) / 1000)),
    via: VIEW.via,
    /* the churn: how many moves it took to cover however many steps. A reader
       who walks straight through spends of-1 moves. Everything above that is
       somebody going round again. */
    moves: VIEW.moves,
    back,
    scroll: VIEW.scroll,
    dwell: sparse(VIEW.dwell, 1),
    replays,
    backs: VIEW.backs
  });
  VIEW.id = null;
}

/* ── the shape of a whole visit ──────────────────────────────── */
const SESSION_VIEWS = [];
let SESSION_SENT = false;
function sessionOut() {
  if (SESSION_SENT || !SESSION_VIEWS.length) return;
  SESSION_SENT = true;
  track('session', {
    views: SESSION_VIEWS.length,
    unique: new Set(SESSION_VIEWS).size,
    secs: Math.min(7200, Math.round((Date.now() - T0) / 1000)),
    entry: SESSION_VIEWS[0],
    exit: SESSION_VIEWS[SESSION_VIEWS.length - 1],
    device: innerWidth < 700 ? 'phone' : innerWidth < 1100 ? 'tablet' : 'desktop',
    returning: RETURNING ? 1 : 0,
    bounce: SESSION_VIEWS.length <= 1 && (Date.now() - T0) < 20000 ? 1 : 0
  });
}

/* Whether this browser has been here before. A boolean, not an identifier:
   there is nothing here to join two visits together with. */
const RETURNING = (() => {
  try {
    /* NOT 'ev-seen': that key already belongs to the sidebar's list of views
       this reader has finished, and writing a string over its array broke
       every call into show(). Named for what it is. */
    const been = localStorage.getItem('ev-returning') === '1';
    localStorage.setItem('ev-returning', '1');
    return been;
  } catch (e) { return false; }
})();

/* Pausing on a hidden tab keeps "time on step" meaning time spent reading,
   not time spent with the laptop shut. */
addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') closeStep();
  else if (VIEW.id && VIEW.cur >= 0) VIEW.curAt = Date.now();
});
