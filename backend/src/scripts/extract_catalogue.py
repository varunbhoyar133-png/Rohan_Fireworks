import os
import json
from pypdf import PdfReader

pdf_path = os.path.join(r"C:\Users\atxva\Desktop\Fireworks\fireworks list", "Jianna Fireworks _119_Price_List.pdf")
reader = PdfReader(pdf_path)

all_extracted_products = []

for page_idx, page in enumerate(reader.pages):
    page_num = page_idx + 1
    text = page.extract_text()
    raw_lines = [l.strip() for l in text.split("\n") if l.strip()]
    
    # Filter out headers
    filtered_lines = []
    for l in raw_lines:
        if l in ["WenCell", "PriceList", "Photos Name Price"] or "Created By WenCell" in l:
            continue
        filtered_lines.append(l)
        
    page_images = list(page.images)
    img_idx = 0
    
    # Iterate through filtered lines.
    # If a line is "Noimages", the next product line has NO image!
    # If not "Noimages", the next product line gets the next image in page_images!
    has_no_image_flag = False
    
    for l in filtered_lines:
        if l.lower() == "noimages":
            has_no_image_flag = True
            continue
            
        # Parse product line into Name and Price
        # Line is typically "Name Price", e.g. "500ShotsStandard 12500"
        parts = l.rsplit(" ", 1)
        if len(parts) == 2 and (parts[1].isdigit() or parts[1].replace(".", "").isdigit()):
            name = parts[0].strip()
            price_str = parts[1].strip()
            price = float(price_str) if "." in price_str else int(price_str)
        else:
            # Unclear or single word without space
            # e.g. "WonderThrow" or joined string
            name = l.strip()
            price = None
            
        image_name = None
        if has_no_image_flag:
            image_name = None
            has_no_image_flag = False
        else:
            if img_idx < len(page_images):
                image_name = page_images[img_idx].name
                img_idx += 1
            else:
                image_name = None
                
        all_extracted_products.append({
            "page": page_num,
            "raw_line": l,
            "name": name,
            "price": price,
            "image_name": image_name,
            "has_image": image_name is not None
        })
        
    print(f"Page {page_num}: Processed {len([p for p in all_extracted_products if p['page'] == page_num])} items. Images matched: {img_idx}/{len(page_images)}")

print(f"\nTotal products extracted: {len(all_extracted_products)}")

# Check any items where price is None or image matching had leftover
no_price = [p for p in all_extracted_products if p['price'] is None]
print(f"Products with unclear price ({len(no_price)}): {no_price}")

with open("backend/src/scripts/extracted_products.json", "w", encoding="utf-8") as f:
    json.dump(all_extracted_products, f, indent=2, ensure_ascii=False)
