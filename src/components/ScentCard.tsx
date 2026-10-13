"use client";

import Link from "next/link";
import type { Scent } from "@/lib/scents";
import { shortNotes } from "@/lib/scents";
import { PRICES, money } from "@/lib/site";
import { track } from "@/lib/analytics";
import { Bottle } from "./Bottle";

/** Card with a notes reveal: notes show under the name, and the full pyramid appears on hover or focus. */
export function ScentCard({ scent: s, list }: { scent: Scent; list: string }) {
  return (
    <Link
      href={`/scents/${s.slug}/`}
      className="group block no-underline"
      onClick={() => track("select_item", { item_list_id: list, items: [{ item_id: s.code, item_name: s.name, item_category: "house", price: PRICES.house[50] }] })}
    >
      <div className="relative mb-4 grid aspect-[4/5] place-items-center overflow-hidden rounded" style={{ background: s.bg }}>
        <Bottle title={s.name} no={s.no} tint={s.tint} className="w-[46%] transition-transform duration-500 ease-settle group-hover:-translate-y-1.5" label={s.name} />
        <dl className="absolute inset-x-3 bottom-3 grid grid-cols-[52px_1fr] gap-x-2 gap-y-1 rounded-sm bg-paper-tag/95 p-3 text-[13px] opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 max-md:hidden">
          <dt className="text-stone">Top</dt><dd>{s.notes.top}</dd>
          <dt className="text-stone">Heart</dt><dd>{s.notes.heart}</dd>
          <dt className="text-stone">Base</dt><dd>{s.notes.base}</dd>
        </dl>
      </div>
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-[22px] md:text-[26px]">{s.name}</h3>
        <span className="whitespace-nowrap text-[15px]">from {money(PRICES.house[50])}</span>
      </div>
      <p className="mt-1 text-sm text-ink-soft md:text-[15px]">{shortNotes(s)}</p>
    </Link>
  );
}
