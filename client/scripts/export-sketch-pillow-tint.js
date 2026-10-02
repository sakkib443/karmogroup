const sharp = require("sharp");
const path = require("path");

const SRC = path.join(
  __dirname,
  "../public/karmo/images/trust/cartoon-v3/sketch-3d-pillow.webp",
);
const DEST = path.join(
  __dirname,
  "../public/karmo/images/trust/cartoon-v3/sketch-3d-pillow-tint.webp",
);

const LEAF = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="46" height="54" viewBox="0 0 46 54">
  <path d="M23 3C34 14 37 32 23 51C9 32 12 14 23 3Z" fill="rgb(165,206,103)" stroke="#1a1a1a" stroke-width="2.6" stroke-linejoin="round"/>
  <path d="M23 12V42" stroke="#1a1a1a" stroke-width="1.8" stroke-linecap="round"/>
</svg>`);

const HEART = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="18" height="16" viewBox="0 0 18 16">
  <path d="M9 15C9 15 1.5 10 1.5 5.6C1.5 3.2 3.2 1.7 5.2 1.7C6.8 1.7 8.2 2.7 9 4C9.8 2.7 11.2 1.7 12.8 1.7C14.8 1.7 16.5 3.2 16.5 5.6C16.5 10 9 15 9 15Z" fill="rgb(225,74,80)"/>
</svg>`);

(async () => {
  const [leaf, heart] = await Promise.all([
    sharp(LEAF).png().toBuffer(),
    sharp(HEART).png().toBuffer(),
  ]);

  await sharp(SRC)
    .composite([
      { input: leaf, left: 248, top: 168 },
      { input: heart, left: 228, top: 248 },
    ])
    .webp({ quality: 92, alphaQuality: 100, effort: 5 })
    .toFile(DEST);

  const m = await sharp(DEST).metadata();
  console.log("sketch-3d-pillow-tint.webp", m.width + "x" + m.height, "alpha", m.hasAlpha);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
