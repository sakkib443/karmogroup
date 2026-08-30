/**
 * Convert Cursor-generated foam-2 PNGs into optimized JPEGs under public/.
 * Run: node scripts/import-foam2-images.js
 */
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const ASSETS = path.join(
  process.env.USERPROFILE || "",
  ".cursor/projects/c-July-karmo-group/assets"
);
const ROOT = path.join(__dirname, "..");

const MAP = {
  "foam2-hero-lifestyle.png": "public/karmo/images/foam-2/hero/lifestyle-sofa-hq.jpg",
  "foam2-hero-craft.png": "public/karmo/images/foam-2/hero/craft-blocks-hq.jpg",
  "foam2-why-firm.png": "public/karmo/images/foam-2/why/why-firm-hq.jpg",
  "foam2-why-density.png": "public/karmo/images/foam-2/why/why-density-hq.jpg",
  "foam2-why-airflow.png": "public/karmo/images/foam-2/why/why-airflow-hq.jpg",
  "foam2-lounge.png": "public/karmo/images/foam-2/bands/lounge-sofa-hq.jpg",
  "foam2-zones-layers.png": "public/karmo/images/foam-2/bands/layers-cutaway-hq.jpg",
  "foam2-mosaic-spotlight.png": "public/karmo/images/foam-2/mosaic/designed-to-rest-hq.jpg",
  "foam2-mosaic-texture.png": "public/karmo/images/foam-2/mosaic/foam-texture-hq.jpg",
  "foam2-product-sofa-olive.png": "public/karmo/images/foam-2/products/sofa-olive-hq.jpg",
  "foam2-product-sofa-blue.png": "public/karmo/images/foam-2/products/sofa-blue-hq.jpg",
  "foam2-product-chair-cream.png": "public/karmo/images/foam-2/products/chair-cream-hq.jpg",
  "foam2-product-blocks-red.png": "public/karmo/images/foam-2/products/blocks-coral-hq.jpg",
  "foam2-product-blocks-lavender.png":
    "public/karmo/images/foam-2/products/blocks-lavender-hq.jpg",
  "foam2-hover-block.png": "public/karmo/images/foam-2/products/hover-block-hq.jpg",
  "foam2-hover-sheets.png": "public/karmo/images/foam-2/products/hover-sheets-hq.jpg",
};

async function main() {
  for (const [srcName, destRel] of Object.entries(MAP)) {
    const src = path.join(ASSETS, srcName);
    const dest = path.join(ROOT, destRel);
    if (!fs.existsSync(src)) {
      console.log("SKIP missing", srcName);
      continue;
    }
    const meta = await sharp(src).metadata();
    let pipe = sharp(src).rotate();
    const long = Math.max(meta.width || 0, meta.height || 0);
    if (long > 2000) {
      if ((meta.width || 0) >= (meta.height || 0)) {
        pipe = pipe.resize({ width: 2000, withoutEnlargement: true });
      } else {
        pipe = pipe.resize({ height: 2000, withoutEnlargement: true });
      }
    }
    const buf = await pipe.jpeg({ quality: 88, mozjpeg: true }).toBuffer();
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, buf);
    console.log(destRel, Math.round(buf.length / 1024) + "KB");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
