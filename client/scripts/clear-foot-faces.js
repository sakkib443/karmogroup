const sharp = require("sharp");
const path = require("path");

const DIR = path.join(__dirname, "../public/karmo/images/trust/cartoon-v3");

const JOBS = [
  { src: "foot-insole-v1.webp", dest: "foot-insole-v2.webp" },
  { src: "foot-sheets-v1.webp", dest: "foot-sheets-v2.webp" },
  { src: "foot-shoe-v1.webp", dest: "foot-shoe-v2.webp" },
];

function isInk(r, g, b) {
  return Math.max(r, g, b) < 55;
}

function isBlush(r, g, b) {
  return r > 200 && g > 85 && g < 165 && b > 85 && b < 170 && r > g + 50 && r > b + 40;
}

function blobsOfInk(data, width, height) {
  const n = width * height;
  const dark = new Uint8Array(n);
  for (let i = 0; i < n; i++) {
    const o = i * 4;
    if (data[o + 3] < 120) continue;
    if (isInk(data[o], data[o + 1], data[o + 2])) dark[i] = 1;
  }
  const seen = new Uint8Array(n);
  const blobs = [];
  for (let i = 0; i < n; i++) {
    if (!dark[i] || seen[i]) continue;
    const q = [i];
    seen[i] = 1;
    const pts = [];
    while (q.length) {
      const p = q.pop();
      pts.push(p);
      const x = p % width;
      const y = (p - x) / width;
      for (const [dx, dy] of [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ]) {
        const xx = x + dx;
        const yy = y + dy;
        if (xx < 0 || yy < 0 || xx >= width || yy >= height) continue;
        const j = yy * width + xx;
        if (!dark[j] || seen[j]) continue;
        seen[j] = 1;
        q.push(j);
      }
    }
    let minx = width;
    let miny = height;
    let maxx = 0;
    let maxy = 0;
    for (const p of pts) {
      const x = p % width;
      const y = (p - x) / width;
      if (x < minx) minx = x;
      if (y < miny) miny = y;
      if (x > maxx) maxx = x;
      if (y > maxy) maxy = y;
    }
    blobs.push({
      n: pts.length,
      minx,
      miny,
      maxx,
      maxy,
      bw: maxx - minx + 1,
      bh: maxy - miny + 1,
      cx: (minx + maxx) / 2,
      cy: (miny + maxy) / 2,
    });
  }
  return blobs;
}

function faceBoxes(blobs) {
  const eyes = blobs.filter(
    (b) =>
      b.n >= 80 &&
      b.n <= 260 &&
      b.bw >= 10 &&
      b.bw <= 22 &&
      b.bh >= 10 &&
      b.bh <= 22 &&
      Math.abs(b.bw - b.bh) <= 8,
  );
  const used = new Set();
  const boxes = [];
  for (let i = 0; i < eyes.length; i++) {
    if (used.has(i)) continue;
    let partner = -1;
    for (let j = i + 1; j < eyes.length; j++) {
      if (used.has(j)) continue;
      const dx = Math.abs(eyes[i].cx - eyes[j].cx);
      const dy = Math.abs(eyes[i].cy - eyes[j].cy);
      if (dy <= 18 && dx >= 24 && dx <= 72) {
        partner = j;
        break;
      }
    }
    if (partner < 0) continue;
    used.add(i);
    used.add(partner);
    const a = eyes[i];
    const b = eyes[partner];
    const left = Math.min(a.cx, b.cx);
    const right = Math.max(a.cx, b.cx);
    const top = Math.min(a.cy, b.cy);
    const mouth = blobs.find(
      (m) =>
        m.n >= 20 &&
        m.n <= 160 &&
        m.bh <= 14 &&
        m.cx >= left - 8 &&
        m.cx <= right + 8 &&
        m.cy >= top &&
        m.cy <= top + 36,
    );
    boxes.push({
      x0: Math.floor(left - 36),
      y0: Math.floor(top - 16),
      x1: Math.ceil(right + 36),
      y1: Math.ceil((mouth ? mouth.cy : top + 22) + 20),
    });
  }
  return boxes;
}

function paintFaces(data, width, height, boxes) {
  const buf = Buffer.from(data);
  for (const box of boxes) {
    const x0 = Math.max(0, box.x0);
    const y0 = Math.max(0, box.y0);
    const x1 = Math.min(width - 1, box.x1);
    const y1 = Math.min(height - 1, box.y1);
    const counts = new Map();
    for (let y = y0; y <= y1; y++) {
      for (let x = x0; x <= x1; x++) {
        const o = (y * width + x) * 4;
        if (buf[o + 3] < 120) continue;
        const r = buf[o];
        const g = buf[o + 1];
        const b = buf[o + 2];
        if (isInk(r, g, b) || isBlush(r, g, b)) continue;
        if (Math.min(r, g, b) > 246) continue;
        const key = `${r >> 3},${g >> 3},${b >> 3}`;
        const cur = counts.get(key) || { n: 0, r: 0, g: 0, b: 0 };
        cur.n += 1;
        cur.r += r;
        cur.g += g;
        cur.b += b;
        counts.set(key, cur);
      }
    }
    if (!counts.size) continue;
    const top = [...counts.values()].sort((a, b) => b.n - a.n)[0];
    const mid = [
      Math.round(top.r / top.n),
      Math.round(top.g / top.n),
      Math.round(top.b / top.n),
    ];
    const onSilhouette = (x, y) => {
      if (!isInk(buf[(y * width + x) * 4], buf[(y * width + x) * 4 + 1], buf[(y * width + x) * 4 + 2])) {
        return false;
      }
      for (let dy = -2; dy <= 2; dy++) {
        for (let dx = -2; dx <= 2; dx++) {
          const xx = x + dx;
          const yy = y + dy;
          if (xx < 0 || yy < 0 || xx >= width || yy >= height) return true;
          if (buf[(yy * width + xx) * 4 + 3] < 40) return true;
        }
      }
      return false;
    };
    for (let y = y0; y <= y1; y++) {
      for (let x = x0; x <= x1; x++) {
        const o = (y * width + x) * 4;
        if (buf[o + 3] < 40) continue;
        if (onSilhouette(x, y)) continue;
        const r = buf[o];
        const g = buf[o + 1];
        const b = buf[o + 2];
        const dist = Math.abs(r - mid[0]) + Math.abs(g - mid[1]) + Math.abs(b - mid[2]);
        if (dist < 28) continue;
        buf[o] = mid[0];
        buf[o + 1] = mid[1];
        buf[o + 2] = mid[2];
      }
    }
  }
  return buf;
}

(async () => {
  for (const job of JOBS) {
    const src = path.join(DIR, job.src);
    const { data, info } = await sharp(src)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    const boxes = faceBoxes(blobsOfInk(data, info.width, info.height));
    const buf = paintFaces(data, info.width, info.height, boxes);
    const dest = path.join(DIR, job.dest);
    await sharp(buf, {
      raw: { width: info.width, height: info.height, channels: 4 },
    })
      .webp({ quality: 92, alphaQuality: 100, effort: 5 })
      .toFile(dest);
    console.log(job.dest, "faces", boxes.length, boxes);
  }
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
