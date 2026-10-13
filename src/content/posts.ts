export interface Post {
  slug: string;
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
  readMinutes: number;
  related: string[]; // scent slugs
  body: { h?: string; p: string }[];
}

export const POSTS: Post[] = [
  {
    slug: "why-we-mix-after-you-order",
    title: "Why we mix your cologne after you order",
    description: "Most fragrance is made months before it's sold. Here's why Fieldnote waits, and what the date on your label means.",
    date: "2026-10-06", readMinutes: 3, related: ["library-musk", "fig-study"],
    body: [
      { p: "A typical bottle of cologne is blended, filled and boxed long before anyone picks it. Then it travels: a warehouse, a distribution center, a store's back room, a shelf under bright lights." },
      { h: "What we do instead", p: "We keep the concentrates and the glass, and nothing else. When you order, your bottle goes into the next bench session. We weigh, blend, fill and label it, and it ships the next weekday." },
      { h: "What the date means", p: "The date on your label is the day your bottle was made. It is not a best-by date and we don't claim it makes the scent last longer on skin. It is a record: this bottle did not exist until you asked for it." },
      { h: "Why it matters to us", p: "It means we never guess at demand, never throw away unsold stock, and can put your name on the bottle. It also means every bottle passes through a person's hands before it reaches yours." },
    ],
  },
  {
    slug: "what-does-vetiver-smell-like",
    title: "What does vetiver smell like?",
    description: "Vetiver is a grass root that smells earthy, smoky and green. A short guide to one of the most useful notes in cologne.",
    date: "2026-09-29", readMinutes: 2, related: ["field-vetiver"],
    body: [
      { p: "Vetiver is a tall grass. The scent comes from its roots, which are dried and distilled into a thick, amber-colored oil." },
      { h: "The smell", p: "Earthy, like soil after rain. Slightly smoky. Green, with a dry, woody finish. Good vetiver smells clean rather than dirty, a bit like a freshly sharpened pencil." },
      { h: "Why it works in cologne", p: "It anchors bright citrus so it doesn't vanish in an hour, and it reads as put-together without being sweet. That's why it shows up in so many classic men's fragrances." },
      { h: "Where to find it", p: "Field Vetiver pairs it with grapefruit and pink pepper. In the builder, the Citrus Vetiver base is the place to start." },
    ],
  },
  {
    slug: "how-to-wear-cologne",
    title: "How to wear cologne without overdoing it",
    description: "Where to spray, how many sprays, and why you shouldn't rub your wrists together. A practical guide for your first signature scent.",
    date: "2026-09-22", readMinutes: 3, related: ["salt-hour", "late-tea"],
    body: [
      { h: "Where", p: "Spray onto skin, not clothes: the neck, the chest, or the inside of the wrists. Warm skin carries scent better than fabric." },
      { h: "How much", p: "Two or three sprays is plenty for a 15 to 18 percent eau de parfum. If you can smell yourself strongly an hour later, use one fewer." },
      { h: "Don't rub", p: "Rubbing your wrists together warms and smears the top notes, so the opening fades faster. Let it dry on its own." },
      { h: "Match the room", p: "Fresher scents for class, interviews and warm days. Warmer scents for evenings and cold weather. If you only own one, a clean musk or a vetiver works almost everywhere." },
    ],
  },
];

export const getPost = (slug: string) => POSTS.find((p) => p.slug === slug);
