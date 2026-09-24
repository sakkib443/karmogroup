from pathlib import Path

from PIL import Image, ImageDraw


source = Path("tmp/pdfs/karmo-catalogue")
pages = sorted(source.glob("page-*.jpg"))

for start in range(0, len(pages), 9):
    batch = pages[start : start + 9]
    opened = [Image.open(path).convert("RGB") for path in batch]
    page_width = max(image.width for image in opened)
    page_height = max(image.height for image in opened)
    sheet = Image.new("RGB", (page_width * 3, page_height * 3), "white")
    draw = ImageDraw.Draw(sheet)
    for index, image in enumerate(opened):
        x = (index % 3) * page_width
        y = (index // 3) * page_height
        sheet.paste(image, (x, y))
        draw.rectangle((x, y, x + 108, y + 32), fill="white")
        draw.text((x + 8, y + 7), pages[start + index].stem, fill="black")
    output = source / f"contact-{start + 1:02d}-{start + len(batch):02d}.jpg"
    sheet.save(output, quality=90)
