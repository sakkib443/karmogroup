"""Keep the King cover pixel-identical except the mattress cloth.

The bed, pillows, piping and badge stay. Each swatch is mapped onto the
mattress top and the front side in perspective, then lit with only the
broad light of the original photo so the old print does not ghost through.
"""
import os
import numpy as np
from PIL import Image, ImageFilter

ROOT = r"C:\July\karmo group\client\public\products"
COVER = os.path.join(ROOT, "mattress", "king-cover-luxury-floral-v2.webp")
FABRIC_DIR = os.path.join(ROOT, "common", "fabrics")
OUT_DIR = os.path.join(ROOT, "mattress", "king-fabrics")
os.makedirs(OUT_DIR, exist_ok=True)

# How many times a cloth sample wraps across the King mattress.
REPEATS = 2.15

base = Image.open(COVER).convert("RGB")
a = np.array(base)
H, W = a.shape[:2]
r, g, b = a[:, :, 0].astype(np.int16), a[:, :, 1].astype(np.int16), a[:, :, 2].astype(np.int16)
blue = (b > r + 18) & (b > g + 5) & (b > 45) & (r < 200)
m = Image.fromarray((blue.astype(np.uint8) * 255))
for _ in range(10):
    m = m.filter(ImageFilter.MaxFilter(7))
for _ in range(9):
    m = m.filter(ImageFilter.MinFilter(7))
m = m.filter(ImageFilter.MaxFilter(3))
closed = np.array(m) > 128
dil = m.filter(ImageFilter.MaxFilter(5))
ero = m.filter(ImageFilter.MinFilter(9))
edge = (np.array(dil) > 128) & ~(np.array(ero) > 128)
lum = (0.299 * r + 0.587 * g + 0.114 * b).astype(np.float32)
white = (lum > 175) & (np.abs(r - g) < 35) & (np.abs(r - b) < 40)
red = (r > 150) & (g < 90) & (b < 100)
mask = closed & ~(white & edge) & ~red

# The double white cord is part of the bed, not the cloth. Keep only the
# white rows themselves so the cloth between the cords is repainted.
row_frac = white[:, 140:1150].mean(axis=1)
piping = row_frac > 0.35
band = piping.copy()
band[1:] |= piping[:-1]
band[:-1] |= piping[1:]
mask[band] = False

bands = []
start = None
for y, on in enumerate(band):
    if on and start is None:
        start = y
    elif not on and start is not None:
        bands.append((start, y - 1))
        start = None
if start is not None:
    bands.append((start, H - 1))
split = next(y1 + 1 for y0, y1 in bands if y0 <= 810 <= y1)

TOP = mask.copy()
TOP[split:] = False
SIDE = mask.copy()
SIDE[:split] = False
if __name__ == "__main__":
    print("piping bands", bands, "split", split)


def plane_edges(region, y0, y1, fit0, fit1):
    left = np.full(H, np.nan)
    right = np.full(H, np.nan)
    for y in range(y0, y1):
        xs = np.where(region[y])[0]
        if len(xs) > 40:
            left[y] = xs.min()
            right[y] = xs.max()
    ys = np.arange(fit0, fit1)
    ok = np.isfinite(left[ys])
    coef_l = np.polyfit(ys[ok], left[ys][ok], 1)
    coef_r = np.polyfit(ys[ok], right[ys][ok], 1)
    span = np.arange(y0, y1)
    return span, np.polyval(coef_l, span), np.polyval(coef_r, span)


def uv_for(region, y0, y1, fit0, fit1, fw, repeats=None):
    """Square, perspective-correct texture coords in fabric pixels."""
    if repeats is None:
        repeats = REPEATS
    span, left, right = plane_edges(region, y0, y1, fit0, fit1)
    width = np.maximum(right - left, 1.0)
    dv = repeats / width
    vacc = np.cumsum(dv)
    fu = np.zeros((H, W), np.float32)
    fv = np.zeros((H, W), np.float32)
    use = np.zeros((H, W), bool)
    for i, y in enumerate(span):
        if y < 0 or y >= H:
            continue
        row = region[y]
        if not row.any():
            continue
        xs = np.arange(W)
        u = (xs - left[i]) / width[i] * repeats * fw
        fu[y, row] = u[row]
        fv[y, row] = vacc[i] * fw
        use[y] = row
    return fu, fv, use


def flatten(fabric):
    """Take the photo's own light out so a repeat does not show as a panel."""
    blur = np.array(
        Image.fromarray(fabric).filter(ImageFilter.GaussianBlur(48)),
        dtype=np.float32,
    )
    mean = fabric.reshape(-1, 3).mean(axis=0).astype(np.float32)
    flat = fabric.astype(np.float32) / np.maximum(blur, 1.0) * mean
    return np.clip(flat, 0, 255).astype(np.uint8)


def mirror(v, n):
    period = 2.0 * n
    m = np.mod(v, period)
    folded = np.where(m < n, m, period - m - 1e-3)
    return np.clip(folded, 0, n - 1.001)


def sample(fabric, fu, fv, use, mode="mirror"):
    fh, fw = fabric.shape[:2]
    out = np.zeros((H, W, 3), np.float32)
    if not use.any():
        return out
    if mode == "mod":
        x = np.mod(fu[use], fw - 0.001)
        y = np.mod(fv[use], fh - 0.001)
    else:
        x = mirror(fu[use], fw)
        y = mirror(fv[use], fh)
    x0 = np.floor(x).astype(np.int32)
    y0 = np.floor(y).astype(np.int32)
    x1 = np.minimum(x0 + 1, fw - 1)
    y1 = np.minimum(y0 + 1, fh - 1)
    tx = (x - x0)[:, None]
    ty = (y - y0)[:, None]
    c00 = fabric[y0, x0].astype(np.float32)
    c10 = fabric[y0, x1].astype(np.float32)
    c01 = fabric[y1, x0].astype(np.float32)
    c11 = fabric[y1, x1].astype(np.float32)
    out[use] = (
        c00 * (1 - tx) * (1 - ty)
        + c10 * tx * (1 - ty)
        + c01 * (1 - tx) * ty
        + c11 * tx * ty
    )
    return out


def crop_label(im):
    fa = np.array(im)
    rr, gg, bb = fa[:, :, 0].astype(np.int16), fa[:, :, 1].astype(np.int16), fa[:, :, 2].astype(np.int16)
    label = (rr > 175) & (gg < 85) & (bb < 85)
    h, w = label.shape
    corner = label.copy()
    corner[: int(h * 0.5), :] = False
    corner[:, : int(w * 0.35)] = False
    ys, xs = np.where(corner)
    if len(xs):
        im = im.crop((0, 0, max(20, int(xs.min()) - 4), max(20, int(ys.min()) - 4)))
    return im


# Broad light only — flower-sized detail in the original is the old print.
weight = mask.astype(np.float32)
num = np.array(
    Image.fromarray(np.clip(lum * weight, 0, 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(26)),
    dtype=np.float32,
)
den = np.array(
    Image.fromarray(np.clip(weight * 255, 0, 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(26)),
    dtype=np.float32,
) / 255.0
shade = num / np.maximum(den, 1e-3)
mean = float(shade[mask].mean()) or 1.0
shade = np.clip(shade / mean, 0.72, 1.22)

# Hard mask so the piping, badge and room stay the original pixels.


def place_once(fabric, region, y0, y1, fit0, fit1):
    """Lay one real cloth photo across the plane, with no mirrored seam."""
    fh, fw = fabric.shape[:2]
    span, left, right = plane_edges(region, y0, y1, fit0, fit1)
    painted = np.zeros((H, W, 3), np.float32)
    y_start = float(span[0])
    y_end = float(max(span[-1], span[0] + 1))
    for i, y in enumerate(span):
        if y < 0 or y >= H:
            continue
        row = region[y]
        if not row.any():
            continue
        width = max(float(right[i] - left[i]), 1.0)
        xs = np.arange(W)
        u = np.clip((xs - left[i]) / width * (fw - 1), 0, fw - 1.001)
        v = (y - y_start) / (y_end - y_start) * (fh - 1)
        v = np.full(W, np.clip(v, 0, fh - 1.001))
        x = u[row]
        yy = v[row]
        x0 = np.floor(x).astype(np.int32)
        y0p = np.floor(yy).astype(np.int32)
        x1 = np.minimum(x0 + 1, fw - 1)
        y1p = np.minimum(y0p + 1, fh - 1)
        tx = (x - x0)[:, None]
        ty = (yy - y0p)[:, None]
        painted[y, row] = (
            fabric[y0p, x0] * (1 - tx) * (1 - ty)
            + fabric[y0p, x1] * tx * (1 - ty)
            + fabric[y1p, x0] * (1 - tx) * ty
            + fabric[y1p, x1] * tx * ty
        )
    return painted


def soften_edges(fabric):
    """Blend opposite edges so a repeat does not show a hard cut."""
    f = fabric.astype(np.float32).copy()
    h, w = f.shape[:2]
    mx = min(40, w // 5)
    my = min(16, h // 5)
    if mx > 4:
        ramp = np.linspace(0, 1, mx, dtype=np.float32)[None, :, None]
        f[:, :mx] = f[:, -mx:] * (1 - ramp) + f[:, :mx] * ramp
    if my > 4:
        ramp = np.linspace(0, 1, my, dtype=np.float32)[:, None, None]
        f[:my] = f[-my:] * (1 - ramp) + f[:my] * ramp
    return np.clip(f, 0, 255).astype(np.uint8)


def paint_tile(top_box, side_box, path):
    """Repeat a flat cloth sample. Used when the product photo is not head-on."""
    im = Image.open(os.path.join(ROOT, "mattress", path)).convert("RGB")
    top = soften_edges(flatten(np.array(im.crop(top_box))))
    side_img = soften_edges(flatten(np.array(im.crop(side_box))))
    fw = top.shape[1]
    fu, fv, use = uv_for(TOP, 560, split, 700, min(790, split - 8), fw)
    painted = sample(top, fu, fv, use, mode="mod")
    fw = side_img.shape[1]
    fu, fv, use = uv_for(SIDE, split, 930, split + 6, min(split + 55, 900), fw)
    side = sample(side_img, fu, fv, use, mode="mod")
    painted[SIDE] = side[SIDE]
    coloured = np.clip(painted * shade[..., None], 0, 255)
    out = a.copy()
    out[mask] = coloured[mask].astype(np.uint8)
    return out


def paint_sample(top_box, side_box, path):
    """Lay the real mattress top and side onto the King cloth."""
    im = Image.open(os.path.join(ROOT, "mattress", path)).convert("RGB")
    top = flatten(np.array(im.crop(top_box)))
    side_img = flatten(np.array(im.crop(side_box)))
    painted = place_once(top, TOP, 560, split, 700, min(790, split - 8))
    side = place_once(side_img, SIDE, split, 930, split + 6, min(split + 55, 900))
    painted[SIDE] = side[SIDE]
    coloured = np.clip(painted * shade[..., None], 0, 255)
    out = a.copy()
    out[mask] = coloured[mask].astype(np.uint8)
    return out


def load_scene(path):
    """Same King photograph, shifted onto this cover."""
    src = Image.open(os.path.join(ROOT, "mattress", path)).convert("RGB")
    src = src.resize((W, H), Image.Resampling.LANCZOS)
    return np.roll(np.array(src), (-1, -1), axis=(0, 1))


def scene_copy(path, region=None):
    """Copy cloth pixels from a King photo that was already shot in this cloth."""
    s = load_scene(path)
    use = mask if region is None else region
    out = a.copy()
    out[use] = s[use]
    return out


def paint_side(out, fabric_img):
    """The source photo has no patterned side here, so continue its top cloth."""
    fabric = flatten(np.array(fabric_img))
    side = place_once(fabric, SIDE, split, 930, split + 6, min(split + 55, 900))
    coloured = np.clip(side * shade[..., None], 0, 255)
    out[SIDE] = coloured[SIDE].astype(np.uint8)
    return out


# Navy (fabric 4) is the King cover itself, so it is not rewritten.
JOBS = {
    1: ("scene", "topper-cover-on-bed-folded.webp"),
    2: ("sample", "bonnell-hover-red-showcase.webp", (220, 350, 1080, 620), (140, 670, 1120, 780)),
    3: ("tile", "pillowtop-hover-leaf-display.webp", (540, 500, 920, 600), (520, 660, 900, 785)),
    5: ("sample", "orthopedic-hover-burgundy-showcase.webp", (220, 380, 1080, 660), (160, 690, 1100, 785)),
    6: ("scene", "eurotop-cover-luxury-kingstyle.webp"),
}

for i, job in (JOBS.items() if __name__ == "__main__" else ()):
    if i == 1:
        # Topper is the same room, but its side is a white base. Keep the
        # cream floral top and continue that cloth down the King side.
        scene = load_scene(job[1])
        out = a.copy()
        out[TOP] = scene[TOP]
        sample_img = Image.fromarray(scene).crop((280, 660, 980, 770))
        out = paint_side(out, sample_img)
    elif job[0] == "scene":
        out = scene_copy(job[1])
    elif job[0] == "tile":
        out = paint_tile(job[2], job[3], job[1])
    else:
        out = paint_sample(job[2], job[3], job[1])
    dest = os.path.join(OUT_DIR, f"fabric-{i}.webp")
    Image.fromarray(out).save(dest, "WEBP", lossless=True, method=4)
    changed = int((np.abs(out.astype(int) - a.astype(int)).sum(2) > 0).sum())
    print("wrote", dest, "changed", changed)
