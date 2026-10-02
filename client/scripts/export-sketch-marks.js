const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const ASSETS = "C:/Users/USER/.cursor/projects/c-July-karmo-group/assets";
const OUT = path.join(
  __dirname,
  "../public/karmo/images/trust/cartoon-v3"
);

const SIZE = 320;
const INNER = 292;

const JOBS = [
  { src: "sketch-marks-legacy-60.jpg", out: "sketch-marks-legacy-60.webp" },
  { src: "sketch-marks-pillow.jpg", out: "sketch-marks-pillow.webp" },
  { src: "sketch-marks-globe.jpg", out: "sketch-marks-globe.webp" },
  { src: "sketch-marks-natural.jpg", out: "sketch-marks-natural.webp" },
  { src: "sketch-marks-delivery.jpg", out: "sketch-marks-delivery.webp" },
  { src: "sketch-marks-stores.jpg", out: "sketch-marks-stores.webp" },
];

async function fitSquare(file) {
  const white = { r: 255, g: 255, b: 255, alpha: 1 };
  let trimmed;
  try {
    trimmed = await sharp(file)
      .flatten({ background: "#ffffff" })
      .trim({ threshold: 14 })
      .png()
      .toBuffer();
  } catch {
    trimmed = await sharp(file)
      .flatten({ background: "#ffffff" })
      .png()
      .toBuffer();
  }

  return sharp(trimmed)
    .resize(INNER, INNER, {
      fit: "contain",
      background: white,
      withoutEnlargement: false,
    })
    .extend({
      top: Math.round((SIZE - INNER) / 2),
      bottom: SIZE - INNER - Math.round((SIZE - INNER) / 2),
      left: Math.round((SIZE - INNER) / 2),
      right: SIZE - INNER - Math.round((SIZE - INNER) / 2),
      background: white,
    })
    .png()
    .toBuffer();
}

(async () => {
  for (const job of JOBS) {
    const src = path.join(ASSETS, job.src);
    const dest = path.join(OUT, job.out);
    const fitted = await fitSquare(src);
    await sharp(fitted)
      .webp({ quality: 90, effort: 5 })
      .toFile(dest);
    const m = await sharp(dest).metadata();
    console.log(job.out, m.width + "x" + m.height, fs.statSync(dest).size);
  }
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
