# Fieldnote — project context

Fieldnote is Daniel's cologne brand concept: every bottle is mixed after the customer orders (within 48 hours) and the label is printed with their name, city and the date it was made. Launch audience: US college students and recent grads (18–26), sold DTC with campus pop-ups. This repo is the storefront.

Live: https://dkang120.github.io/fieldnote (GitHub Pages; every push to `main` deploys in ~2 min via `.github/workflows/deploy.yml`).

## Stack
Next.js 14 App Router + TypeScript + Tailwind 3, `output: "export"` (static). Base path `/fieldnote` is set by the workflow; empty locally. No server routes — anything server-side must work client-side or move to Vercel later.

Before pushing: `npm run typecheck && npm run lint && npm run build`.

## How the site is built (since the Figma rebuild)
Every page is a 1:1 copy of its Figma frames (Screens page), not a fluid layout. `src/components/Frames.tsx` renders the phone (390), tablet (768, Home/Scents/Product only) and desktop (1440) frames; each is built in exact px and zoomed to the window by a script in `layout.tsx` (`--zp/--zt/--zd`). Phone < 600px ≤ tablet < 1100px ≤ desktop. To change a page, change Figma first, then follow `docs/FIGMA-BUILD.md` (get_design_context → `scripts/figma2tsx.mjs`, images via `scripts/figma-export.md`, check with `scripts/shoot.mjs` + `scripts/diff.py`).
- Shared pieces: `src/components/site/` (header/footer `Chrome.tsx`, `Newsletter.tsx`, bag/menu/reserve overlays `Overlays.tsx`, `Button`/`TextLink` in `ui.tsx`). Page code lives in `src/components/pages/<page>/`, images in `public/img/<page>/`.
- Palette (Figma "Fieldnote" variables, CSS vars in `globals.css`): ink #2B231F, taupe #6B625B, bone #ECE8E1, linen #F7F4F0, white, clay #9A4F31 (focus), cream-on-dark #F4F0E8, border #D1CDC4.
- Type: Instrument Serif (display/headings), Figtree (UI/body), IBM Plex Mono (labels, prices). Min 12px.
- Pre-launch: every buy button is "Reserve, pay at launch"; it adds to the bag, and the bag's Reserve opens the email dialog. Nothing is charged.

## Brand rules (keep these)
- The signature element is the printed oval label (name/city/date). Label wording is "Made for" (decided).
- Tone: calm, specific, a little dry. Short sentences. No "elevate", "exquisite", luxury clichés.
- Don't claim fresh-made fragrance "lasts longer". Say it never sat in a warehouse; the date on the label proves it.
- Example labels are marked as examples — never present invented customers or reviews as real.

## Conversion helpers
- Primary CTA site-wide is "Find your scent" → `/scents/#find` (the product grid; the old two-question finder is not in the design). The Discovery Set is the "start here" path.
- Label name/city persist across pages via `src/lib/personalization.ts`; `labelProblem()` in `cart-types.ts` blocks bottles that won't print, with errors that say how to fix them.
- Unconfirmed policies and content are listed in `docs/LAUNCH-GAPS.md`. Don't add claims that aren't there.

## Where things live
- `src/lib/scents.ts` — six house scents (names are final: Library Musk, Fig Study, Field Vetiver, Late Tea, Salt Hour, Worn Leather)
- `src/lib/builder.ts` — custom builder: quiz scoring, accords A1–A6, modifiers M01–M12, tested pairings, dose caps, formula codes (`CMP-A4-M04.M10.M11-W+1-I17`), bench recipe
- `src/components/pages/build/` — builder UI (base → notes → strength → label → review); `/build/?code=…` reopens a saved blend
- `src/lib/fill-dates.ts` — bench sessions Mon–Fri, 3pm PT cutoff, `CLOSED_DAYS`
- `src/lib/analytics.ts` — typed event map → `window.dataLayer` (GA4 ecommerce shape); `?debug=analytics` logs to console
- Installable app (PWA): `src/app/manifest.ts`, `public/sw.js` (bump `VERSION` to clear old caches), `src/components/ServiceWorker.tsx`, icons in `public/icons/`
- `src/lib/integrations/` — preview payments/email (default), Shopify Storefront checkout, flat-rate ground shipping, Zebra ZPL label printing

## Pricing
House 50 ml $78 / 100 ml $128 · Custom 50 ml $108 / 100 ml $168 · Discovery Set (6 × 2 ml) $22, credited to the first bottle · free ground shipping over $75.

## Not built yet
- Account / "My Scents" (saved formulas, reorder, order history) — deferred
- Real checkout (switch with `NEXT_PUBLIC_COMMERCE=shopify` + variant map once the store exists)

## Figma
Design file: https://www.figma.com/design/zlkIf86qC1F1FZDgGFhPQE (Daniel's team, Pro). Pages: Foundations (tokens and type specimen), Components (bottle, scent tile, buttons, chips, inputs, header/footer, product-page parts, icons), Screens (home, scents, product, Discovery at 1440 and 390). Variables mirror the `:root` tokens with CSS code syntax; keep code and Figma in step when tokens change.

## Design skills in this repo
`.claude/skills/impeccable` and `.claude/skills/ui-ux-pro-max` are third-party design skills Daniel asked for. Use them for design passes, but the brand rules above win where they conflict. Impeccable's launcher downloads a helper binary on first run.

## Working with Daniel
Casual, direct. When he gives a task without asking for an explanation, just do it and report the result briefly. Ask before big or hard-to-undo changes.
