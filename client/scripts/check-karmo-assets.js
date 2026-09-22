const fs = require("fs");
const path = require("path");

function walk(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, acc);
    else if (/\.(jsx?|tsx?)$/.test(e.name)) acc.push(p);
  }
  return acc;
}

const roots = [
  "src/components/karmo/home",
  "src/components/karmo/division",
  "src/components/karmo/product",
  "src/components/karmo/OverlayHeroSlider.jsx",
  "src/components/karmo/header",
  "src/components/karmo/chrome",
  "src/data/divisions/mattress.js",
  "src/app/(karmo-2)/page.jsx",
  "src/app/(karmo-2)/mattress",
];

const files = [];
for (const r of roots) {
  const p = path.join(process.cwd(), r);
  if (!fs.existsSync(p)) continue;
  if (fs.statSync(p).isDirectory()) walk(p, files);
  else files.push(p);
}

const found = new Map();
const re = /["'`](\/karmo\/[^"'`\s]+\.(?:jpg|jpeg|png|webp|gif|svg|mp4))["'`]/gi;

for (const f of files) {
  const text = fs.readFileSync(f, "utf8");
  let m;
  const r2 = new RegExp(re);
  while ((m = r2.exec(text))) {
    const src = m[1];
    if (!found.has(src)) found.set(src, []);
    found.get(src).push(path.relative(process.cwd(), f).replace(/\\/g, "/"));
  }
}

const missing = [];
let ok = 0;
for (const src of [...found.keys()].sort()) {
  const disk = path.join(process.cwd(), "public", src.replace(/^\//, ""));
  if (fs.existsSync(disk)) ok += 1;
  else missing.push({ src, from: found.get(src) });
}

console.log("checked", found.size, "ok", ok, "missing", missing.length);
for (const x of missing) {
  console.log("MISSING", x.src);
  console.log("  ", x.from.slice(0, 4).join(" | "));
}
