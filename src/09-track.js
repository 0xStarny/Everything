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
  const body = JSON.stringify({ s: SESSION, e: QUEUE.splice(0, QUEUE.length) });
  try {
    if (navigator.sendBeacon) {
      navigator.sendBeacon(TRACK.endpoint, new Blob([body], { type: 'application/json' }));
    } else {
      fetch(TRACK.endpoint, { method: 'POST', body, keepalive: true,
        headers: { 'Content-Type': 'application/json' } });
    }
  } catch (e) { /* nothing here is worth an error */ }
}
addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') { depthOut(); flush(); } });
addEventListener('pagehide', () => { depthOut(); flush(); });

/* ── how far into a view somebody actually got ──────────────────
   One event per view, not one per step: the furthest step reached, sent when
   the reader leaves that view or the tab. That is the drop-off curve. */
const DEPTH = { id: null, max: 0, of: 0, at: 0 };
function depthIn(id, of) {
  /* A language switch re-renders the view in place. That is the same visit,
     not a new one, so the window is kept and only its length is refreshed —
     otherwise every toggle would post a one-second visit that reached step 1
     and the drop-off curve would be mostly noise. */
  if (DEPTH.id === id) { DEPTH.of = of; return false; }
  depthOut();
  DEPTH.id = id; DEPTH.max = 0; DEPTH.of = of; DEPTH.at = Date.now();
  return true;
}
function depthStep(id, i) {
  if (DEPTH.id === id && i > DEPTH.max) DEPTH.max = i;
}
function depthOut() {
  if (!DEPTH.id || !DEPTH.of) return;
  track('view_depth', {
    view: DEPTH.id,
    step: DEPTH.max + 1,
    of: DEPTH.of,
    pct: Math.round(((DEPTH.max + 1) / DEPTH.of) * 100),
    done: DEPTH.max === DEPTH.of - 1 ? 1 : 0,
    secs: Math.round((Date.now() - DEPTH.at) / 1000)
  });
  DEPTH.id = null;
}
