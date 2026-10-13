import type { Formula } from "./builder";
import type { Size } from "./site";
import type { Item } from "./analytics";

export interface Personalization {
  name: string;
  city: string;
  /** Printed on the card inside the box, not on the bottle. Max 40 characters. */
  message: string;
}

interface LineBase {
  id: string;
  sku: string;
  title: string;
  price: number;
  tint: string;
}

export interface HouseLine extends LineBase {
  kind: "house";
  slug: string;
  no: string;
  size: Size;
  personalization: Personalization;
}

export interface CustomLine extends LineBase {
  kind: "custom";
  size: Size;
  personalization: Personalization;
  formula: Formula;
  formulaCode: string;
  /** What the customer called it; printed as the scent name on the label */
  blendName: string;
}

export interface DiscoveryLine extends LineBase {
  kind: "discovery";
}

export type CartLine = HouseLine | CustomLine | DiscoveryLine;

export const NAME_MAX = 20;
export const CITY_MAX = 18;
export const MESSAGE_MAX = 40;
export const BLEND_MAX = 16;

export function toItem(line: CartLine): Item {
  return {
    item_id: line.sku,
    item_name: line.title,
    item_category: line.kind,
    item_variant: "size" in line ? `${line.size}ml` : undefined,
    price: line.price,
    quantity: 1,
  };
}

/** Strip characters a thermal label can't print and trim to length. */
export function cleanLabelText(s: string, max: number) {
  return s.replace(/[^\p{L}\p{N} .,'&\-]/gu, "").replace(/\s+/g, " ").trimStart().slice(0, max);
}

type DistributiveOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never;
export type NewCartLine = DistributiveOmit<CartLine, "id">;
