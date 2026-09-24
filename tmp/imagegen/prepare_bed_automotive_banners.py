from pathlib import Path

from PIL import Image, ImageEnhance, ImageFilter


OUTPUT = Path("client/public/karmo/images/foam-2/bed-automotive")
OUTPUT.mkdir(parents=True, exist_ok=True)

SOURCES = {
    "beds-comfort-hero.webp": Path(
        r"C:\Users\Irin Akter Nisha\.codex\generated_images\01a0c7fc-a24b-70b3-9e3d-fef1b211ce28\exec-eacded5b-8afb-4d89-b04d-14068134fc1f.png"
    ),
    "automotive-comfort-hero.webp": Path(
        r"C:\Users\Irin Akter Nisha\.codex\generated_images\01a0c7fc-a24b-70b3-9e3d-fef1b211ce28\exec-7ff0e27d-c520-40db-ba84-52322c55bbe9.png"
    ),
    "beds-automotive-combined-hero.webp": Path(
        r"C:\Users\Irin Akter Nisha\.codex\generated_images\01a0c7fc-a24b-70b3-9e3d-fef1b211ce28\exec-04343859-70ee-458d-b906-51fe53bf2578.png"
    ),
}

for filename, source in SOURCES.items():
    with Image.open(source).convert("RGB") as image:
        image = image.resize((3840, 2160), Image.Resampling.LANCZOS)
        image = image.filter(ImageFilter.UnsharpMask(radius=1.2, percent=75, threshold=3))
        image = ImageEnhance.Contrast(image).enhance(1.02)
        image.save(OUTPUT / filename, "WEBP", quality=92, method=6)
