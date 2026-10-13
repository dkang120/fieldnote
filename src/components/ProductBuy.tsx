"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart";
import { track } from "@/lib/analytics";
import { useFillDates } from "@/lib/use-fill-dates";
import { PRICES, money, type Size } from "@/lib/site";
import type { Scent } from "@/lib/scents";
import { Bottle } from "./Bottle";
import { LabelFields, emptyPersonalization } from "./LabelFields";
import { FillDateNote } from "./FillDateNote";

export function ProductBuy({ scent: s, children, after }: { scent: Scent; children: React.ReactNode; after?: React.ReactNode }) {
  const [size, setSize] = useState<Size>(50);
  const [p, setP] = useState(emptyPersonalization);
  const [nameError, setNameError] = useState<string | null>(null);
  const dates = useFillDates();
  const { add } = useCart();
  const price = PRICES.house[size];

  useEffect(() => {
    track("view_item", { currency: "USD", value: PRICES.house[50], items: [{ item_id: s.code, item_name: s.name, item_category: "house", price: PRICES.house[50] }] });
  }, [s]);

  function addToBag() {
    if (!p.name.trim()) { setNameError("Add the name for your label."); document.getElementById("pdp-name")?.focus(); return; }
    setNameError(null);
    track("personalization_complete", { item_id: `${s.code}-${size}`, has_city: !!p.city, has_message: !!p.message, city_source: p.city ? "typed" : "none" });
    add({ kind: "house", sku: `${s.code}-${size}`, slug: s.slug, no: s.no, title: s.name, price, size, tint: s.tint, personalization: { ...p, name: p.name.trim() } });
  }

  return (
    <div className="grid items-start gap-8 pb-20 pt-4 md:grid-cols-[1.1fr_1fr] md:gap-16 md:pt-8">
      <div className="grid aspect-square place-items-center rounded bg-surface md:sticky md:top-[88px] md:aspect-[4/5]">
        <Bottle title={s.name} no={s.no} tint={s.tint} name={p.name} city={p.city} size={size} date={dates?.compounded ?? null} className="w-[42%] md:w-[54%]" />
      </div>
      <div className="min-w-0">
        {children}
        <p className="mb-6 text-xl tabular-nums">{money(price)} <span className="meta">Eau de parfum, {size} ml</span></p>

        <div className="mb-6 grid grid-cols-2 gap-2.5" role="group" aria-label="Size">
          {([50, 100] as const).map((z) => (
            <button
              key={z} aria-pressed={size === z} onClick={() => setSize(z)}
              className="flex min-h-[56px] items-center justify-between rounded border border-line px-3.5 text-left aria-pressed:border-ink aria-pressed:shadow-[inset_0_0_0_1px_rgb(var(--ink))]"
            >
              <span>{z} ml</span><span className="tabular-nums">{money(PRICES.house[z])}</span>
            </button>
          ))}
        </div>

        <div className="border-t border-line pt-5">
          <h2 className="mb-1 text-[22px]">Your label</h2>
          <p className="meta mb-4">The bottle updates as you type.</p>
          <LabelFields value={p} onChange={(v) => { setP(v); if (v.name) setNameError(null); }} surface="product" nameError={nameError} idPrefix="pdp" />
        </div>

        <FillDateNote className="my-5" />
        <button className="btn w-full" onClick={addToBag}>Add to bag, {money(price)}</button>
        {after}
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 flex items-center gap-3 border-t border-line bg-canvas px-4 pb-[calc(12px+env(safe-area-inset-bottom))] pt-3 md:hidden">
        <span className="tabular-nums">{money(price)}</span>
        <button className="btn flex-1" onClick={addToBag}>Add to bag</button>
      </div>
    </div>
  );
}
