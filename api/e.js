/* ══════════════ THE COLLECTOR ══════════════

   Counters, not rows. Every event increments a handful of Redis keys and
   nothing else is stored: no IP, no user agent, no address, no cursor back to
   a person. What comes out the other side is "how many readers left the LP
   view at step 5" and "how often question 4F2A is answered wrong", which is
   all anyone needs to know where the explaining failed.

   Dormant until KV_REST_API_URL and KV_REST_API_TOKEN are set. Vercel KV and
   Upstash Redis both speak this REST API and both have a free tier; without
   them this returns 204 and the site behaves exactly as it did before. */

/* Vercel has injected these under two different names over time: KV_* when
   the store is created as Vercel KV, UPSTASH_* when it comes through the
   marketplace integration. Rather than guess which one your project got,
   take whichever is there. */
const URL_ = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || process.env.REDIS_REST_URL;
const TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || process.env.REDIS_REST_TOKEN;

const NAMES = new Set([
  'view_open', 'view_depth', 'view_complete', 'view_next_card', 'session',
  'lab_use', 'lab_set', 'quiz_abandon',
  'quiz_gate', 'quiz_home', 'quiz_start', 'quiz_answer', 'quiz_reached_sign',
  'quiz_finish', 'quiz_sign_refused', 'badge_unlock',
  'which_answer', 'which_result',
  'search', 'search_open', 'search_pick', 'glossary', 'copy_diagram',
  'lang', 'theme', 'path', 'first_move'
]);

/* Coarse on purpose. "Chrome on Android" is a fact about a rendering engine;
   a full user-agent string is a fingerprint, and this file is not in the
   business of holding one. */
function agent(ua) {
  ua = String(ua || '');
  const browser =
    /Edg\//.test(ua) ? 'Edge' :
    /OPR\/|Opera/.test(ua) ? 'Opera' :
    /Firefox\//.test(ua) ? 'Firefox' :
    /Chrome\//.test(ua) ? 'Chrome' :
    /Safari\//.test(ua) ? 'Safari' : 'other';
  const os =
    /Android/.test(ua) ? 'Android' :
    /iPhone|iPad|iPod/.test(ua) ? 'iOS' :
    /Mac OS X/.test(ua) ? 'macOS' :
    /Windows/.test(ua) ? 'Windows' :
    /Linux/.test(ua) ? 'Linux' : 'other';
  const bot = /bot|crawl|spider|preview|headless|lighthouse/i.test(ua) ? 1 : 0;
  return { browser, os, bot };
}

/* Vercel puts the geography on the request. Nothing has to be asked of the
   reader, no third party is involved, and the IP itself is never stored. */
function contextKeys(req, c) {
  const h = req.headers || {};
  const g = k => { try { return decodeURIComponent(h[k] || '') || null; } catch (e) { return h[k] || null; } };
  const { browser, os, bot } = agent(h['user-agent']);
  const now = new Date();
  const out = [];
  const bump = (hash, f) => out.push(['HINCRBY', hash, clean(f), 1]);

  if (bot) { bump('ev:bot', browser); return out; }

  bump('ev:geo:country', g('x-vercel-ip-country') || '??');
  bump('ev:geo:region', (g('x-vercel-ip-country') || '??') + '/' + (g('x-vercel-ip-country-region') || '?'));
  bump('ev:geo:city', g('x-vercel-ip-city') || '?');
  bump('ev:geo:tz', g('x-vercel-ip-timezone') || '?');
  bump('ev:browser', browser);
  bump('ev:os', os);
  bump('ev:hour', String(now.getUTCHours()).padStart(2, '0') + 'h UTC');
  bump('ev:dow', ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][now.getUTCDay()]);
  bump('ev:day', now.toISOString().slice(0, 10));

  if (c && typeof c === 'object') {
    bump('ev:referrer', c.ref || 'direct');
    if (c.src) bump('ev:campaign:source', c.src);
    if (c.campaign) bump('ev:campaign:name', c.campaign);
    if (c.medium) bump('ev:campaign:medium', c.medium);
    bump('ev:landing', c.landing || '/');
    bump('ev:width', c.w || '?');
    bump('ev:prefers', c.dark ? 'dark' : 'light');
    if (c.slowmo) bump('ev:prefers', 'reduced-motion');
    bump('ev:input', c.touch ? 'touch' : 'pointer');
    bump('ev:haswallet', c.wallet ? 'yes' : 'no');
  }
  return out;
}

/* Letters of any alphabet survive — a city called Chambéry should not be
   filed as Chambry — while anything that could be markup, a control character
   or a Redis path separator does not. */
const clean = (v, max = 48) =>
  String(v == null ? '' : v)
    .replace(/[^\p{L}\p{N} ._:/@+-]/gu, '')
    .trim()
    .slice(0, max) || '-';

/* One Redis pipeline for the whole batch, so a reader's whole visit costs a
   single round trip. */
async function pipeline(cmds) {
  const r = await fetch(URL_ + '/pipeline', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + TOKEN, 'Content-Type': 'application/json' },
    body: JSON.stringify(cmds)
  });
  if (!r.ok) throw new Error('kv ' + r.status);
  return r.json();
}

/* The keys each event turns into. Everything is a counter or a small hash, so
   the store stays a few kilobytes however much traffic arrives. */
function keysFor(ev) {
  const day = new Date().toISOString().slice(0, 10);
  const e = ev.p || {};
  const out = [['HINCRBY', 'ev:events', clean(ev.n), 1]];
  const bump = (h, f) => out.push(['HINCRBY', h, clean(f), 1]);

  switch (ev.n) {
    case 'view_open':
      bump('ev:view:open', e.view);
      bump(`ev:day:${day}`, 'view_open');
      break;
    case 'view_depth': {
      const v = clean(e.view);
      /* the drop-off curve: how many readers got as far as each step */
      bump(`ev:depth:${v}`, `${e.step}/${e.of}`);
      bump('ev:view:done', e.done ? v : '-');
      out.push(['HINCRBY', `ev:secs:${v}`, 'total', Math.min(3600, +e.secs || 0)]);
      out.push(['HINCRBY', `ev:secs:${v}`, 'n', 1]);
      out.push(['HINCRBY', `ev:secs:${v}`, 'scroll', Math.min(100, +e.scroll || 0)]);
      if (e.via) bump(`ev:via:${v}`, e.via);

      /* churn: how many moves it took to cover however many steps. A reader
         walking straight through spends of-1 moves; the excess is somebody
         going round again. */
      out.push(['HINCRBY', `ev:churn:${v}`, 'moves', Math.min(400, +e.moves || 0)]);
      /* Measured against the ground they actually covered, not the length of
         the whole view: somebody who read six steps needed five moves, and
         judging them against nine would hide the going-round-again. */
      out.push(['HINCRBY', `ev:churn:${v}`, 'min', Math.max(1, (+e.step || 1) - 1)]);
      out.push(['HINCRBY', `ev:churn:${v}`, 'back', Math.min(200, +e.back || 0)]);
      out.push(['HINCRBY', `ev:churn:${v}`, 'n', 1]);

      /* per-step: how long they sat on it, how often they showed it again,
         and how often they came BACK to it. The third is the one that names
         a passage nobody understood. */
      const each = (obj, key, cap) => {
        for (const k in (obj || {})) {
          const step = +k; const n = +obj[k];
          if (!Number.isFinite(step) || !Number.isFinite(n) || n <= 0) continue;
          if (step < 0 || step > 60) continue;
          out.push(['HINCRBY', `ev:${key}:${v}`, 's' + (step + 1), Math.min(cap, n)]);
        }
      };
      each(e.dwell, 'dwell', 600);
      each(e.replays, 'replay', 50);
      each(e.backs, 'back', 50);
      /* a denominator for the dwell average: how many readers saw each step */
      for (const k in (e.dwell || {})) {
        const step = +k;
        if (Number.isFinite(step) && step >= 0 && step <= 60)
          out.push(['HINCRBY', `ev:dwelln:${v}`, 's' + (step + 1), 1]);
      }
      break;
    }
    case 'session':
      bump('ev:session', 'visits');
      bump('ev:session:bounce', e.bounce ? 'yes' : 'no');
      out.push(['HINCRBY', 'ev:session', 'views', Math.min(200, +e.views || 0)]);
      out.push(['HINCRBY', 'ev:session', 'secs', Math.min(7200, +e.secs || 0)]);
      bump('ev:session:returning', e.returning ? 'yes' : 'no');
      bump('ev:entry', e.entry);
      bump('ev:exit', e.exit);
      bump('ev:device', e.device);
      break;
    case 'path':
      /* pushed directly: cleaning the joined string would eat the arrow */
      out.push(['HINCRBY', 'ev:path', clean(e.from, 20) + ' > ' + clean(e.to, 20), 1]);
      break;
    case 'first_move':
      out.push(['HINCRBY', `ev:hesitate:${clean(e.view)}`, 'total', Math.min(300, +e.secs || 0)]);
      out.push(['HINCRBY', `ev:hesitate:${clean(e.view)}`, 'n', 1]);
      break;
    case 'lab_use': bump('ev:lab', 'used'); break;
    case 'lab_set': bump(`ev:lab:${clean(e.dial, 8)}`, e.v); break;
    case 'quiz_abandon':
      bump(`ev:abandon:${clean(e.test)}`, 'q' + clean(e.at, 3));
      bump('ev:test:abandoned', e.test);
      break;
    case 'view_complete': bump('ev:view:complete', e.view); break;
    case 'quiz_answer':
      /* right and wrong per question, plus which wrong answer they reached
         for, which names the misconception instead of only counting it */
      bump(`ev:q:${clean(e.q, 16)}`, e.correct ? 'right' : 'wrong');
      out.push(['HSET', `ev:q:${clean(e.q, 16)}`, 'view', clean(e.view)]);
      out.push(['HINCRBY', `ev:q:${clean(e.q, 16)}`, 'secs', Math.min(300, +e.secs || 0)]);
      if (!e.correct) bump(`ev:qwrong:${clean(e.q, 16)}`, 'opt' + clean(e.chose, 2));
      bump('ev:test:answered', e.test);
      break;
    case 'quiz_finish':
      bump(`ev:test:${clean(e.test)}`, e.passed ? 'passed' : 'failed');
      bump(`ev:score:${clean(e.test)}`, `${e.score}/${e.of}`);
      break;
    case 'which_result': bump('ev:which', e.who); break;
    case 'search': bump('ev:search', String(e.q || '').toLowerCase()); break;
    case 'glossary': bump('ev:glossary', e.term); break;
    case 'copy_diagram': bump('ev:copy', e.view); break;
    case 'lang': bump('ev:lang', e.to); break;
    case 'theme': bump('ev:theme', e.to); break;
    default: bump('ev:misc', ev.n);
  }
  return out;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  if (!URL_ || !TOKEN) return res.status(204).end();   // dormant, by design

  let body = req.body;
  try { if (typeof body === 'string') body = JSON.parse(body); } catch (e) { return res.status(204).end(); }
  const events = (body && Array.isArray(body.e) ? body.e : []).slice(0, 60);
  if (!events.length) return res.status(204).end();

  const cmds = [];
  /* once per visit, not once per event */
  if (body.f) cmds.push(...contextKeys(req, body.c));
  for (const e of events) {
    if (!e || !NAMES.has(e.n)) continue;
    cmds.push(...keysFor(e));
  }
  if (!cmds.length) return res.status(204).end();

  try { await pipeline(cmds.slice(0, 600)); } catch (err) { /* never the reader's problem */ }
  res.status(204).end();
}
