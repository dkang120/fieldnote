# Building pages from the Figma file

Figma: file key `zlkIf86qC1F1FZDgGFhPQE`, page Screens `3:3`. The site must match the frames exactly at 390 / 768 / 1440.

## How a page is put together

- Each route renders `<Frames phone={…} tablet={…} desktop={…} />` (`src/components/Frames.tsx`).
  Every frame is built at its Figma width in px (390 / 768 / 1440) and zoomed to the window by CSS, so **write exact px values
  from Figma; never make the layout fluid**. Omit `tablet` when the page has no tablet frame.
- Header/footer/newsletter are shared, don't regenerate them: `src/components/site/Chrome.tsx`
  (`HeaderDesktop`, `HeaderPhone width?`, `FooterDesktop`, `FooterPhone width?`) and `src/components/site/Newsletter.tsx`
  (`<Newsletter device="d" | "t" | "p" />`). Tablet frames use `HeaderPhone width={768}` / `FooterPhone width={768}`.
- Buttons/links: `Button` and `TextLink` in `src/components/site/ui.tsx` (Figma Button 4:40 and Link). Icons: `src/components/icons`.
- Overlays are global (`src/components/site/Overlays.tsx`): open the bag with `useCart().setOpen(true)`, the menu with
  `useUi().setMenuOpen(true)`, the reserve dialog with `useUi().openReserve({ id, name, price, detail })`.
  Every "Reserve, pay at launch" button should add the item to the bag (`useCart().add(...)`, see `src/lib/cart-types.ts`)
  only if that is clearly what the design implies; otherwise just `openReserve(...)`.
- Links: Scents `/scents/`, a scent `/scents/<slug>/`, Discovery `/discovery/`, How it's made `/how-its-made/`
  (shipping section `/how-its-made/#shipping`), About `/about/`, Build your own `/build/`, Find your scent `/scents/#find`.
  Use `next/link`. Plain `<img src>` must go through `asset()` from `@/lib/site` (adds the GitHub Pages base path).
- Fonts: `font-sans` (Figtree), `font-serif` (Instrument Serif), `font-mono` (IBM Plex Mono). Colors: write the hex values
  from Figma (`text-[#2b231f]`) or the named tokens in tailwind.config.ts.

## Workflow per section

1. Get reference code: `get_design_context` (skillNames "resource:figma-design-to-code", clientFrameworks "react,nextjs",
   `excludeScreenshot: true` is fine for sections; take one screenshot of the whole frame to compare against).
   Work section by section (direct children of the frame); whole frames are too big.
2. Save the code to a scratch file and run `node scripts/figma2tsx.mjs raw.tsx out.tsx ComponentName assets.json`.
   It maps fonts, strips Figma-only attributes, turns `var(--…,#hex)` into hex, and lists the image constants with the
   node id each is drawn in (exit code 2 until every image constant has a path in assets.json).
3. Export those images (see `scripts/figma-export.md`) into `public/img/<page>/…webp`. Export the image *slot* node
   (it already has the crop). If a photo has a label overlay group on top, export the parent group or pass the overlay ids
   as extras so it is baked into the image, and remove the overlay markup from the code. Use scale 2 for slots up to ~720px
   wide, 1.5 for wider. Replace any `<img>` positioned with percentages/offsets inside a crop wrapper by a plain
   `absolute inset-0 size-full object-cover` image, since the export already has the crop.
4. Clean the generated code by hand: replace generated `Button` / `Link` / header / footer copies with the shared ones,
   make links real (`<Link href>`), make buttons/inputs real (`<button>`, `<input>` with labels), keep all px values,
   keep text exactly as in Figma. `h1` for the page title, `h2` for section titles.
5. Verify: `npm run typecheck`, then screenshot the page with Playwright at 390/768/1440 (`node scripts/shoot.mjs <path>`)
   and compare against the Figma frame screenshot. Fix any difference larger than text anti-aliasing.

## Rules

- Do not change the Figma file, except deleting your own frames on the "_export (temp)" page.
- Don't edit shared files (`Chrome.tsx`, `Newsletter.tsx`, `Overlays.tsx`, `ui.tsx`, `Frames.tsx`, `globals.css`,
  `layout.tsx`, `tailwind.config.ts`). If one needs a change, say so in your final report.
- Copy is final as written in Figma. Don't add claims.
