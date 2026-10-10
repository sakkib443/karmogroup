/**
 * Aggressive WebP pass for heavy site images.
 *   node scripts/optimize-aggressive.mjs <image> [...]
 * Writes a .webp next to each PNG/JPG (same name), capped at MAX_WIDTH, q QUALITY.
 * Keeps alpha. Skips (and reports) any output that ends up LARGER than the source.
 */
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const MAX_WIDTH = 2000;
const QUALITY = 74;

const files = process.argv.slice(2);
if (!files.length) {
  console.log("usage: node scripts/optimize-aggressive.mjs <image> [...]");
  process.exit(1);
}

let before = 0;
let after = 0;
let kept = 0;

for (const file of files) {
  const out = file.replace(/\.(png|jpe?g)$/i, ".webp");
  if (out === file) {
    console.log(`skip (not png/jpg): ${file}`);
    continue;
  }
  let src;
  try {
    src = await fs.readFile(file);
  } catch {
    console.log(`missing: ${file}`);
    continue;
  }
  const meta = await sharp(src).metadata();
  const tmp = out + ".tmp";
  await sharp(src)
    .rotate()
    .resize({ width: Math.min(meta.width, MAX_WIDTH), withoutEnlargement: true })
    .webp({ quality: QUALITY, alphaQuality: 88, effort: 6, smartSubsample: true })
    .toFile(tmp);
  const size = (await fs.stat(tmp)).size;
  if (size >= src.length) {
    await fs.unlink(tmp);
    console.log(`SKIP grew (${(src.length / 1024) | 0}->${(size / 1024) | 0} KB): ${path.basename(file)}`);
    kept++;
    continue;
  }
  await fs.rename(tmp, out);
  before += src.length;
  after += size;
  console.log(
    `${(src.length / 1024).toFixed(0).padStart(6)} -> ${(size / 1024).toFixed(0).padStart(5)} KB  ${meta.width}x${meta.height}  ${path.basename(out)}`,
  );
}

console.log(
  `total ${(before / 1048576).toFixed(1)} -> ${(after / 1048576).toFixed(1)} MB  (${kept} kept as source)`,
);
