"""Put a re-rendered mattress cloth back into the untouched King cover.

The generated photo is aligned to the cover, then only the cloth pixels (same
mask as king-fabric-covers.py) are copied. Room, piping and badge stay the
original King pixels.

    python king-fabric-from-gen.py 2 path/to/generated.jpg
"""
import os
import sys
import numpy as np
from PIL import Image

sys.path.insert(0, os.path.dirname(__file__))
kfc = __import__("king-fabric-covers")


def best_shift(gen, king, mask):
    """Integer shift that best lines the generated mattress up with the cover."""
    near = np.zeros(mask.shape, bool)
    near[540:960, 40:1215] = True
    near &= ~mask
    gl = gen.mean(axis=2)
    kl = king.mean(axis=2)
    best = None
    for dy in range(-14, 15):
        for dx in range(-8, 9):
            d = np.abs(np.roll(gl, (dy, dx), (0, 1)) - kl)[near].mean()
            if best is None or d < best[0]:
                best = (d, dx, dy)
    return best


def badge_box():
    """The red KARMO label, letters included."""
    red = kfc.red.copy()
    red[:780] = False
    red[960:] = False
    # Scattered pink flowers are red too; the label is the solid block.
    xs = np.where(red.sum(axis=0) > 25)[0]
    ys = np.where(red.sum(axis=1) > 40)[0]
    box = np.zeros_like(red)
    box[ys.min() : ys.max() + 1, xs.min() : xs.max() + 1] = True
    return box


def is_white(img):
    r, g, b = (img[:, :, i].astype(np.int16) for i in range(3))
    lum = 0.299 * r + 0.587 * g + 0.114 * b
    return (lum > 175) & (np.abs(r - g) < 35) & (np.abs(r - b) < 40)


def cloth_mask(gen):
    """Blue-cloth mask filled across each row, so dark folds and shadows go too."""
    m = kfc.mask
    h = m.shape[0]
    left = np.full(h, np.nan)
    right = np.full(h, np.nan)
    for y in range(h):
        xs = np.where(m[y])[0]
        if len(xs) > 40:
            left[y], right[y] = xs.min(), xs.max()
    fill = np.zeros_like(m)
    rim = np.zeros_like(m)
    for y in range(560, 925):
        lo = max(0, y - 50)
        win_l = left[lo : y + 51]
        if np.isnan(win_l).all():
            continue
        l = int(np.nanmin(win_l))
        r = int(np.nanmax(right[lo : y + 51]))
        fill[y, l : r + 1] = True
        rim[y, max(0, l - 2) : l + 22] = True
        rim[y, r - 21 : r + 3] = True
    # Piping is white in both photos once aligned; old white print is not.
    piping = kfc.white & is_white(gen) & rim
    return (fill | m) & ~piping & ~badge_box() & ~kfc.band[:, None]


def main():
    idx, path = int(sys.argv[1]), sys.argv[2]
    king = kfc.a
    gen = Image.open(path).convert("RGB").resize((kfc.W, kfc.H), Image.Resampling.LANCZOS)
    g = np.array(gen).astype(np.float32)
    err, dx, dy = best_shift(g, king.astype(np.float32), kfc.mask)
    g = np.roll(g, (dy, dx), (0, 1))
    mask = cloth_mask(g.astype(np.uint8))
    out = king.copy()
    out[mask] = np.clip(g[mask], 0, 255).astype(np.uint8)
    dest = os.path.join(kfc.OUT_DIR, f"fabric-{idx}.webp")
    Image.fromarray(out).save(dest, "WEBP", lossless=True, method=4)
    print(f"fabric-{idx}: shift dx={dx} dy={dy} room err={err:.2f} -> {dest}")


if __name__ == "__main__":
    main()
