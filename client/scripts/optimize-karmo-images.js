/**
 * Restore crushed homepage heroes + compress live mattress catalogue stills.
 * Run from client/: node scripts/optimize-karmo-images.js
 */
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const ROOT = path.join(__dirname, "..");
const REPO = path.join(ROOT, "..");
const TMP = path.join(ROOT, "tmp-hero-restore");

function gitShow(rev, repoPath, dest) {
  const buf = execSync(`git -C "${REPO}" show ${rev}:${repoPath}`, {
    maxBuffer: 40 * 1024 * 1024,
  });
  fs.writeFileSync(dest, buf);
  return dest;
}

async function encodeJpeg(src, dest, { width = null, quality = 90 } = {}) {
  let pipe = sharp(src).rotate();
  if (width) pipe = pipe.resize({ width, withoutEnlargement: true });
  await pipe.jpeg({ quality, mozjpeg: true }).toFile(dest);
  const m = await sharp(dest).metadata();
  const kb = Math.round(fs.statSync(dest).size / 1024);
  console.log(`JPEG ${path.basename(dest)} ${m.width}x${m.height} ${kb}KB`);
}

async function encodeWebp(src, dest, { width = null, quality = 82 } = {}) {
  let pipe = sharp(src).rotate();
  if (width) pipe = pipe.resize({ width, withoutEnlargement: true });
  await pipe.webp({ quality }).toFile(dest);
  const m = await sharp(dest).metadata();
  const kb = Math.round(fs.statSync(dest).size / 1024);
  console.log(`WEBP ${path.basename(dest)} ${m.width}x${m.height} ${kb}KB`);
}

async function main() {
  fs.mkdirSync(TMP, { recursive: true });
  const heroDir = path.join(ROOT, "public/karmo/images/home-02/hero");
  const mattressHero = path.join(ROOT, "public/karmo/images/mattress/hero");

  console.log("--- heroes ---");
  const motion = gitShow(
    "b6a15bf",
    "client/public/karmo/images/home-02/hero/home-hero-slide-01-motion.jpg",
    path.join(TMP, "motion.jpg")
  );
  const chem = gitShow(
    "b6a15bf",
    "client/public/karmo/images/home-02/hero/home-hero-slide-chemicals-hero.jpg",
    path.join(TMP, "chemicals.jpg")
  );
  const summer = path.join(heroDir, "home-hero-slide-mattress-summer-cool-v2.jpg");

  await encodeJpeg(motion, path.join(heroDir, "home-hero-slide-01-motion-hq.jpg"), {
    quality: 90,
  });
  await encodeJpeg(chem, path.join(heroDir, "home-hero-slide-chemicals-hero-hq.jpg"), {
    quality: 90,
  });
  await encodeJpeg(summer, path.join(heroDir, "home-hero-slide-mattress-summer-cool-hq.jpg"), {
    quality: 90,
  });
  await encodeJpeg(
    path.join(mattressHero, "cooling-cat-snowy-window.jpg"),
    path.join(mattressHero, "cooling-cat-snowy-window-hq.jpg"),
    { width: 2560, quality: 90 }
  );

  console.log("--- product rooms / hovers ---");
  const prodDir = path.join(ROOT, "public/karmo/images/mattress/products");
  const products = [
    "king",
    "prestige",
    "orthopedic",
    "imperial",
    "bonnell",
    "pillowtop",
    "eurotop",
    "topper",
  ];
  for (const id of products) {
    const room = path.join(prodDir, `${id}-room.jpg`);
    const hover = path.join(prodDir, `${id}-hover-v3.jpg`);
    if (fs.existsSync(room)) {
      await encodeJpeg(room, path.join(prodDir, `${id}-room-hq.jpg`), {
        width: 1200,
        quality: 85,
      });
    }
    if (fs.existsSync(hover)) {
      await encodeJpeg(hover, path.join(prodDir, `${id}-hover-v3-hq.jpg`), {
        width: 1200,
        quality: 85,
      });
    }
  }

  console.log("--- size icons ---");
  const iconDir = path.join(ROOT, "public/karmo/images/product/size-icons");
  for (const f of fs.readdirSync(iconDir).filter((x) => x.endsWith(".png"))) {
    const base = f.replace(/\.png$/i, "");
    await encodeWebp(path.join(iconDir, f), path.join(iconDir, `${base}.webp`), {
      width: 128,
      quality: 90,
    });
  }

  console.log("done");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
