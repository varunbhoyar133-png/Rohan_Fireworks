import os
from pypdf import PdfReader

pdf_path = os.path.join(r"C:\Users\atxva\Desktop\Fireworks\fireworks list", "Jianna Fireworks _119_Price_List.pdf")
output_dir = r"C:\Users\atxva\Desktop\Fireworks\backend\uploads\catalogue"
os.makedirs(output_dir, exist_ok=True)

reader = PdfReader(pdf_path)
saved_count = 0

for page_idx, page in enumerate(reader.pages):
    for img in page.images:
        ext = os.path.splitext(img.name)[1]
        if not ext:
            ext = ".jpg"
        clean_name = f"page_{page_idx+1}_{img.name}"
        img_path = os.path.join(output_dir, clean_name)
        with open(img_path, "wb") as f:
            f.write(img.data)
        saved_count += 1

print(f"Saved {saved_count} product images into {output_dir}")
