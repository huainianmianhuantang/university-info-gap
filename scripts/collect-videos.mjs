import fs from 'node:fs';
import path from 'node:path';

const headers = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
  Referer: 'https://www.bilibili.com/',
  Accept: 'application/json, text/plain, */*',
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getJson(url, tries = 2) {
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(url, { headers, signal: AbortSignal.timeout(8000) });
      if (res.status === 412) {
        await sleep(5000 * (i + 1));
        continue;
      }
      const json = await res.json();
      if (json.code === -412) {
        await sleep(5000 * (i + 1));
        continue;
      }
      return json;
    } catch (e) {
      await sleep(2500 * (i + 1));
    }
  }
  return null;
}

const picks = JSON.parse(
  fs.readFileSync(path.resolve('scripts/video-picks.json'), 'utf8'),
);

if (process.argv.includes('--probe')) {
  for (const bvid of ['BV1PtKgziEGb', 'BV1uF411B7cJ']) {
    const json = await getJson(
      `https://api.bilibili.com/x/web-interface/view?bvid=${bvid}`,
      2,
    );
    console.log(
      bvid,
      json?.code,
      json?.data?.title?.slice(0, 30),
      json?.data?.owner?.name,
    );
  }
  process.exit(0);
}

const results = {};
const verifiedPath = path.resolve('scripts/video-verified.json');
if (fs.existsSync(verifiedPath)) {
  Object.assign(results, JSON.parse(fs.readFileSync(verifiedPath, 'utf8')));
}
let issues = 0;
let done = 0;
const total = Object.values(picks).reduce(
  (n, p) => n + (p.life ? 1 : 0) + (p.study ? 1 : 0),
  0,
);
const limitArg = process.argv.indexOf('--limit');
const limit = limitArg !== -1 ? Number(process.argv[limitArg + 1]) : Infinity;
let processed = 0;
for (const [file, p] of Object.entries(picks)) {
  if (processed >= limit) break;
  results[file] = { school: p.school, life: null, study: null };
  for (const slot of ['life', 'study']) {
    const v = p[slot];
    if (!v) continue;
    if (results[file]?.[slot]?.bvid && results[file][slot].title !== '(API FAIL)') {
      done++;
      continue;
    }
    const json = await getJson(
      `https://api.bilibili.com/x/web-interface/view?bvid=${v.bvid}`,
    );
    if (!json || json.code !== 0) {
      results[file][slot] = { bvid: v.bvid, title: '(API FAIL)', author: '(FAIL)' };
      issues++;
      console.log(`FAIL ${file} ${slot} ${v.bvid}`);
      await sleep(1500);
      continue;
    }
    const title = json.data.title || '';
    const author = json.data.owner?.name || '';
    results[file][slot] = { bvid: v.bvid, title, author };
    fs.writeFileSync(verifiedPath, JSON.stringify(results, null, 2), 'utf8');
    const flag = v.up && !author.includes(v.up) ? ' <<MISMATCH' : '';
    if (flag) issues++;
    console.log(
      `${file} ${slot} | ${v.bvid} | ${title.slice(0, 42)} | ${author}${flag}`,
    );
    done++;
    console.log(`[progress ${done}/${total}]`);
    await sleep(1400);
  }
  processed++;
  fs.writeFileSync(verifiedPath, JSON.stringify(results, null, 2), 'utf8');
}

console.log(`Partial done (processed ${processed} schools). issues=${issues}`);
