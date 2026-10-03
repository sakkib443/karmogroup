const sharp = require("sharp");
const path = require("path");

const SRC = path.join(
  __dirname,
  "../public/karmo/images/trust/cartoon-v3/stores-v4.webp",
);
const DEST = path.join(
  __dirname,
  "../public/karmo/images/trust/cartoon-v3/stores-v5.webp",
);

(async () => {
  const { data, info } = await sharp(SRC)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const buf = Buffer.from(data);
  const { width } = info;

  for (let y = 0; y < 82; y++) {
    for (let x = 168; x < width; x++) {
      const o = (y * width + x) * 4;
      if (buf[o + 3] < 8) continue;
      const max = Math.max(buf[o], buf[o + 1], buf[o + 2]);
      if (max < 70) continue;
      buf[o + 3] = 0;
    }
  }

  await sharp(buf, {
    raw: { width, height: info.height, channels: 4 },
  })
    .webp({ quality: 96, alphaQuality: 100, effort: 6 })
    .toFile(DEST);

  console.log("wrote stores-v5.webp (map + pin, no baked badge)");
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
