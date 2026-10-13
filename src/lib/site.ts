export const SITE = {
  name: "Fieldnote",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://dkang120.github.io/fieldnote").replace(/\/$/, ""),
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",
  description:
    "Fieldnote mixes every bottle of cologne after you order and labels it with your name, city and date. Six house scents from $78, or build your own.",
  email: "hello@fieldnote.studio",
};

export const PRICES = {
  house: { 50: 78, 100: 128 },
  custom: { 50: 108, 100: 168 },
  discovery: 22,
} as const;

export type Size = 50 | 100;
export const FREE_SHIP_THRESHOLD = 75;

export const money = (n: number) => `$${n.toFixed(0)}`;

/** Prefix a public asset path with the base path (needed for plain <img>/<a> outside next/link). */
export const asset = (p: string) => `${SITE.basePath}${p}`;
