"use client";

import Link from "next/link";
import type { Scent } from "@/lib/scents";
import { shortNotes } from "@/lib/scents";
import { PRICES, money } from "@/lib/site";
import { track } from "@/lib/analytics";
import { useSaved } from "@/lib/saved";
import { Bottle } from "./Bottle";
import { ArrowRight, Bookmark } from "./icons";

/** Shop-grid tile: tall 3:4 image, then everything needed to choose without hovering:
 *  number + family, name + bookmark, three key notes, a plain-language mood line, price, and an explicit link. */
export function ScentCard({ scent: s, list }: { scent: Scent; list: string }) {
  const [saved, toggle] = useSaved(s.slug);
  const href = `/scents/${s.slug}/`;
  const select = () => track("select_item", { item_list_id: list, items: [{ item_id: s.code, item_name: s.name, item_category: "house", price: PRICES.house[50] }] });

  return (
    <article aria-labelledby={`card-${list}-${s.slug}`}>
      <Link href={href} onClick={select} tabIndex={-1} aria-hidden="true" className="relative block aspect-[3/4] overflow-hidden bg-surface">
        <span className="absolute inset-0 grid place-items-center">
          <Bottle title={s.name} no={s.no} tint={s.tint} className="w-[54%] transition-transform duration-700 ease-settle hover:scale-[1.03]" label={s.name} />
        </span>
        {s.isNew && <span className="absolute bottom-3 left-3 bg-white px-2 py-0.5 text-meta text-ink">New</span>}
      </Link>
      <p className="meta mt-3">No. {s.no} · {s.family}</p>
      <div className="flex items-start justify-between gap-2">
        <h3 id={`card-${list}-${s.slug}`} className="text-title">
          <Link href={href} onClick={select} className="no-underline hover:underline">{s.name}</Link>
        </h3>
        <button
          type="button" onClick={toggle} aria-pressed={saved} aria-label={`Save ${s.name}`}
          className="-mr-2.5 -mt-2.5 grid size-11 flex-none place-items-center"
        >
          <Bookmark className="size-[18px]" filled={saved} />
        </button>
      </div>
      <p className="text-[15px] leading-snug">{shortNotes(s)}</p>
      <p className="mt-1 text-[15px] leading-snug text-muted">{s.mood}</p>
      <p className="price mt-3 text-title">From {money(PRICES.house[50])}</p>
      <Link href={href} onClick={select} className="mt-2 inline-flex min-h-[44px] items-center gap-1.5 text-[15px] underline decoration-1 underline-offset-[5px]">
        Explore scent<span className="sr-only">, {s.name}</span> <ArrowRight className="size-3.5" />
      </Link>
    </article>
  );
}
