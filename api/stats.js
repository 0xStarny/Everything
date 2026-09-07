/* ══════════════ READING THE COUNTERS BACK ══════════════

   GET /api/stats?key=… returns everything api/e.js has collected, already
   shaped into the four questions worth asking:

     dropoff   where readers stop, per view, as a curve
     hardest   which questions are answered wrong most often
     searched  what people went looking for
     looked_up which glossary terms they had to click

   Guarded by STATS_KEY so the numbers are yours, not everyone's. */

import { readFileSync } from 'node:fs';

/* Read rather than `import ... with { type: 'json' }`, which only parses on
   Node 22 and up. This works on every runtime Vercel offers. */
const QUESTIONS = (() => {
  try { return JSON.parse(readFileSync(new URL('./questions.json', import.meta.url), 'utf8')); }
  catch (e) { return {}; }
})();

/* Vercel has injected these under two different names over time: KV_* when
   the store is created as Vercel KV, UPSTASH_* when it comes through the
   marketplace integration. Rather than guess which one your project got,
   take whichever is there. */
const URL_ = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || process.env.REDIS_REST_URL;
const TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || process.env.REDIS_REST_TOKEN;
const KEY = process.env.STATS_KEY;

async function redis(cmd) {
  const r = await fetch(URL_ + '/pipeline', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + TOKEN, 'Content-Type': 'application/json' },
    body: JSON.stringify(cmd)
  });
  if (!r.ok) throw new Error('kv ' + r.status);
  return (await r.json()).map(x => x.result);
}

const sortDesc = o => Object.fromEntries(
  Object.entries(o || {}).map(([k, v]) => [k, +v]).sort((a, b) => b[1] - a[1]));

export default async function handler(req, res) {
  if (!URL_ || !TOKEN) return res.status(503).json({
    error: 'collector not configured',
    found: {
      url: !!URL_, token: !!TOKEN, stats_key: !!KEY,
      /* the names present in this environment, so you can see what Vercel
         actually injected without guessing */
      seen: Object.keys(process.env).filter(k => /KV_|UPSTASH|REDIS|STATS_KEY/.test(k)).sort()
    }
  });
  if (!KEY || req.query.key !== KEY) return res.status(401).json({ error: 'bad key' });

  const [keys] = await redis([['KEYS', 'ev:*']]);
  const list = keys || [];
  const vals = await redis(list.map(k => ['HGETALL', k]));

  /* Upstash returns a hash as a flat array; Vercel KV returns an object. */
  const asObj = v => {
    if (!v) return {};
    if (Array.isArray(v)) {
      const o = {};
      for (let i = 0; i < v.length; i += 2) o[v[i]] = v[i + 1];
      return o;
    }
    return v;
  };
  const raw = {};
  list.forEach((k, i) => { raw[k] = asObj(vals[i]); });

  /* the drop-off curve, per view, ordered by step */
  const dropoff = {};
  for (const k of list.filter(x => x.startsWith('ev:depth:'))) {
    const view = k.slice('ev:depth:'.length);
    const rows = Object.entries(raw[k]).map(([bucket, n]) => {
      const [step, of] = bucket.split('/').map(Number);
      return { step, of, readers: +n };
    }).sort((a, b) => a.step - b.step);
    const total = rows.reduce((a, r) => a + r.readers, 0);
    dropoff[view] = {
      readers: total,
      reached_last: rows.filter(r => r.step === r.of).reduce((a, r) => a + r.readers, 0),
      avg_secs: raw['ev:secs:' + view] && +raw['ev:secs:' + view].n
        ? Math.round(+raw['ev:secs:' + view].total / +raw['ev:secs:' + view].n) : null,
      curve: rows
    };
  }

  /* the questions that are getting the guide's explanations wrong */
  const hardest = list.filter(x => x.startsWith('ev:q:')).map(k => {
    const id = k.slice('ev:q:'.length);
    const h = raw[k], right = +h.right || 0, wrong = +h.wrong || 0, n = right + wrong;
    const meta = QUESTIONS[id] || {};
    /* the wrong answers, resolved from option index to the sentence people
       actually picked, because a misconception is only useful when you can
       read it */
    const chosen = Object.entries(sortDesc(raw['ev:qwrong:' + id]))
      .map(([opt, count]) => ({
        picked: (meta.options || [])[+opt.replace('opt', '')] || opt,
        count
      }));
    return {
      q: id,
      view: meta.view || h.view || null,
      question: meta.question || null,
      answer: meta.answer || null,
      asked: n,
      wrong_pct: n ? Math.round((wrong / n) * 100) : 0,
      picked_instead: chosen
    };
  }).filter(x => x.asked >= 3).sort((a, b) => b.wrong_pct - a.wrong_pct);

  res.setHeader('Cache-Control', 'no-store');
  res.status(200).json({
    generated: new Date().toISOString(),
    events: sortDesc(raw['ev:events']),
    views_opened: sortDesc(raw['ev:view:open']),
    views_completed: sortDesc(raw['ev:view:complete']),
    dropoff,
    hardest,
    tests: Object.fromEntries(list.filter(x => x.startsWith('ev:test:'))
      .map(k => [k.slice('ev:test:'.length), sortDesc(raw[k])])),
    scores: Object.fromEntries(list.filter(x => x.startsWith('ev:score:'))
      .map(k => [k.slice('ev:score:'.length), sortDesc(raw[k])])),
    which: sortDesc(raw['ev:which']),
    searched: sortDesc(raw['ev:search']),
    looked_up: sortDesc(raw['ev:glossary']),
    copied: sortDesc(raw['ev:copy']),
    lang: sortDesc(raw['ev:lang']),
    theme: sortDesc(raw['ev:theme'])
  });
}
