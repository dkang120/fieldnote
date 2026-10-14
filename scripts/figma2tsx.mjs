#!/usr/bin/env node
/**
 * Turns the React+Tailwind reference code from Figma's get_design_context into a component
 * that fits this project: real font families, plain hex colors, local images.
 *
 *   node scripts/figma2tsx.mjs <raw.tsx> <out.tsx> <ComponentName> [assets.json]
 *
 * assets.json maps the Figma image constants to public paths, e.g. {"imgHeroPhoto": "/img/home/hero.webp"}.
 * Without it (or with constants missing from it) the script prints the constants and the node id
 * each one is drawn in, so the images can be exported from those nodes, and exits with code 2.
 */
import fs from "node:fs";

const [, , rawPath, outPath, name, mapPath] = process.argv;
if (!rawPath || !outPath || !name) {
  console.error("usage: figma2tsx.mjs <raw.tsx> <out.tsx> <ComponentName> [assets.json]");
  process.exit(1);
}
let src = fs.readFileSync(rawPath, "utf8");
const map = mapPath && fs.existsSync(mapPath) ? JSON.parse(fs.readFileSync(mapPath, "utf8")) : {};

// Keep only the code block (the tool output sometimes carries notes after it).
const fence = src.match(/```(?:tsx|jsx|typescript)?\n([\s\S]*?)```/);
if (fence) src = fence[1];

// ---- images: find constants and the node each is drawn in
const consts = [...src.matchAll(/^const (\w+) = "(https:\/\/www\.figma\.com\/api\/mcp\/asset\/[^"]+)";\s*$/gm)];
const missing = [];
for (const [, id, url] of consts) {
  const use = src.indexOf(`src={${id}}`);
  const before = use > 0 ? src.slice(0, use) : "";
  const nodes = [...before.matchAll(/data-node-id="([^"]+)"/g)];
  const node = nodes.length ? nodes[nodes.length - 1][1] : "?";
  const ext = url.endsWith(".svg") ? "svg" : "img";
  if (!map[id]) missing.push({ id, node, ext });
}
if (missing.length) {
  console.log(JSON.stringify(missing, null, 1));
  if (!process.env.ALLOW_MISSING) process.exit(2);
}
src = src.replace(/^const (\w+) = "https:\/\/www\.figma\.com\/api\/mcp\/asset\/[^"]+";\s*$/gm, (_, id) =>
  map[id] ? `const ${id} = asset(${JSON.stringify(map[id])});` : `const ${id} = "";`,
);

// ---- class cleanup
src = src
  .replace(/var\(--rgb\(var\(--[\w-]+\)\),\s*([^)\]]+)\)/g, "$1") // var(--rgb(var(--ink)),#2b231f) -> #2b231f
  .replace(/var\(--[^,()\]]*,\s*([^)\]]+)\)/g, "$1") // var(--border,#d1cdc4) -> #d1cdc4
  .replace(/font-\['([A-Za-z_ ]+?)(?::[^']*)?'\]/g, (_, fam) => {
    const f = fam.replace(/_/g, " ");
    if (/Instrument Serif/.test(f)) return "font-serif";
    if (/Plex Mono|Space Mono|Mono/.test(f)) return "font-mono";
    return "font-sans";
  })
  .replace(/\s+data-(node-id|name|annotations)="[^"]*"/g, "")
  .replace(/<img alt="" /g, '<img alt="" loading="lazy" decoding="async" ');

// ---- module shape
src = src.replace(/export default function \w+/, `export function ${name}`);
const header = `/* Generated from Figma (scripts/figma2tsx.mjs), then edited by hand. */\nimport { asset } from "@/lib/site";\n\n`;
fs.writeFileSync(outPath, header + src.trim() + "\n");
console.log(`wrote ${outPath}`);
