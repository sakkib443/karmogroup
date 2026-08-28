const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

(async () => {
  const src =
    "C:/Users/USER/.cursor/projects/c-July-karmo-group/assets/karmo-mattress-layers-sketch-v4.png";
  const out = path.join(
    __dirname,
    "../public/karmo/images/product/sketches/mattress-5-layer-sketch-v4.png"
  );

  const { data, info } = await sharp(src)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const outBuf = Buffer.from(data);
  for (let i = 0; i < outBuf.length; i += 4) {
    const r = outBuf[i];
    const g = outBuf[i + 1];
    const b = outBuf[i + 2];
    // Near-white / paper → transparent; keep pencil greys
    if (r > 245 && g > 245 && b > 245) {
      outBuf[i + 3] = 0;
      continue;
    }
    if (r > 235 && g > 235 && b > 235) {
      const whiteness = (r + g + b) / 3;
      const t = (whiteness - 235) / (255 - 235);
      outBuf[i + 3] = Math.max(0, Math.min(255, Math.round(255 * (1 - t))));
    }
  }

  await sharp(outBuf, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png()
    .toFile(out);

  console.log("wrote", out, fs.statSync(out).size);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
