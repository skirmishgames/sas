// Adds a version query to CSS and JS links so browsers pick up new files.
// Run from the repo root: node tools/stamp.js
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const root = path.join(__dirname, '..');
const files = ['css/styles.css', ...fs.readdirSync(path.join(root, 'js')).filter(f => f.endsWith('.js')).map(f => 'js/' + f), ...fs.readdirSync(path.join(root, 'js/data')).map(f => 'js/data/' + f)];
const h = crypto.createHash('sha1');
for (const f of files) h.update(fs.readFileSync(path.join(root, f), 'utf8').replace(/\?v=[a-z0-9]+/g, ''));
const v = h.digest('hex').slice(0, 8);
const stamp = (f, re) => {
  const p = path.join(root, f);
  const before = fs.readFileSync(p, 'utf8');
  const after = before.replace(re, (m, a, b) => `${a}?v=${v}${b}`);
  if (after !== before) fs.writeFileSync(p, after);
};
stamp('index.html', /((?:href|src)="(?:css|js)\/[^"?]+\.(?:css|js))(?:\?v=[a-z0-9]+)?(")/g);
for (const f of files.filter(f => f.endsWith('.js'))) stamp(f, /(from '\.{1,2}\/[^'?]+\.js)(?:\?v=[a-z0-9]+)?(')/g);
console.log('Stamped version', v);
