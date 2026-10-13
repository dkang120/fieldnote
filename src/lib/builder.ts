/**
 * Custom scent builder: quiz scoring, the accord + modifier library, safe-combination rules,
 * and the formula code that travels with the order to the bench and the label printer.
 *
 * Only pre-tested combinations are allowed: every accord lists the modifiers that were
 * stability- and IFRA-checked with it, and doses are capped per modifier.
 */
import type { Size } from "./site";
import { PRICES } from "./site";

export type AccordId = "A1" | "A2" | "A3" | "A4" | "A5" | "A6";
export type ModifierId =
  | "M01" | "M02" | "M03" | "M04" | "M05" | "M06" | "M07" | "M08" | "M09" | "M10" | "M11" | "M12";

export interface Accord {
  id: AccordId;
  name: string;
  line: string;
  tint: string;
  bg: string;
  /** Modifiers tested with this accord */
  pairs: ModifierId[];
  /** Modifiers suggested when the quiz lands here */
  suggest: [ModifierId, ModifierId];
}

export interface Modifier {
  id: ModifierId;
  name: string;
  feel: "Fresh" | "Spice" | "Floral" | "Wood" | "Sweet";
  /** Max share of the concentrate, percent */
  maxDose: number;
}

export const ACCORDS: Record<AccordId, Accord> = {
  A1: { id: "A1", name: "Clean Musk", line: "Soft, skin-close and clean, like a fresh white shirt.", tint: "#E8DFCF", bg: "#E7E1D5",
        pairs: ["M01", "M05", "M06", "M07", "M08", "M09", "M11"], suggest: ["M08", "M07"] },
  A2: { id: "A2", name: "Green Fig", line: "Milky fig and dry cedar, green and a little sweet.", tint: "#C9D0B4", bg: "#DFE1D2",
        pairs: ["M01", "M02", "M03", "M06", "M07", "M09", "M10"], suggest: ["M01", "M09"] },
  A3: { id: "A3", name: "Citrus Vetiver", line: "Grapefruit over earthy vetiver. Crisp and awake.", tint: "#D7D9C6", bg: "#E2E2D6",
        pairs: ["M01", "M02", "M03", "M04", "M05", "M07", "M09", "M12"], suggest: ["M03", "M02"] },
  A4: { id: "A4", name: "Tea Amber", line: "Smoky black tea melting into warm amber.", tint: "#D9B98F", bg: "#E8DCCB",
        pairs: ["M04", "M05", "M06", "M08", "M10", "M11", "M12"], suggest: ["M04", "M11"] },
  A5: { id: "A5", name: "Salt Wood", line: "Sea salt and driftwood on warm skin.", tint: "#CCD8D8", bg: "#DEE3E1",
        pairs: ["M01", "M02", "M05", "M06", "M07", "M09", "M10"], suggest: ["M06", "M10"] },
  A6: { id: "A6", name: "Soft Suede", line: "Worn suede with saffron and a thread of smoke.", tint: "#C6A288", bg: "#E5D8CD",
        pairs: ["M03", "M04", "M08", "M09", "M10", "M11", "M12"], suggest: ["M12", "M10"] },
};

export const MODIFIERS: Record<ModifierId, Modifier> = {
  M01: { id: "M01", name: "Bergamot", feel: "Fresh", maxDose: 12 },
  M02: { id: "M02", name: "Grapefruit", feel: "Fresh", maxDose: 10 },
  M03: { id: "M03", name: "Pink pepper", feel: "Spice", maxDose: 6 },
  M04: { id: "M04", name: "Cardamom", feel: "Spice", maxDose: 6 },
  M05: { id: "M05", name: "Lavender", feel: "Floral", maxDose: 8 },
  M06: { id: "M06", name: "Neroli", feel: "Floral", maxDose: 8 },
  M07: { id: "M07", name: "Green tea", feel: "Fresh", maxDose: 8 },
  M08: { id: "M08", name: "Iris", feel: "Floral", maxDose: 5 },
  M09: { id: "M09", name: "Cedar", feel: "Wood", maxDose: 10 },
  M10: { id: "M10", name: "Sandalwood", feel: "Wood", maxDose: 10 },
  M11: { id: "M11", name: "Tonka", feel: "Sweet", maxDose: 6 },
  M12: { id: "M12", name: "Birch smoke", feel: "Wood", maxDose: 3 },
};

export const MAX_MODIFIERS = 3;

/* ---------- quiz ---------- */
export interface QuizOption {
  id: string;
  label: string;
  hint?: string;
  /** Color chip shown on smell-pair cards */
  swatch?: string;
  score: Partial<Record<AccordId, number>>;
  warmth?: number;
  intensity?: Intensity;
}
export interface QuizQuestion {
  id: string;
  prompt: string;
  /** "pair" questions render as two big smell cards */
  kind: "choice" | "pair";
  options: QuizOption[];
}

export type Intensity = "soft" | "classic" | "bold";
export const INTENSITY: Record<Intensity, { label: string; percent: number; note: string }> = {
  soft: { label: "Soft", percent: 15, note: "Stays close. Someone has to lean in." },
  classic: { label: "Classic", percent: 17, note: "Noticeable across a table." },
  bold: { label: "Bold", percent: 18, note: "Leaves a trail when you walk past." },
};

export const QUIZ: QuizQuestion[] = [
  {
    id: "mood", kind: "choice", prompt: "How do you want to come across?",
    options: [
      { id: "calm", label: "Calm and clean", score: { A1: 3, A5: 1 }, warmth: 0 },
      { id: "bright", label: "Bright and awake", score: { A3: 3, A2: 1 }, warmth: -1 },
      { id: "warm", label: "Warm and close", score: { A4: 3, A6: 1 }, warmth: 1 },
      { id: "bold", label: "Bold and memorable", score: { A6: 3, A4: 1 }, warmth: 1 },
    ],
  },
  {
    id: "setting", kind: "choice", prompt: "Where will you wear it most?",
    options: [
      { id: "class", label: "Class and work", score: { A1: 2, A3: 1 } },
      { id: "night", label: "Nights out", score: { A6: 2, A4: 1 } },
      { id: "outside", label: "Outdoors and weekends", score: { A5: 2, A2: 1 } },
      { id: "everywhere", label: "Everywhere", score: { A1: 1, A2: 1, A3: 1 } },
    ],
  },
  {
    id: "season", kind: "choice", prompt: "Which season is it for?",
    options: [
      { id: "warm", label: "Spring and summer", score: { A3: 1, A5: 2, A2: 1 }, warmth: -1 },
      { id: "cold", label: "Fall and winter", score: { A4: 2, A6: 1 }, warmth: 1 },
      { id: "all", label: "All year", score: { A1: 1, A2: 1 } },
    ],
  },
  {
    id: "pair1", kind: "pair", prompt: "Pick the smell you like more.",
    options: [
      { id: "lemon", label: "Lemon peel", hint: "Sharp, juicy, a little bitter", swatch: "#E4D98A", score: { A3: 2, A5: 1 } },
      { id: "tea", label: "Black tea", hint: "Smoky, dry, comforting", swatch: "#8C5E3C", score: { A4: 2, A6: 1 } },
    ],
  },
  {
    id: "pair2", kind: "pair", prompt: "And between these two?",
    options: [
      { id: "laundry", label: "Clean laundry", hint: "Soft, powdery, fresh", swatch: "#E8E4DA", score: { A1: 2, A5: 1 } },
      { id: "garden", label: "A fig tree", hint: "Green leaves, ripe fruit", swatch: "#8E9E6A", score: { A2: 3 } },
    ],
  },
  {
    id: "strength", kind: "choice", prompt: "How strong should it be?",
    options: [
      { id: "soft", label: "Close to the skin", score: {}, intensity: "soft" },
      { id: "classic", label: "Noticeable across a table", score: {}, intensity: "classic" },
      { id: "bold", label: "Leaves a trail", score: {}, intensity: "bold" },
    ],
  },
];

export type Answers = Record<string, string>;

export function scoreQuiz(answers: Answers) {
  const totals: Record<AccordId, number> = { A1: 0, A2: 0, A3: 0, A4: 0, A5: 0, A6: 0 };
  let warmth = 0;
  let intensity: Intensity = "classic";
  for (const q of QUIZ) {
    const opt = q.options.find((o) => o.id === answers[q.id]);
    if (!opt) continue;
    for (const [k, v] of Object.entries(opt.score)) totals[k as AccordId] += v ?? 0;
    warmth += opt.warmth ?? 0;
    if (opt.intensity) intensity = opt.intensity;
  }
  // Ties break toward the more versatile accords (A1 → A6 order).
  const ranked = (Object.keys(totals) as AccordId[]).sort((a, b) => totals[b] - totals[a]);
  return { accord: ranked[0], runnerUp: ranked[1], totals, warmth: clamp(warmth, -2, 2), intensity };
}

/* ---------- the formula ---------- */
export interface Formula {
  accord: AccordId;
  modifiers: ModifierId[];
  /** -2 (fresher) … +2 (warmer) */
  warmth: number;
  intensity: Intensity;
}

export function validateFormula(f: Formula): string[] {
  const errors: string[] = [];
  const a = ACCORDS[f.accord];
  if (!a) errors.push("Choose a base.");
  if (f.modifiers.length > MAX_MODIFIERS) errors.push(`Pick up to ${MAX_MODIFIERS} notes.`);
  for (const m of f.modifiers) if (!a?.pairs.includes(m)) errors.push(`${MODIFIERS[m].name} isn't tested with ${a?.name}.`);
  if (new Set(f.modifiers).size !== f.modifiers.length) errors.push("Each note can be added once.");
  if (Math.abs(f.warmth) > 2) errors.push("Warmth must be between -2 and +2.");
  return errors;
}

/** e.g. CMP-A2-M01.M09-W+1-I17 : read by the bench card and the label printer. */
export function formulaCode(f: Formula) {
  const mods = [...f.modifiers].sort().join(".") || "0";
  const w = f.warmth > 0 ? `+${f.warmth}` : `${f.warmth}`;
  return `CMP-${f.accord}-${mods}-W${w}-I${INTENSITY[f.intensity].percent}`;
}

export function parseFormulaCode(code: string): Formula | null {
  // "+" arrives as a space when the code is pasted into a URL unencoded.
  const m = /^CMP-(A[1-6])-([M0-9.]+)-W([+-]?\d)-I(\d{2})$/.exec(code.trim().replace(/ /g, "+").toUpperCase());
  if (!m) return null;
  const intensity = (Object.keys(INTENSITY) as Intensity[]).find((k) => INTENSITY[k].percent === +m[4]);
  if (!intensity) return null;
  const f: Formula = {
    accord: m[1] as AccordId,
    modifiers: m[2] === "0" ? [] : (m[2].split(".") as ModifierId[]),
    warmth: +m[3],
    intensity,
  };
  return validateFormula(f).length ? null : f;
}

/**
 * Bench recipe in grams for one bottle. EDP density ≈ 0.83 g/ml.
 * Modifier share grows with the number picked but never passes each modifier's cap.
 * The warmth dial nudges wood/sweet/spice modifiers up and fresh ones down.
 */
export function benchRecipe(f: Formula, size: Size) {
  const totalG = size * 0.83;
  const concentrateG = (totalG * INTENSITY[f.intensity].percent) / 100;
  const perMod = f.modifiers.length ? Math.min(30 / f.modifiers.length, 12) : 0;
  const mods = f.modifiers.map((id) => {
    const m = MODIFIERS[id];
    const warmSide = m.feel === "Wood" || m.feel === "Sweet" || m.feel === "Spice";
    const nudge = 1 + (warmSide ? f.warmth : -f.warmth) * 0.15;
    const share = Math.min(perMod * nudge, m.maxDose);
    return { id, name: m.name, sharePct: round(share, 1), grams: round((concentrateG * share) / 100, 2) };
  });
  const modShare = mods.reduce((s, m) => s + m.sharePct, 0);
  return {
    accord: { id: f.accord, name: ACCORDS[f.accord].name, sharePct: round(100 - modShare, 1), grams: round((concentrateG * (100 - modShare)) / 100, 2) },
    modifiers: mods,
    alcoholG: round(totalG - concentrateG, 2),
    concentrateG: round(concentrateG, 2),
  };
}

export const customPrice = (size: Size) => PRICES.custom[size];

export const describeWarmth = (w: number) =>
  ({ "-2": "Much fresher", "-1": "A little fresher", "0": "As composed", "1": "A little warmer", "2": "Much warmer" })[String(w)] ?? "As composed";

function clamp(n: number, lo: number, hi: number) { return Math.max(lo, Math.min(hi, n)); }
function round(n: number, d: number) { const p = 10 ** d; return Math.round(n * p) / p; }
