import fs from 'node:fs';
import path from 'node:path';

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';

const SCHOOLS = [
  ['peking-university', '北京大学', 'https://www.pku.edu.cn'],
  ['tsinghua-university', '清华大学', 'https://www.tsinghua.edu.cn'],
  ['renmin-university', '中国人民大学', 'https://www.ruc.edu.cn'],
  ['buaa', '北京航空航天大学', 'https://www.buaa.edu.cn'],
  ['bit', '北京理工大学', 'https://www.bit.edu.cn'],
  ['cau', '中国农业大学', 'https://www.cau.edu.cn'],
  ['bnu', '北京师范大学', 'https://www.bnu.edu.cn'],
  ['muc', '中央民族大学', 'https://www.muc.edu.cn'],
  ['nankai', '南开大学', 'https://www.nankai.edu.cn'],
  ['tju', '天津大学', 'https://www.tju.edu.cn'],
  ['dlut', '大连理工大学', 'https://www.dlut.edu.cn'],
  ['jilin-university', '吉林大学', 'https://www.jlu.edu.cn'],
  ['hit', '哈尔滨工业大学', 'https://www.hit.edu.cn'],
  ['fudan', '复旦大学', 'https://www.fudan.edu.cn'],
  ['sjtu', '上海交通大学', 'https://www.sjtu.edu.cn'],
  ['tongji', '同济大学', 'https://www.tongji.edu.cn'],
  ['ecnu', '华东师范大学', 'https://www.ecnu.edu.cn'],
  ['nju', '南京大学', 'https://www.nju.edu.cn'],
  ['seu', '东南大学', 'https://www.seu.edu.cn'],
  ['ustc', '中国科学技术大学', 'https://www.ustc.edu.cn'],
  ['xmu', '厦门大学', 'https://www.xmu.edu.cn'],
  ['sdu', '山东大学', 'https://www.sdu.edu.cn'],
  ['ouc', '中国海洋大学', 'https://www.ouc.edu.cn'],
  ['hunan-university', '湖南大学', 'https://www.hnu.edu.cn'],
  ['csu', '中南大学', 'https://www.csu.edu.cn'],
  ['sysu', '中山大学', 'https://www.sysu.edu.cn'],
  ['scut', '华南理工大学', 'https://www.scut.edu.cn'],
  ['cqu', '重庆大学', 'https://www.cqu.edu.cn'],
  ['scu', '四川大学', 'https://www.scu.edu.cn'],
  ['uestc', '电子科技大学', 'https://www.uestc.edu.cn'],
  ['xjtu', '西安交通大学', 'https://www.xjtu.edu.cn'],
  ['npu', '西北工业大学', 'https://www.nwpu.edu.cn'],
  ['nwafu', '西北农林科技大学', 'https://www.nwafu.edu.cn'],
  ['lzu', '兰州大学', 'https://www.lzu.edu.cn'],
  ['nudt', '国防科技大学', 'https://www.nudt.edu.cn'],
  ['northeastern-university', '东北大学', 'https://www.neu.edu.cn'],
  ['zhejiang-university', '浙江大学', 'https://www.zju.edu.cn'],
  ['huazhong-ust', '华中科技大学', 'https://www.hust.edu.cn'],
  ['wuhan-university', '武汉大学', 'https://www.whu.edu.cn'],
];

const KNOWN = {
  'peking-university': 'https://www.pku.edu.cn/pku_logo_red.png',
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchText(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': UA, Accept: 'text/html,*/*' },
    signal: AbortSignal.timeout(15000),
    redirect: 'follow',
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
}

function scoreUrl(u) {
  let s = 0;
  if (/logo/i.test(u)) s += 3;
  if (/校徽/.test(u)) s += 3;
  if (/emblem/i.test(u)) s += 2;
  if (/icon/i.test(u)) s += 1;
  if (/\.svg$/i.test(u)) s += 1;
  if (/\.png$/i.test(u)) s += 0.5;
  if (/banner|bgimg|background|slider|carousel|bkg/i.test(u)) s -= 3;
  return s;
}

function pickCandidates(html, home) {
  const found = new Map();
  const re = /(?:src|href)\s*=\s*["']([^"']+\.(?:png|jpg|jpeg|svg|gif))["']/gi;
  for (const m of html.matchAll(re)) {
    let u = m[1];
    if (u.startsWith('data:')) continue;
    try {
      u = new URL(u, home).href;
    } catch {
      continue;
    }
    const score = scoreUrl(u);
    if (score <= 0) continue;
    if (!found.has(u) || score > found.get(u)) found.set(u, score);
  }
  return [...found.entries()].sort((a, b) => b[1] - a[1]);
}

const report = {};
fs.mkdirSync(path.resolve('public/images'), { recursive: true });

for (const [slug, name, home] of SCHOOLS) {
  const entry = { name, home, status: 'skip', url: null, file: null };
  try {
    let candidates = [];
    if (KNOWN[slug]) {
      candidates = [[KNOWN[slug], 10]];
    } else {
      const html = await fetchText(home);
      candidates = pickCandidates(html, home);
    }
    if (candidates.length === 0) {
      entry.status = 'no_candidate';
      console.log(`${slug} | ${name} | NO CANDIDATE`);
      report[slug] = entry;
      await sleep(400);
      continue;
    }

    const url = candidates[0][0];
    const ext = path.extname(new URL(url).pathname).split('?')[0] || '.png';
    const file = path.resolve(`public/images/logo-${slug}${ext}`);
    const res = await fetch(url, {
      headers: { 'User-Agent': UA },
      signal: AbortSignal.timeout(20000),
      redirect: 'follow',
    });
    if (!res.ok) throw new Error(`download HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 1000) throw new Error('too small');
    fs.writeFileSync(file, buf);
    entry.status = 'ok';
    entry.url = url;
    entry.file = `logo-${slug}${ext}`;
    entry.bytes = buf.length;
    console.log(`${slug} | ${name} | OK ${entry.file} (${buf.length}B) from ${url.slice(0, 80)}`);
  } catch (e) {
    entry.status = 'error';
    entry.error = e.message;
    console.log(`${slug} | ${name} | ERROR ${e.message}`);
  }
  report[slug] = entry;
  await sleep(300);
}

fs.writeFileSync(path.resolve('scripts/logo-report.json'), JSON.stringify(report, null, 2), 'utf8');
const okCount = Object.values(report).filter((r) => r.status === 'ok').length;
console.log(`Done: ${okCount}/39 OK`);
