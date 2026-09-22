const sharp = require("sharp");
const path = require("path");

const SRC = path.join(
  __dirname,
  "../public/karmo/images/mattress/hero/cooling-cat-snowy-window-hq.jpg",
);
const OUT = path.join(
  __dirname,
  "../public/karmo/images/mattress/hero/cooling-cat-snowy-window-seal-hq.jpg",
);
const PREVIEW =
  "C:/Users/USER/.cursor/projects/c-July-karmo-group/assets/seal-preview-crop.png";

const W = 88;
const H = 100;
const L = 1218;
const T = 700;
const R = 8;

const svg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <clipPath id="card"><rect x="0" y="0" width="${W}" height="${H}" rx="${R}" ry="${R}"/></clipPath>
  </defs>
  <g clip-path="url(#card)">
    <rect width="${W}" height="${H}" fill="#f4f1ea"/>
    <text x="${W / 2}" y="14" text-anchor="middle" font-family="Georgia, Times New Roman, serif" font-size="6" fill="#6a6a6a">Since 1965</text>
    <text x="${W / 2}" y="36" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="13" font-weight="700" fill="#c8102e" letter-spacing="0.6">KARMO</text>
    <text x="${W / 2}" y="56" text-anchor="middle" font-family="Segoe Script, Brush Script MT, Georgia, serif" font-size="14" fill="#161616">Mattress</text>
    <rect x="0" y="68" width="${W}" height="32" fill="#111"/>
    ${[14, 34, 54, 74]
      .map(
        (cx) =>
          `<circle cx="${cx}" cy="84" r="5.2" fill="none" stroke="#fff" stroke-width="1.15"/>`,
      )
      .join("")}
  </g>
  <rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" rx="${R}" ry="${R}" fill="none" stroke="rgba(0,0,0,0.08)" stroke-width="1"/>
</svg>`);

(async () => {
  const sticker = await sharp(svg).png().toBuffer();
  const base = sharp(SRC);
  const { width, height } = await base.metadata();

  await sharp(SRC)
    .composite([{ input: sticker, left: L, top: T }])
    .jpeg({ quality: 92, mozjpeg: true })
    .toFile(OUT);

  await sharp(OUT)
    .extract({
      left: Math.max(0, L - 40),
      top: Math.max(0, T - 40),
      width: Math.min(width - L + 40, W + 80),
      height: Math.min(height - T + 40, H + 80),
    })
    .png()
    .toFile(PREVIEW);

  console.log({ out: OUT, at: { L, T, W, H } });
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
