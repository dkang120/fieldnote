#!/usr/bin/env python3
"""Save a Figma export PNG into public/img as WebP (photos) or PNG (flat art).

  python3 -I scripts/save-img.py <export.png> <public/img/....webp> [quality]
"""
import sys
from PIL import Image

src, out = sys.argv[1], sys.argv[2]
q = int(sys.argv[3]) if len(sys.argv) > 3 else 84
im = Image.open(src)
if out.endswith(".webp"):
    im = im.convert("RGBA") if im.mode in ("RGBA", "LA", "P") and im.getextrema()[-1][0] < 255 else im.convert("RGB")
    im.save(out, "WEBP", quality=q, method=6)
elif out.endswith(".jpg"):
    im.convert("RGB").save(out, "JPEG", quality=q, optimize=True, progressive=True)
else:
    im.save(out, optimize=True)
print(out, im.size)
