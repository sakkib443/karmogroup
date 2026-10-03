const sharp = require("sharp");
const path = require("path");

const ROOT = path.join(__dirname, "../public/karmo/images/home-02/certified/logos");

function clamp(n) {
  return Math.max(0, Math.min(255, Math.round(n)));
}

function isCrownRed(r, g, b) {
  return r > 140 && g < 110 && b < 110 && r > g + 35;
}

function isJewel(r, g, b) {
  return (g > r + 12 && g > b) || (b > r + 20 && b > g + 10);
}

function isGold(r, g, b, a) {
  if (a < 16) return false;
  if (isCrownRed(r, g, b) || isJewel(r, g, b)) return false;
  if (r < 50) return false;
  return r >= g - 10 && g >= b - 14;
}

function toPureGold(r, g, b) {
  // Lock hue to #1/#2 gold (ISO body ~195,146,57). Keep shine from red.
  const shine = Math.max(r, g * 1.05, 70);
  return [clamp(shine), clamp(shine * 0.72), clamp(shine * 0.28)];
}

async function match(srcName, destName) {
  const src = path.join(ROOT, srcName);
  const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({
    resolveWithObject: true,
  });
  const buf = Buffer.from(data);
  for (let i = 0; i < buf.length; i += 4) {
    const r = buf[i];
    const g = buf[i + 1];
    const b = buf[i + 2];
    const a = buf[i + 3];
    if (!isGold(r, g, b, a)) continue;
    const [nr, ng, nb] = toPureGold(r, g, b);
    buf[i] = nr;
    buf[i + 1] = ng;
    buf[i + 2] = nb;
  }
  const dest = path.join(ROOT, destName);
  await sharp(buf, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .webp({ quality: 94, alphaQuality: 100, effort: 6 })
    .toFile(dest);
  console.log("wrote", destName);
}

(async () => {
  await match("logo-ukas-gold-v9.webp", "logo-ukas-gold-v10.webp");
  await match("logo-moody-gold-v9.webp", "logo-moody-gold-v10.webp");
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
