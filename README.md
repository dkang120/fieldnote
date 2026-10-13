# Fieldnote

Storefront for Fieldnote, a cologne brand that mixes every bottle after you order and labels it with your name, city and date.

Next.js 14 (App Router) + Tailwind, exported as a static site and deployed to GitHub Pages.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static site in ./out
npm run typecheck
```

## Deploy (GitHub Pages)

Push to `main`. The workflow in `.github/workflows/deploy.yml` type-checks, builds with the repo name as the base path, and publishes `out/`.
One-time setup: repo **Settings → Pages → Source: GitHub Actions**.

## Map

| Path | What it is |
| --- | --- |
| `src/app/` | Routes: home, `/scents`, `/scents/[slug]`, `/build`, `/discovery`, `/how-its-made`, `/journal`, sitemap, robots |
| `src/lib/scents.ts` | House scent data (edit names, notes, stories here) |
| `src/lib/builder.ts` | Custom builder: quiz scoring, accords, modifiers, tested pairings, dose caps, formula codes, bench recipe |
| `src/lib/fill-dates.ts` | Fresh-fill schedule (bench sessions, 3pm PT cutoff, closed days) |
| `src/lib/analytics.ts` | Typed event map; pushes to `window.dataLayer` (GTM/GA4), a `fieldnote:track` DOM event, and the console with `?debug=analytics` |
| `src/lib/integrations/` | Provider interfaces + adapters: preview payments/email, Shopify Storefront checkout, flat-rate ground shipping, Zebra ZPL label printing |
| `src/content/posts.ts` | Journal posts |

## Going live

Set these at build time to switch from preview mode to real checkout:

```
NEXT_PUBLIC_COMMERCE=shopify
NEXT_PUBLIC_SHOPIFY_DOMAIN=your-store.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN=public-storefront-token
```

Then map each SKU (`HS-01-50`, `CMP-50`, `DS-06`, …) to its Shopify variant in `src/lib/integrations/shopify.ts`. Personalization, card messages and formula codes ride along as cart line attributes.

## Analytics events

`page_view`, `view_item_list`, `select_item`, `view_item`, `filter_catalog`, `label_preview_edit`, `personalization_complete`, `builder_start`, `builder_step`, `builder_answer`, `builder_result`, `builder_tune`, `builder_complete`, `builder_abandon`, `add_to_cart`, `remove_from_cart`, `view_cart`, `begin_checkout`, `purchase`, `newsletter_signup`. Ecommerce events use GA4's `ecommerce` shape.

## Formula codes

`CMP-A4-M04.M10.M11-W+1-I17` = base accord A4 (Tea Amber) + cardamom, sandalwood, tonka, one step warmer, 17% concentrate. The code is printed on the label and reopens the exact blend at `/build/?code=…`.
