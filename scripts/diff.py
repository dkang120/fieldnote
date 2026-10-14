#!/usr/bin/env python3
"""Compare a site screenshot with a Figma frame export of the same width.

  python3 -I scripts/diff.py site.png figma.png [out-diff.png]

Prints overall mismatch and the worst 120px bands (y ranges) so you can find which section is off.
A pixel counts as different when any channel differs by more than 40 (ignores anti-aliasing noise).
"""
import sys
from PIL import Image, ImageChops
import numpy as np

a = Image.open(sys.argv[1]).convert("RGB")
b = Image.open(sys.argv[2]).convert("RGB")
if a.width != b.width:
    b = b.resize((a.width, round(b.height * a.width / b.width)))
h = min(a.height, b.height)
print(f"site {a.size}  figma {b.size}  (height diff {a.height - b.height:+d}px)")
A = np.asarray(a.crop((0, 0, a.width, h))).astype(int)
B = np.asarray(b.crop((0, 0, b.width, h))).astype(int)
d = (np.abs(A - B).max(axis=2) > 40)
print(f"mismatch {d.mean()*100:.2f}% of pixels")
band = 120
rows = [(y, d[y:y+band].mean()*100) for y in range(0, h, band)]
for y, m in sorted(rows, key=lambda r: -r[1])[:8]:
    if m > 0.5:
        print(f"  y {y:5d}-{y+band:5d}: {m:5.1f}%")
if len(sys.argv) > 3:
    vis = np.asarray(a.crop((0, 0, a.width, h))).copy()
    vis[d] = [255, 0, 80]
    Image.fromarray(vis.astype("uint8")).save(sys.argv[3])
