const sharp = require("sharp");
const path = require("path");

const ROOT = path.join(__dirname, "../public/karmo/images/home-02/certified/logos");
const ISO_SRC = path.join(ROOT, "logo-iso-9001-gold.webp");
const ISO_DEST = path.join(ROOT, "logo-iso-9001-gold-v4.webp");
const UKAS_SRC = path.join(ROOT, "logo-ukas-gold-v5.webp");
const UKAS_DEST = path.join(ROOT, "logo-ukas-gold-v8.webp");
const MOODY_SRC = path.join(ROOT, "logo-moody-gold-v5.webp");
const MOODY_DEST = path.join(ROOT, "logo-moody-gold-v8.webp");

function isCrownRed(r, g, b) {
  return r > 145 && g < 95 && b < 95 && r > g + 45;
}

function isGold(r, g, b) {
  if (isCrownRed(r, g, b)) return false;
  const min = Math.min(r, g, b);
  if (min > 240) return false;
  return r > g + 4 && g >= b - 6 && r > 70;
}

function gradeGold(r, g, b) {
  // Pull bright lemon gold toward the quieter #1/#2 amber.
  return [
    Math.max(0, Math.min(255, Math.round(r * 0.86 + 10))),
    Math.max(0, Math.min(255, Math.round(g * 0.68 + 16))),
    Math.max(0, Math.min(255, Math.round(b * 0.38 + 20))),
  ];
}

async function load(src) {
  return sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
}

async function save(buf, info, dest) {
  await sharp(buf, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .webp({ quality: 94, alphaQuality: 100, effort: 6 })
    .toFile(dest);
}

async function stripIsoRed() {
  const { data, info } = await load(ISO_SRC);
  const src = data;
  const buf = Buffer.from(data);
  const { width, height } = info;
  const cx = width / 2;
  const cy = height / 2;
  const GOLD = [228, 186, 92];

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const dx = x - cx;
      const dy = y - cy;
      const rad = Math.hypot(dx, dy);
      if (rad < 398 || rad > 458) continue;
      const o = (y * width + x) * 4;
      if (src[o + 3] < 8) continue;
      const r = src[o];
      const g = src[o + 1];
      const b = src[o + 2];
      const isBrightLip = r > 230 && g > 195 && b > 110 && r - g < 70;
      if (isBrightLip) continue;
      const isCrimson = r > 88 && r > g + 22 && r > b + 28 && g < 125 && b < 105;
      const isDarkGroove = rad >= 405 && rad <= 448 && r < 165 && g < 125 && b < 95;
      if (!isCrimson && !isDarkGroove) continue;
      const ang = Math.atan2(dy, dx);
      const sr = Math.max(360, rad - 22);
      const sx = Math.max(0, Math.min(width - 1, Math.round(cx + Math.cos(ang) * sr)));
      const sy = Math.max(0, Math.min(height - 1, Math.round(cy + Math.sin(ang) * sr)));
      const so = (sy * width + sx) * 4;
      let nr = src[so];
      let ng = src[so + 1];
      let nb = src[so + 2];
      if (nr < 150 || ng < 110 || src[so + 3] < 16) {
        nr = GOLD[0];
        ng = GOLD[1];
        nb = GOLD[2];
      }
      buf[o] = nr;
      buf[o + 1] = ng;
      buf[o + 2] = nb;
    }
  }

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const rad = Math.hypot(x - cx, y - cy);
      if (rad < 415 || rad > 456) continue;
      const o = (y * width + x) * 4;
      if (buf[o + 3] < 8) continue;
      const r = buf[o];
      const g = buf[o + 1];
      const b = buf[o + 2];
      if (r > 220 && g > 185 && b > 95 && r - g < 55) continue;
      if (b < 120 && r > b + 18) {
        buf[o] = GOLD[0];
        buf[o + 1] = GOLD[1];
        buf[o + 2] = GOLD[2];
      }
    }
  }

  await save(buf, info, ISO_DEST);
  console.log("wrote", path.basename(ISO_DEST));
}

async function muteSeal(src, dest) {
  const { data, info } = await load(src);
  const buf = Buffer.from(data);
  for (let i = 0; i < buf.length; i += 4) {
    if (buf[i + 3] < 16) continue;
    const r = buf[i];
    const g = buf[i + 1];
    const b = buf[i + 2];
    if (!isGold(r, g, b)) continue;
    const [nr, ng, nb] = gradeGold(r, g, b);
    buf[i] = nr;
    buf[i + 1] = ng;
    buf[i + 2] = nb;
  }
  await save(buf, info, dest);
  console.log("wrote", path.basename(dest));
}

(async () => {
  await stripIsoRed();
  await muteSeal(UKAS_SRC, UKAS_DEST);
  await muteSeal(MOODY_SRC, MOODY_DEST);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
