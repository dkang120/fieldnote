export type Family = "Clean" | "Fresh" | "Green" | "Warm";

export interface Scent {
  slug: string;
  no: string;
  code: string;
  name: string;
  family: Family;
  /** Liquid tint in the bottle illustration */
  tint: string;
  /** Card / media background */
  bg: string;
  mood: string;
  notes: { top: string; heart: string; base: string };
  wear: string;
  story: string;
  /** Rough order for "freshest → warmest" sorting */
  warmth: number;
  launchedOrder: number;
  /** Shows a "New" tag on the tile. Leave unset at launch: all six are launching together. */
  isNew?: boolean;
}

export const SCENTS: Scent[] = [
  {
    slug: "library-musk", no: "01", code: "HS-01", name: "Library Musk", family: "Clean",
    tint: "#E8DFCF", bg: "#E7E1D5", warmth: 2, launchedOrder: 1,
    mood: "Clean sheets, old paper, a quiet floor at 9am.",
    notes: { top: "Aldehydes, pear skin", heart: "Iris, white tea", base: "Clean musk, cashmeran" },
    wear: "Every day, close to the skin",
    story: "We started with the smell of a reading room before anyone arrives: dust caught in light, a cotton sweater, paper that has been handled. It is the scent you forget you are wearing until someone leans in.",
  },
  {
    slug: "fig-study", no: "02", code: "HS-02", name: "Fig Study", family: "Green",
    tint: "#C9D0B4", bg: "#DFE1D2", warmth: 3, launchedOrder: 2,
    mood: "Green fig leaf, split open in late summer.",
    notes: { top: "Fig leaf, bergamot", heart: "Fig milk, violet leaf", base: "Cedar, coconut wood" },
    wear: "Warm days, open windows",
    story: "Half fruit, half tree. The milky sweetness of a ripe fig sits on dry cedar, so it never turns sugary. Friendly in a lecture hall, interesting up close.",
  },
  {
    slug: "field-vetiver", no: "03", code: "HS-03", name: "Field Vetiver", family: "Fresh",
    tint: "#D7D9C6", bg: "#E2E2D6", warmth: 1, launchedOrder: 3,
    mood: "Cut grass, grapefruit peel, the walk across campus.",
    notes: { top: "Grapefruit, pink pepper", heart: "Clary sage, geranium", base: "Haitian vetiver, oakmoss" },
    wear: "Mornings, interviews, first dates",
    story: "Our crispest scent. Bright citrus up front, then the earthy, slightly smoky root of vetiver. It reads put-together without trying hard.",
  },
  {
    slug: "late-tea", no: "04", code: "HS-04", name: "Late Tea", family: "Warm",
    tint: "#D9B98F", bg: "#E8DCCB", warmth: 5, launchedOrder: 4,
    mood: "Black tea gone cold next to an open notebook.",
    notes: { top: "Black tea, cardamom", heart: "Orange blossom, honey", base: "Amber, tonka bean" },
    wear: "Evenings, cold weather",
    story: "A long night of studying, made comfortable. Smoky tea and cardamom soften into honeyed amber. Warm, never heavy.",
  },
  {
    slug: "salt-hour", no: "05", code: "HS-05", name: "Salt Hour", family: "Fresh",
    tint: "#CCD8D8", bg: "#DEE3E1", warmth: 1, launchedOrder: 5,
    mood: "Skin after the ocean, the hour before sunset.",
    notes: { top: "Sea salt, lemon", heart: "Ambrette, sage", base: "Driftwood, mineral musk" },
    wear: "Weekends, warm nights",
    story: "Not a blue sports cologne. Salt Hour smells like dried salt on warm skin and sun-bleached wood. Easy, and a little sandy.",
  },
  {
    slug: "worn-leather", no: "06", code: "HS-06", name: "Worn Leather", family: "Warm",
    tint: "#C6A288", bg: "#E5D8CD", warmth: 6, launchedOrder: 6,
    mood: "A suede jacket that has been to a lot of concerts.",
    notes: { top: "Saffron, black pepper", heart: "Suede, raspberry leaf", base: "Birch tar, sandalwood" },
    wear: "Nights out, fall and winter",
    story: "Soft suede rather than new leather, with a pinch of saffron and a thread of smoke. Confident without being loud.",
  },
];

export const FAMILIES: Family[] = ["Clean", "Fresh", "Green", "Warm"];

export const getScent = (slug: string) => SCENTS.find((s) => s.slug === slug);

export const shortNotes = (s: Scent) =>
  [s.notes.top, s.notes.heart, s.notes.base].map((n, i) => (i === 0 ? n.split(",")[0] : n.split(",")[0].toLowerCase())).join(", ");
