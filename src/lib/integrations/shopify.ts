import { lineQty } from "../cart-types";
/**
 * Shopify Storefront API adapter (for when the store exists).
 * Each cart line carries its personalization and formula as line attributes, which flow to the
 * order, the bench queue and the label printer. Needs NEXT_PUBLIC_SHOPIFY_DOMAIN,
 * NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN (public token) and a variant ID per SKU in VARIANTS.
 */
import type { CartLine } from "../cart-types";
import type { CheckoutContext, CheckoutResult, PaymentProvider } from "./types";

const API_VERSION = process.env.NEXT_PUBLIC_SHOPIFY_API_VERSION || "2025-07";

/** Map our SKUs to Shopify variant GIDs once products are created in the admin. */
export const VARIANTS: Record<string, string> = {
  // "HS-01-50": "gid://shopify/ProductVariant/1234567890",
};

const CART_CREATE = `mutation cartCreate($input: CartInput!) {
  cartCreate(input: $input) { cart { id checkoutUrl } userErrors { field message } }
}`;

function attributes(line: CartLine, ctx: CheckoutContext) {
  const attrs: { key: string; value: string }[] = [{ key: "_fill_date", value: ctx.fillDate }];
  if (line.kind !== "discovery") {
    attrs.push({ key: "Name on label", value: line.personalization.name });
    if (line.personalization.city) attrs.push({ key: "City on label", value: line.personalization.city });
    if (line.personalization.message) attrs.push({ key: "Card message", value: line.personalization.message });
  }
  if (line.kind === "custom") {
    attrs.push({ key: "_formula", value: line.formulaCode }, { key: "Blend name", value: line.blendName });
  }
  return attrs;
}

export const shopifyPayments: PaymentProvider = {
  id: "shopify",
  async createCheckout(lines, ctx): Promise<CheckoutResult> {
    const domain = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN;
    const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN;
    if (!domain || !token) throw new Error("Shopify isn't configured: set NEXT_PUBLIC_SHOPIFY_DOMAIN and NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN.");
    const missing = lines.filter((l) => !VARIANTS[l.sku]).map((l) => l.sku);
    if (missing.length) throw new Error(`No Shopify variant mapped for: ${missing.join(", ")}`);

    const res = await fetch(`https://${domain}/api/${API_VERSION}/graphql.json`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Shopify-Storefront-Access-Token": token },
      body: JSON.stringify({
        query: CART_CREATE,
        variables: { input: { lines: lines.map((l) => ({ merchandiseId: VARIANTS[l.sku], quantity: lineQty(l), attributes: attributes(l, ctx) })) } },
      }),
    });
    const json = await res.json();
    const out = json?.data?.cartCreate;
    if (!out?.cart || out.userErrors?.length) throw new Error(out?.userErrors?.[0]?.message || "Couldn't start checkout.");
    return { status: "redirect", url: out.cart.checkoutUrl, checkoutId: out.cart.id };
  },
};
