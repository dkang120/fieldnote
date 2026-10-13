"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { FAMILIES, SCENTS, type Family } from "@/lib/scents";
import { PRICES } from "@/lib/site";
import { track } from "@/lib/analytics";
import { ScentCard } from "./ScentCard";

const SORTS = {
  featured: { label: "Featured", fn: (a: (typeof SCENTS)[0], b: (typeof SCENTS)[0]) => a.launchedOrder - b.launchedOrder },
  fresh: { label: "Freshest first", fn: (a: (typeof SCENTS)[0], b: (typeof SCENTS)[0]) => a.warmth - b.warmth },
  warm: { label: "Warmest first", fn: (a: (typeof SCENTS)[0], b: (typeof SCENTS)[0]) => b.warmth - a.warmth },
  az: { label: "A to Z", fn: (a: (typeof SCENTS)[0], b: (typeof SCENTS)[0]) => a.name.localeCompare(b.name) },
} as const;
type SortKey = keyof typeof SORTS;

export function Catalog() {
  const [family, setFamily] = useState<Family | "All">("All");
  const [sort, setSort] = useState<SortKey>("featured");
  const shown = useMemo(() => SCENTS.filter((s) => family === "All" || s.family === family).sort(SORTS[sort].fn), [family, sort]);

  useEffect(() => {
    track("view_item_list", {
      item_list_id: "catalog",
      items: SCENTS.map((s) => ({ item_id: s.code, item_name: s.name, item_category: "house" as const, price: PRICES.house[50] })),
    });
  }, []);

  const changeFamily = (f: Family | "All") => { setFamily(f); track("filter_catalog", { family: f, sort }); };
  const changeSort = (s: SortKey) => { setSort(s); track("filter_catalog", { family, sort: s }); };

  return (
    <>
      <div className="mb-9 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by family">
          {(["All", ...FAMILIES] as const).map((f) => (
            <button key={f} className="chip" aria-pressed={family === f} onClick={() => changeFamily(f)}>{f}</button>
          ))}
        </div>
        <label className="flex items-center gap-2 text-[15px] text-muted">
          Sort
          <select className="input min-h-[44px] w-auto rounded-full px-5 py-0 pr-8" value={sort} onChange={(e) => changeSort(e.target.value as SortKey)}>
            {(Object.keys(SORTS) as SortKey[]).map((k) => <option key={k} value={k}>{SORTS[k].label}</option>)}
          </select>
        </label>
      </div>
      <p className="meta mb-5" aria-live="polite">{shown.length} {shown.length === 1 ? "scent" : "scents"}</p>
      <div className="grid grid-cols-2 gap-x-4 gap-y-16 md:grid-cols-3">
        {/* The page's one moment: filtering and sorting slide cards to their new places instead of jumping. */}
        <AnimatePresence mode="popLayout" initial={false}>
          {shown.map((s) => (
            <motion.div
              key={s.slug} layout
              initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.18 } }}
              transition={{ duration: 0.45 }}
            >
              <ScentCard scent={s} list="catalog" />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </>
  );
}
