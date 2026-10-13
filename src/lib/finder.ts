import { SCENTS, type Scent } from "./scents";

/** Lightweight scent finder. Tags are read straight off each scent's published notes and family,
 *  so a recommendation never claims something the product page doesn't say. */
export const FEELS = ["Fresh", "Warm", "Clean", "Grounded", "Distinct"] as const;
export const NOTES = ["Tea", "Fig", "Musk", "Wood", "Citrus", "Leather"] as const;
export type Feel = (typeof FEELS)[number];
export type NoteTag = (typeof NOTES)[number];

const TAGS: Record<string, { feel: Feel[]; notes: NoteTag[] }> = {
  "library-musk": { feel: ["Clean"], notes: ["Musk"] },
  "fig-study": { feel: ["Fresh", "Distinct"], notes: ["Fig", "Wood", "Citrus"] },
  "field-vetiver": { feel: ["Fresh", "Grounded"], notes: ["Wood", "Citrus"] },
  "late-tea": { feel: ["Warm"], notes: ["Tea"] },
  "salt-hour": { feel: ["Fresh", "Clean"], notes: ["Musk", "Wood", "Citrus"] },
  "worn-leather": { feel: ["Warm", "Grounded", "Distinct"], notes: ["Leather", "Wood"] },
};

/** Best match first, then two alternatives. Ties keep catalog order. */
export function recommend(feel: Feel | null, note: NoteTag | null): Scent[] {
  return SCENTS.map((s, i) => {
    const t = TAGS[s.slug];
    const score = (feel && t.feel.includes(feel) ? 2 : 0) + (note && t.notes.includes(note) ? 2 : 0) + (feel && t.feel[0] === feel ? 0.5 : 0);
    // Among equal scores, lean warmer for warm/grounded answers and fresher for fresh/clean ones.
    const lean = feel === "Warm" || feel === "Grounded" ? s.warmth : feel === "Fresh" || feel === "Clean" ? -s.warmth : 0;
    return { s, score, lean, i };
  })
    .sort((a, b) => b.score - a.score || b.lean - a.lean || a.i - b.i)
    .slice(0, 3)
    .map((x) => x.s);
}
