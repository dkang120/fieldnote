#!/usr/bin/env node
/**
 * Full-page screenshots of a route at the three design widths.
 *   node scripts/shoot.mjs /scents/ [outDir]      (BASE defaults to http://localhost:3000)
 * Writes <outDir>/<name>-390.png, -768.png, -1440.png.
 */
import { chromium } from "playwright";
import fs from "node:fs";

const route = process.argv[2] || "/";
const out = process.argv[3] || "/tmp/shots";
const base = process.env.BASE || "http://localhost:3000";
const widths = (process.env.WIDTHS || "390,768,1440").split(",").map(Number);
fs.mkdirSync(out, { recursive: true });
const name = route.replace(/^\/|\/$/g, "").replace(/\//g, "_") || "home";
const HS = "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell";
const browser = await chromium.launch({ executablePath: fs.existsSync(HS) ? HS : undefined });
for (const w of widths) {
  const page = await browser.newPage({ viewport: { width: w, height: 900 }, deviceScaleFactor: 1 });
  await page.goto(base + route, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  // load lazy images: scroll through the page, then wait for every image to decode
  await page.evaluate(async () => {
    for (const i of document.images) i.loading = "eager";
    const step = innerHeight * 0.8;
    for (let y = 0; y < document.body.scrollHeight; y += step) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); }
    scrollTo(0, 0);
    await Promise.all([...document.images].map((i) => (i.complete ? null : new Promise((r) => { i.onload = i.onerror = r; }))));
  });
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(300);
  const file = `${out}/${name}-${w}.png`;
  await page.screenshot({ path: file, fullPage: true });
  console.log(file);
  await page.close();
}
await browser.close();
