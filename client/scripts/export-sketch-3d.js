const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const ASSETS = "C:/Users/USER/.cursor/projects/c-July-karmo-group/assets";
const OUT = path.join(
  __dirname,
  "../public/karmo/images/trust/cartoon-v3"
);

const SIZE = 320;
const INNER = 268;

const JOBS = [
  { src: "sketch-3d-legacy-60.jpg", out: "sketch-3d-legacy-60.webp", wipeCorners: true },
  { src: "sketch-3d-pillow.jpg", out: "sketch-3d-pillow.webp" },
  { src: "sketch-3d-globe.jpg", out: "sketch-3d-globe.webp" },
  { src: "sketch-3d-natural.jpg", out: "sketch-3d-natural.webp" },
  { src: "sketch-3d-delivery.jpg", out: "sketch-3d-delivery.webp" },
  { src: "sketch-3d-stores.jpg", out: "sketch-3d-stores.webp" },
];

function isPaper(r, g, b) {
  const min = Math.min(r, g, b);
  const max = Math.max(r, g, b);
  return min > 246 && max - min < 10;
}

function knockEdgePaper(data, width, height) {
  const n = width * height;
  const seen = new Uint8Array(n);
  const q = [];

  const push = (x, y) => {
    if (x < 0 || y < 0 || x >= width || y >= height) return;
    const i = y * width + x;
    if (seen[i]) return;
    const o = i * 4;
    if (!isPaper(data[o], data[o + 1], data[o + 2])) return;
    seen[i] = 1;
    q.push(i);
  };

  for (let x = 0; x < width; x++) {
    push(x, 0);
    push(x, height - 1);
  }
  for (let y = 0; y < height; y++) {
    push(0, y);
    push(width - 1, y);
  }

  while (q.length) {
    const i = q.pop();
    const x = i % width;
    const y = (i - x) / width;
    data[i * 4 + 3] = 0;
    push(x - 1, y);
    push(x + 1, y);
    push(x, y - 1);
    push(x, y + 1);
  }
}

function wipeFarCorners(data, width, height, frac = 0.1) {
  const m = Math.round(Math.min(width, height) * frac);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const far =
        (x < m && y < m) ||
        (x > width - 1 - m && y < m) ||
        (x < m && y > height - 1 - m) ||
        (x > width - 1 - m && y > height - 1 - m);
      if (far) data[(y * width + x) * 4 + 3] = 0;
    }
  }
}

function stampPlus(data, width, height) {
  let minX = width;
  let minY = height;
  let maxX = 0;
  let maxY = 0;
  let found = false;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const o = (y * width + x) * 4;
      if (data[o + 3] < 180) continue;
      if (data[o] > 165 && data[o + 1] < 95 && data[o + 2] < 95) {
        found = true;
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
      }
    }
  }
  if (!found) return;

  const cx = Math.round((minX + maxX) / 2);
  const cy = Math.round(minY + (maxY - minY) * 0.38);
  const arm = Math.max(5, Math.round((maxX - minX) * 0.14));
  const thick = Math.max(1, Math.round(arm * 0.22));

  const paint = (x, y) => {
    if (x < 0 || y < 0 || x >= width || y >= height) return;
    const o = (y * width + x) * 4;
    data[o] = 255;
    data[o + 1] = 255;
    data[o + 2] = 255;
    data[o + 3] = 255;
  };

  for (let dx = -arm; dx <= arm; dx++) {
    for (let t = -thick; t <= thick; t++) paint(cx + dx, cy + t);
  }
  for (let dy = -arm; dy <= arm; dy++) {
    for (let t = -thick; t <= thick; t++) paint(cx + t, cy + dy);
  }
}

async function toClearSquare(file, { wipeCorners = false } = {}) {
  const { data, info } = await sharp(file)
    .flatten({ background: "#ffffff" })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const buf = Buffer.from(data);
  knockEdgePaper(buf, info.width, info.height);
  if (wipeCorners) wipeFarCorners(buf, info.width, info.height, 0.11);

  const knocked = await sharp(buf, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png()
    .toBuffer();

  let trimmed;
  try {
    trimmed = await sharp(knocked).trim({ threshold: 4 }).png().toBuffer();
  } catch {
    trimmed = knocked;
  }

  return sharp(trimmed)
    .resize(INNER, INNER, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
      withoutEnlargement: false,
    })
    .extend({
      top: Math.round((SIZE - INNER) / 2),
      bottom: SIZE - INNER - Math.round((SIZE - INNER) / 2),
      left: Math.round((SIZE - INNER) / 2),
      right: SIZE - INNER - Math.round((SIZE - INNER) / 2),
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .webp({ quality: 92, alphaQuality: 100, effort: 5 })
    .toBuffer();
}

async function addPlusToClearStores() {
  const src = path.join(OUT, "sketch-clear-stores.webp");
  const dest = path.join(OUT, "sketch-clear-stores-mark.webp");
  const { data, info } = await sharp(src)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const buf = Buffer.from(data);
  stampPlus(buf, info.width, info.height);
  await sharp(buf, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .webp({ quality: 92, alphaQuality: 100, effort: 5 })
    .toFile(dest);
  console.log("stamped plus on", dest);
}

(async () => {
  for (const job of JOBS) {
    const src = path.join(ASSETS, job.src);
    const dest = path.join(OUT, job.out);
    const webp = await toClearSquare(src, job);
    fs.writeFileSync(dest, webp);
    const m = await sharp(dest).metadata();
    console.log(job.out, m.width + "x" + m.height, "alpha", m.hasAlpha, fs.statSync(dest).size);
  }
  await addPlusToClearStores();
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
