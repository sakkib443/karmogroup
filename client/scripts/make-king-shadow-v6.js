const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

(async () => {
  const srcPath = path.join(
    __dirname,
    "../public/karmo/images/mattress/products/king-3d-cutout-v2.png"
  );
  const outPath = path.join(
    __dirname,
    "../public/karmo/images/mattress/products/king-3d-cutout-v6.png"
  );
  const previewPath =
    "C:/Users/USER/.cursor/projects/c-July-karmo-group/assets/king-v6-shadow-preview.png";

  const meta = await sharp(srcPath).metadata();
  const w = meta.width;
  const h = meta.height;

  // Extra-smooth falloff: many opacity stops + large blur → no choppy edges
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="soft" x="-60%" y="-60%" width="220%" height="220%">
      <feGaussianBlur stdDeviation="38"/>
    </filter>
    <filter id="med" x="-55%" y="-55%" width="210%" height="210%">
      <feGaussianBlur stdDeviation="22"/>
    </filter>
    <filter id="tight" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="10"/>
    </filter>
    <radialGradient id="cast" cx="47%" cy="36%" r="62%" fx="43%" fy="30%">
      <stop offset="0%" stop-color="#000" stop-opacity="0.42"/>
      <stop offset="22%" stop-color="#000" stop-opacity="0.28"/>
      <stop offset="45%" stop-color="#000" stop-opacity="0.14"/>
      <stop offset="68%" stop-color="#000" stop-opacity="0.055"/>
      <stop offset="85%" stop-color="#000" stop-opacity="0.018"/>
      <stop offset="100%" stop-color="#000" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="ambient" cx="50%" cy="40%" r="55%">
      <stop offset="0%" stop-color="#000" stop-opacity="0.38"/>
      <stop offset="28%" stop-color="#000" stop-opacity="0.22"/>
      <stop offset="55%" stop-color="#000" stop-opacity="0.09"/>
      <stop offset="78%" stop-color="#000" stop-opacity="0.028"/>
      <stop offset="100%" stop-color="#000" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="contact" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#000" stop-opacity="0.62"/>
      <stop offset="25%" stop-color="#000" stop-opacity="0.34"/>
      <stop offset="55%" stop-color="#000" stop-opacity="0.12"/>
      <stop offset="80%" stop-color="#000" stop-opacity="0.03"/>
      <stop offset="100%" stop-color="#000" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <ellipse cx="800" cy="908" rx="560" ry="118" fill="url(#cast)" filter="url(#soft)"/>
  <ellipse cx="735" cy="868" rx="470" ry="86" fill="url(#ambient)" filter="url(#med)"/>

  <ellipse cx="525" cy="910" rx="52" ry="22" fill="url(#contact)" filter="url(#tight)"/>
  <ellipse cx="705" cy="880" rx="66" ry="20" fill="url(#contact)" filter="url(#tight)" opacity="0.6"/>
  <ellipse cx="1185" cy="794" rx="46" ry="18" fill="url(#contact)" filter="url(#tight)"/>
  <ellipse cx="295" cy="764" rx="40" ry="16" fill="url(#contact)" filter="url(#tight)" opacity="0.75"/>
  <ellipse cx="1388" cy="760" rx="38" ry="15" fill="url(#contact)" filter="url(#tight)" opacity="0.7"/>
</svg>`;

  const shadowSoft = await sharp(Buffer.from(svg))
    .png()
    .ensureAlpha()
    .blur(3.2)
    .toBuffer();

  const productBuf = await sharp(srcPath).ensureAlpha().png().toBuffer();

  const composed = await sharp({
    create: {
      width: w,
      height: h,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([
      { input: shadowSoft, blend: "over" },
      { input: productBuf, blend: "over" },
    ])
    .png()
    .toBuffer();

  await sharp(composed).png().toFile(outPath);

  await sharp({
    create: {
      width: w,
      height: h,
      channels: 3,
      background: { r: 255, g: 255, b: 255 },
    },
  })
    .composite([{ input: composed, blend: "over" }])
    .png()
    .toFile(previewPath);

  const { data, info } = await sharp(composed)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  let opaque = 0;
  let semi = 0;
  let clear = 0;
  const y0 = Math.floor(h * 0.7);
  for (let y = y0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const a = data[(y * w + x) * 4 + 3];
      if (a > 250) opaque++;
      else if (a > 8) semi++;
      else clear++;
    }
  }

  console.log("wrote", outPath, fs.statSync(outPath).size);
  console.log("preview", previewPath);
  console.log({ opaque, semi, clear });
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
