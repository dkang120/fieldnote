/**
 * Integration contracts. The storefront only talks to these interfaces; swapping the preview
 * mocks for real providers (Shopify, ShipStation, Klaviyo, a Zebra printer) is a config change.
 */
import type { CartLine } from "../cart-types";

export interface CheckoutContext {
  fillDate: string;    // YYYY-MM-DD the bottles will be mixed
  shipDate: string;    // YYYY-MM-DD they leave the studio
}

export type CheckoutResult =
  | { status: "redirect"; url: string; checkoutId: string }
  | { status: "preview"; orderId: string; message: string };

export interface PaymentProvider {
  readonly id: string;
  createCheckout(lines: CartLine[], ctx: CheckoutContext): Promise<CheckoutResult>;
}

export interface ShippingQuote {
  service: "Ground";
  price: number;
  /** Alcohol-based fragrance ships ground under limited-quantity rules */
  limitedQuantity: boolean;
  etaBusinessDays: [number, number];
  freeShippingRemaining: number;
}

export interface ShippingProvider {
  readonly id: string;
  quote(lines: CartLine[], destinationZip?: string): ShippingQuote;
}

export interface LabelJob {
  lineId: string;
  /** Printer language, e.g. ZPL for Zebra thermal printers */
  format: "zpl";
  payload: string;
  /** Plain-text preview of what prints, for the bench screen and QA */
  preview: string[];
}

export interface LabelPrinter {
  readonly id: string;
  render(line: CartLine, order: { orderId: string; compounded: Date; batch: string }): LabelJob | null;
}

export interface EmailProvider {
  readonly id: string;
  subscribe(email: string, source: string): Promise<{ ok: boolean; message: string }>;
}
