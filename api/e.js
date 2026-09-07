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
  'view_open', 'view_depth', 'view_complete', 'view_next_card',
  'quiz_gate', 'quiz_home', 'quiz_start', 'quiz_answer', 'quiz_reached_sign',
  'quiz_finish', 'quiz_sign_refused', 'badge_unlock',
  'which_answer', 'which_result',
  'search', 'search_open', 'search_pick', 'glossary', 'copy_diagram',
  'lang', 'theme'
]);

const clean = (v, max = 48) =>
  String(v == null ? '' : v).replace(/[^\w .:/@+-]/g, '').slice(0, max) || '-';

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
    case 'view_depth':
      /* the drop-off curve: how many readers got as far as each step */
      bump(`ev:depth:${clean(e.view)}`, `${e.step}/${e.of}`);
      bump('ev:view:done', e.done ? clean(e.view) : '-');
      out.push(['HINCRBY', `ev:secs:${clean(e.view)}`, 'total', Math.min(3600, +e.secs || 0)]);
      out.push(['HINCRBY', `ev:secs:${clean(e.view)}`, 'n', 1]);
      break;
    case 'view_complete': bump('ev:view:complete', e.view); break;
    case 'quiz_answer':
      /* right and wrong per question, plus which wrong answer they reached
         for, which names the misconception instead of only counting it */
      bump(`ev:q:${clean(e.q, 16)}`, e.correct ? 'right' : 'wrong');
      out.push(['HSET', `ev:q:${clean(e.q, 16)}`, 'view', clean(e.view)]);
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
  const events = (body && Array.isArray(body.e) ? body.e : []).slice(0, 40);
  if (!events.length) return res.status(204).end();

  const cmds = [];
  for (const e of events) {
    if (!e || !NAMES.has(e.n)) continue;
    cmds.push(...keysFor(e));
  }
  if (!cmds.length) return res.status(204).end();

  try { await pipeline(cmds.slice(0, 200)); } catch (err) { /* never the reader's problem */ }
  res.status(204).end();
}
