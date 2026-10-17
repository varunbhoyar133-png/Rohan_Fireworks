import os
from pypdf import PdfReader
import json

pdf_path = os.path.join(r"C:\Users\atxva\Desktop\Fireworks\fireworks list", "Jianna Fireworks _119_Price_List.pdf")
reader = PdfReader(pdf_path)

output_data = []

for page_idx, page in enumerate(reader.pages):
    text = page.extract_text()
    lines = [line.strip() for line in text.split("\n") if line.strip()]
    
    # Extract images info
    image_names = [img.name for img in page.images]
    
    output_data.append({
        "page": page_idx + 1,
        "lines": lines,
        "images": image_names
    })

with open("backend/src/scripts/pdf_dump.json", "w", encoding="utf-8") as f:
    json.dump(output_data, f, indent=2, ensure_ascii=False)

print("Dumped all pages to backend/src/scripts/pdf_dump.json")
