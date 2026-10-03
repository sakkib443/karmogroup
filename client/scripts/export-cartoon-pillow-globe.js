const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const ASSETS = "C:/Users/USER/.cursor/projects/c-July-karmo-group/assets";
const OUT = path.join(
  __dirname,
  "../public/karmo/images/trust/cartoon-v3"
);
const SIZE = 320;

const JOBS = [
  { src: "stores-noface.jpg", out: "stores-v3.webp", inner: 300 },
];

const LEAF = [165, 206, 103];
const HEART = [225, 74, 80];

function punchPackColors(data) {
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] < 180) continue;
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    if (g > 125 && g > r + 12 && g > b + 8 && r < 210) {
      const lum = (0.3 * r + 0.59 * g + 0.11 * b) / 180;
      const t = Math.max(0.78, Math.min(1.12, lum));
      data[i] = Math.min(255, Math.round(LEAF[0] * t));
      data[i + 1] = Math.min(255, Math.round(LEAF[1] * t));
      data[i + 2] = Math.min(255, Math.round(LEAF[2] * t));
      continue;
    }
    if (r > 155 && g < 125 && b < 125 && r > g + 40) {
      const lum = (0.3 * r + 0.59 * g + 0.11 * b) / 140;
      const t = Math.max(0.82, Math.min(1.08, lum));
      data[i] = Math.min(255, Math.round(HEART[0] * t));
      data[i + 1] = Math.min(255, Math.round(HEART[1] * t));
      data[i + 2] = Math.min(255, Math.round(HEART[2] * t));
    }
  }
}

function isPaper(r, g, b) {
  const min = Math.min(r, g, b);
  const max = Math.max(r, g, b);
  return min > 232 && max - min < 18;
}

function isLetterbox(r, g, b) {
  return Math.max(r, g, b) < 36;
}

function knockEdge(data, width, height, pred) {
  const n = width * height;
  const seen = new Uint8Array(n);
  const q = [];
  const push = (x, y) => {
    if (x < 0 || y < 0 || x >= width || y >= height) return;
    const i = y * width + x;
    if (seen[i]) return;
    const o = i * 4;
    if (data[o + 3] < 8) return;
    if (!pred(data[o], data[o + 1], data[o + 2])) return;
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

function isFrameGrey(r, g, b) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  return max - min < 16 && max >= 36 && max <= 220;
}

function knockMatchingFromClear(data, width, height, pred) {
  const seen = new Uint8Array(width * height);
  const q = [];
  const tryPush = (x, y) => {
    if (x < 0 || y < 0 || x >= width || y >= height) return;
    const i = y * width + x;
    if (seen[i]) return;
    const o = i * 4;
    if (data[o + 3] < 8) return;
    if (!pred(data[o], data[o + 1], data[o + 2])) return;
    seen[i] = 1;
    q.push(i);
  };
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const o = (y * width + x) * 4;
      const edge = x === 0 || y === 0 || x === width - 1 || y === height - 1;
      if (data[o + 3] < 8 || edge) {
        if (edge) tryPush(x, y);
        tryPush(x - 1, y);
        tryPush(x + 1, y);
        tryPush(x, y - 1);
        tryPush(x, y + 1);
      }
    }
  }
  while (q.length) {
    const i = q.pop();
    const x = i % width;
    const y = (i - x) / width;
    data[i * 4 + 3] = 0;
    tryPush(x - 1, y);
    tryPush(x + 1, y);
    tryPush(x, y - 1);
    tryPush(x, y + 1);
  }
}

function wipeFarCorners(data, width, height, frac = 0.08) {
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

async function toClearSquare(file, inner) {
  const { data, info } = await sharp(file)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const buf = Buffer.from(data);
  knockEdge(buf, info.width, info.height, isLetterbox);
  knockMatchingFromClear(buf, info.width, info.height, isFrameGrey);
  knockMatchingFromClear(buf, info.width, info.height, isPaper);
  wipeFarCorners(buf, info.width, info.height);
  punchPackColors(buf);
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
    .resize(inner, inner, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .extend({
      top: Math.round((SIZE - inner) / 2),
      bottom: SIZE - inner - Math.round((SIZE - inner) / 2),
      left: Math.round((SIZE - inner) / 2),
      right: SIZE - inner - Math.round((SIZE - inner) / 2),
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .webp({ quality: 92, alphaQuality: 100, effort: 5 })
    .toBuffer();
}

(async () => {
  for (const job of JOBS) {
    const dest = path.join(OUT, job.out);
    const webp = await toClearSquare(path.join(ASSETS, job.src), job.inner);
    fs.writeFileSync(dest, webp);
    const m = await sharp(dest).metadata();
    console.log(job.out, m.width + "x" + m.height, "alpha", m.hasAlpha);
  }
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
