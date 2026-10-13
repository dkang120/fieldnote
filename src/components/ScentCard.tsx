"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Scent } from "@/lib/scents";
import { shortNotes } from "@/lib/scents";
import { PRICES, money } from "@/lib/site";
import { track } from "@/lib/analytics";
import { Bottle } from "./Bottle";

const SAVED_KEY = "fieldnote:saved";
const readSaved = (): string[] => {
  try { return JSON.parse(localStorage.getItem(SAVED_KEY) || "[]"); } catch { return []; }
};

/** Light tile with the bottle, a save heart, and a notes reveal on hover or focus. */
export function ScentCard({ scent: s, list }: { scent: Scent; list: string }) {
  const [saved, setSaved] = useState(false);
  useEffect(() => setSaved(readSaved().includes(s.slug)), [s.slug]);
  const toggle = () => {
    const next = !saved;
    setSaved(next);
    try {
      const all = readSaved().filter((x) => x !== s.slug);
      localStorage.setItem(SAVED_KEY, JSON.stringify(next ? [...all, s.slug] : all));
    } catch { /* storage unavailable: keep the in-page state */ }
  };

  return (
    <div className="group relative">
      <Link
        href={`/scents/${s.slug}/`}
        className="block no-underline"
        onClick={() => track("select_item", { item_list_id: list, items: [{ item_id: s.code, item_name: s.name, item_category: "house", price: PRICES.house[50] }] })}
      >
        <div className="zoom relative mb-4 grid aspect-[4/5] place-items-center bg-surface">
          <Bottle title={s.name} no={s.no} tint={s.tint} className="w-[46%]" label={s.name} />
          <dl className="absolute inset-x-3 bottom-3 grid grid-cols-[52px_1fr] gap-x-2 gap-y-1 border border-line bg-canvas/95 p-3 text-[13px] opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100 max-md:hidden">
            <dt className="text-muted">Top</dt><dd>{s.notes.top}</dd>
            <dt className="text-muted">Heart</dt><dd>{s.notes.heart}</dd>
            <dt className="text-muted">Base</dt><dd>{s.notes.base}</dd>
          </dl>
        </div>
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="text-[22px] md:text-[26px]">{s.name}</h3>
          <span className="whitespace-nowrap font-mono text-[13px]">from {money(PRICES.house[50])}</span>
        </div>
        <p className="mt-1 text-sm text-muted md:text-[15px]">{shortNotes(s)}</p>
      </Link>
      <button
        type="button" onClick={toggle} aria-pressed={saved} aria-label={`Save ${s.name}`}
        className="absolute right-2 top-2 grid size-10 place-items-center rounded-full text-ink transition-colors hover:bg-canvas"
      >
        <svg viewBox="0 0 24 24" className="size-[18px]" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
          <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" />
        </svg>
      </button>
    </div>
  );
}
