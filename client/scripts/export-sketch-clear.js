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
  { src: "sketch-color-legacy-60.jpg", out: "sketch-clear-legacy-60.webp" },
  { src: "sketch-color-pillow.jpg", out: "sketch-clear-pillow.webp" },
  { src: "sketch-color-quality-globe.jpg", out: "sketch-clear-globe.webp" },
  { src: "sketch-color-natural.jpg", out: "sketch-clear-natural.webp" },
  { src: "sketch-color-delivery.jpg", out: "sketch-clear-delivery.webp" },
  { src: "sketch-color-stores.jpg", out: "sketch-clear-stores.webp" },
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

  for (let i = 0; i < n; i++) {
    const o = i * 4;
    if (data[o + 3] === 0) continue;
    const r = data[o];
    const g = data[o + 1];
    const b = data[o + 2];
    const min = Math.min(r, g, b);
    const max = Math.max(r, g, b);
    if (min > 236 && max - min < 14) {
      const x = i % width;
      const y = (i - x) / width;
      const nearClear = [
        [x - 1, y],
        [x + 1, y],
        [x, y - 1],
        [x, y + 1],
      ].some(([nx, ny]) => {
        if (nx < 0 || ny < 0 || nx >= width || ny >= height) return true;
        return data[(ny * width + nx) * 4 + 3] === 0;
      });
      if (nearClear) {
        const t = (min - 236) / (255 - 236);
        data[o + 3] = Math.max(0, Math.round(255 * (1 - t)));
      }
    }
  }
}

async function toClearSquare(file) {
  const { data, info } = await sharp(file)
    .flatten({ background: "#ffffff" })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const buf = Buffer.from(data);
  knockEdgePaper(buf, info.width, info.height);

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

(async () => {
  for (const job of JOBS) {
    const src = path.join(ASSETS, job.src);
    const dest = path.join(OUT, job.out);
    const webp = await toClearSquare(src);
    fs.writeFileSync(dest, webp);
    const m = await sharp(dest).metadata();
    const { data, info } = await sharp(dest)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    const corners = [
      [0, 0],
      [info.width - 1, 0],
      [0, info.height - 1],
      [info.width - 1, info.height - 1],
    ].map(([x, y]) => data[(y * info.width + x) * 4 + 3]);
    console.log(
      job.out,
      m.width + "x" + m.height,
      "alpha",
      m.hasAlpha,
      "corners",
      corners.join(","),
      fs.statSync(dest).size
    );
  }
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
