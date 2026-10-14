# Exporting images from Figma (no direct downloads here)

figma.com asset URLs are blocked in this environment, so images come out through screenshots:

1. `use_figma` (skillNames "resource:figma-use"): copy each image slot onto the scratch page "_export (temp)",
   scaled up, with this script (edit LIST):

```js
const LIST = [ // [key, nodeId, scale, extraNodeIds?]  extra = overlays drawn on top (label groups etc.)
  ["home-hero-d", "26:1684", 1.5],
];
let pg = figma.root.children.find(p => p.name === "_export (temp)");
if (!pg) { pg = figma.createPage(); pg.name = "_export (temp)"; }
await figma.setCurrentPageAsync(pg);
let y = 0; const out = {};
for (const [key, id, s, extra = []] of LIST) {
  const n = await figma.getNodeByIdAsync(id);
  const old = pg.children.find(c => c.name === key); if (old) old.remove();
  const f = figma.createFrame(); f.name = key; f.fills = []; f.clipsContent = true;
  f.resize(Math.round(n.width * s), Math.round(n.height * s)); pg.appendChild(f); f.x = 0; f.y = y; y += f.height + 40;
  const nb = n.absoluteTransform;
  const place = (c, src) => { const t = src.absoluteTransform; c.x = (t[0][2] - nb[0][2]) * s; c.y = (t[1][2] - nb[1][2]) * s; };
  if (n.type === "RECTANGLE" || id.startsWith("I")) { // image slot (also inside instances): copy the paint
    const r = figma.createRectangle(); r.resize(f.width, f.height); r.fills = JSON.parse(JSON.stringify(n.fills)); r.cornerRadius = (n.cornerRadius || 0) * s; f.appendChild(r);
  } else { const c = n.clone(); f.appendChild(c); c.rescale(s); c.x = 0; c.y = 0; }
  for (const eid of extra) { const e = await figma.getNodeByIdAsync(eid); const c = e.clone(); f.appendChild(c); c.rescale(s); place(c, e); }
  out[key] = [f.id, f.width, f.height];
}
return out;
```

2. `get_screenshot` each returned frame id with `enableBase64Response: true` and `maxDimension` = the frame's
   larger side. The response names a local PNG: `[Image: source: /root/.claude/.../tool-results/mcp-Figma-blob-....png]`.

3. `python3 -I scripts/save-img.py <that png> public/img/<page>/<key>.webp` (photos) or `.png` (flat art).

4. Delete your frames from "_export (temp)" when done.
