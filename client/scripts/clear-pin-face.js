const sharp = require("sharp");
const path = require("path");

const SRC = path.join(
  __dirname,
  "../public/karmo/images/trust/cartoon-v3/stores-v2.webp",
);
const DEST = path.join(
  __dirname,
  "../public/karmo/images/trust/cartoon-v3/stores-v3.webp",
);

const RED = [225, 74, 80];

function isPinRed(r, g, b) {
  return r > 160 && r > g + 40 && r > b + 40 && g < 150;
}

function isFaceMark(r, g, b) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  if (max < 140) return true;
  if (r > 150 && g > 70 && g < 200 && b > 70 && r > g + 10) return true;
  if (max - min < 25 && max < 180) return true;
  return false;
}

(async () => {
  const { data, info } = await sharp(SRC)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const buf = Buffer.from(data);
  const { width, height } = info;

  const redN = (x, y) => {
    let n = 0;
    for (let dy = -2; dy <= 2; dy++) {
      for (let dx = -2; dx <= 2; dx++) {
        if (!dx && !dy) continue;
        const xx = x + dx;
        const yy = y + dy;
        if (xx < 0 || yy < 0 || xx >= width || yy >= height) continue;
        const o = (yy * width + xx) * 4;
        if (buf[o + 3] < 80) continue;
        if (isPinRed(buf[o], buf[o + 1], buf[o + 2])) n++;
      }
    }
    return n;
  };

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const o = (y * width + x) * 4;
      if (buf[o + 3] < 80) continue;
      const r = buf[o];
      const g = buf[o + 1];
      const b = buf[o + 2];
      if (!isFaceMark(r, g, b)) continue;
      if (redN(x, y) < 8) continue;
      buf[o] = RED[0];
      buf[o + 1] = RED[1];
      buf[o + 2] = RED[2];
    }
  }

  await sharp(buf, {
    raw: { width, height, channels: 4 },
  })
    .webp({ quality: 92, alphaQuality: 100, effort: 5 })
    .toFile(DEST);

  console.log("wrote stores-v3.webp");
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
