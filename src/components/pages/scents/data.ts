/* Product grid content, as written on the Figma product cards (Product grid 92:1457 / 99:2039 / 174:2388). */
import { PRICES } from "@/lib/site";

export type Profile = "Fresh" | "Woody" | "Warm";
export type Season = "Spring" | "Summer" | "Fall" | "Winter";

export interface Card {
  id: string;
  href: string;
  img: string;
  alt: string;
  name: string;
  profileLine: string;
  /** Price text on the card, e.g. "$22.00"; `from` adds "From" in front */
  price: number;
  from: boolean;
  /** Highest price of the item (largest size), used by the price filter */
  maxPrice: number;
  badge?: string;
  /** For the reserve dialog */
  reserveName: string;
  reservePrice: number;
  sizes: (50 | 100)[];
  profiles: Profile[];
  seasons: Season[];
  /** Order in the "date" sorts (launch order) */
  order: number;
  bestSeller?: boolean;
}

const ALL_SEASONS: Season[] = ["Spring", "Summer", "Fall", "Winter"];
const house = (slug: string, upper: string, title: string, no: string, profileLine: string, profiles: Profile[], seasons: Season[], order: number, badge?: string): Card => ({
  id: slug,
  href: `/scents/${slug}/`,
  img: `/img/scents/${slug}.webp`,
  alt: `${title} eau de parfum, a frosted bottle with an oval Fieldnote label`,
  name: `${upper} (No. ${no}) Eau De Parfum`,
  profileLine,
  price: PRICES.house[50],
  from: true,
  maxPrice: PRICES.house[100],
  badge,
  reserveName: title,
  reservePrice: PRICES.house[50],
  sizes: [50, 100],
  profiles,
  seasons,
  order,
  bestSeller: badge === "Best Seller",
});

export const CARDS: Card[] = [
  {
    id: "discovery-set", href: "/discovery/", img: "/img/scents/discovery-set.webp",
    alt: "The Discovery Set: a black box and six small sample vials",
    name: "The Discovery Set", profileLine: "Sample 6, Redeem Full Size",
    price: PRICES.discovery, from: false, maxPrice: PRICES.discovery, badge: "Perfect Gift",
    reserveName: "The Discovery Set", reservePrice: PRICES.discovery,
    sizes: [], profiles: [], seasons: ALL_SEASONS, order: 0,
  },
  {
    id: "build-your-own", href: "/build/", img: "/img/scents/build-your-own.webp",
    alt: "A custom Fieldnote bottle on a workbench next to a notebook and a scale",
    // Figma card copy says "From $109.00" (PRICES.custom[50] is 108); the card text is kept as designed.
    name: "Build Your Own", profileLine: "Six Questions, One Formula",
    price: 109, from: true, maxPrice: PRICES.custom[100], badge: "Custom",
    reserveName: "Build Your Own", reservePrice: PRICES.custom[50],
    sizes: [50, 100], profiles: [], seasons: ALL_SEASONS, order: 7,
  },
  house("library-musk", "LIBRARY MUSK", "Library Musk", "01", "Soft Clean Musk", ["Fresh"], ALL_SEASONS, 1, "New"),
  house("fig-study", "FIG STUDY", "Fig Study", "02", "Green Woody Fig", ["Woody"], ["Spring", "Summer"], 2, "Best Seller"),
  house("field-vetiver", "FIELD VETIVER", "Field Vetiver", "03", "Fresh Green Vetiver", ["Fresh", "Woody"], ["Spring", "Summer"], 3),
  house("late-tea", "LATE TEA", "Late Tea", "04", "Warm Tea Amber", ["Warm"], ["Fall", "Winter"], 4),
  house("salt-hour", "SALT HOUR", "Salt Hour", "05", "Salty Mineral Citrus", ["Fresh"], ["Summer"], 5),
  house("worn-leather", "WORN LEATHER", "Worn Leather", "06", "Smoky Suede Leather", ["Warm", "Woody"], ["Fall", "Winter"], 6),
];

export const PRICE_MAX = PRICES.custom[100];

export const SORTS = [
  "Featured",
  "Most relevant",
  "Best selling",
  "Alphabetically A-Z",
  "Alphabetically Z-A",
  "Price low to high",
  "Price high to low",
  "Date old to new",
  "Date new to old",
] as const;
export type Sort = (typeof SORTS)[number];

export interface Filters {
  avail: { in: boolean; out: boolean };
  min: number;
  max: number;
  sizes: (50 | 100)[];
  profiles: Profile[];
  seasons: Season[];
}

export const EMPTY_FILTERS: Filters = { avail: { in: false, out: false }, min: 0, max: PRICE_MAX, sizes: [], profiles: [], seasons: [] };

export function applyFilters(cards: Card[], f: Filters, sort: Sort): Card[] {
  const sortName = (c: Card) => c.reserveName.toLowerCase();
  let list = cards.filter((c) => {
    // Everything is mixed to order, so nothing is ever out of stock.
    if (f.avail.out && !f.avail.in) return false;
    if (c.maxPrice < f.min || c.price > f.max) return false;
    if (f.sizes.length && !f.sizes.some((s) => c.sizes.includes(s))) return false;
    if (f.profiles.length && !f.profiles.some((p) => c.profiles.includes(p))) return false;
    if (f.seasons.length && !f.seasons.some((s) => c.seasons.includes(s))) return false;
    return true;
  });
  const by = (fn: (a: Card, b: Card) => number) => [...list].sort((a, b) => fn(a, b) || cards.indexOf(a) - cards.indexOf(b));
  switch (sort) {
    case "Best selling": list = by((a, b) => Number(!!b.bestSeller) - Number(!!a.bestSeller)); break;
    case "Alphabetically A-Z": list = by((a, b) => sortName(a).localeCompare(sortName(b))); break;
    case "Alphabetically Z-A": list = by((a, b) => sortName(b).localeCompare(sortName(a))); break;
    case "Price low to high": list = by((a, b) => a.price - b.price); break;
    case "Price high to low": list = by((a, b) => b.price - a.price); break;
    case "Date old to new": list = by((a, b) => a.order - b.order); break;
    case "Date new to old": list = by((a, b) => b.order - a.order); break;
    default: break;
  }
  return list;
}

export const activeCount = (f: Filters) =>
  Number(f.avail.in) + Number(f.avail.out) + Number(f.min > 0 || f.max < PRICE_MAX) + f.sizes.length + f.profiles.length + f.seasons.length;
