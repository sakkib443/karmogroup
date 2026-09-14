/* eslint-disable no-console */
/**
 * Places the three real Karmo foam cut-outs on the empty mustard room,
 * to the left of the coffee table, a step deeper into the scene so they
 * sit on the floor instead of floating in the foreground.
 */
const sharp = require("../client/node_modules/sharp");

const A = "C:/Users/USER/.cursor/projects/c-July-karmo-group/assets/";
const PLATE = A + "home-hero-mustard-room-empty.png";
const OUT_FULL = A + "home-hero-foam-real-v21.png";
const OUT_HERO =
  "C:/July/karmo group/client/public/karmo/images/home-02/hero/home-hero-slide-foam-real-v21-hq.jpg";

/**
 * Same left-of-table order as v20 (green, brown, red), just smaller and
 * further back — baseY is the floor contact. brown sits a half-step deeper.
 */
const PLACEMENT = [
  { name: "brown", scale: 0.7, left: 292, baseY: 772 },
  { name: "green", scale: 0.74, left: 138, baseY: 788 },
  { name: "red", scale: 0.72, left: 438, baseY: 786 },
];

function warmAndGround(data, w, h) {
  for (let y = 0; y < h; y++) {
    const ground = Math.min(1, Math.max(0, (y - h * 0.62) / (h * 0.38)));
    for (let x = 0; x < w; x++) {
      const o = (y * w + x) * 4;
      const a = data[o + 3];
      if (!a) continue;

      // match the room's golden window light
      let r = data[o] * 1.08 + 6;
      let g = data[o + 1] * 1.02 + 3;
      let b = data[o + 2] * 0.88;

      // left window: a hair brighter on the left face, quieter on the right
      const side = x / (w - 1);
      r *= 1.04 - side * 0.08;
      g *= 1.03 - side * 0.06;
      b *= 1.01 - side * 0.04;

      // ambient occlusion where the product meets the floor
      const occlude = 1 - ground * 0.22;
      r *= occlude;
      g *= occlude;
      b *= occlude;

      data[o] = Math.min(255, Math.round(r));
      data[o + 1] = Math.min(255, Math.round(g));
      data[o + 2] = Math.min(255, Math.round(b));

      // kill pale studio-floor fringe so the cut sits clean
      const lum = (data[o] + data[o + 1] + data[o + 2]) / 3;
      const sat = Math.max(data[o], data[o + 1], data[o + 2]) - Math.min(data[o], data[o + 1], data[o + 2]);
      if (lum > 175 && sat < 28) {
        data[o + 3] = Math.round(a * 0.08);
      }

      // feather the last few rows into the contact shadow
      if (y > h - 6) {
        const t = (h - 1 - y) / 5;
        data[o + 3] = Math.round(data[o + 3] * (0.35 + 0.65 * t));
      }
    }
  }
}

function ellipseShadow(w, h, strength, blur) {
  const buf = Buffer.alloc(w * h * 4);
  const cx = (w - 1) / 2;
  const cy = (h - 1) / 2;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const dx = (x - cx) / cx;
      const dy = (y - cy) / cy;
      const d = Math.sqrt(dx * dx + dy * dy);
      const f = d >= 1 ? 0 : Math.pow(1 - d, 1.85);
      const o = (y * w + x) * 4;
      buf[o] = 38;
      buf[o + 1] = 24;
      buf[o + 2] = 12;
      buf[o + 3] = Math.round(255 * strength * f);
    }
  }
  return sharp(buf, { raw: { width: w, height: h, channels: 4 } }).blur(blur).png().toBuffer();
}

(async () => {
  const plate = sharp(PLATE);
  const meta = await plate.metadata();
  console.log("plate", meta.width, meta.height);

  const layers = [];

  for (const p of PLACEMENT) {
    const file = A + "foam-cut-" + p.name + ".png";
    const m = await sharp(file).metadata();
    const w = Math.round(m.width * p.scale);
    const h = Math.round(m.height * p.scale * 0.97);
    const top = p.baseY - h;

    const { data, info } = await sharp(file)
      .resize(w, h, { fit: "fill", kernel: "lanczos3" })
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    warmAndGround(data, info.width, info.height);
    const product = await sharp(data, {
      raw: { width: info.width, height: info.height, channels: 4 },
    })
      .png()
      .toBuffer();

    // window is on the left, so the pool sits a little to the right of the object
    const cast = {
      w: Math.round(w * 1.22),
      h: Math.round(w * 0.22),
      a: 0.24,
      blur: 8,
      xOff: w * 0.12,
    };
    const contact = {
      w: Math.round(w * 0.86),
      h: Math.round(Math.max(10, w * 0.09)),
      a: 0.62,
      blur: 1.8,
      xOff: w * 0.03,
    };

    for (const s of [cast, contact]) {
      layers.push({
        input: await ellipseShadow(s.w, s.h, s.a, s.blur),
        left: Math.round(p.left + w / 2 - s.w / 2 + s.xOff),
        top: Math.round(p.baseY - s.h * 0.48),
      });
    }
    layers.push({ input: product, left: p.left, top });

    console.log(p.name, { left: p.left, top, w, h, baseY: p.baseY });
  }

  await plate.composite(layers).png().toFile(OUT_FULL);

  const winH = Math.round(meta.width / 2.0);
  const cropTop = 180;
  await sharp(OUT_FULL)
    .extract({ left: 0, top: cropTop, width: meta.width, height: winH })
    .resize(2560, 1280, { fit: "fill" })
    .jpeg({ quality: 94, mozjpeg: true })
    .toFile(OUT_HERO);
  console.log("hero written", OUT_HERO);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
