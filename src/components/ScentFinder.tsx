"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { FEELS, NOTES, recommend, type Feel, type NoteTag } from "@/lib/finder";
import { shortNotes } from "@/lib/scents";
import { PRICES, money } from "@/lib/site";
import { ArrowRight } from "./icons";

/** Two quick questions above the grid. Answers narrow the suggestion; the full grid and every description stay visible below. */
export function ScentFinder() {
  const [feel, setFeel] = useState<Feel | null>(null);
  const [note, setNote] = useState<NoteTag | null>(null);
  const id = useId();
  const picks = feel || note ? recommend(feel, note) : null;
  const [best, ...alts] = picks ?? [];

  const group = <T extends string>(label: string, options: readonly T[], value: T | null, set: (v: T | null) => void) => (
    <fieldset>
      <legend className="mb-3 text-base">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button key={o} type="button" className="chip" aria-pressed={value === o} onClick={() => set(value === o ? null : o)}>{o}</button>
        ))}
      </div>
    </fieldset>
  );

  return (
    <section id="find" aria-labelledby={`${id}-h`} className="scroll-mt-24 rounded-[20px] bg-surface p-5 md:p-8">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 id={`${id}-h`} className="text-h3 md:text-[22px]">Find your scent</h2>
        {picks && (
          <button type="button" className="min-h-[44px] text-[15px] underline underline-offset-4" onClick={() => { setFeel(null); setNote(null); }}>
            Start over
          </button>
        )}
      </div>
      <p className="meta mt-1">Two questions. Pick one answer for each, or just one.</p>
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {group("How should it feel?", FEELS, feel, setFeel)}
        {group("What do you gravitate toward?", NOTES, note, setNote)}
      </div>

      <div aria-live="polite" className="mt-8">
        {best && (
          <div className="grid gap-6 border-t border-line pt-6 md:grid-cols-[1.2fr_1fr] md:gap-10">
            <div>
              <p className="meta">Start with</p>
              <p className="mt-1 text-[22px] leading-snug">No. {best.no} · {best.name}</p>
              <p className="mt-1 text-[15px]">{shortNotes(best)}</p>
              <p className="text-[15px] text-muted">{best.mood}</p>
              <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3">
                <Link href={`/scents/${best.slug}/`} className="btn">Explore {best.name}</Link>
                <Link href="/discovery/" className="link-line text-[15px]">Try all six first, {money(PRICES.discovery)}</Link>
              </div>
            </div>
            <div>
              <p className="meta">Also try</p>
              <ul className="mt-1">
                {alts.map((a) => (
                  <li key={a.slug}>
                    <Link href={`/scents/${a.slug}/`} className="flex min-h-[44px] items-center justify-between gap-3 border-b border-line no-underline hover:underline">
                      <span>No. {a.no} · {a.name} <span className="text-muted">— {shortNotes(a)}</span></span>
                      <ArrowRight className="size-3.5 flex-none" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
