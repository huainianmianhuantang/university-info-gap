import fs from 'node:fs';
import path from 'node:path';

const dist = path.resolve('dist');
const files = [];
function walk(dir) {
  for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, f.name);
    if (f.isDirectory()) walk(p);
    else if (f.name.endsWith('.html')) files.push(p);
  }
}
walk(dist);

const broken = new Set();
let checked = 0;
for (const f of files) {
  const html = fs.readFileSync(f, 'utf8');
  const refs = [
    ...html.matchAll(/(?:href|src)="(\/[^"#?]*)/g),
  ].map((m) => m[1]);
  for (const ref of refs) {
    if (ref.startsWith('http') || ref.startsWith('mailto:') || ref.startsWith('tel:')) continue;
    if (ref.includes('${')) continue;
    checked++;
    const target = path.join(dist, ref.replace(/^\//, ''));
    const ok =
      fs.existsSync(target) ||
      fs.existsSync(path.join(target, 'index.html')) ||
      fs.existsSync(target + '.html') ||
      fs.existsSync(target.replace(/\/$/, '') + '.html');
    if (!ok) broken.add(`${ref} <- ${path.relative(dist, f)}`);
  }
}
console.log(`checked ${checked} local refs, broken ${broken.size}`);
for (const b of broken) console.log('BROKEN:', b);
