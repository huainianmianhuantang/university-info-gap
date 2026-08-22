/**
 * 为 39 所 985 补充 5 类实用标签：
 *  保研率高 / 宿舍条件好 / 转专业宽松 / 生活成本低 / 行业就业（计算机强校·金融强校·军工对口）
 * 已存在的标签保留，重复运行安全。
 */
import fs from 'node:fs';
import path from 'node:path';

const NEW_TAGS = {
  'peking-university': ['保研率高', '转专业宽松', '计算机强校', '金融强校'],
  'tsinghua-university': ['保研率高', '转专业宽松', '计算机强校', '金融强校'],
  'ustc': ['保研率高', '计算机强校', '生活成本低'],
  'nju': ['保研率高', '转专业宽松', '宿舍条件好', '计算机强校'],
  'fudan': ['保研率高', '转专业宽松', '计算机强校', '金融强校'],
  'sjtu': ['保研率高', '计算机强校', '金融强校'],
  'zhejiang-university': ['保研率高', '转专业宽松', '宿舍条件好', '计算机强校'],
  'renmin-university': ['保研率高', '金融强校'],
  'nankai': ['保研率高', '转专业宽松', '金融强校'],
  'buaa': ['保研率高', '计算机强校', '军工对口'],
  'bit': ['保研率高', '计算机强校', '军工对口'],
  'hit': ['保研率高', '宿舍条件好', '生活成本低', '计算机强校', '军工对口'],
  'xjtu': ['保研率高', '宿舍条件好', '生活成本低', '计算机强校'],
  'tongji': ['保研率高', '宿舍条件好'],
  'tju': ['宿舍条件好'],
  'huazhong-ust': ['保研率高', '转专业宽松', '宿舍条件好', '计算机强校', '生活成本低'],
  'wuhan-university': ['保研率高', '转专业宽松', '计算机强校', '生活成本低'],
  'seu': ['保研率高', '宿舍条件好', '计算机强校'],
  'scu': ['保研率高', '转专业宽松', '宿舍条件好', '生活成本低'],
  'sysu': ['保研率高', '转专业宽松', '宿舍条件好', '计算机强校'],
  'xmu': ['保研率高', '转专业宽松', '宿舍条件好', '金融强校'],
  'sdu': ['转专业宽松', '宿舍条件好'],
  'csu': ['生活成本低'],
  'scut': ['宿舍条件好'],
  'cqu': ['生活成本低'],
  'dlut': ['宿舍条件好', '生活成本低'],
  'npu': ['军工对口'],
  'nudt': ['军工对口'],
  'jilin-university': ['转专业宽松', '生活成本低'],
  'lzu': ['转专业宽松', '生活成本低'],
  'ouc': ['转专业宽松'],
  'hunan-university': ['生活成本低'],
  'nwafu': ['生活成本低'],
  'northeastern-university': ['转专业宽松', '生活成本低'],
  'uestc': ['宿舍条件好', '计算机强校', '生活成本低'],
};

const dir = 'src/content/universities';
let total = 0;
for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.md'))) {
  const slug = f.replace(/\.md$/, '');
  const add = NEW_TAGS[slug];
  if (!add || add.length === 0) continue;
  const p = path.join(dir, f);
  const lines = fs.readFileSync(p, 'utf8').split('\n');
  const idx = lines.findIndex((l) => /^tags:\s*\[/.test(l));
  if (idx === -1) {
    console.log(`${f}: 未找到 tags 行，跳过`);
    continue;
  }
  const raw = lines[idx].replace(/^tags:\s*\[/, '').replace(/\]\s*$/, '').trim();
  const existing = raw
    ? raw.split(',').map((s) => s.trim().replace(/^['"]|['"]$/g, '')).filter(Boolean)
    : [];
  const merged = [...existing];
  for (const t of add) {
    if (!merged.includes(t)) merged.push(t);
  }
  lines[idx] = `tags: [${merged.join(', ')}]`;
  fs.writeFileSync(p, lines.join('\n'), 'utf8');
  console.log(`${f}: +${merged.length - existing.length}`);
  total += merged.length - existing.length;
}
console.log(`共新增 ${total} 个标签`);
