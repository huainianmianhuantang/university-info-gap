import fs from 'node:fs';
import path from 'node:path';

const headers = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
  Referer: 'https://www.bilibili.com/',
  Accept: 'application/json, text/plain, */*',
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const log = (msg) => {
  const line = `${new Date().toISOString()} ${msg}`;
  console.log(line);
  fs.appendFileSync(path.resolve('scripts/verify-slow.log'), line + '\n', 'utf8');
};

async function view(bvid) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch(
      `https://api.bilibili.com/x/web-interface/view?bvid=${bvid}`,
      { headers, signal: controller.signal },
    );
    clearTimeout(timer);
    if (res.status !== 200) return { ok: false, status: res.status };
    const json = await res.json();
    if (json.code !== 0) return { ok: false, status: `code:${json.code}` };
    return {
      ok: true,
      title: json.data.title,
      author: json.data.owner?.name ?? '',
    };
  } catch (e) {
    clearTimeout(timer);
    return { ok: false, status: `${e.name}: ${e.message}` };
  }
}

const picks = JSON.parse(
  fs.readFileSync(path.resolve('scripts/video-picks.json'), 'utf8'),
);
const verifiedPath = path.resolve('scripts/video-verified.json');
const verified = JSON.parse(fs.readFileSync(verifiedPath, 'utf8'));

const queue = [];
for (const [file, p] of Object.entries(picks)) {
  for (const slot of ['life', 'study']) {
    const v = p[slot];
    if (!v) continue;
    const cur = verified[file]?.[slot];
    if (cur?.bvid && cur.title && cur.title !== '(API FAIL)') continue;
    queue.push({ file, slot, bvid: v.bvid });
  }
}

log(`queue=${queue.length} videos to verify`);

for (const item of queue) {
  const r = await view(item.bvid);
  if (r.ok) {
    verified[item.file] ??= { school: picks[item.file].school, life: null, study: null };
    verified[item.file][item.slot] = { bvid: item.bvid, title: r.title, author: r.author };
    fs.writeFileSync(verifiedPath, JSON.stringify(verified, null, 2), 'utf8');
    log(`OK ${item.file} ${item.slot} ${item.bvid} | ${r.title.slice(0, 36)} | ${r.author}`);
  } else {
    log(`FAIL ${item.file} ${item.slot} ${item.bvid} (${r.status})`);
  }
  await sleep(180000);
}

log('ALL DONE');
