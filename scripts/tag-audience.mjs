/**
 * 为 39 校内容批量标注 audience（家长/学生/共同关心）。
 * 规则：
 *  - materials 按 category 映射：campus-life→student、admission/scholarship/postgrad-rec→parent、
 *    transfer-policy/training-plan/freshman→both、courses/competition→student
 *  - videos 按 tags 映射：宣传片→both、宿舍生活/学习日常→student，其余 both
 * 已存在 audience 的条目跳过，可重复运行。
 */
import fs from 'node:fs';
import path from 'node:path';

const MATERIAL_AUDIENCE = {
  'transfer-policy': 'both',
  admission: 'parent',
  'training-plan': 'both',
  'postgrad-rec': 'parent',
  scholarship: 'parent',
  courses: 'student',
  freshman: 'both',
  'campus-life': 'student',
  competition: 'student',
};

function videoAudience(tags = []) {
  const t = String(tags[0] ?? '');
  if (t === '宿舍生活' || t === '学习日常') return 'student';
  return 'both';
}

const dir = 'src/content/universities';
let totalAdded = 0;

for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.md'))) {
  const p = path.join(dir, f);
  const lines = fs.readFileSync(p, 'utf8').split('\n');
  const out = [];
  let mode = null; // 'materials' | 'videos' | null
  let itemStart = -1;
  let catIdx = -1;
  let tagIdx = -1;
  let added = 0;

  const flushItem = () => {
    if (!mode || itemStart < 0) return;
    const item = out.slice(itemStart);
    const hasAudience = item.some((l) => /^\s+audience:/.test(l));
    if (!hasAudience) {
      let val = 'both';
      let insertAt = -1;
      if (mode === 'materials' && catIdx >= 0) {
        const cat = out[catIdx].replace(/^\s+category:\s*/, '').trim();
        val = MATERIAL_AUDIENCE[cat] ?? 'both';
        insertAt = catIdx + 1;
      } else if (mode === 'videos') {
        if (tagIdx >= 0) {
          const raw = out[tagIdx].replace(/^\s+tags:\s*/, '');
          const tags = raw.match(/[^\[\],\s]+/g) ?? [];
          val = videoAudience(tags);
          insertAt = tagIdx + 1;
        } else {
          insertAt = out.length; // 追加为条目最后一个字段
        }
      }
      if (insertAt >= 0) {
        out.splice(insertAt, 0, `    audience: ${val}`);
        added++;
      }
    }
    itemStart = -1;
    catIdx = -1;
    tagIdx = -1;
  };

  for (const line of lines) {
    if (line.startsWith('materials:')) {
      flushItem();
      mode = 'materials';
      out.push(line);
      continue;
    }
    if (line.startsWith('videos:')) {
      flushItem();
      mode = 'videos';
      out.push(line);
      continue;
    }
    if (/^[A-Za-z][A-Za-z0-9]*:/.test(line)) {
      flushItem();
      mode = null;
      out.push(line);
      continue;
    }
    if (/^\s*-\s+title:/.test(line)) {
      flushItem();
      itemStart = out.length;
      out.push(line);
      continue;
    }
    if (mode === 'materials' && /^\s+category:/.test(line)) {
      catIdx = out.length;
      out.push(line);
      continue;
    }
    if (mode === 'videos' && /^\s+tags:/.test(line)) {
      tagIdx = out.length;
      out.push(line);
      continue;
    }
    out.push(line);
  }
  flushItem();

  if (added > 0) {
    fs.writeFileSync(p, out.join('\n'), 'utf8');
    console.log(`${f}: +${added}`);
    totalAdded += added;
  }
}

console.log(`共新增 ${totalAdded} 条 audience 标注`);
