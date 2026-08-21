import fs from 'node:fs';
import path from 'node:path';

/**
 * 巡检资料库外部链接（各校 materials 中的 http/https 链接）。
 * 用法：node scripts/check-external-links.mjs
 * 说明：403/412 多为官网 WAF 拦截机器人，不等于链接失效，标记为「需人工确认」。
 */
const dir = path.resolve('src/content/universities');
const files = fs.readdirSync(dir).filter((f) => f.endsWith('.md'));
const links = [];

for (const f of files) {
  const c = fs.readFileSync(path.join(dir, f), 'utf8');
  const m = c.match(/^materials:([\s\S]*?)^videos:/m);
  if (!m) continue;
  for (const lm of m[1].matchAll(/link:\s*(https?:\/\/\S+)/g)) {
    links.push({ slug: f.replace('.md', ''), url: lm[1].replace(/[),;。]$/, '') });
  }
}

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/126.0.0.0 Safari/537.36';
const results = [];
const CONC = 5;
let idx = 0;

async function worker() {
  while (idx < links.length) {
    const item = links[idx++];
    try {
      const r = await fetch(item.url, {
        method: 'GET',
        headers: { 'User-Agent': UA },
        redirect: 'follow',
        signal: AbortSignal.timeout(15000),
      });
      results.push({ ...item, status: r.status, verdict: r.ok ? 'ok' : r.status === 403 || r.status === 412 ? 'waf' : 'broken' });
    } catch {
      results.push({ ...item, status: 0, verdict: 'unreachable' });
    }
    process.stdout.write(`\r${idx}/${links.length}`);
  }
}

await Promise.all(Array.from({ length: CONC }, worker));
console.log('\n');

const groups = { ok: [], waf: [], broken: [], unreachable: [] };
for (const r of results) groups[r.verdict].push(r);
console.log(`总链接 ${links.length}：OK ${groups.ok.length}｜WAF待确认 ${groups.waf.length}｜失效 ${groups.broken.length}｜不可达 ${groups.unreachable.length}`);
if (groups.broken.length) {
  console.log('\n失效链接：');
  for (const r of groups.broken) console.log(`  ${r.status} ${r.slug} ${r.url}`);
}
if (groups.unreachable.length) {
  console.log('\n不可达链接：');
  for (const r of groups.unreachable) console.log(`  ${r.slug} ${r.url}`);
}
if (groups.waf.length) {
  console.log('\nWAF拦截（需人工确认）：');
  for (const r of groups.waf) console.log(`  ${r.status} ${r.slug} ${r.url}`);
}
fs.writeFileSync(
  new URL('../scripts/_tmp/external-links-report.json', import.meta.url),
  JSON.stringify(results, null, 2),
  'utf8',
);
