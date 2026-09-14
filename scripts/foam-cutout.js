/* eslint-disable no-console */
/**
 * Cuts the three real Karmo foam products out of the "four grades" hero photo
 * so they can be composited into another scene without redrawing them.
 * Each product gets its own colour rule; the mask is then eroded so the dark
 * shadow line under the sofa lets go of the product, reduced to the blob at
 * the crop centre, and dilated back inside the original mask.
 */
const sharp = require("../client/node_modules/sharp");

const SRC =
  "C:/July/karmo group/client/public/karmo/images/home-02/hero/home-hero-slide-foam-grades-v2-hq.jpg";
const OUT = "C:/Users/USER/.cursor/projects/c-July-karmo-group/assets/";

const lum = (r, g, b) => 0.299 * r + 0.587 * g + 0.114 * b;

const PRODUCTS = {
  green: {
    box: { left: 1285, top: 836, width: 240, height: 224 },
    isProduct: (r, g, b) => g >= r + 4 && g >= b + 18 && lum(r, g, b) < 200,
  },
  brown: {
    // hugged tight: the dark shadow band under the sofa reads as product-dark
    box: { left: 1536, top: 864, width: 214, height: 184 },
    isProduct: (r, g, b) => lum(r, g, b) < 174,
  },
  red: {
    box: { left: 1958, top: 826, width: 240, height: 246 },
    isProduct: (r, g, b) => r - g > 55 && r - b > 45,
  },
};

/** sharp hands back an sRGB buffer even for one-channel input, so stride it back down. */
async function greyBlur(buf, w, h, radius) {
  const { data, info } = await sharp(buf, { raw: { width: w, height: h, channels: 1 } })
    .blur(radius)
    .raw()
    .toBuffer({ resolveWithObject: true });
  if (info.channels === 1) return data;
  const grey = Buffer.alloc(w * h);
  for (let i = 0; i < w * h; i++) grey[i] = data[i * info.channels];
  return grey;
}

async function morph(mask, w, h, radius, cut) {
  const buf = Buffer.alloc(w * h);
  for (let i = 0; i < w * h; i++) buf[i] = mask[i] ? 255 : 0;
  const blurred = await greyBlur(buf, w, h, radius);
  const out = new Uint8Array(w * h);
  for (let i = 0; i < w * h; i++) out[i] = blurred[i] >= cut ? 1 : 0;
  return out;
}

function blobAtCentre(mask, w, h) {
  const seen = new Uint8Array(w * h);
  const keep = new Uint8Array(w * h);
  const cx = w / 2;
  const cy = h * 0.55;
  let best = null;
  let bestScore = -1;

  for (let i = 0; i < w * h; i++) {
    if (!mask[i] || seen[i]) continue;
    const stack = [i];
    seen[i] = 1;
    const blob = [];
    let near = Infinity;
    while (stack.length) {
      const p = stack.pop();
      blob.push(p);
      const x = p % w;
      const y = (p / w) | 0;
      const d = Math.hypot(x - cx, y - cy);
      if (d < near) near = d;
      if (x > 0 && mask[p - 1] && !seen[p - 1]) (seen[p - 1] = 1), stack.push(p - 1);
      if (x < w - 1 && mask[p + 1] && !seen[p + 1]) (seen[p + 1] = 1), stack.push(p + 1);
      if (y > 0 && mask[p - w] && !seen[p - w]) (seen[p - w] = 1), stack.push(p - w);
      if (y < h - 1 && mask[p + w] && !seen[p + w]) (seen[p + w] = 1), stack.push(p + w);
    }
    const score = blob.length / (1 + near);
    if (score > bestScore) {
      bestScore = score;
      best = blob;
    }
  }
  if (best) for (const p of best) keep[p] = 1;
  return keep;
}

async function cut(name, { box, isProduct }) {
  const { data, info } = await sharp(SRC)
    .extract(box)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width: w, height: h } = info;
  const raw = new Uint8Array(w * h);
  for (let i = 0; i < w * h; i++) {
    if (isProduct(data[i * 4], data[i * 4 + 1], data[i * 4 + 2])) raw[i] = 1;
  }

  const eroded = await morph(raw, w, h, 2, 205);
  const core = blobAtCentre(eroded, w, h);
  const grown = await morph(core, w, h, 2, 55);

  const alpha = Buffer.alloc(w * h);
  let minX = w;
  let minY = h;
  let maxX = 0;
  let maxY = 0;
  for (let i = 0; i < w * h; i++) {
    const on = grown[i] && raw[i];
    alpha[i] = on ? 255 : 0;
    if (on) {
      const x = i % w;
      const y = (i / w) | 0;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
  console.log(name, "bbox", { minX, minY, maxX, maxY, of: `${w}x${h}` });

  const soft = await greyBlur(alpha, w, h, 0.8);

  const rgba = Buffer.alloc(w * h * 4);
  for (let i = 0; i < w * h; i++) {
    rgba[i * 4] = data[i * 4];
    rgba[i * 4 + 1] = data[i * 4 + 1];
    rgba[i * 4 + 2] = data[i * 4 + 2];
    rgba[i * 4 + 3] = soft[i];
  }

  const pad = 2;
  const left = Math.max(0, minX - pad);
  const top = Math.max(0, minY - pad);
  const cropped = sharp(rgba, { raw: { width: w, height: h, channels: 4 } }).extract({
    left,
    top,
    width: Math.min(w - 1, maxX + pad) - left,
    height: Math.min(h - 1, maxY + pad) - top,
  });

  await cropped.clone().png().toFile(OUT + "foam-cut-" + name + ".png");
  // flatten on magenta so the cut edge is easy to eyeball
  await cropped
    .clone()
    .flatten({ background: "#ff00ff" })
    .png()
    .toFile(OUT + "foam-check-" + name + ".png");
}

(async () => {
  for (const [name, spec] of Object.entries(PRODUCTS)) await cut(name, spec);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
