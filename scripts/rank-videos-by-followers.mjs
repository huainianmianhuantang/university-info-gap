/**
 * 按 UP 主粉丝量重新排序选片
 *
 * 读 scripts/video-candidates.json（每校 life/study 两组候选），
 * 1) 抓视频页 HTML 拿 UP 主 UID（video page 可用；view API 常被 -412 风控）
 * 2) 用 x/relation/stat 查该 UID 的粉丝数（已实测可用）
 * 3) 每校每组按「粉丝数降序，播放量降序」排序，输出推荐选片
 *
 * 用法：
 *   node scripts/rank-videos-by-followers.mjs            # 全量跑，只出报告不改选片
 *   node scripts/rank-videos-by-followers.mjs --limit 3  # 只跑前 3 所学校（试跑）
 *   node scripts/rank-videos-by-followers.mjs --apply    # 跑完把每组粉丝最多的片写入 video-picks.json
 *   node scripts/rank-videos-by-followers.mjs --delay 300 --limit 2
 *
 * 断点续跑：中间结果缓存到 scripts/video-follower-data.json，重复运行自动跳过已抓取的视频/UP 主。
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve();
const candidatesPath = path.resolve('scripts/video-candidates.json');
const dataPath = path.resolve('scripts/video-follower-data.json');
const rankPath = path.resolve('scripts/video-follower-rank.json');
const picksPath = path.resolve('scripts/video-picks.json');

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';
const HEADERS = { 'User-Agent': UA, Referer: 'https://www.bilibili.com/', Accept: '*/*' };

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const args = process.argv.slice(2);
const limitArg = args.indexOf('--limit');
const limit = limitArg !== -1 ? Number(args[limitArg + 1]) : Infinity;
const delayArg = args.indexOf('--delay');
const delayMs = delayArg !== -1 ? Number(args[delayArg + 1]) : 700;
const APPLY = args.includes('--apply');

/** 解析视频页 HTML 里的 __INITIAL_STATE__，返回 { mid, name } */
function parseOwner(html) {
  const patterns = [
    /window\.__INITIAL_STATE__=(.+?);\(function/,
    /window\.__INITIAL_STATE__=(.+?)<\/script>/,
  ];
  for (const re of patterns) {
    const m = html.match(re);
    if (!m) continue;
    try {
      const state = JSON.parse(m[1]);
      const owner = state.videoInfo?.owner || state.videoData?.owner;
      if (owner?.mid && owner?.name) return { mid: owner.mid, name: owner.name };
    } catch {
      /* 试下一种模式 */
    }
  }
  return null;
}

async function fetchWithRetry(url, tries = 3, extraHeaders = {}) {
  let lastErr = '';
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(url, {
        headers: { ...HEADERS, ...extraHeaders },
        signal: AbortSignal.timeout(15000),
      });
      if (res.status === 412) {
        lastErr = `status 412`;
        await sleep(2500 * (i + 1));
        continue;
      }
      const buf = Buffer.from(await res.arrayBuffer());
      const ct = res.headers.get('content-type') || '';
      if (ct.includes('json')) return { json: JSON.parse(buf.toString('utf8')), html: '' };
      return { json: null, html: buf.toString('utf8') };
    } catch (e) {
      lastErr = String(e).slice(0, 80);
      await sleep(1200 * (i + 1));
    }
  }
  return { json: null, html: '', err: lastErr };
}

async function bvidMeta(bvid, cache) {
  if (cache.bvids[bvid]?.mid) return cache.bvids[bvid];
  const page = await fetchWithRetry(`https://www.bilibili.com/video/${bvid}`);
  let meta = null;
  if (page.html) {
    const owner = parseOwner(page.html);
    if (owner) meta = { bvid, mid: owner.mid, name: owner.name, pageOk: true };
  }
  if (!meta && page.json?.code === 0) {
    const owner = page.json.data?.owner;
    if (owner) meta = { bvid, mid: owner.mid, name: owner.name, pageOk: false };
  }
  if (!meta) {
    meta = { bvid, mid: null, name: null, pageOk: false, err: page.err || 'parse fail' };
  }
  cache.bvids[bvid] = meta;
  saveCache(cache);
  return meta;
}

async function midFollowers(mid, cache) {
  if (cache.mids[mid]?.follower != null) return cache.mids[mid];
  const res = await fetchWithRetry(`https://api.bilibili.com/x/relation/stat?vmid=${mid}`);
  const follower = res.json?.code === 0 ? res.json.data?.follower ?? null : null;
  const entry = { mid, follower, err: follower == null ? (res.json?.message || res.err || 'api fail') : null };
  cache.mids[mid] = entry;
  saveCache(cache);
  return entry;
}

function saveCache(cache) {
  fs.writeFileSync(dataPath, JSON.stringify(cache, null, 2), 'utf8');
}

function loadCache() {
  if (fs.existsSync(dataPath)) {
    try {
      return JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    } catch {
      /* 重建 */
    }
  }
  return { bvids: {}, mids: {} };
}

function pickBest(list) {
  return [...list].sort((a, b) => {
    const fa = a.follower ?? -1;
    const fb = b.follower ?? -1;
    if (fb !== fa) return fb - fa;
    return (b.play ?? 0) - (a.play ?? 0);
  });
}

if (args.includes('--probe')) {
  const cache = loadCache();
  for (const bvid of ['BV1PtKgziEGb', 'BV1uF411B7cJ']) {
    const meta = await bvidMeta(bvid, cache);
    console.log(bvid, '=>', JSON.stringify(meta));
    if (meta.mid) {
      const f = await midFollowers(meta.mid, cache);
      console.log('  followers:', JSON.stringify(f));
    }
    await sleep(delayMs);
  }
  process.exit(0);
}

const candidates = JSON.parse(fs.readFileSync(candidatesPath, 'utf8'));
const cache = loadCache();
const schools = Object.keys(candidates);
const rank = {};
let processed = 0;
let htmlFail = 0;
let followerFail = 0;
const allBvids = new Set();

for (const key of schools) {
  if (processed >= limit) break;
  const school = candidates[key];
  rank[key] = { name: school.name, life: [], study: [] };
  for (const slot of ['life', 'study']) {
    const list = school[slot] ?? [];
    for (const c of list) {
      if (allBvids.has(c.bvid)) continue;
      allBvids.add(c.bvid);
      const meta = await bvidMeta(c.bvid, cache);
      if (!meta.mid) htmlFail++;
      let follower = null;
      if (meta.mid) {
        const f = await midFollowers(meta.mid, cache);
        follower = f.follower;
        if (follower == null) followerFail++;
        await sleep(Math.min(delayMs, 300));
      }
      rank[key][slot].push({
        bvid: c.bvid,
        title: c.title,
        author: meta.name || c.author || '(未知UP)',
        mid: meta.mid ?? null,
        play: c.play ?? null,
        follower,
        ok: meta.mid != null && follower != null,
      });
      console.log(
        `[${processed + 1}/${Math.min(limit, schools.length)}] ${key} ${slot} | ${c.bvid} | 粉丝 ${follower ?? '?'} | ${meta.name || c.author}`,
      );
      await sleep(delayMs);
    }
    rank[key][slot] = pickBest(rank[key][slot]);
  }
  processed++;
}

// 汇总：每组粉丝最多的候选
let topWithFollower = 0;
for (const key of Object.keys(rank)) {
  for (const slot of ['life', 'study']) {
    const list = rank[key][slot] ?? [];
    if (list.length && list[0]?.follower != null) topWithFollower++;
  }
}

fs.writeFileSync(rankPath, JSON.stringify(rank, null, 2), 'utf8');
console.log('\n=== 排名报告已写入 scripts/video-follower-rank.json ===');
console.log(`视频抓取失败 ${htmlFail}，粉丝数缺失 ${followerFail}，可推荐选片 ${topWithFollower}/${schools.length * 2} 组`);

// 打印每组当前选片 vs 粉丝最多候选
const oldPicks = fs.existsSync(picksPath) ? JSON.parse(fs.readFileSync(picksPath, 'utf8')) : {};
for (const key of Object.keys(rank)) {
  const changed = [];
  for (const slot of ['life', 'study']) {
    const best = rank[key][slot]?.[0];
    const cur = oldPicks[key]?.[slot];
    if (!best) continue;
    const same = cur?.bvid === best.bvid;
    changed.push(`${slot}: ${same ? '保持' : '换'} ${cur?.bvid || '无'} -> ${best.bvid} (${best.author}, 粉丝${best.follower ?? '?'})`);
  }
  console.log(`${key} ${rank[key].name} | ${changed.join(' | ')}`);
}

if (APPLY) {
  const picks = JSON.parse(fs.readFileSync(picksPath, 'utf8'));
  let updated = 0;
  for (const key of Object.keys(rank)) {
    const school = picks[key] ?? { school: rank[key].name };
    for (const slot of ['life', 'study']) {
      const best = rank[key][slot]?.[0];
      if (!best || best.follower == null) continue;
      if (school[slot]?.bvid === best.bvid) continue;
      school[slot] = {
        bvid: best.bvid,
        title: best.title,
        up: best.author,
        follower: best.follower,
      };
      updated++;
    }
    picks[key] = school;
  }
  fs.writeFileSync(picksPath, JSON.stringify(picks, null, 2), 'utf8');
  console.log(`\n已按粉丝量更新 scripts/video-picks.json（${updated} 组更换）`);
}
