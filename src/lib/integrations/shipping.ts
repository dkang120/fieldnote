import { FREE_SHIP_THRESHOLD } from "../site";
import type { CartLine } from "../cart-types";
import type { ShippingProvider, ShippingQuote } from "./types";

const GROUND = 8;
const SAMPLES_ONLY = 4.5;

/** Flat-rate ground. Replace with ShipStation/Shippo rates once the carrier account exists. */
export const flatRateShipping: ShippingProvider = {
  id: "flat-rate",
  quote(lines: CartLine[]): ShippingQuote {
    const subtotal = lines.reduce((s, l) => s + l.price, 0);
    const hasBottle = lines.some((l) => l.kind !== "discovery");
    const free = subtotal >= FREE_SHIP_THRESHOLD;
    return {
      service: "Ground",
      price: !lines.length || free ? 0 : hasBottle ? GROUND : SAMPLES_ONLY,
      limitedQuantity: hasBottle,
      etaBusinessDays: [2, 5],
      freeShippingRemaining: Math.max(0, FREE_SHIP_THRESHOLD - subtotal),
    };
  },
};
