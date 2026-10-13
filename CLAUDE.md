# Fieldnote — project context

Fieldnote is Daniel's cologne brand concept: every bottle is mixed after the customer orders (within 48 hours) and the label is printed with their name, city and the date it was made. Launch audience: US college students and recent grads (18–26), sold DTC with campus pop-ups. This repo is the storefront.

Live: https://dkang120.github.io/fieldnote (GitHub Pages; every push to `main` deploys in ~2 min via `.github/workflows/deploy.yml`).

## Stack
Next.js 14 App Router + TypeScript + Tailwind 3, `output: "export"` (static). Base path `/fieldnote` is set by the workflow; empty locally. No server routes — anything server-side must work client-side or move to Vercel later.

Before pushing: `npm run typecheck && npm run lint && npm run build`.

## Brand rules (keep these)
- Palette (tailwind.config.ts): paper `#F3EFE7`, paper-deep `#E9E3D7`, ink `#1C1B19`, ink-soft, stone, kraft `#C9B796`, clay accent `#A95F3B`. Clay is the only accent.
- Type: Instrument Serif (display/voice), Hanken Grotesk (UI/body), IBM Plex Mono only where a label or formula prints.
- Inspiration: an even mix of Elorea (clean, modern, product-forward) and Diptyque (oval labels, serif, editorial). Le Labo for the made-for-you ritual.
- The signature element is the bottle SVG with the oval label (`src/components/Bottle.tsx`) — live name/city/date. Protect it.
- Tone: calm, specific, a little dry. Short sentences. No "elevate", "exquisite", luxury clichés.
- Label wording is "Made for" (decided).
- Don't claim fresh-made fragrance "lasts longer". Say it never sat in a warehouse; the date on the label proves it.
- Example labels on the home page are marked as examples — never present invented customers or reviews as real.

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
- Motion (`motion` package) for interaction polish — planned next, keep it restrained: one orchestrated moment per page, respect reduced motion

## Design skills in this repo
`.claude/skills/impeccable` and `.claude/skills/ui-ux-pro-max` are third-party design skills Daniel asked for. Use them for design passes, but the brand rules above win where they conflict. Impeccable's launcher downloads a helper binary on first run.

## Working with Daniel
Casual, direct. When he gives a task without asking for an explanation, just do it and report the result briefly. Ask before big or hard-to-undo changes.
