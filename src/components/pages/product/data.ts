/* Product page content (Figma: Product (Fig Study) desktop 22:1307, phone 23:1482, tablet 174:2530).
   Only Fig Study is designed; the other house scents reuse the layout with their own data from src/lib/scents.ts
   and hide the sections that rely on Fig Study photography. */
import { SCENTS, type Scent } from "@/lib/scents";
import { PRICES } from "@/lib/site";

const P = "/img/product";

/** Profile lines, as written on the Figma product cards. */
export const PROFILE: Record<string, string> = {
  "library-musk": "Soft Clean Musk",
  "fig-study": "Green Woody Fig",
  "field-vetiver": "Fresh Green Vetiver",
  "late-tea": "Warm Tea Amber",
  "salt-hour": "Salty Mineral Citrus",
  "worn-leather": "Smoky Suede Leather",
};

export interface GalleryImage { src: string; thumb: string; alt: string }

export interface ProductContent {
  scent: Scent;
  /** e.g. "FIG STUDY (No. 02) Eau De Parfum" */
  title: string;
  profile: string;
  story: string;
  /** Main image first; the designed page shows the packshot with a label as the main image and six thumbnails. */
  main: GalleryImage;
  thumbs: GalleryImage[] | null;
  /** Tablet frame stacks these. */
  stacked: { src: string; h: number; alt: string }[];
  size: { 100: string; 50: string };
  /** Projection / longevity meters (1–5), only where the design gives values. */
  meters: { projection: number; longevity: number } | null;
  figStudy: boolean;
}

export const DISCLAIMER = "*Every bottle carries your name, so we can't restock it. If a scent isn't right, we'll remake it once in another house scent.";
export const HELPER = "Printed on your label with the date it's filled. Up to 16 characters each.";
export const LABEL_MAX = 16;

export function contentFor(s: Scent): ProductContent {
  const title = `${s.name.toUpperCase()} (No. ${s.no}) Eau De Parfum`;
  const profile = PROFILE[s.slug] ?? s.family;
  if (s.slug === "fig-study") {
    const alt = (what: string) => `Fig Study eau de parfum, ${what}`;
    const g = (n: number, what: string): GalleryImage => ({ src: `${P}/g${n}.webp`, thumb: `${P}/g${n}-thumb.webp`, alt: alt(what) });
    return {
      scent: s, title, profile, figStudy: true,
      story: "Half fruit, half tree. The milky sweetness of a ripe fig sits on dry cedar, so it never turns sugary. Friendly in a lecture hall, interesting up close. Wear it on warm days, with the windows open.",
      main: { src: `${P}/main.webp`, thumb: `${P}/g4-thumb.webp`, alt: alt("50 ml bottle with an oval label made for Avery M., Los Angeles, CA") },
      thumbs: [
        g(1, "a frosted bottle by a window with a fig leaf, a split fig and a block of cedar"),
        g(2, "scent notes: fig leaf and bergamot, fig milk and violet leaf, cedar and coconut wood"),
        g(3, "the 100 ml bottle"),
        g(4, "the 50 ml bottle"),
        g(5, "close-up of the oval label"),
        g(6, "the 100 ml and 50 ml bottles side by side"),
      ],
      stacked: [
        { src: `${P}/main.webp`, h: 704, alt: alt("50 ml bottle with an oval label made for Avery M., Los Angeles, CA") },
        { src: `${P}/campaign.webp`, h: 889.935, alt: alt("on a stone slab under a fig branch, with a split fig and a small white vase") },
        { src: `${P}/g1.webp`, h: 704, alt: alt("a frosted bottle by a window with a fig leaf, a split fig and a block of cedar") },
      ],
      size: { 100: `${P}/size100.webp`, 50: `${P}/size50.webp` },
      meters: { projection: 2, longevity: 3 },
    };
  }
  const photo = `/img/scents/${s.slug}.webp`;
  const a = `${s.name} eau de parfum, a frosted bottle with an oval Fieldnote label`;
  return {
    scent: s, title, profile, figStudy: false,
    story: s.story,
    main: { src: photo, thumb: photo, alt: a },
    thumbs: null,
    stacked: [{ src: photo, h: 704, alt: a }],
    size: { 100: photo, 50: photo },
    meters: null,
  };
}

/** The four other house scents shown under "Related products" (Fig Study: 01, 03, 04, 05 as designed). */
export function relatedFor(s: Scent): Scent[] {
  return SCENTS.filter((x) => x.slug !== s.slug).slice(0, 4);
}

export const priceFor = (size: 50 | 100) => PRICES.house[size];
export const fmt = (n: number) => `$${n.toFixed(2)}`;
