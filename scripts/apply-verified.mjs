import fs from 'node:fs';
import path from 'node:path';

const dir = path.resolve('src/content/universities');
const picks = JSON.parse(
  fs.readFileSync(path.resolve('scripts/video-picks.json'), 'utf8'),
);
const verified = JSON.parse(
  fs.readFileSync(path.resolve('scripts/video-verified.json'), 'utf8'),
);

const q = (s) => `"${String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;

let updated = 0;
for (const [file, p] of Object.entries(picks)) {
  const fp = path.join(dir, file);
  let text = fs.readFileSync(fp, 'utf8');
  let changed = false;
  for (const slot of ['life', 'study']) {
    const v = p[slot];
    const ver = verified[file]?.[slot];
    if (!v || !ver || !ver.title || ver.title === '(API FAIL)') continue;
    if (ver.title === v.title && v.up) continue; // 已一致

    const school = p.school;
    const isOfficial =
      ver.author.includes(school) || ver.author.includes('招生') || ver.author.includes('招办');
    const source = isOfficial
      ? ver.author.includes('招生') || ver.author.includes('招办')
        ? ver.author
        : `${school}官方B站账号`
      : `B站转载（UP：${ver.author}）`;

    const oldTitle = v.title;
    v.title = ver.title;
    v.up = ver.author;

    // 更新 md 中对应的视频条目（按 id 定位）
    const entryRe = new RegExp(
      `(  - title: )[^\\n]+\\n(    platform: bilibili\\n    id: ${v.bvid}\\n    source: )[^\\n]+`,
    );
    if (!entryRe.test(text)) {
      console.error(`NO MATCH ${file} ${slot} ${v.bvid}`);
      continue;
    }
    text = text.replace(
      entryRe,
      `$1${q(ver.title)}\n$2${q(source)}`,
    );
    changed = true;
    updated++;
    console.log(`OK ${file} ${slot}: ${oldTitle.slice(0, 20)} -> ${ver.title.slice(0, 30)} | ${source}`);
  }
  if (changed) fs.writeFileSync(fp, text, 'utf8');
}

fs.writeFileSync(
  path.resolve('scripts/video-picks.json'),
  JSON.stringify(picks, null, 2),
  'utf8',
);
console.log(`Updated ${updated} entries.`);
