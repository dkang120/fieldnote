"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useReducer, useRef } from "react";
import { motion } from "motion/react";
import { Check } from "./icons";
import {
  ACCORDS, INTENSITY, MAX_MODIFIERS, MODIFIERS, QUIZ,
  benchRecipe, customPrice, describeWarmth, formulaCode, parseFormulaCode, scoreQuiz, validateFormula,
  type AccordId, type Answers, type Formula, type Intensity, type ModifierId,
} from "@/lib/builder";
import { BLEND_MAX, cleanLabelText, labelProblem, type Personalization } from "@/lib/cart-types";
import { PRICES, money, type Size } from "@/lib/site";
import { track } from "@/lib/analytics";
import { useCart } from "@/lib/cart";
import { useFillDates } from "@/lib/use-fill-dates";
import { Bottle } from "./Bottle";
import { LabelFields, emptyPersonalization } from "./LabelFields";
import { readSavedLabel, saveLabel } from "@/lib/personalization";
import { FillDateNote } from "./FillDateNote";

/* ---------- steps ---------- */
type StepKey = `q:${string}` | "result" | "tune" | "label" | "review";
const STEPS: StepKey[] = [...QUIZ.map((q) => `q:${q.id}` as StepKey), "result", "tune", "label", "review"];
const STEP_NAMES: Record<string, string> = { result: "Your base", tune: "Tune it", label: "Your label", review: "Review" };

interface State {
  step: number;
  answers: Answers;
  formula: Formula;
  runnerUp: AccordId;
  personalization: Personalization;
  blendName: string;
  size: Size;
  started: boolean;
  done: boolean;
  nameError: string | null;
}

const INITIAL: State = {
  step: 0, answers: {}, formula: { accord: "A1", modifiers: [], warmth: 0, intensity: "classic" }, runnerUp: "A2",
  personalization: emptyPersonalization, blendName: "", size: 50, started: false, done: false, nameError: null,
};

type Action =
  | { type: "restore"; state: State }
  | { type: "answer"; q: string; a: string }
  | { type: "go"; step: number }
  | { type: "accord"; accord: AccordId }
  | { type: "toggleMod"; mod: ModifierId }
  | { type: "warmth"; value: number }
  | { type: "intensity"; value: Intensity }
  | { type: "personalize"; value: Personalization }
  | { type: "blend"; value: string }
  | { type: "size"; value: Size }
  | { type: "fromCode"; formula: Formula }
  | { type: "nameError"; value: string | null }
  | { type: "personalizeIfEmpty"; value: { name: string; city: string } }
  | { type: "done" }
  | { type: "reset" };

function reducer(s: State, a: Action): State {
  switch (a.type) {
    case "restore": return a.state;
    case "answer": {
      const answers = { ...s.answers, [a.q]: a.a };
      const next = s.step + 1;
      if (STEPS[next] === "result") {
        const r = scoreQuiz(answers);
        const accord = ACCORDS[r.accord];
        return {
          ...s, answers, step: next, started: true, runnerUp: r.runnerUp,
          formula: { accord: r.accord, modifiers: [...accord.suggest], warmth: r.warmth, intensity: r.intensity },
        };
      }
      return { ...s, answers, step: next, started: true };
    }
    case "go": return { ...s, step: Math.max(0, Math.min(STEPS.length - 1, a.step)) };
    case "accord": {
      const acc = ACCORDS[a.accord];
      // Keep only modifiers that were tested with the new base; fall back to its suggestions.
      const kept = s.formula.modifiers.filter((m) => acc.pairs.includes(m));
      return { ...s, formula: { ...s.formula, accord: a.accord, modifiers: kept.length ? kept : [...acc.suggest] } };
    }
    case "toggleMod": {
      const has = s.formula.modifiers.includes(a.mod);
      if (!has && s.formula.modifiers.length >= MAX_MODIFIERS) return s;
      const modifiers = has ? s.formula.modifiers.filter((m) => m !== a.mod) : [...s.formula.modifiers, a.mod];
      return { ...s, formula: { ...s.formula, modifiers } };
    }
    case "warmth": return { ...s, formula: { ...s.formula, warmth: a.value } };
    case "intensity": return { ...s, formula: { ...s.formula, intensity: a.value } };
    case "personalize": return { ...s, personalization: a.value, nameError: a.value.name ? null : s.nameError };
    case "blend": return { ...s, blendName: a.value };
    case "size": return { ...s, size: a.value };
    case "fromCode": return { ...INITIAL, formula: a.formula, step: STEPS.indexOf("label"), started: true };
    case "nameError": return { ...s, nameError: a.value };
    case "personalizeIfEmpty":
      return s.personalization.name || s.personalization.city ? s : { ...s, personalization: { ...s.personalization, ...a.value } };
    case "done": return { ...s, done: true };
    case "reset": return INITIAL;
  }
}

const STORE = "fn-builder-v1";

/* ---------- component ---------- */
export function Builder() {
  const [s, dispatch] = useReducer(reducer, INITIAL);
  const params = useSearchParams();
  const hydrated = useRef(false);
  const dates = useFillDates();
  const { add } = useCart();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const stepKey = STEPS[s.step];
  const latest = useRef(s);
  latest.current = s;

  // Restore from ?code= (reorder) or from this tab's saved progress.
  useEffect(() => {
    const code = params?.get("code");
    const parsed = code ? parseFormulaCode(code) : null;
    if (parsed) dispatch({ type: "fromCode", formula: parsed });
    else {
      try {
        const saved = JSON.parse(sessionStorage.getItem(STORE) || "null");
        if (saved && typeof saved.step === "number" && !saved.done) dispatch({ type: "restore", state: { ...INITIAL, ...saved } });
      } catch { /* storage blocked */ }
    }
    // Carry the name and city typed elsewhere on the site into the label step, unless this blend already has its own.
    const label = readSavedLabel();
    if (label.name || label.city) dispatch({ type: "personalizeIfEmpty", value: label });
    hydrated.current = true;
    track("builder_start", { entry: parsed ? "formula_code" : document.referrer ? new URL(document.referrer).pathname : "direct" });
  }, [params]);

  useEffect(() => {
    if (!hydrated.current) return;
    try { sessionStorage.setItem(STORE, JSON.stringify(s)); } catch { /* storage blocked */ }
  }, [s]);

  // Step analytics + move focus to the new step's heading for keyboard and screen-reader users.
  const firstRender = useRef(true);
  useEffect(() => {
    track("builder_step", { step: stepKey, index: s.step + 1, total: STEPS.length });
    if (stepKey === "result") {
      const f = latest.current.formula;
      track("builder_result", { accord: f.accord, runner_up: latest.current.runnerUp, warmth: f.warmth, intensity: f.intensity });
    }
    if (firstRender.current) { firstRender.current = false; return; }
    headingRef.current?.focus({ preventScroll: false });
  }, [s.step, stepKey]);

  // Abandonment: leaving the page after starting but before adding to the bag.
  useEffect(() => {
    const onHide = () => {
      const c = latest.current;
      if (c.started && !c.done) track("builder_abandon", { last_step: STEPS[c.step], index: c.step + 1 });
    };
    window.addEventListener("pagehide", onHide);
    return () => { onHide(); window.removeEventListener("pagehide", onHide); };
  }, []);

  const accord = ACCORDS[s.formula.accord];
  const code = formulaCode(s.formula);
  const price = customPrice(s.size);
  const blendTitle = s.blendName.trim() || accord.name;
  const errors = validateFormula(s.formula);
  const recipe = useMemo(() => benchRecipe(s.formula, s.size), [s.formula, s.size]);
  const progress = ((s.step + 1) / STEPS.length) * 100;
  const onQuiz = stepKey.startsWith("q:");

  function next() {
    if (stepKey === "tune") track("builder_tune", { accord: s.formula.accord, modifiers: s.formula.modifiers, warmth: s.formula.warmth, intensity: s.formula.intensity });
    const problem = stepKey === "label" ? labelProblem(s.personalization) : null;
    if (problem) {
      if (problem.field === "name" && !s.personalization.name.trim()) dispatch({ type: "nameError", value: problem.message });
      document.getElementById(`build-${problem.field}`)?.focus();
      return;
    }
    dispatch({ type: "go", step: s.step + 1 });
  }

  function addToBag() {
    if (errors.length) return;
    if (labelProblem(s.personalization)) { dispatch({ type: "go", step: STEPS.indexOf("label") }); return; }
    track("personalization_complete", { item_id: code, has_city: !!s.personalization.city, has_message: !!s.personalization.message, city_source: s.personalization.city ? "typed" : "none" });
    track("builder_complete", { formula_code: code, size: s.size, value: price });
    add({
      kind: "custom", sku: `CMP-${s.size}`, title: `${blendTitle} (custom)`, price, size: s.size, tint: accord.tint,
      personalization: { ...s.personalization, name: s.personalization.name.trim(), city: s.personalization.city.trim(), message: s.personalization.message.trim() }, formula: s.formula, formulaCode: code, blendName: blendTitle,
    });
    dispatch({ type: "done" });
  }

  const preview = (
    <div className="grid place-items-center bg-surface transition-colors duration-500">
      <Bottle
        title={blendTitle} no="C" tint={accord.tint} name={s.personalization.name} city={s.personalization.city}
        size={s.size} date={dates?.compounded ?? null} className="w-[44%] py-[8%]"
      />
    </div>
  );

  if (s.done) {
    return (
      <div className="wrap py-16 md:py-24">
        <div className="grid items-center gap-10 md:grid-cols-2">
          {preview}
          <div>
            <h1 className="text-h2">{blendTitle} is in your bag.</h1>
            <p className="lede mt-4">Save this formula code. It's printed on your label too, and it will mix this exact blend again.</p>
            <p className="mt-4 break-all bg-surface px-4 py-3 text-sm">{code}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button className="btn btn-ghost" onClick={() => dispatch({ type: "reset" })}>Build another</button>
              <Link className="btn btn-ghost" href="/scents/">Shop house scents</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="wrap pb-28 pt-6 md:pb-24 md:pt-10">
      {/* progress */}
      <div className="mb-8 flex items-center gap-4">
        <button
          className="min-h-[44px] pr-2 text-[15px] underline underline-offset-4 disabled:invisible" disabled={s.step === 0}
          onClick={() => dispatch({ type: "go", step: s.step - 1 })}
        >
          Back
        </button>
        <div className="h-[3px] flex-1 overflow-hidden bg-line" role="progressbar" aria-valuemin={1} aria-valuemax={STEPS.length} aria-valuenow={s.step + 1} aria-label="Builder progress">
          <span className="block h-full bg-ink transition-[width] duration-500 ease-settle" style={{ width: `${progress}%` }} />
        </div>
        <span className="meta tabular-nums">{s.step + 1} of {STEPS.length}</span>
      </div>

      <div className={`grid items-start gap-8 ${onQuiz ? "" : "md:grid-cols-[1fr_1.1fr] md:gap-16"}`}>
        {!onQuiz && <div className="mx-auto w-full max-w-[220px] md:sticky md:top-[88px] md:max-w-none">{preview}
          <p className="mt-3 hidden break-all text-center text-meta text-muted md:block">{code}</p></div>}

        {/* The builder's one moment: each step arrives from the right, so moving forward feels like turning a page.
            Keyed remount, no exit wait, so focus moves to the new heading immediately. */}
        <motion.div
          key={stepKey} initial={s.step === 0 ? false : { opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.35 }}
          className={`min-w-0 ${onQuiz ? "mx-auto w-full max-w-[720px]" : ""}`}
        >
          {onQuiz && <QuizStep qid={stepKey.slice(2)} selected={s.answers[stepKey.slice(2)]} headingRef={headingRef}
            onPick={(q, a) => { track("builder_answer", { question: q, answer: a }); dispatch({ type: "answer", q, a }); }} />}

          {stepKey === "result" && (
            <section>
              <p className="meta mb-2">{STEP_NAMES.result}</p>
              <h1 ref={headingRef} tabIndex={-1} className="mb-3 text-h2 outline-none">{accord.name}</h1>
              <p className="lede mb-8">{accord.line}</p>
              <p className="mb-3 text-[15px] text-muted">Not quite? Switch the base. Your runner-up was {ACCORDS[s.runnerUp].name}.</p>
              <div className="mb-10 flex flex-wrap gap-2" role="radiogroup" aria-label="Base accord">
                {(Object.keys(ACCORDS) as AccordId[]).map((id) => (
                  <button key={id} role="radio" aria-checked={s.formula.accord === id} className="chip aria-checked:border-ink aria-checked:bg-ink aria-checked:text-on-ink"
                    onClick={() => dispatch({ type: "accord", accord: id })}>
                    {ACCORDS[id].name}
                  </button>
                ))}
              </div>
              <button className="btn" onClick={next}>Tune {accord.name}</button>
            </section>
          )}

          {stepKey === "tune" && (
            <section>
              <p className="meta mb-2">{STEP_NAMES.tune}</p>
              <h1 ref={headingRef} tabIndex={-1} className="mb-3 text-h2 outline-none">Add up to three notes</h1>
              <p className="mb-6 text-muted">These are the notes we've tested with {accord.name}. We picked two to start.</p>
              <div className="mb-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {accord.pairs.map((id) => {
                  const m = MODIFIERS[id];
                  const on = s.formula.modifiers.includes(id);
                  const full = !on && s.formula.modifiers.length >= MAX_MODIFIERS;
                  return (
                    <button key={id} aria-pressed={on} disabled={full} onClick={() => dispatch({ type: "toggleMod", mod: id })}
                      className="flex min-h-[56px] flex-col items-start justify-center border border-line px-3.5 py-2 text-left transition-colors
                                 aria-pressed:border-ink aria-pressed:bg-ink aria-pressed:text-on-ink disabled:opacity-40">
                      <span>{m.name}</span><span className="text-meta opacity-70">{m.feel}</span>
                    </button>
                  );
                })}
              </div>
              <p className="meta mb-8" aria-live="polite">{s.formula.modifiers.length} of {MAX_MODIFIERS} picked</p>

              <label htmlFor="warmth" className="mb-2 flex justify-between text-[15px]"><span>Fresher or warmer</span><span className="text-muted">{describeWarmth(s.formula.warmth)}</span></label>
              <input id="warmth" type="range" min={-2} max={2} step={1} value={s.formula.warmth}
                onChange={(e) => dispatch({ type: "warmth", value: +e.target.value })} className="mb-1 w-full accent-ink" aria-valuetext={describeWarmth(s.formula.warmth)} />
              <div className="meta mb-8 flex justify-between"><span>Fresher</span><span>Warmer</span></div>

              <p className="mb-2 text-[15px]">Strength</p>
              <div className="mb-2 grid grid-cols-3 gap-2" role="radiogroup" aria-label="Strength">
                {(Object.keys(INTENSITY) as Intensity[]).map((k) => (
                  <button key={k} role="radio" aria-checked={s.formula.intensity === k} onClick={() => dispatch({ type: "intensity", value: k })}
                    className="min-h-[52px] border border-line px-2 aria-checked:border-ink aria-checked:shadow-[inset_0_0_0_1px_rgb(var(--ink))]">
                    {INTENSITY[k].label} <span className="block text-meta text-muted">{INTENSITY[k].percent}% concentrate</span>
                  </button>
                ))}
              </div>
              <p className="meta mb-8">{INTENSITY[s.formula.intensity].note}</p>

              <details className="mb-8 border border-line px-4">
                <summary className="cursor-pointer py-3 text-[15px]">Bench recipe for a {s.size} ml bottle</summary>
                <table className="mb-4 w-full text-[13px] tabular-nums">
                  <tbody>
                    <tr className="border-b border-line"><td className="py-1.5">{recipe.accord.name} accord</td><td className="text-right">{recipe.accord.sharePct}%</td><td className="text-right">{recipe.accord.grams} g</td></tr>
                    {recipe.modifiers.map((m) => (
                      <tr key={m.id} className="border-b border-line"><td className="py-1.5">{m.name}</td><td className="text-right">{m.sharePct}%</td><td className="text-right">{m.grams} g</td></tr>
                    ))}
                    <tr className="border-b border-line"><td className="py-1.5">Concentrate total</td><td /><td className="text-right">{recipe.concentrateG} g</td></tr>
                    <tr><td className="py-1.5">Perfumer's alcohol</td><td /><td className="text-right">{recipe.alcoholG} g</td></tr>
                  </tbody>
                </table>
              </details>
              {errors.length > 0 && <p className="mb-4 text-sm text-ink" role="alert">{errors[0]}</p>}
              <button className="btn" onClick={next} disabled={errors.length > 0}>Continue to your label</button>
            </section>
          )}

          {stepKey === "label" && (
            <section>
              <p className="meta mb-2">{STEP_NAMES.label}</p>
              <h1 ref={headingRef} tabIndex={-1} className="mb-6 text-h2 outline-none">Name it and sign it</h1>
              <div className="mb-3.5">
                <label htmlFor="build-blend" className="mb-1.5 flex justify-between text-sm text-muted">
                  Blend name <span className="text-muted">{s.blendName.length}/{BLEND_MAX}</span>
                </label>
                <input id="build-blend" className="input" value={s.blendName} maxLength={BLEND_MAX} placeholder={`e.g. Night Shift (or keep "${accord.name}")`}
                  onChange={(e) => dispatch({ type: "blend", value: cleanLabelText(e.target.value, BLEND_MAX) })} />
              </div>
              <LabelFields value={s.personalization} onChange={(v) => { dispatch({ type: "personalize", value: v }); saveLabel(v); }} surface="builder" nameError={s.nameError} idPrefix="build" />
              <p className="mb-2 mt-6 text-[15px]">Size</p>
              <div className="mb-8 grid grid-cols-2 gap-2.5" role="radiogroup" aria-label="Size">
                {([50, 100] as const).map((z) => (
                  <button key={z} role="radio" aria-checked={s.size === z} onClick={() => dispatch({ type: "size", value: z })}
                    className="flex min-h-[56px] items-center justify-between border border-line px-3.5 aria-checked:border-ink aria-checked:shadow-[inset_0_0_0_1px_rgb(var(--ink))]">
                    <span>{z} ml</span><span className="tabular-nums">{money(PRICES.custom[z])}</span>
                  </button>
                ))}
              </div>
              <button className="btn" onClick={next}>Review</button>
            </section>
          )}

          {stepKey === "review" && (
            <section>
              <p className="meta mb-2">{STEP_NAMES.review}</p>
              <h1 ref={headingRef} tabIndex={-1} className="mb-6 text-h2 outline-none">{blendTitle}</h1>
              <dl className="border-t border-ink">
                {[
                  ["Base", accord.name, "result"],
                  ["Notes", s.formula.modifiers.map((m) => MODIFIERS[m].name).join(", ") || "None", "tune"],
                  ["Warmth", describeWarmth(s.formula.warmth), "tune"],
                  ["Strength", `${INTENSITY[s.formula.intensity].label}, ${INTENSITY[s.formula.intensity].percent}%`, "tune"],
                  ["Label", `${s.personalization.name}${s.personalization.city ? `, ${s.personalization.city}` : ""}`, "label"],
                  ["Card", s.personalization.message || "No message", "label"],
                  ["Size", `${s.size} ml eau de parfum`, "label"],
                ].map(([k, v, target]) => (
                  <div key={k} className="grid grid-cols-[96px_1fr_auto] items-baseline gap-3 border-b border-line py-3">
                    <dt className="text-[15px] text-muted">{k}</dt><dd className="min-w-0 break-words">{v}</dd>
                    <dd><button className="text-sm text-muted underline underline-offset-4" onClick={() => dispatch({ type: "go", step: STEPS.indexOf(target as StepKey) })}>Edit</button></dd>
                  </div>
                ))}
                <div className="grid grid-cols-[96px_1fr] gap-3 border-b border-line py-3">
                  <dt className="text-[15px] text-muted">Formula</dt><dd className="break-all text-sm">{code}</dd>
                </div>
              </dl>
              <FillDateNote className="my-6" />
              <button className="btn w-full" onClick={addToBag} disabled={errors.length > 0}>Add to bag, {money(price)}</button>
            </section>
          )}
        </motion.div>
      </div>
    </div>
  );
}

function QuizStep({ qid, selected, onPick, headingRef }: {
  qid: string; selected?: string; onPick: (q: string, a: string) => void; headingRef: React.RefObject<HTMLHeadingElement>;
}) {
  const q = QUIZ.find((x) => x.id === qid)!;
  return (
    <section>
      <h1 ref={headingRef} tabIndex={-1} className="mb-8 text-h2 outline-none">{q.prompt}</h1>
      {q.kind === "pair" ? (
        <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label={q.prompt}>
          {q.options.map((o) => (
            <button key={o.id} role="radio" aria-checked={selected === o.id} onClick={() => onPick(q.id, o.id)}
              className="relative flex aspect-[4/5] flex-col justify-end bg-surface p-5 text-left transition-colors hover:bg-line/40 aria-checked:bg-ink aria-checked:text-on-ink sm:aspect-[5/4]">
              {o.swatch && <span aria-hidden className="absolute left-5 top-5 size-10 rounded-full border border-ink/15" style={{ background: o.swatch, filter: "grayscale(1)" }} />}
              <span className="text-[22px] leading-tight md:text-[26px]">{o.label}</span>
              {o.hint && <span className="mt-1 text-sm opacity-70">{o.hint}</span>}
            </button>
          ))}
        </div>
      ) : (
        <div className="grid gap-2.5" role="radiogroup" aria-label={q.prompt}>
          {q.options.map((o) => (
            <button key={o.id} role="radio" aria-checked={selected === o.id} onClick={() => onPick(q.id, o.id)}
              className="flex min-h-[60px] items-center justify-between border border-line px-5 text-left text-lg transition-colors hover:border-ink aria-checked:border-ink aria-checked:bg-ink aria-checked:text-on-ink">
              {o.label}{selected === o.id && <Check className="size-5" />}
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
