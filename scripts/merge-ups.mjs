import fs from 'node:fs';
import path from 'node:path';

const picks = JSON.parse(
  fs.readFileSync(path.resolve('scripts/video-picks.json'), 'utf8'),
);
const candidates = JSON.parse(
  fs.readFileSync(path.resolve('scripts/video-candidates.json'), 'utf8'),
);

const byBvid = new Map();
for (const d of Object.values(candidates)) {
  for (const v of [...(d.life ?? []), ...(d.study ?? [])]) {
    if (!byBvid.has(v.bvid)) byBvid.set(v.bvid, v.author);
  }
}

let filled = 0;
for (const [file, p] of Object.entries(picks)) {
  for (const slot of ['life', 'study']) {
    const v = p[slot];
    if (!v || v.up) continue;
    const author = byBvid.get(v.bvid);
    if (author) {
      v.up = author;
      filled++;
      console.log(`${file} ${slot}: ${v.bvid} -> UP ${author}`);
    }
  }
}

fs.writeFileSync(
  path.resolve('scripts/video-picks.json'),
  JSON.stringify(picks, null, 2),
  'utf8',
);
console.log(`Filled ${filled} uploaders.`);
