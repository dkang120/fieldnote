# Before launch: what the site needs from Daniel

The storefront avoids claims nobody has confirmed. These are the gaps, and what the site says (or doesn't) until they're filled.

## Product
- **Scent notes and families** — tiles, product pages and the scent finder use the notes and family in `src/lib/scents.ts`. Confirm them; the finder's tags in `src/lib/finder.ts` are read off those notes.
- **Projection / intensity per scent** — not shown anywhere. The finder skips "How present should it be?" until this exists.
- **Ingredient and allergen list** — How it's made says a full list is printed on each box. Needs a page or PDF.
- **Product photos** — tiles and product pages use the bottle illustration. Category band images are placeholders in `public/assets/`.
- **"New" tags** — set `isNew: true` on a scent in `scents.ts` when one launches.

## Policies (the site currently says nothing about these)
- **Returns** — product pages say named bottles can't be restocked but will be remade once in another house scent. Is that the policy? Is there any return on the Discovery Set? (The home trust row no longer mentions returns.)
- **Discovery credit** — Discovery page says: one-time $22 code by email, valid 90 days on any house or custom bottle. Confirm.
- **Shipping** — $8 ground for bottles, $4.50 for samples only, free over $75, 2–5 business days, ground only. Confirm carrier and destinations (US only?).
- **Custom blend returns, editing names after ordering, gift recipient names** — How it's made says names can change until the bottle is mixed. Confirm.
- **Shipping email** — the order-to-desk section does not promise a shipping email or first-in-first-out order handling. Add it once true.
- **Secure checkout** — not claimed. Checkout isn't live (`NEXT_PUBLIC_COMMERCE=shopify` turns it on).

## Pages that don't exist yet
- Privacy policy (newsletter forms should link to it), terms, shipping, returns, accessibility statement.
- Contact/support: the footer shows hello@fieldnote.studio. Confirm it's monitored.
- Social accounts.

## Marketing
- **Campus pop-ups** — dates and locations not set; the form collects emails per campus and says so.
- **Reviews** — product pages show "No reviews yet" until real ones exist. Structured data has no ratings.
- **10% off first bottle** for newsletter sign-ups — mentioned in the footer. Confirm the code exists.
- **Open Graph image** — none yet; social shares show title and description only.
