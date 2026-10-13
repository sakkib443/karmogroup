"""Brochure figure crops (white border kept) and a defringed shoe cutout.

The three figures are straight crops of the catalogue pages. Nothing inside
the frame is recoloured, redrawn or regenerated.
"""

import os
from collections import deque

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

LIB = (
    r"C:\July\karmo group\client\public\karmo-library"
    r"\02-catalogues\foam-catalogue"
)
CLIENT = (
    r"C:\Users\USER\.cursor\projects\c-July-karmo-group\assets"
    r"\c__Users_USER_AppData_Roaming_Cursor_User_workspaceStorage"
    r"_5723e454313c65c7a47f4e9d1ee9a1ef_images_image-85b26965-024e-4129-80b0-61e2f91fe2e5.png"
)
OUT = r"C:\July\karmo group\client\public\karmo\images\home-02\footwear"
PREVIEW = r"C:\July\karmo group\tmp\footwear-slide3"
os.makedirs(PREVIEW, exist_ok=True)

p19 = Image.open(os.path.join(LIB, "page-19.jpg"))
p20 = Image.open(os.path.join(LIB, "page-20.jpg"))

# Boxes follow the white stroke measured on the page, plus the stroke itself.
frames = {
    "icon-foam-footbeds": (p19, (462, 1268, 810, 1516)),
    "icon-foam-sheet-pink": (p20, (538, 1096, 900, 1370)),
    "icon-foam-sheet-grey": (p20, (846, 1242, 1178, 1494)),
}
for name, (src, box) in frames.items():
    crop = src.crop(box)
    crop.save(os.path.join(OUT, f"{name}.webp"), quality=95, method=6)
    crop.save(os.path.join(PREVIEW, f"{name}.jpg"), quality=92)
    print(name, crop.size)

# ── Shoe: the client's own pixels, labels cropped off ────────────────────────
# Backdrop is pure white (255). The midsole tops out near 232, so dropping
# only near-white pixels leaves every shoe pixel untouched. No erosion and
# no thin-line pass — those were tearing the sole.
shoe = Image.open(CLIENT).convert("RGB")
rgb = np.array(shoe)
# The three labels and their leader lines sit to the right of the outsole.
# The shoe fills its columns. The leader lines and labels do not, so the
# last dense column is the right edge of the outsole.
counts = (rgb.min(axis=2) < 250).sum(axis=0)
dense = np.flatnonzero(counts > 40)
last = int(dense[dense < 700][-1])
product = rgb[:, : last + 4]
opaque = product.min(axis=2) < 250
print("crop x", last + 3)

alpha = Image.fromarray((opaque * 255).astype(np.uint8), mode="L")
cut = Image.fromarray(product).convert("RGBA")
cut.putalpha(alpha)
cut = cut.crop(cut.getbbox())
cut.save(os.path.join(OUT, "shoe-exploded-cutout.png"))
print("cutout", cut.size)

# Check the edge against the real section background tone, not pure black.
check = Image.new("RGB", cut.size, (28, 28, 28))
check.paste(cut, (0, 0), cut)
check.save(os.path.join(PREVIEW, "cutout-on-black.jpg"), quality=92)
