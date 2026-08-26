// Concatenates src/*.js (lexical order) into the single app.js the page loads.
// Run: node build.mjs
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const SRC = 'src';
const files = readdirSync(SRC).filter(f => f.endsWith('.js')).sort();
const out = files.map(f => readFileSync(join(SRC, f), 'utf8').replace(/\s+$/, '')).join('\n\n');
writeFileSync('app.js', out + '\n');
console.log(`app.js  ${files.length} modules  ${(out.length / 1024).toFixed(1)} kB`);
console.log(files.map(f => '  · ' + f).join('\n'));
