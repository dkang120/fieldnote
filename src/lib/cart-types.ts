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
  /** Unit price. */
  price: number;
  tint: string;
  /** Identical bottles with the same label; missing means 1. */
  qty?: number;
}

export const QTY_MAX = 5;
export const lineQty = (l: { qty?: number }) => l.qty ?? 1;
export const lineTotal = (l: { price: number; qty?: number }) => l.price * lineQty(l);

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
    quantity: lineQty(line),
  };
}

/** Characters the label printer can't print are removed; length is checked separately so nothing is cut off silently. */
export const stripLabelText = (s: string) => s.replace(/[^\p{L}\p{N} .,'&\-]/gu, "").replace(/\s+/g, " ").trimStart();

export const LABEL_LIMIT_MSG = {
  name: `Keep the name to ${20} characters. Initials work, like Avery M.`,
  city: `Keep the city to ${18} characters, such as Los Angeles, CA.`,
  message: `Keep the card message to ${40} characters.`,
} as const;

/** First problem that would stop this label from printing, or null. */
export function labelProblem(p: Personalization): { field: keyof Personalization; message: string } | null {
  if (!p.name.trim()) return { field: "name", message: "Add the name for your label, such as Avery M." };
  if (p.name.trim().length > NAME_MAX) return { field: "name", message: LABEL_LIMIT_MSG.name };
  if (p.city.trim().length > CITY_MAX) return { field: "city", message: LABEL_LIMIT_MSG.city };
  if (p.message.trim().length > MESSAGE_MAX) return { field: "message", message: LABEL_LIMIT_MSG.message };
  return null;
}

/** Strip characters a thermal label can't print and trim to length. */
export function cleanLabelText(s: string, max: number) {
  return s.replace(/[^\p{L}\p{N} .,'&\-]/gu, "").replace(/\s+/g, " ").trimStart().slice(0, max);
}

type DistributiveOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never;
export type NewCartLine = DistributiveOmit<CartLine, "id">;
