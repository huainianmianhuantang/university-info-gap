import fs from 'node:fs';
import path from 'node:path';

const dir = path.resolve('src/content/universities');
const profiles = JSON.parse(
  fs.readFileSync(path.resolve('scripts/school-profiles.json'), 'utf8'),
);

const FOOTER =
  '\n\n> 概况为公开资料整理，仅供参考；政策类信息请以学校官方发布为准。各栏目内容持续补充中，欢迎投稿。\n';

let applied = 0;
for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.md'))) {
  const slug = f.replace(/\.md$/, '');
  const p = profiles[slug];
  if (!p) continue;
  const fp = path.join(dir, f);
  let text = fs.readFileSync(fp, 'utf8');

  // Replace brief in frontmatter
  const briefRe = /^(brief:\s*).*$/m;
  if (!briefRe.test(text)) {
    console.error(`NO brief: ${f}`);
    continue;
  }
  text = text.replace(briefRe, `$1${p.brief}`);

  // Replace body after frontmatter
  const bodyRe = /^---\n[\s\S]*?\n---\n[\s\S]*$/;
  if (!bodyRe.test(text)) {
    console.error(`NO body: ${f}`);
    continue;
  }
  text = text.replace(bodyRe, (m) => {
    const fmEnd = m.indexOf('\n---') + 4;
    return m.slice(0, fmEnd) + '\n\n' + p.body + FOOTER;
  });

  fs.writeFileSync(fp, text, 'utf8');
  applied++;
}
console.log(`Applied profiles to ${applied} schools.`);
