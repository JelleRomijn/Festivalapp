import sharp from 'sharp';
import { stat } from 'fs/promises';
import { join } from 'path';

const PUBLIC = new URL('../public/', import.meta.url).pathname;

const images = [
  { in: 'logoWhite.png',     out: 'logoWhite.webp',     resize: null, opts: { quality: 90 } },
  { in: 'logoBlack.png',     out: 'logoBlack.webp',     resize: null, opts: { quality: 90 } },
  { in: 'blokkenschema.png', out: 'blokkenschema.webp', resize: null, opts: { quality: 85 } },
  { in: 'festival1.jpg',     out: 'festival1.webp',     resize: 900,  opts: { quality: 82 } },
  { in: 'festival2.jpg',     out: 'festival2.webp',     resize: 900,  opts: { quality: 82 } },
  { in: 'festival3.jpg',     out: 'festival3.webp',     resize: 900,  opts: { quality: 82 } },
];

for (const { in: src, out: dst, resize, opts } of images) {
  const inPath  = join(PUBLIC, src);
  const outPath = join(PUBLIC, dst);
  let pipeline = sharp(inPath);
  if (resize) pipeline = pipeline.resize({ width: resize, withoutEnlargement: true });
  await pipeline.webp(opts).toFile(outPath);
  const before = (await stat(inPath)).size;
  const after  = (await stat(outPath)).size;
  const pct = Math.round((1 - after / before) * 100);
  console.log(`${src} → ${dst}  ${(before/1024).toFixed(0)}K → ${(after/1024).toFixed(0)}K  (-${pct}%)`);
}
