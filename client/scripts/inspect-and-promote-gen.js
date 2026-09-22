const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

(async () => {
  const gen =
    "C:/Users/USER/.cursor/projects/c-July-karmo-group/assets/king-3d-cutout-v6-gen.png";
  const previewOut =
    "C:/Users/USER/.cursor/projects/c-July-karmo-group/assets/king-v6-gen-on-white.png";
  const publicOut = path.join(
    __dirname,
    "../public/karmo/images/mattress/products/king-3d-cutout-v6-gen.png"
  );

  const { data, info } = await sharp(gen)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const w = info.width;
  const h = info.height;
  let opaque = 0;
  let semi = 0;
  let clear = 0;
  let hard = 0;
  let grayish = 0;
  const y0 = Math.floor(h * 0.65);
  for (let y = y0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];
      if (a > 250) opaque++;
      else if (a > 8) {
        semi++;
        if (
          r > 40 &&
          g > 40 &&
          b > 40 &&
          Math.abs(r - g) < 12 &&
          Math.abs(g - b) < 12
        )
          grayish++;
      } else clear++;
    }
    for (let x = 1; x < w; x++) {
      const a0 = data[(y * w + x - 1) * 4 + 3];
      const a1 = data[(y * w + x) * 4 + 3];
      if (Math.abs(a0 - a1) > 100) hard++;
    }
  }
  console.log("GEN", w + "x" + h, { opaque, semi, clear, hard, grayish });

  // Soften any residual near-white plate into transparency on edges
  const cleaned = Buffer.from(data);
  for (let i = 0; i < cleaned.length; i += 4) {
    const r = cleaned[i];
    const g = cleaned[i + 1];
    const b = cleaned[i + 2];
    let a = cleaned[i + 3];
    // Near-white / light-gray studio leftovers → kill
    if (a > 0 && r > 220 && g > 220 && b > 220) {
      cleaned[i + 3] = 0;
      continue;
    }
    // Mid gray plate (not dark shadow): drop
    if (
      a > 20 &&
      r > 160 &&
      g > 160 &&
      b > 160 &&
      Math.abs(r - g) < 10 &&
      Math.abs(g - b) < 10
    ) {
      cleaned[i + 3] = 0;
    }
  }

  const cleanedPng = await sharp(cleaned, {
    raw: { width: w, height: h, channels: 4 },
  })
    .png()
    .toBuffer();

  await sharp(cleanedPng).toFile(publicOut);
  await sharp({
    create: {
      width: w,
      height: h,
      channels: 3,
      background: { r: 255, g: 255, b: 255 },
    },
  })
    .composite([{ input: cleanedPng, blend: "over" }])
    .png()
    .toFile(previewOut);

  console.log("copied", publicOut, fs.statSync(publicOut).size);
  console.log("preview", previewOut);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
