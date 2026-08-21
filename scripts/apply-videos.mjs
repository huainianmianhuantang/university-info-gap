import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const dir = path.resolve('src/content/universities');
const picks = JSON.parse(
  fs.readFileSync(path.resolve('scripts/video-picks.json'), 'utf8'),
);

function parseVideosBlock(fm) {
  const m = fm.match(/^videos:\s*\n([\s\S]*)/m);
  if (!m) return [];
  const entries = [];
  const lines = m[1].split('\n');
  let cur = null;
  for (const line of lines) {
    if (/^videos:/.test(line)) break;
    const title = line.match(/^  - title:\s*(.+)$/);
    const kv = line.match(/^    (\w+):\s*(.*)$/);
    if (title) {
      if (cur) entries.push(cur);
      cur = { title: title[1].trim() };
    } else if (kv && cur) {
      cur[kv[1]] = kv[2].trim();
    }
  }
  if (cur) entries.push(cur);
  return entries;
}

const DESCS = {
  life: '宿舍/校园生活实拍，帮你提前了解真实的居住与生活环境。',
  study: '课堂/学习日常记录，感受真实的学习节奏与专业氛围。',
};

const q = (s) => `"${String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;

for (const [file, p] of Object.entries(picks)) {
  const fp = path.join(dir, file);
  let text = fs.readFileSync(fp, 'utf8');
  const gitText = execSync(
    `git show d681cd9:src/content/universities/${file}`,
    { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] },
  ).trim();
  const gitFm = gitText.match(/^---\n([\s\S]*?)\n---/);
  if (!gitFm) {
    console.error(`NO GIT FRONTMATTER: ${file}`);
    continue;
  }
  const fmMatch = text.match(/^---\n([\s\S]*?)\n---/);
  if (!fmMatch) {
    console.error(`NO FRONTMATTER: ${file}`);
    continue;
  }
  const existing = parseVideosBlock(gitFm[1]);
  const lines = ['videos:'];
  for (const e of existing) {
    lines.push(`  - title: ${q(e.title)}`);
    lines.push(`    platform: ${e.platform || 'bilibili'}`);
    if (e.id) lines.push(`    id: ${e.id}`);
    if (e.url) lines.push(`    url: ${e.url}`);
    if (e.source) lines.push(`    source: ${q(e.source)}`);
    if (e.description) lines.push(`    description: ${q(e.description)}`);
    lines.push('    tags: [宣传片]');
  }
  for (const slot of ['life', 'study']) {
    const v = p[slot];
    if (!v) continue;
    let source;
    if (!v.up) {
      source = 'B站转载（UP待核实）';
    } else if (v.up.includes(p.school) || v.up.includes('招生') || v.up.includes('招办')) {
      source = v.up.includes('招生') || v.up.includes('招办') ? v.up : `${p.school}官方B站账号`;
    } else {
      source = `B站转载（UP：${v.up}）`;
    }
    lines.push(`  - title: ${q(v.title)}`);
    lines.push('    platform: bilibili');
    lines.push(`    id: ${v.bvid}`);
    lines.push(`    source: ${q(source)}`);
    lines.push(`    description: ${q(DESCS[slot])}`);
    lines.push(`    tags: [${slot === 'life' ? '宿舍生活' : '学习日常'}]`);
  }
  const newBlock = lines.join('\n');
  const idx = fmMatch[1].indexOf('videos:');
  const newFm = idx === -1 ? fmMatch[1] + '\n' + newBlock : fmMatch[1].slice(0, idx) + newBlock;
  text = text.replace(/^---\n([\s\S]*?)\n---/, `---\n${newFm}\n---`);
  fs.writeFileSync(fp, text, 'utf8');
  console.log(`Applied ${file} (${existing.length} promo + ${p.life ? 1 : 0} life + ${p.study ? 1 : 0} study)`);
}

console.log('Done.');
