import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const dir = path.resolve('public/images');
const files = fs
  .readdirSync(dir)
  .filter((f) => /^logo-.*\.(webp|png|jpe?g)$/i.test(f));

let saved = 0;
let totalBefore = 0;
let totalAfter = 0;
const created = [];

for (const f of files) {
  const fp = path.join(dir, f);
  const meta = await sharp(fp).metadata();
  totalBefore += meta.size ?? fs.statSync(fp).size;
  if ((meta.width ?? 0) > 512) {
    if (f.toLowerCase().endsWith('.png')) {
      try {
        const out = await sharp(fp)
          .resize({ width: 512, withoutEnlargement: true })
          .png({ compressionLevel: 9 })
          .toBuffer();
        fs.writeFileSync(fp, out);
        saved++;
      } catch (e) {
        console.log(`SKIP ${f}: ${e.code ?? e.message}`);
      }
    } else {
      const outName = f.replace(/\.(webp|jpe?g)$/i, '-512.webp');
      const outPath = path.join(dir, outName);
      try {
        const out = await sharp(fp)
          .resize({ width: 512, withoutEnlargement: true })
          .webp({ quality: 82 })
          .toBuffer();
        fs.writeFileSync(outPath, out);
        created.push({ old: f, new: outName });
        saved++;
      } catch (e) {
        console.log(`SKIP ${f}: ${e.code ?? e.message}`);
      }
    }
  }
  totalAfter += fs.statSync(fp).size;
}

console.log(
  JSON.stringify({
    saved,
    beforeMB: +(totalBefore / 1048576).toFixed(2),
    afterMB: +(totalAfter / 1048576).toFixed(2),
    created: created.length,
  }),
);

// 更新各校 cover 引用到压缩版
if (created.length > 0) {
  const contentDir = path.resolve('src/content/universities');
  let updated = 0;
  for (const c of fs.readdirSync(contentDir).filter((x) => x.endsWith('.md'))) {
    const fp = path.join(contentDir, c);
    let text = fs.readFileSync(fp, 'utf8');
    for (const { old: o, new: n } of created) {
      const oldRef = `/images/${o}`;
      if (text.includes(oldRef)) {
        text = text.replace(oldRef, `/images/${n}`);
        updated++;
      }
    }
    fs.writeFileSync(fp, text, 'utf8');
  }
  console.log(`covers updated: ${updated}`);
}
