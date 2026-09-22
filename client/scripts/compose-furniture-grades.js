const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const ROOT = path.join(__dirname, "../public/karmo/images/foam/furniture");
const OUT = path.join(ROOT, "grades/furniture-grades-lineup-hq.jpg");
const BG = path.join(ROOT, "grades/furniture-grades-room-bg.png");

const STACKS = [
  ["280", "products/280-hover-hq.jpg"],
  ["2001", "products/2001-hover-hq.jpg"],
  ["hd", "products/hd-hover-hq.jpg"],
  ["1965", "products/1965-hover-hq.jpg"],
];

const W = 2560;
const H = 1440;

async function cutout(file) {
  const { data, info } = await sharp(file)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  let minX = width;
  let minY = height;
  let maxX = 0;
  let maxY = 0;
  for (let i = 0; i < data.length; i += channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const maxc = Math.max(r, g, b);
    const minc = Math.min(r, g, b);
    const lum = (r + g + b) / 3;
    const sat = maxc - minc;
    let a = 255;
    if (lum > 225 || (lum > 185 && sat < 28)) a = 0;
    else if (lum > 160 && sat < 36) a = Math.round(((185 - lum) / 25) * 200);
    data[i + 3] = a;
    if (a > 18) {
      const px = (i / channels) % width;
      const py = Math.floor(i / channels / width);
      if (px < minX) minX = px;
      if (py < minY) minY = py;
      if (px > maxX) maxX = px;
      if (py > maxY) maxY = py;
    }
  }
  const pad = 6;
  minX = Math.max(0, minX - pad);
  minY = Math.max(0, minY - pad);
  maxX = Math.min(width - 1, maxX + pad);
  maxY = Math.min(height - 1, maxY + pad);
  return sharp(data, { raw: { width, height, channels: 4 } })
    .extract({
      left: minX,
      top: minY,
      width: maxX - minX + 1,
      height: maxY - minY + 1,
    })
    .png()
    .toBuffer();
}

async function withShadow(pngBuf) {
  const { data, info } = await sharp(pngBuf)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const shadowRaw = Buffer.from(data);
  for (let i = 0; i < shadowRaw.length; i += 4) {
    shadowRaw[i] = 32;
    shadowRaw[i + 1] = 22;
    shadowRaw[i + 2] = 14;
    shadowRaw[i + 3] = Math.round(shadowRaw[i + 3] * 0.4);
  }
  const pad = 52;
  const shadow = await sharp(shadowRaw, { raw: info }).blur(26).png().toBuffer();
  return sharp({
    create: {
      width: info.width + pad * 2,
      height: info.height + pad * 2,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([
      { input: shadow, left: pad, top: pad + 24 },
      { input: pngBuf, left: pad, top: pad },
    ])
    .png()
    .toBuffer();
}

(async () => {
  fs.mkdirSync(path.dirname(OUT), { recursive: true });

  const bg = await sharp(BG)
    .resize(W, H, { fit: "cover", position: "centre" })
    .blur(3)
    .modulate({ brightness: 0.96, saturation: 0.92 })
    .toBuffer();

  const cutouts = [];
  for (const [id, rel] of STACKS) {
    const buf = await cutout(path.join(ROOT, rel));
    cutouts.push(buf);
    await sharp(buf)
      .png()
      .toFile(path.join(ROOT, `grades/cutout-${id}.png`));
  }

  const targetH = 800;
  const gap = 48;
  const side = 220;
  const usable = W - side * 2 - gap * (cutouts.length - 1);
  const colW = Math.floor(usable / cutouts.length);

  const overlays = [];
  for (let i = 0; i < cutouts.length; i++) {
    const resized = await sharp(cutouts[i])
      .resize({ width: colW, height: targetH, fit: "inside" })
      .png()
      .toBuffer();
    const shadowed = await withShadow(resized);
    const meta = await sharp(shadowed).metadata();
    const left = side + i * (colW + gap) + Math.round((colW - meta.width) / 2);
    const top = H - 48 - meta.height;
    overlays.push({ input: shadowed, left: Math.max(0, left), top: Math.max(0, top) });
  }

  await sharp(bg)
    .composite(overlays)
    .jpeg({ quality: 90, mozjpeg: true })
    .toFile(OUT);

  const m = await sharp(OUT).metadata();
  console.log("wrote", OUT, m.width, m.height);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
