"""Split the two overlapping white frames on brochure page 20."""

import os

import numpy as np
from PIL import Image

LIB = (
    r"C:\July\karmo group\client\public\karmo-library"
    r"\02-catalogues\foam-catalogue"
)
page = np.array(Image.open(os.path.join(LIB, "page-20.jpg")).convert("RGB"))
white = np.all(page > 245, axis=-1)

# Search the foam-photo corner.
y0, y1, x0, x1 = 1080, 1520, 500, 1220
band = white[y0:y1, x0:x1]
print("rows with a long white run:")
for y in range(band.shape[0]):
    row = band[y]
    best = 0
    run = 0
    start = 0
    best_span = None
    for x, on in enumerate(row):
        if on:
            if run == 0:
                start = x
            run += 1
            if run > best:
                best = run
                best_span = (start, x)
        else:
            run = 0
    if best >= 120:
        print(f"  y={y0 + y} len={best} x={x0 + best_span[0]}..{x0 + best_span[1]}")
