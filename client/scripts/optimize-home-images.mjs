/**
 * Turns heavy homepage images (ChatGPT PNG/JPG exports, 1–3 MB each) into
 * light WebP files next to the originals, same name, `.webp` extension.
 *
 *   node scripts/optimize-home-images.mjs public/karmo/images/a.png [...]
 *
 * - Width is capped at MAX_WIDTH (2400px = sharp on a 1200px-wide retina
 *   slot and on a 1920px full-bleed screen); smaller images keep their size.
 * - Transparent PNGs keep their alpha.
 * - Prints before/after sizes. The original file is left untouched.
 */
import path from "node:path";
import fs from "node:fs/promises";
import sharp from "sharp";

const MAX_WIDTH = 2400;
const QUALITY = 80;

const files = process.argv.slice(2);
if (!files.length) {
  console.log("usage: node scripts/optimize-home-images.mjs <image> [...]");
  process.exit(1);
}

let before = 0;
let after = 0;

for (const file of files) {
  const out = file.replace(/\.(png|jpe?g)$/i, ".webp");
  if (out === file) {
    console.log(`skip (not png/jpg): ${file}`);
    continue;
  }
  const src = await fs.readFile(file);
  const meta = await sharp(src).metadata();
  await sharp(src)
    .rotate()
    .resize({ width: Math.min(meta.width, MAX_WIDTH), withoutEnlargement: true })
    .webp({ quality: QUALITY, alphaQuality: 90, effort: 6, smartSubsample: true })
    .toFile(out);
  const { size } = await fs.stat(out);
  before += src.length;
  after += size;
  console.log(
    `${(src.length / 1024).toFixed(0).padStart(5)} KB -> ${(size / 1024).toFixed(0).padStart(4)} KB  ${meta.width}x${meta.height}  ${path.basename(out)}`,
  );
}

console.log(
  `total ${(before / 1048576).toFixed(1)} MB -> ${(after / 1048576).toFixed(1)} MB`,
);
