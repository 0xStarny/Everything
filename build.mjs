// Concatenates src/*.js into app.js, then emits one static page per view so
// every deep link carries its own title, description and Open Graph card.
// Every replacement is idempotent: index.html stays the single hand-edited file.
// Run: node build.mjs
import { readdirSync, readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import { join } from 'node:path';

/* ── 0 · the route table, from views.json ─────────────────────── */
const meta = JSON.parse(readFileSync('views.json', 'utf8'));
const site = meta.site;
writeFileSync('src/01-routes.js', [
  '/* Generated from views.json by build.mjs. Do not edit. */',
  'const ROUTES = ' + JSON.stringify({
    site,
    views: meta.views.map(v => ({ id: v.id, path: v.path, title: v.title, ...(v.root ? { root: true } : {}) }))
  }, null, 2) + ';',
  ''
].join('\n'));

/* ── 1 · the script ───────────────────────────────────────────── */
const SRC = 'src';
const files = readdirSync(SRC).filter(f => f.endsWith('.js')).sort();
const out = files.map(f => readFileSync(join(SRC, f), 'utf8').replace(/\s+$/, '')).join('\n\n');
writeFileSync('app.js', out + '\n');
console.log(`app.js   ${files.length} modules  ${(out.length / 1024).toFixed(1)} kB`);

/* ── 2 · one page per view ────────────────────────────────────── */
const shell = readFileSync('index.html', 'utf8');
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');

const set = (html, re, to) => {
  if (!re.test(html)) throw new Error('build: no match for ' + re);
  return html.replace(re, to);
};

const page = v => {
  const url = site.url + '/' + v.path;
  const title = v.path ? `${v.title} · ${site.name}` : `${site.name} · ${site.tagline}`;
  const img = `${site.url}/assets/og/${v.id}.png`;
  let h = shell;
  h = set(h, /<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`);
  h = set(h, /(<meta name="description" content=")[^"]*(">)/, `$1${esc(v.desc)}$2`);
  h = set(h, /(<meta property="og:title" content=")[^"]*(">)/, `$1${esc(v.og)}$2`);
  h = set(h, /(<meta property="og:description" content=")[^"]*(">)/, `$1${esc(v.desc)}$2`);
  h = set(h, /(<meta property="og:image" content=")[^"]*(">)/, `$1${img}$2`);
  h = set(h, /(<meta name="twitter:image" content=")[^"]*(">)/, `$1${img}$2`);
  h = set(h, /(<meta property="og:type" content=")[^"]*(">)/, `$1${v.path ? 'article' : 'website'}$2`);
  h = set(h, /(<meta property="og:url" content=")[^"]*(">)/, `$1${url}$2`);
  h = set(h, /(<link rel="canonical" href=")[^"]*(">)/, `$1${url}$2`);
  return h;
};

for (const v of meta.views) {
  if (v.path && existsSync(v.path)) rmSync(v.path, { recursive: true, force: true });
}
let n = 0;
for (const v of meta.views) {
  if (!v.path) continue;

  mkdirSync(v.path, { recursive: true });
  writeFileSync(join(v.path, 'index.html'), page(v));
  n++;
}
const root = meta.views.find(v => v.root);
writeFileSync('index.html', page({ ...root, path: '' }));
console.log(`pages    ${n + 1} routes  /  ${meta.views.filter(v => v.path).map(v => '/' + v.path).join('  ')}`);
