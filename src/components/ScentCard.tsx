"use client";

import Link from "next/link";
import type { Scent } from "@/lib/scents";
import { PRICES, money } from "@/lib/site";
import { track } from "@/lib/analytics";
import { useSaved } from "@/lib/saved";
import { Bottle, grayTint } from "./Bottle";
import { Bookmark } from "./icons";

/** Formats shown as dots under the price: one dot per bottle size, sized to match. */
const SIZES = [{ label: "50 ml", px: 8 }, { label: "100 ml", px: 11 }];
const MAX_DOTS = 5;

/** Shop-grid tile: tall 3:4 image, then name + bookmark, price, size dots. No card chrome. */
export function ScentCard({ scent: s, list }: { scent: Scent; list: string }) {
  const [saved, toggle] = useSaved(s.slug);
  /* Dots read darker than the liquid so they hold up at 8–11 px. */
  const dot = grayTint(s.tint, 0.78);
  const shown = SIZES.slice(0, MAX_DOTS);
  const extra = SIZES.length - shown.length;
  const href = `/scents/${s.slug}/`;
  const select = () => track("select_item", { item_list_id: list, items: [{ item_id: s.code, item_name: s.name, item_category: "house", price: PRICES.house[50] }] });

  return (
    <div>
      <Link href={href} onClick={select} tabIndex={-1} aria-hidden="true" className="relative block aspect-[3/4] overflow-hidden bg-surface">
        <span className="absolute inset-0 grid place-items-center">
          <Bottle title={s.name} no={s.no} tint={s.tint} className="w-[54%] transition-transform duration-700 ease-settle hover:scale-[1.03]" label={s.name} />
        </span>
        {s.isNew && <span className="absolute bottom-3 left-3 bg-white px-2 py-0.5 text-meta text-ink">New</span>}
      </Link>
      <div className="mt-3 flex items-start justify-between gap-2">
        <h3 className="text-title">
          <Link href={href} onClick={select} className="no-underline hover:underline">{s.name}</Link>
        </h3>
        <button
          type="button" onClick={toggle} aria-pressed={saved} aria-label={`Save ${s.name}`}
          className="-mr-2.5 -mt-2.5 grid size-11 flex-none place-items-center"
        >
          <Bookmark className="size-[18px]" filled={saved} />
        </button>
      </div>
      <p className="price text-title">from {money(PRICES.house[50])}</p>
      <p className="mt-3 flex items-center gap-2" aria-label={`Available in ${SIZES.map((z) => z.label).join(" and ")}`}>
        {shown.map((z) => (
          <span key={z.label} title={z.label} className="rounded-full ring-1 ring-ink/20" style={{ width: z.px, height: z.px, background: dot }} />
        ))}
        {extra > 0 && <span className="text-meta">+{extra}</span>}
      </p>
    </div>
  );
}
