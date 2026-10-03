const sharp = require("sharp");
const path = require("path");

const SRC = path.join(
  __dirname,
  "../public/karmo/images/trust/cartoon-v3/stores-v3.webp",
);
const DEST = path.join(
  __dirname,
  "../public/karmo/images/trust/cartoon-v3/stores-v4.webp",
);

function isRed(r, g, b) {
  return r > 160 && r > g + 40 && r > b + 40 && g < 160;
}

function isWhite(r, g, b) {
  const min = Math.min(r, g, b);
  const max = Math.max(r, g, b);
  return min > 210 && max - min < 24;
}

(async () => {
  const { data, info } = await sharp(SRC)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const buf = Buffer.from(data);
  const { width, height } = info;

  const seen = new Uint8Array(width * height);
  const isRedPx = (i) => {
    const o = i * 4;
    return buf[o + 3] >= 80 && isRed(buf[o], buf[o + 1], buf[o + 2]);
  };

  let pin = null;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = y * width + x;
      if (seen[i] || !isRedPx(i)) continue;
      const q = [i];
      seen[i] = 1;
      let n = 0;
      let minx = width;
      let miny = height;
      let maxx = 0;
      let maxy = 0;
      while (q.length) {
        const p = q.pop();
        const xx = p % width;
        const yy = (p - xx) / width;
        n++;
        if (xx < minx) minx = xx;
        if (yy < miny) miny = yy;
        if (xx > maxx) maxx = xx;
        if (yy > maxy) maxy = yy;
        for (const [dx, dy] of [
          [1, 0],
          [-1, 0],
          [0, 1],
          [0, -1],
        ]) {
          const nx = xx + dx;
          const ny = yy + dy;
          if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
          const ni = ny * width + nx;
          if (seen[ni] || !isRedPx(ni)) continue;
          seen[ni] = 1;
          q.push(ni);
        }
      }
      if (n > 800 && miny > 80 && (!pin || n > pin.n)) {
        pin = { n, minx, miny, maxx, maxy };
      }
    }
  }
  if (!pin) throw new Error("pin not found");

  let sx = 0;
  let sy = 0;
  let n = 0;
  for (let y = pin.miny; y <= Math.round(pin.miny + (pin.maxy - pin.miny) * 0.62); y++) {
    for (let x = pin.minx; x <= pin.maxx; x++) {
      const o = (y * width + x) * 4;
      if (buf[o + 3] < 80) continue;
      if (!isWhite(buf[o], buf[o + 1], buf[o + 2])) continue;
      sx += x;
      sy += y;
      n++;
    }
  }
  const cx = n ? sx / n : (pin.minx + pin.maxx) / 2;
  const cy = n ? sy / n : pin.miny + (pin.maxy - pin.miny) * 0.32;
  const radius = 16;

  for (let y = Math.floor(cy - radius - 1); y <= Math.ceil(cy + radius + 1); y++) {
    for (let x = Math.floor(cx - radius - 1); x <= Math.ceil(cx + radius + 1); x++) {
      if (x < 0 || y < 0 || x >= width || y >= height) continue;
      const dx = x + 0.5 - cx;
      const dy = y + 0.5 - cy;
      const d = Math.hypot(dx, dy);
      if (d > radius) continue;
      const o = (y * width + x) * 4;
      if (buf[o + 3] < 80) continue;
      if (!isRed(buf[o], buf[o + 1], buf[o + 2]) && !isWhite(buf[o], buf[o + 1], buf[o + 2])) {
        continue;
      }
      buf[o] = 255;
      buf[o + 1] = 255;
      buf[o + 2] = 255;
      buf[o + 3] = 255;
    }
  }

  await sharp(buf, { raw: { width, height, channels: 4 } })
    .webp({ quality: 92, alphaQuality: 100, effort: 5 })
    .toFile(DEST);

  console.log("hole center", cx.toFixed(1), cy.toFixed(1), "n", n, "r", radius);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
