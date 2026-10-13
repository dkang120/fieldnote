/** Pick providers by env. Default is preview mode, which is what GitHub Pages runs. */
import { previewEmail, previewPayments } from "./preview";
import { shopifyPayments } from "./shopify";
import { flatRateShipping } from "./shipping";
import { zebraPrinter } from "./label-zpl";

const mode = process.env.NEXT_PUBLIC_COMMERCE === "shopify" ? "shopify" : "preview";

export const integrations = {
  mode,
  payments: mode === "shopify" ? shopifyPayments : previewPayments,
  shipping: flatRateShipping,
  labels: zebraPrinter,
  email: previewEmail,
};

export type { CheckoutResult, ShippingQuote, LabelJob } from "./types";
