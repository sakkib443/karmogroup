const sharp = require("C:/July/karmo group/client/node_modules/sharp");

const src =
  "C:/July/karmo group/client/public/karmo-library/02-catalogues/mattress-brochure/page-03.png";
const dest =
  "C:/July/karmo group/client/public/karmo/images/mattress/brochure/page-03-brands-dusk.jpg";

function isPale(r, g, b) {
  const maxc = Math.max(r, g, b);
  const minc = Math.min(r, g, b);
  const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luma > 214 && maxc - minc < 32;
}

(async () => {
  const { data, info } = await sharp(src)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;
  const n = w * h;
  const pale = Buffer.alloc(n);
  for (let i = 0, p = 0; i < data.length; i += 4, p++) {
    if (isPale(data[i], data[i + 1], data[i + 2])) pale[p] = 1;
  }

  const bed = Buffer.alloc(n);
  const q = new Uint32Array(n);
  let qs = 0;
  let qe = 0;
  const push = (x, y) => {
    const i = y * w + x;
    if (!pale[i] || bed[i]) return;
    bed[i] = 1;
    q[qe++] = i;
  };
  for (let x = 0; x < w; x++) {
    push(x, 0);
    push(x, h - 1);
  }
  for (let y = 0; y < h; y++) {
    push(0, y);
    push(w - 1, y);
  }
  while (qs < qe) {
    const i = q[qs++];
    const x = i % w;
    const y = (i - x) / w;
    if (x > 0) push(x - 1, y);
    if (x + 1 < w) push(x + 1, y);
    if (y > 0) push(x, y - 1);
    if (y + 1 < h) push(x, y + 1);
  }

  let bedCount = 0;
  for (let i = 0, p = 0; i < data.length; i += 4, p++) {
    if (!bed[p]) continue;
    bedCount++;
    data[i] = Math.round(data[i] * 0.78 + 18);
    data[i + 1] = Math.round(data[i + 1] * 0.78 + 16);
    data[i + 2] = Math.round(data[i + 2] * 0.78 + 14);
  }

  await sharp(data, { raw: { width: w, height: h, channels: 4 } })
    .jpeg({ quality: 90, mozjpeg: true })
    .toFile(dest);
  console.log("wrote", dest, "bedPx", bedCount, "of", n);
})();
