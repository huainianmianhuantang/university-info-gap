const base = 'http://127.0.0.1:4321';

async function get(url) {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
    return { status: res.status, text: await res.text() };
  } catch (e) {
    return { status: -1, text: '', error: e.message };
  }
}

const sitemap = await get(`${base}/sitemap.xml`);
const urls = new Set(['/']);
if (sitemap.status === 200) {
  for (const m of sitemap.text.matchAll(/<loc>(.*?)<\/loc>/g)) {
    const p = new URL(m[1]).pathname.replace(/\/$/, '') || '/';
    urls.add(p);
  }
}
urls.add('/404test');

const all = new Set(urls);
for (const u of urls) {
  const r = await get(base + u);
  for (const m of r.text.matchAll(/href="(\/[^"#?]*)/g)) {
    const p = m[1].replace(/\/$/, '') || '/';
    if (!p.startsWith('/api')) all.add(p);
  }
}

const failures = [];
for (const u of all) {
  if (u === '/404test') continue;
  const r = await get(base + u);
  if (r.status !== 200) failures.push(`${u} -> ${r.status}${r.error ? ` (${r.error})` : ''}`);
}

console.log(`Checked ${all.size} URLs, ${failures.length} failures`);
for (const f of failures) console.log(f);
