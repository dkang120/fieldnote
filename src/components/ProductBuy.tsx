"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { motion } from "motion/react";
import { useCart } from "@/lib/cart";
import { track } from "@/lib/analytics";
import { useFillDates } from "@/lib/use-fill-dates";
import { fmtDay } from "@/lib/fill-dates";
import { useSaved } from "@/lib/saved";
import { PRICES, money, type Size } from "@/lib/site";
import type { Scent } from "@/lib/scents";
import { Bottle } from "./Bottle";
import { LabelFields, emptyPersonalization } from "./LabelFields";
import { FillDateNote } from "./FillDateNote";
import { ArrowLeft, Bag, Bookmark, ChevronRight, Share } from "./icons";

const TABS = ["Details", "Notes", "Reviews"] as const;
type Tab = (typeof TABS)[number];

/** Product page: full-bleed bottle with floating pills, then a bottom-sheet panel (mobile) or sticky column (desktop). */
export function ProductBuy({ scent: s }: { scent: Scent }) {
  const [size, setSize] = useState<Size>(50);
  const [resized, setResized] = useState(false);
  const [p, setP] = useState(emptyPersonalization);
  const [nameError, setNameError] = useState<string | null>(null);
  const [open, setOpenRow] = useState<"label" | "ship" | null>(null);
  const [tab, setTab] = useState<Tab>("Details");
  const [shareNote, setShareNote] = useState("");
  const [saved, toggleSaved] = useSaved(s.slug);
  const dates = useFillDates();
  const { add, lines, setOpen } = useCart();
  const price = PRICES.house[size];
  const uid = useId();

  useEffect(() => {
    track("view_item", { currency: "USD", value: PRICES.house[50], items: [{ item_id: s.code, item_name: s.name, item_category: "house", price: PRICES.house[50] }] });
  }, [s]);

  function addToBag() {
    if (!p.name.trim()) {
      setNameError("Add the name for your label.");
      setOpenRow("label");
      requestAnimationFrame(() => document.getElementById("pdp-name")?.focus());
      return;
    }
    setNameError(null);
    track("personalization_complete", { item_id: `${s.code}-${size}`, has_city: !!p.city, has_message: !!p.message, city_source: p.city ? "typed" : "none" });
    add({ kind: "house", sku: `${s.code}-${size}`, slug: s.slug, no: s.no, title: s.name, price, size, tint: s.tint, personalization: { ...p, name: p.name.trim() } });
  }

  async function share() {
    const url = window.location.href;
    try {
      if (navigator.share) { await navigator.share({ title: `${s.name} | Fieldnote`, url }); return; }
      await navigator.clipboard.writeText(url);
      setShareNote("Link copied");
    } catch { /* share sheet dismissed */ }
    setTimeout(() => setShareNote(""), 2400);
  }

  const pill = "grid h-11 w-[72px] place-items-center rounded-full bg-white text-ink shadow-[0_2px_10px_rgba(17,17,17,0.08)]";
  const iconBtn = "grid size-11 place-items-center";
  const row = "flex min-h-[56px] w-full items-center justify-between gap-4 text-left";

  return (
    <div className="md:wrap md:grid md:grid-cols-[1.15fr_1fr] md:items-start md:gap-14 md:pb-24 md:pt-8 lg:gap-20">
      {/* Media */}
      <div className="relative md:sticky md:top-[88px]">
        <div className="grid aspect-[4/5] max-h-[72svh] w-full place-items-center overflow-hidden bg-surface md:max-h-none">
          {/* The page's one moment: switching size re-seats the bottle, so 50 to 100 ml reads as a change, not a redraw. */}
          <motion.div
            key={size} className="grid w-full place-items-center"
            initial={resized ? { opacity: 0.4, y: 10, scale: 0.98 } : false} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.45 }}
          >
            <Bottle title={s.name} no={s.no} tint={s.tint} name={p.name} city={p.city} size={size} date={dates?.compounded ?? null} className="w-[46%] md:w-[52%]" />
          </motion.div>
        </div>
        <Link href="/scents/" aria-label="Back to all scents" className={`${pill} absolute left-4 top-[calc(env(safe-area-inset-top)+16px)] md:hidden`}>
          <ArrowLeft />
        </Link>
        <button type="button" onClick={() => setOpen(true)} aria-label={`Bag, ${lines.length} item${lines.length === 1 ? "" : "s"}`}
          className={`${pill} absolute right-4 top-[calc(env(safe-area-inset-top)+16px)] md:hidden`}>
          <Bag />
        </button>
      </div>

      {/* Panel: a bottom sheet over the image on phones, a plain column on desktop */}
      <div className="relative z-10 -mt-5 rounded-t-[20px] bg-canvas px-4 pb-32 pt-3 md:mt-0 md:rounded-none md:px-0 md:pb-0 md:pt-0">
        <span aria-hidden="true" className="mx-auto mb-6 block h-1 w-10 rounded-full bg-line md:hidden" />
        <nav aria-label="Breadcrumb" className="meta mb-6 hidden md:block">
          <Link href="/scents/" className="no-underline hover:text-ink">House scents</Link> / {s.name}
        </nav>

        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 pt-2">
            <h1 className="text-h3 md:text-[22px] md:leading-snug">{s.name}</h1>
            <p className="mt-1 text-[15px] text-muted">{s.mood}</p>
          </div>
          <div className="-mr-2.5 flex flex-none items-center">
            <button type="button" onClick={share} aria-label={`Share ${s.name}`} className={iconBtn}><Share /></button>
            <button type="button" onClick={toggleSaved} aria-pressed={saved} aria-label={`Save ${s.name}`} className={iconBtn}><Bookmark filled={saved} /></button>
          </div>
        </div>
        <p className="price mt-3 text-title">{money(price)}</p>
        <p className="meta min-h-[1.45em]" aria-live="polite">{shareNote}</p>

        {/* Option row */}
        <div className="mt-10">
          <div className="flex justify-between text-base">
            <span id={`${uid}-size`}>Size</span><span className="text-muted">{size} ml</span>
          </div>
          <div className="mt-4 flex gap-3" role="radiogroup" aria-labelledby={`${uid}-size`}>
            {([50, 100] as const).map((z) => (
              <button
                key={z} type="button" role="radio" aria-checked={size === z} aria-label={`${z} ml, ${money(PRICES.house[z])}`}
                onClick={() => { setSize(z); setResized(true); }}
                className="grid size-12 place-items-center rounded-full bg-surface text-[13px] transition-shadow
                           aria-checked:shadow-[0_0_0_2px_rgb(var(--canvas)),0_0_0_3px_rgb(var(--ink))]"
              >
                {z}
              </button>
            ))}
          </div>
        </div>

        {/* Settings rows */}
        <div className="mt-10">
          <button type="button" className={row} aria-expanded={open === "label"} aria-controls={`${uid}-label`} onClick={() => setOpenRow(open === "label" ? null : "label")}>
            <span>Personalize your label</span>
            <span className="flex min-w-0 items-center gap-2 text-muted">
              <span className="truncate">{p.name.trim() || "Add a name"}</span>
              <ChevronRight className={`size-5 flex-none transition-transform duration-200 ${open === "label" ? "rotate-90" : ""}`} />
            </span>
          </button>
          <div id={`${uid}-label`} hidden={open !== "label"} className="pb-6 pt-2">
            <p className="meta mb-4">The bottle updates as you type.</p>
            <LabelFields value={p} onChange={(v) => { setP(v); if (v.name) setNameError(null); }} surface="product" nameError={nameError} idPrefix="pdp" />
          </div>
          <button type="button" className={row} aria-expanded={open === "ship"} aria-controls={`${uid}-ship`} onClick={() => setOpenRow(open === "ship" ? null : "ship")}>
            <span>Mixed and shipped</span>
            <span className="flex items-center gap-2 text-muted">
              {dates ? `Ships ${fmtDay(dates.ships)}` : "Within 48 hours"}
              <ChevronRight className={`size-5 flex-none transition-transform duration-200 ${open === "ship" ? "rotate-90" : ""}`} />
            </span>
          </button>
          <div id={`${uid}-ship`} hidden={open !== "ship"} className="pb-6 pt-2">
            <FillDateNote />
          </div>
        </div>

        {/* Add to bag: pinned pill on phones, inline under the options on desktop */}
        <div className="fixed inset-x-3 bottom-[calc(env(safe-area-inset-bottom)+12px)] z-30 md:static md:mt-10">
          <button type="button" onClick={addToBag}
            className="flex h-14 w-full items-center justify-between rounded-full bg-ink px-7 text-on-ink shadow-[0_6px_20px_rgba(17,17,17,0.18)] transition-opacity hover:opacity-90">
            <span className="font-medium">Add to bag</span><span className="price">{money(price)}</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="mt-12">
          <div role="tablist" aria-label="Product information" className="grid grid-cols-3 gap-3">
            {TABS.map((t) => (
              <button key={t} type="button" role="tab" id={`${uid}-tab-${t}`} aria-selected={tab === t} aria-controls={`${uid}-panel-${t}`}
                tabIndex={tab === t ? 0 : -1} onClick={() => setTab(t)}
                onKeyDown={(e) => {
                  const i = TABS.indexOf(t);
                  const next = e.key === "ArrowRight" ? TABS[(i + 1) % TABS.length] : e.key === "ArrowLeft" ? TABS[(i + TABS.length - 1) % TABS.length] : null;
                  if (next) { setTab(next); document.getElementById(`${uid}-tab-${next}`)?.focus(); }
                }}
                className="tab justify-start px-5 text-left"
              >
                {t}
              </button>
            ))}
          </div>
          <div role="tabpanel" id={`${uid}-panel-${tab}`} aria-labelledby={`${uid}-tab-${tab}`} className="mt-10 grid gap-6 text-base leading-[1.7]">
            {tab === "Details" && <>
              <p>{s.story}</p>
              <p><span className="text-muted">Wear it:</span> {s.wear}</p>
              <p className="text-muted">Your bottle is mixed at the next bench session after you order: weekdays, with a 3pm Pacific cutoff. The date on your label is the day it was made, not the day it left a warehouse.</p>
              <p className="text-muted">Free ground shipping on orders over $75. Because every bottle carries your name we can&apos;t restock it, but if a scent isn&apos;t right we&apos;ll remake it once in another house scent.</p>
            </>}
            {tab === "Notes" && (
              <dl className="grid grid-cols-[96px_1fr] gap-x-4 gap-y-4">
                {[["Top", s.notes.top], ["Heart", s.notes.heart], ["Base", s.notes.base], ["Formula", s.code]].map(([k, v]) => (
                  <div key={k} className="contents"><dt className="text-muted">{k}</dt><dd>{v}</dd></div>
                ))}
              </dl>
            )}
            {tab === "Reviews" && <p className="text-muted">No reviews yet. Bottles start shipping at launch.</p>}
          </div>
        </div>

      </div>
    </div>
  );
}
