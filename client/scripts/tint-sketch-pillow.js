const sharp = require("sharp");
const path = require("path");

const FILE = path.join(
  __dirname,
  "../public/karmo/images/trust/cartoon-v3/sketch-pillow-clean.webp",
);

const LEAF = [165, 206, 103];
const HEART = [225, 74, 80];

function mix(c, t, amt) {
  return Math.round(c * (1 - amt) + t * amt);
}

(async () => {
  const { data, info } = await sharp(FILE)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const buf = Buffer.from(data);

  for (let i = 0; i < buf.length; i += 4) {
    const a = buf[i + 3];
    if (a < 20) continue;
    const r = buf[i];
    const g = buf[i + 1];
    const b = buf[i + 2];
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const chroma = max - min;
    const lum = 0.3 * r + 0.59 * g + 0.11 * b;

    if (r > g + 10 && r > b + 10 && r > 90) {
      buf[i] = mix(r, HEART[0], 0.72);
      buf[i + 1] = mix(g, HEART[1], 0.72);
      buf[i + 2] = mix(b, HEART[2], 0.72);
      continue;
    }

    if (lum > 198 && chroma < 32) {
      const amt = lum < 236 ? 0.42 : 0.2;
      buf[i] = mix(r, LEAF[0], amt);
      buf[i + 1] = mix(g, LEAF[1], amt);
      buf[i + 2] = mix(b, LEAF[2], amt);
    }
  }

  await sharp(buf, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .webp({ quality: 92, alphaQuality: 100, effort: 5 })
    .toFile(path.join(path.dirname(FILE), "sketch-pillow-tint.webp"));

  console.log("tinted sketch-pillow-tint.webp");
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
