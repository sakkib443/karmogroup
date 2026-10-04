const sharp = require("C:/July/karmo group/client/node_modules/sharp");
const path = require("path");

const dir =
  "C:/July/karmo group/client/public/karmo/images/mattress/brochure/logos";
const names = [
  "logo-imperial",
  "logo-king",
  "logo-prestige",
  "logo-orthopedic",
  "logo-bonnell",
  "logo-natural",
  "logo-pocket",
];

(async () => {
  for (const name of names) {
    const src = path.join(dir, `${name}.png`);
    const dest = path.join(dir, `${name}-trim.png`);
    const { data, info } = await sharp(src)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      if (r > 236 && g > 234 && b > 228 && Math.abs(r - g) < 16 && Math.abs(g - b) < 18) {
        data[i + 3] = 0;
      }
    }
    await sharp(data, {
      raw: { width: info.width, height: info.height, channels: 4 },
    })
      .trim({ threshold: 12 })
      .png()
      .toFile(dest);
    const out = await sharp(dest).metadata();
    console.log(name, out.width, out.height);
  }
})();
