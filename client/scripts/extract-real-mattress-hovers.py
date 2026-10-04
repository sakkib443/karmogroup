"""Extract the real mattress (or topper) from original catalogue hovers."""
from pathlib import Path
import numpy as np
from PIL import Image

SRC = Path(r"C:\July\karmo group\client\public\karmo\images\mattress\products")
OUT = SRC / "real-extract"
OUT.mkdir(exist_ok=True)

# Tight bands so catalogue headlines never enter the crop.
JOBS = [
    ("king-hover-v6-hq.jpg", "king-real.png", (0.12, 0.40, 0.88, 0.70)),
    ("prestige-hover-v5-hq.jpg", "prestige-real.png", (0.10, 0.34, 0.90, 0.70)),
    ("orthopedic-hover-v5-hq.jpg", "orthopedic-real.png", (0.10, 0.34, 0.90, 0.70)),
    ("imperial-hover-v6-hq.jpg", "imperial-real.png", (0.12, 0.40, 0.88, 0.70)),
    ("bonnell-hover-v5-hq.jpg", "bonnell-real.png", (0.10, 0.34, 0.90, 0.70)),
    ("pillowtop-hover-v6-hq.jpg", "pillowtop-real.png", (0.12, 0.40, 0.88, 0.72)),
    ("eurotop-hover-v6-hq.jpg", "eurotop-real.png", (0.12, 0.38, 0.90, 0.72)),
    ("topper-hover-v5-hq.jpg", "topper-real.png", (0.38, 0.30, 0.96, 0.78)),
]


def extract(src: Path, dest: Path, box) -> None:
    im = Image.open(src).convert("RGB")
    arr = np.asarray(im).astype(np.int16)
    h, w = arr.shape[:2]
    lum = (0.299 * arr[:, :, 0] + 0.587 * arr[:, :, 1] + 0.114 * arr[:, :, 2])

    x0, y0, x1, y1 = (
        int(w * box[0]),
        int(h * box[1]),
        int(w * box[2]),
        int(h * box[3]),
    )
    band = lum[y0:y1, x0:x1]

    # Product pixels are darker / more saturated than the white cyclorama.
    sat = arr[y0:y1, x0:x1].max(axis=2) - arr[y0:y1, x0:x1].min(axis=2)
    mask = (band < 245) & ((sat > 8) | (band < 230))

    ys, xs = np.where(mask)
    if len(xs) < 200:
        crop = im.crop((x0, y0, x1, y1))
    else:
        pad = 18
        xa, xb = max(x0 + xs.min() - pad, 0), min(x0 + xs.max() + pad, w)
        ya, yb = max(y0 + ys.min() - pad, 0), min(y0 + ys.max() + pad, h)
        crop = im.crop((xa, ya, xb, yb))

    # Drop leftover ink: very dark near-black bars from headlines if they leaked.
    c = np.asarray(crop).astype(np.int16)
    clum = 0.299 * c[:, :, 0] + 0.587 * c[:, :, 1] + 0.114 * c[:, :, 2]
    # Keep a little white margin so the product isn't flush.
    crop.save(dest, "PNG")
    print(f"{src.name} -> {dest.name} {crop.size}  leftover_dark={(clum < 40).mean():.3f}")


for src_name, dest_name, box in JOBS:
    extract(SRC / src_name, OUT / dest_name, box)
