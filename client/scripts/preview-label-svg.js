const sharp = require("sharp");

const W = 440;
const H = 500;
const R = 36;
const svg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <rect width="${W}" height="${H}" rx="${R}" fill="#f4f1ea"/>
  <text x="220" y="70" text-anchor="middle" font-family="Georgia" font-size="28" fill="#6a6a6a">Since 1965</text>
  <text x="220" y="180" text-anchor="middle" font-family="Arial" font-size="64" font-weight="700" fill="#c8102e">KARMO</text>
  <text x="220" y="280" text-anchor="middle" font-family="Segoe Script, Georgia" font-size="64" fill="#161616">Mattress</text>
  <rect x="0" y="340" width="${W}" height="160" fill="#111"/>
</svg>`);

sharp(svg)
  .png()
  .toFile("C:/Users/USER/.cursor/projects/c-July-karmo-group/assets/label-svg-big.png")
  .then(() => console.log("ok"))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
