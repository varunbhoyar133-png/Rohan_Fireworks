import os
import json
import csv
import re
from pypdf import PdfReader

pdf_path = os.path.join(r"C:\Users\atxva\Desktop\Fireworks\fireworks list", "Jianna Fireworks _119_Price_List.pdf")
output_csv = r"C:\Users\atxva\Desktop\Fireworks\backend\src\scripts\fireworks_catalogue_119.csv"
output_json = r"C:\Users\atxva\Desktop\Fireworks\backend\src\scripts\fireworks_catalogue_119.json"
img_dir = r"C:\Users\atxva\Desktop\Fireworks\backend\uploads\catalogue"

reader = PdfReader(pdf_path)

# Category classification rules based on page & product name
def get_category_info(page_num, raw_name):
    name_lower = raw_name.lower()
    
    if page_num in [1, 2, 3] or "shot" in name_lower:
        return {
            "name": "Aerial Multi-Shots (Sky Cakes)",
            "slug": "aerial-multi-shots",
            "prefix": "SHT",
            "sound": "High Aerial Thud",
            "effect": "Multi-Color Aerial Starburst & Palm Bouquet",
            "distance": "20 Meters in Open Ground",
            "pack": "1 Display Cake Unit"
        }
    elif page_num in [4, 5, 6] and ("pipe" in name_lower):
        return {
            "name": "Aerial Display Pipes & Shells",
            "slug": "aerial-display-pipes",
            "prefix": "PIP",
            "sound": "High Aerial Thud",
            "effect": "Single High-Altitude Shell Burst & Golden Tail",
            "distance": "25 Meters in Open Ground",
            "pack": "2 Pcs / Pipe Pack" if "2pcs" in name_lower or "2p" in name_lower else "1 Pc Display Pipe"
        }
    elif "peacock" in name_lower or "fountain" in name_lower or "penta" in name_lower:
        return {
            "name": "Novelty Fountains & Peacocks",
            "slug": "novelty-fountains",
            "prefix": "FNT",
            "sound": "Low / Sparkle Only",
            "effect": "Graceful Colorful Fan Fountain with Crackles",
            "distance": "5 Meters",
            "pack": "1 Pc Novelty Box"
        }
    elif "helicopter" in name_lower or "butterfly" in name_lower or "rocket" in name_lower:
        return {
            "name": "Rockets, Helicopters & Butterflies",
            "slug": "rockets-and-missiles",
            "prefix": "RCK",
            "sound": "Medium Boom",
            "effect": "Ascending Whistling Flight with Radiant Burst",
            "distance": "15 Meters in Open Ground",
            "pack": "Pack of 10 Pcs" if "rocket" in name_lower else "Box of 5 Pcs"
        }
    elif "anar" in name_lower:
        return {
            "name": "Flower Pots (Anar)",
            "slug": "flower-pots",
            "prefix": "ANR",
            "sound": "Low / Sparkle Only",
            "effect": "High-Ascending Sparkling Golden Fountain",
            "distance": "5 Meters",
            "pack": "Box of 5 Pots" if ("giant" in name_lower or "deluxe" in name_lower) else "Box of 10 Pots"
        }
    elif "chkr" in name_lower or "wheel" in name_lower or "spinner" in name_lower:
        return {
            "name": "Ground Chakkars (Spinning Wheels)",
            "slug": "ground-chakkars",
            "prefix": "CHK",
            "sound": "Low / Sparkle Only",
            "effect": "Rapid High-Speed Spinning Golden Fire Rings",
            "distance": "4 Meters",
            "pack": "Box of 10 Wheels" if "deluxe" in name_lower or "special" in name_lower else "Box of 10 Pcs"
        }
    elif any(k in name_lower for k in ["tiger", "555", "sutli", "bomb", "gesm", "kitkat", "cock", "shots"]):
        return {
            "name": "Sound Crackers & Atom Bombs",
            "slug": "sound-crackers",
            "prefix": "BMB",
            "sound": "High Aerial Thud" if "bomb" in name_lower else "Medium Boom",
            "effect": "Intense Sonic Resonant Bang",
            "distance": "10 Meters",
            "pack": "Box of 10 Pcs" if "bomb" in name_lower else "Pack of 5 Pcs"
        }
    elif any(k in name_lower for k in ["singlecracker", "singlesound", "laxmi", "bird", "gold"]):
        return {
            "name": "Sound Crackers & Atom Bombs",
            "slug": "sound-crackers",
            "prefix": "SCK",
            "sound": "Mild Crackle",
            "effect": "Crisp Single Sound Blast",
            "distance": "5 Meters",
            "pack": "Box of 5 Pcs"
        }
    elif any(k in name_lower for k in ["10k", "5k", "2k", "1k", "rassi", "loose", "bijli"]):
        return {
            "name": "Garlands & Repeating Crackers (Ladi)",
            "slug": "garlands-and-ladi",
            "prefix": "LAD",
            "sound": "High Aerial Thud",
            "effect": "Rhythmic Continuous Festive Chain Fire",
            "distance": "15 Meters in Open Ground",
            "pack": "1 Festive Garland Roll" if ("k" in name_lower or "rassi" in name_lower) else "1 Packet (100 Pcs)"
        }
    elif "fuljhadi" in name_lower:
        return {
            "name": "Sparklers (Phuljhadi)",
            "slug": "sparklers",
            "prefix": "SPK",
            "sound": "Mild Crackle",
            "effect": "Radiant Electric Silver & Color Crackling Embers",
            "distance": "2 Meters",
            "pack": "Box of 10 Sticks"
        }
    else:
        return {
            "name": "Kids Special & Novelties",
            "slug": "kids-special",
            "prefix": "KID",
            "sound": "Soundless" if "lantern" in name_lower or "serpant" in name_lower else "Mild Crackle",
            "effect": "Safe Low-Decibel Festive Wonder",
            "distance": "2 Meters",
            "pack": "Box of Novelties"
        }

# Helper to format clean display name from camelcase/unspaced names
def format_display_name(raw_name):
    s = raw_name
    # Replace typographic quotes with clean inch symbol
    s = s.replace("\u201d", '"').replace("\u201c", '"')
    # Add space after inch symbol if followed by letters
    s = re.sub(r'([0-9\.]+)"([a-zA-Z])', r'\1" \2', s)
    # Add space before capitals or numbers if squished together
    s = re.sub(r'([0-9]+)([a-zA-Z])', r'\1 \2', s)
    s = re.sub(r'([a-z])([A-Z])', r'\1 \2', s)
    s = re.sub(r'([A-Z]+)([A-Z][a-z])', r'\1 \2', s)
    # Clean up double spaces
    s = re.sub(r'\s+', ' ', s).strip()
    return s

all_products = []
sku_counters = {}

for page_idx, page in enumerate(reader.pages):
    page_num = page_idx + 1
    text = page.extract_text()
    raw_lines = [l.strip() for l in text.split("\n") if l.strip()]
    
    filtered_lines = []
    for l in raw_lines:
        if l in ["WenCell", "PriceList", "Photos Name Price"] or "Created By WenCell" in l:
            continue
        filtered_lines.append(l)
        
    page_images = list(page.images)
    img_idx = 0
    has_no_image_flag = False
    
    for l in filtered_lines:
        if l.lower() == "noimages":
            has_no_image_flag = True
            continue
            
        parts = l.rsplit(" ", 1)
        if len(parts) == 2 and (parts[1].isdigit() or parts[1].replace(".", "").isdigit()):
            raw_name = parts[0].strip()
            price_val = int(parts[1].strip())
            price_needs_review = False
        else:
            raw_name = l.strip()
            price_val = 0
            price_needs_review = True
            
        # Image matching
        image_url = ""
        image_filename = ""
        if has_no_image_flag:
            image_url = ""
            has_no_image_flag = False
        else:
            if img_idx < len(page_images):
                img_name = page_images[img_idx].name
                image_filename = f"page_{page_num}_{img_name}"
                image_url = f"/uploads/catalogue/{image_filename}"
                img_idx += 1
            else:
                image_url = ""
                
        cat_info = get_category_info(page_num, raw_name)
        prefix = cat_info["prefix"]
        sku_counters[prefix] = sku_counters.get(prefix, 0) + 1
        sku = f"RF-{prefix}-{sku_counters[prefix]:02d}"
        
        display_name = format_display_name(raw_name)
        
        # Stock: assign realistic stock count between 20 and 150 units
        # with a few strategic items at low-stock threshold for inventory testing
        stock_units = 8 if (page_num == 4 and "niagara" in raw_name.lower()) or (page_num == 10 and "4*4" in raw_name.lower()) else (25 + (page_num * 5) % 100)
        
        product_item = {
            "source_id": len(all_products) + 1,
            "source_page": page_num,
            "raw_name": raw_name,
            "display_name": display_name,
            "sku": sku,
            "price": price_val,
            "price_needs_review": price_needs_review,
            "category_name": cat_info["name"],
            "category_slug": cat_info["slug"],
            "image_url": image_url,
            "has_image": bool(image_url),
            "pack_size": cat_info["pack"],
            "sound_level": cat_info["sound"],
            "visual_effect": cat_info["effect"],
            "safety_distance": cat_info["distance"],
            "stock": stock_units,
            "low_stock_threshold": 10,
            "is_green_cracker": True,
            "is_visible": True,
            "is_featured": (page_num in [1, 7, 9, 10, 18] and sku_counters[prefix] <= 2)
        }
        all_products.append(product_item)

print(f"Total products generated: {len(all_products)}")

# Save to JSON
with open(output_json, "w", encoding="utf-8") as f:
    json.dump(all_products, f, indent=2, ensure_ascii=False)

# Save to CSV
fieldnames = list(all_products[0].keys())
with open(output_csv, "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(all_products)

print(f"Generated {output_json}")
print(f"Generated {output_csv}")
