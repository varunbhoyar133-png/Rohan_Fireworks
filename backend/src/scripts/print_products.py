import json

data = json.load(open('backend/src/scripts/extracted_products.json', encoding='utf-8'))
print(f"Total Products Extracted: {len(data)}")

for i, p in enumerate(data):
    img = p['image_name'] if p['image_name'] else "NO_IMAGE"
    price_val = f"Rs. {p['price']}" if p['price'] is not None else "NEEDS_REVIEW"
    clean_name = p['name'].encode('ascii', 'replace').decode('ascii')
    print(f"{i+1:3d}. [Page {p['page']:2d}] {clean_name:<35} | {price_val:<12} | {img}")
