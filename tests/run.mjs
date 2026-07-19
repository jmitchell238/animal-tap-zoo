/**
 * Lightweight smoke tests for Animal Tap Zoo (no browser).
 * Run: node tests/run.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

let failed = 0;
function ok(cond, msg) {
  if (cond) console.log('  ✓', msg);
  else {
    console.error('  ✗', msg);
    failed++;
  }
}

console.log('Animal Tap Zoo tests\n');

// Files exist
const required = [
  'index.html',
  'css/style.css',
  'js/config.js',
  'js/save.js',
  'js/audio.js',
  'js/particles.js',
  'js/animals.js',
  'js/game.js',
  'js/main.js',
  'manifest.webmanifest',
  'sw.js',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'apple-touch-icon.png',
  'art/cover.jpg',
];
for (const f of required) {
  ok(fs.existsSync(path.join(root, f)), `exists ${f}`);
}

// Version sync
const config = fs.readFileSync(path.join(root, 'js/config.js'), 'utf8');
const sw = fs.readFileSync(path.join(root, 'sw.js'), 'utf8');
const verMatch = config.match(/GAME_VERSION\s*=\s*['"]([^'"]+)['"]/);
ok(!!verMatch, 'GAME_VERSION present');
if (verMatch) {
  ok(sw.includes(`animal-tap-zoo-${verMatch[1]}`), `SW CACHE matches ${verMatch[1]}`);
}

// Config content
ok(config.includes('HABITATS'), 'HABITATS defined');
ok(config.includes('ANIMALS'), 'ANIMALS defined');
const animalCount = (config.match(/id:\s*'/g) || []).length;
ok(animalCount >= 10, `at least 10 animals (got ${animalCount})`);

// Manifest
const man = JSON.parse(fs.readFileSync(path.join(root, 'manifest.webmanifest'), 'utf8'));
ok(man.display === 'standalone', 'manifest display standalone');
ok(man.name && man.name.includes('Animal'), 'manifest name');
ok(Array.isArray(man.icons) && man.icons.length >= 2, 'manifest icons');

// index loads scripts in order
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const order = ['config.js', 'save.js', 'audio.js', 'particles.js', 'animals.js', 'game.js', 'main.js'];
let last = -1;
for (const s of order) {
  const i = html.indexOf(s);
  ok(i > last, `script order ${s}`);
  last = i;
}

// SW precaches key assets
for (const a of ['./js/main.js', './icons/icon-192.png', './art/cover.jpg']) {
  ok(sw.includes(a), `sw precache ${a}`);
}

console.log(failed ? `\n${failed} failed` : '\nAll passed');
process.exit(failed ? 1 : 0);
