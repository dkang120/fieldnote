"use client";

/* State for the Build your own page (Figma 171:1914 desktop, 171:2088 phone).
   Both frames render from the same state, so switching width keeps the blend. */
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ACCORDS, MODIFIERS, formulaCode, parseFormulaCode, customPrice,
  type AccordId, type Formula, type ModifierId,
} from "@/lib/builder";
import { CITY_MAX, NAME_MAX, labelProblem, stripLabelText, type Personalization } from "@/lib/cart-types";
import { usePersonalization } from "@/lib/personalization";
import { useCart } from "@/lib/cart";
import { track } from "@/lib/analytics";

export const BASES: AccordId[] = ["A1", "A2", "A3", "A4", "A5", "A6"];

/** Three notes offered on each base. Green Fig's set is the one drawn in Figma. */
const NOTES: Record<AccordId, ModifierId[]> = {
  A1: ["M08", "M07", "M11"],
  A2: ["M01", "M09", "M11"],
  A3: ["M03", "M02", "M09"],
  A4: ["M04", "M11", "M10"],
  A5: ["M06", "M10", "M01"],
  A6: ["M12", "M10", "M11"],
};
const DEFAULT_LEVELS = [60, 40, 25];

export type Strength = "edc" | "edp";
export const STRENGTH: Record<Strength, { label: string; line: string; intensity: Formula["intensity"] }> = {
  edc: { label: "Eau de cologne", line: "Eau de cologne is lighter and fades sooner.", intensity: "soft" },
  edp: { label: "Eau de parfum", line: "Eau de parfum wears longer and closer to the skin.", intensity: "classic" },
};

/** Shown on the label, the summary and the counters until the visitor types their own. */
export const EXAMPLE = { name: "Avery M.", city: "Los Angeles, CA" };
export const SIZE = 50 as const;
export const PRICE_TEXT = "From $109.00";
export const STEPS = ["Base", "Notes", "Strength", "Label"] as const;
export const ROMAN = ["I", "II", "III", "IV"] as const;

export type Note = { id: ModifierId; name: string; level: number };
type Field = "name" | "city";

export function useBuild() {
  const { add } = useCart();
  const [p, setP] = usePersonalization();
  const [base, setBaseState] = useState<AccordId>("A2");
  const [levels, setLevels] = useState<Record<string, number>>({});
  const [strength, setStrengthState] = useState<Strength>("edp");
  const [reached, setReached] = useState(0);
  const [error, setError] = useState<{ field: Field; message: string } | null>(null);

  // /build/?code=CMP-… reopens a saved blend.
  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("code");
    const f = code ? parseFormulaCode(code) : null;
    track("builder_start", { entry: f ? "formula_code" : document.referrer ? new URL(document.referrer).pathname : "direct" });
    if (!f) return;
    setBaseState(f.accord);
    setStrengthState(f.intensity === "soft" ? "edc" : "edp");
    const ids = NOTES[f.accord];
    setLevels(Object.fromEntries(ids.map((id, i) => [`${f.accord}:${id}`, f.modifiers.includes(id) ? DEFAULT_LEVELS[i] : 0])));
  }, []);

  const reach = useCallback((i: number) => setReached((r) => Math.max(r, i)), []);

  const notes: Note[] = useMemo(
    () => NOTES[base].map((id, i) => ({ id, name: MODIFIERS[id].name, level: levels[`${base}:${id}`] ?? DEFAULT_LEVELS[i] })),
    [base, levels],
  );

  const setBase = useCallback((a: AccordId) => { setBaseState(a); reach(0); }, [reach]);
  const setLevel = useCallback((id: ModifierId, v: number) => { setLevels((l) => ({ ...l, [`${base}:${id}`]: v })); reach(1); }, [base, reach]);
  const setStrength = useCallback((s: Strength) => { setStrengthState(s); reach(2); }, [reach]);
  const setField = useCallback((field: Field, raw: string) => {
    const v = stripLabelText(raw).slice(0, field === "name" ? NAME_MAX : CITY_MAX);
    setP({ ...p, [field]: v } as Personalization);
    setError(null);
    reach(3);
  }, [p, setP, reach]);

  const formula: Formula = useMemo(() => {
    const accord = ACCORDS[base];
    const on = notes.filter((n) => n.level > 0);
    // Only notes tested with this base go into the bench formula.
    const modifiers = on.map((n) => n.id).filter((id) => accord.pairs.includes(id));
    let fresh = 0, warm = 0;
    for (const n of on) (MODIFIERS[n.id].feel === "Fresh" || MODIFIERS[n.id].feel === "Floral" ? (fresh += n.level) : (warm += n.level));
    const d = warm - fresh;
    const warmth = d === 0 ? 0 : d > 0 ? (d >= 60 ? 2 : 1) : d <= -60 ? -2 : -1;
    return { accord: base, modifiers, warmth, intensity: STRENGTH[strength].intensity };
  }, [base, notes, strength]);
  const code = formulaCode(formula);

  const name = p.name.trim() || EXAMPLE.name;
  const city = p.city.trim() || EXAMPLE.city;
  const baseName = ACCORDS[base].name;
  const on = notes.filter((n) => n.level > 0).map((n) => n.name.toLowerCase());
  const list = on.length > 1 ? `${on.slice(0, -1).join(", ")} and ${on[on.length - 1]}` : on[0];
  const summary = `${baseName}${list ? `, with ${list}.` : ", on its own."} ${STRENGTH[strength].label}, labelled for ${name}, ${city.split(",")[0].trim()}.`;

  const reserve = useCallback(() => {
    const per: Personalization = { name: p.name.trim(), city: p.city.trim(), message: "" };
    const problem = labelProblem(per);
    if (problem) {
      const field = problem.field === "city" ? "city" : "name";
      setError({ field, message: problem.message });
      reach(3);
      // Both frames are in the DOM; focus the field in the one on screen.
      Array.from(document.querySelectorAll<HTMLInputElement>(`input[data-field="${field}"]`)).find((i) => i.offsetParent !== null)?.focus();
      return;
    }
    const price = customPrice(SIZE);
    track("personalization_complete", { item_id: code, has_city: !!per.city, has_message: false, city_source: per.city ? "typed" : "none" });
    track("builder_complete", { formula_code: code, size: SIZE, value: price });
    add({
      kind: "custom", sku: `CMP-${SIZE}`, title: `${baseName} (custom)`, price, size: SIZE, tint: ACCORDS[base].tint,
      personalization: per, formula, formulaCode: code, blendName: baseName,
    });
  }, [p, code, add, base, baseName, formula, reach]);

  return {
    base, setBase, notes, setLevel, strength, setStrength, reached, reach,
    p, setField, error, name, city, baseName, summary, code, reserve,
    strengthLine: `${STRENGTH[strength].label.toUpperCase()} · ${SIZE} ML`,
  };
}

export type BuildState = ReturnType<typeof useBuild>;
