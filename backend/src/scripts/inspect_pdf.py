import os
from pypdf import PdfReader

pdf_path = os.path.join(r"C:\Users\atxva\Desktop\Fireworks\fireworks list", "Jianna Fireworks _119_Price_List.pdf")

reader = PdfReader(pdf_path)
print(f"Total pages: {len(reader.pages)}")

for i, page in enumerate(reader.pages):
    print(f"\n--- PAGE {i+1} ---")
    text = page.extract_text()
    lines = text.split("\n") if text else []
    print(f"Text length: {len(text) if text else 0}, Lines: {len(lines)}")
    # Print first 20 lines
    for line in lines[:25]:
        print(f"  {line}")
    images = page.images
    print(f"Images on page {i+1}: {len(images)}")
    for img in images:
        print(f"   Image name: {img.name}")
