/**
 * Typed analytics. Every event name and its payload is declared once here, so a typo is a
 * compile error and the funnel stays consistent across GA4, Meta, TikTok and Klaviyo.
 *
 * Sinks:
 *  - window.dataLayer (Google Tag Manager → GA4 / Meta CAPI / TikTok). Ecommerce events use GA4's `ecommerce` shape.
 *  - a DOM CustomEvent "fieldnote:track" any other script can listen to (e.g. a Klaviyo bridge).
 *  - console, when NEXT_PUBLIC_ANALYTICS_DEBUG=1 or the URL has ?debug=analytics.
 */

export interface Item {
  item_id: string;
  item_name: string;
  item_category: "house" | "custom" | "discovery";
  item_variant?: string;
  price: number;
  quantity?: number;
}

export interface EventMap {
  page_view: { path: string; title: string };
  view_item_list: { item_list_id: string; items: Item[] };
  select_item: { item_list_id: string; items: [Item] };
  view_item: { currency: "USD"; value: number; items: [Item] };
  filter_catalog: { family: string; sort: string };
  label_preview_edit: { field: "name" | "city" | "message"; surface: "home" | "product" | "builder" };
  personalization_complete: { item_id: string; has_city: boolean; has_message: boolean; city_source: "typed" | "suggested" | "none" };
  builder_start: { entry: string };
  builder_step: { step: string; index: number; total: number };
  builder_answer: { question: string; answer: string };
  builder_result: { accord: string; runner_up: string; warmth: number; intensity: string };
  builder_tune: { accord: string; modifiers: string[]; warmth: number; intensity: string };
  builder_complete: { formula_code: string; size: number; value: number };
  builder_abandon: { last_step: string; index: number };
  add_to_cart: { currency: "USD"; value: number; items: [Item] };
  remove_from_cart: { currency: "USD"; value: number; items: [Item] };
  view_cart: { currency: "USD"; value: number; items: Item[] };
  begin_checkout: { currency: "USD"; value: number; items: Item[]; fill_date: string };
  purchase: { currency: "USD"; value: number; transaction_id: string; shipping: number; items: Item[] };
  newsletter_signup: { source: string };
}

export type EventName = keyof EventMap;

const ECOMMERCE = new Set<EventName>([
  "view_item_list", "select_item", "view_item", "add_to_cart", "remove_from_cart", "view_cart", "begin_checkout", "purchase",
]);

declare global {
  interface Window { dataLayer?: unknown[] }
}

function debugOn() {
  if (process.env.NEXT_PUBLIC_ANALYTICS_DEBUG === "1") return true;
  try { return typeof location !== "undefined" && new URLSearchParams(location.search).get("debug") === "analytics"; } catch { return false; }
}

/** In-memory log so tests and the debug panel can read what fired. */
export const eventLog: { name: EventName; payload: unknown; at: number }[] = [];

export function track<E extends EventName>(name: E, payload: EventMap[E]) {
  if (typeof window === "undefined") return;
  eventLog.push({ name, payload, at: Date.now() });
  if (eventLog.length > 200) eventLog.shift();

  window.dataLayer = window.dataLayer || [];
  if (ECOMMERCE.has(name)) {
    window.dataLayer.push({ ecommerce: null }); // GA4 recommends clearing the previous ecommerce object
    window.dataLayer.push({ event: name, ecommerce: payload });
  } else {
    window.dataLayer.push({ event: name, ...payload });
  }
  window.dispatchEvent(new CustomEvent("fieldnote:track", { detail: { name, payload } }));
  if (debugOn()) console.info("[analytics]", name, payload);
}
