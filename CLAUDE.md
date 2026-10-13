# Fieldnote — project context

Fieldnote is Daniel's cologne brand concept: every bottle is mixed after the customer orders (within 48 hours) and the label is printed with their name, city and the date it was made. Launch audience: US college students and recent grads (18–26), sold DTC with campus pop-ups. This repo is the storefront.

Live: https://dkang120.github.io/fieldnote (GitHub Pages; every push to `main` deploys in ~2 min via `.github/workflows/deploy.yml`).

## Stack
Next.js 14 App Router + TypeScript + Tailwind 3, `output: "export"` (static). Base path `/fieldnote` is set by the workflow; empty locally. No server routes — anything server-side must work client-side or move to Vercel later.

Before pushing: `npm run typecheck && npm run lint && npm run build`.

## Brand rules (keep these)
- Palette: monochrome, no accent. CSS variables on `:root` in `src/app/globals.css`, mapped in tailwind.config.ts: canvas `#E6E5E3` (page), surface `#F2F1EF` (cards, tiles), ink `#111111` (text, solid blocks, buttons), muted `#646464`, line `#CFCDC9`, on-ink `#F2F1EF` (text on black bands). Photos go grayscale (`img.photo`); the bottle SVG renders scent tints as neutral grays.
- Type: Figtree only (Outfit fallback), 400 for nearly everything, 500 max, sentence case, no wide tracking. Body 16px, product titles 17–18px/1.45, prices 17px, meta 13px. Exceptions: the hero FIELDNOTE wordmark (Figtree 700, tight tracking) and the oval label inside `Bottle.tsx`, which keeps Instrument Serif + IBM Plex Mono so it reads as a printed label.
- Shop layout follows Aritzia: 3:4 tiles with number + family, name + bookmark, three key notes, a plain mood line, price and an "Explore scent" link (nothing hover-only), no cards; product page is a full-bleed bottle with floating pills, a bottom-sheet panel on phones, settings rows with chevrons, pill tabs (Details / Notes / Reviews, reviews stay an empty state until real ones exist) and a black pill Add to bag bar. Pills for buttons and tabs, square image tiles.
- Home layout follows a GAZU-style editorial store: giant FIELDNOTE wordmark with the bottle layered over it, black category band, split label section, trust row, house-scents grid. Placeholder images live in `public/assets/` (swap with same filenames).
- Inspiration: Aritzia for type and shop layout, GAZU for the home hero, Diptyque for the oval label. Le Labo for the made-for-you ritual.
- The signature element is the bottle SVG with the oval label (`src/components/Bottle.tsx`) — live name/city/date. Protect it.
- Tone: calm, specific, a little dry. Short sentences. No "elevate", "exquisite", luxury clichés.
- Label wording is "Made for" (decided).
- Don't claim fresh-made fragrance "lasts longer". Say it never sat in a warehouse; the date on the label proves it.
- Example labels on the home page are marked as examples — never present invented customers or reviews as real.

## Motion
`motion` (motion/react) with `MotionConfig reducedMotion="user"` in `src/components/MotionProvider.tsx`. One authored moment per page: home hero (wordmark opens, bottle sets down), scents grid re-flows on filter, product size switch re-seats the bottle, Discovery vials stand up in order, How it's made rule draws with scroll, builder steps arrive from the right. Content is visible before hydration; no scattered scroll reveals. Icons are one SVG stroke family in `src/components/icons`.

## Conversion helpers
- Primary CTA site-wide is "Find your scent" → `/scents/#find` (`ScentFinder`, two questions, one pick + two alternatives + "Try all six first"). The Discovery Set is the "start here" path.
- Label name/city persist across pages via `src/lib/personalization.ts`; `labelProblem()` in `cart-types.ts` blocks bottles that won't print, with errors that say how to fix them.
- Unconfirmed policies and content are listed in `docs/LAUNCH-GAPS.md`. Don't add claims that aren't there.

## Where things live
- `src/lib/scents.ts` — six house scents (names are final: Library Musk, Fig Study, Field Vetiver, Late Tea, Salt Hour, Worn Leather)
- `src/lib/builder.ts` — custom builder: quiz scoring, accords A1–A6, modifiers M01–M12, tested pairings, dose caps, formula codes (`CMP-A4-M04.M10.M11-W+1-I17`), bench recipe
- `src/components/Builder.tsx` — builder UI (quiz → base → tune → label → review); `/build/?code=…` reopens a saved blend
- `src/lib/fill-dates.ts` — bench sessions Mon–Fri, 3pm PT cutoff, `CLOSED_DAYS`
- `src/lib/analytics.ts` — typed event map → `window.dataLayer` (GA4 ecommerce shape); `?debug=analytics` logs to console
- `src/lib/integrations/` — preview payments/email (default), Shopify Storefront checkout, flat-rate ground shipping, Zebra ZPL label printing
- `src/content/posts.ts` — journal posts

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
