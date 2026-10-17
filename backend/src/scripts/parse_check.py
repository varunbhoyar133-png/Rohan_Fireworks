import json

with open("backend/src/scripts/pdf_dump.json", "r", encoding="utf-8") as f:
    pages = json.load(f)

for p in pages:
    print(f"\n================ PAGE {p['page']} ================")
    print(f"Lines ({len(p['lines'])}):")
    for l in p['lines']:
        print(f"  {l}")
    print(f"Images ({len(p['images'])}): {p['images']}")
