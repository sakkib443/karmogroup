from pathlib import Path

from pypdf import PdfReader


source = Path("karmo-foam-catalogue.pdf")
output = Path("tmp/pdfs/karmo-catalogue/catalogue.txt")
reader = PdfReader(source)

with output.open("w", encoding="utf-8") as stream:
    for index, page in enumerate(reader.pages, start=1):
        stream.write(f"\n\n===== PAGE {index:02d} =====\n")
        stream.write(page.extract_text() or "[NO EXTRACTABLE TEXT]")
