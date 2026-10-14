"use client";
/* eslint-disable @next/next/no-img-element */

/* Pieces shared by the three product frames. */
import Link from "next/link";
import { asset, type Size } from "@/lib/site";
import { useCart } from "@/lib/cart";
import { PRICES } from "@/lib/site";
import { Bag, Check } from "@/components/icons";
import { QTY_MAX } from "@/lib/cart-types";
import type { ProductState, Tab } from "./useProduct";

export const T12 = "font-sans font-normal leading-[17px] text-[12px] text-[#2b231f]";
export const T14 = "font-sans font-normal leading-[1.5] text-[14px] text-[#2b231f]";

export function Chevron({ size, dir = "right", className = "" }: { size: number; dir?: "right" | "left" | "down"; className?: string }) {
  const rot = dir === "left" ? "rotate-180" : dir === "down" ? "rotate-90" : "";
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="#2b231f" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" aria-hidden
      className={`shrink-0 ${rot} ${className}`} style={{ width: size, height: size }}>
      <path d="m9 5.5 6.5 6.5L9 18.5" />
    </svg>
  );
}

export function Callout({ ships, className, textClass }: { ships: string | null; className: string; textClass: string }) {
  return (
    <div className={`bg-[#f7f4f0] flex relative shrink-0 ${className}`}>
      <Check className="relative shrink-0 size-[14px] text-[#d1cdc4]" />
      <p className={`${T12} ${textClass}`}>Filled to Order: Mixed within 48 hours{ships ? ` | Ships ${ships}` : ""}</p>
    </div>
  );
}

export function SizeTiles({ p, idp }: { p: ProductState; idp: string }) {
  const tiles: Size[] = [100, 50];
  return (
    <fieldset className="flex gap-[18px] items-start relative shrink-0">
      <legend className="sr-only">Size</legend>
      {tiles.map((z) => {
        const on = p.size === z;
        return (
          <label key={z} className={`border border-[#2b231f] border-solid flex flex-col h-[117px] items-center justify-between p-[10px] relative shrink-0 w-[82px] cursor-pointer ${on ? "bg-[#2b231f]" : "bg-white"}`}>
            <input type="radio" name={`size-${idp}`} value={z} checked={on} onChange={() => p.setSize(z)} className="sr-only peer" aria-label={`${z} ml, $${PRICES.house[z]}`} />
            <img alt="" src={asset(p.c.size[z])} className="h-[72px] w-[62px] object-cover relative shrink-0" />
            <span className={`${T12} whitespace-nowrap ${on ? "!text-white" : ""}`}>{z}ML</span>
            <span className="pointer-events-none absolute -inset-[3px] peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-[#9a4f31]" />
          </label>
        );
      })}
    </fieldset>
  );
}

export function QtySelect({ p, className, id }: { p: ProductState; className: string; id: string }) {
  return (
    <div className={`bg-white border border-[#d1cdc4] border-solid relative shrink-0 w-[105px] ${className}`}>
      <label htmlFor={id} className="sr-only">Quantity</label>
      <select id={id} value={p.qty} onChange={(e) => p.setQty(Number(e.target.value))}
        className={`${T14} appearance-none bg-transparent absolute inset-0 size-full pl-[15px] pr-[14px] outline-none cursor-pointer focus-visible:outline-2 focus-visible:outline-[#9a4f31]`}>
        {Array.from({ length: QTY_MAX }, (_, i) => i + 1).map((q) => <option key={q} value={q}>{q}</option>)}
      </select>
      <Chevron size={12} dir="down" className="absolute pointer-events-none" />
    </div>
  );
}

const TABS: [Tab, string][] = [["description", "Description"], ["notes", "Notes"], ["ingredients", "Ingredients"]];

/** Desktop / tablet tabs (12px sentence case, 34px gap, 1px underline 4px below). Phone passes `upper`. */
export function Tabs({ p, idp, upper = false }: { p: ProductState; idp: string; upper?: boolean }) {
  return (
    <div role="tablist" aria-label="Product details" className={upper ? "contents" : "flex gap-[34px] items-start relative shrink-0"}>
      {TABS.map(([t, label], i) => {
        const on = p.tab === t;
        return (
          <button key={t} type="button" role="tab" id={`tab-${idp}-${t}`} aria-selected={on} aria-controls={`panel-${idp}`} onClick={() => p.setTab(t)}
            className={upper ? `absolute top-0 ${T12} whitespace-nowrap ${["left-[16px]", "left-[130px]", "left-[203px]"][i]}` : "flex flex-col gap-[4px] items-start relative shrink-0"}>
            {upper ? (
              <>
                {label.toUpperCase()}
                {on ? <span className="absolute left-0 top-[18px] h-px bg-[#2b231f]" style={{ width: "calc(100% + 8px)" }} /> : null}
              </>
            ) : (
              <>
                <span className={`${T12} whitespace-nowrap`}>{label}</span>
                {on ? <span className="bg-[#2b231f] h-px w-full" /> : null}
              </>
            )}
          </button>
        );
      })}
    </div>
  );
}

/** Notes / ingredients panels: same type as the description copy. */
export function OtherPanel({ p, width }: { p: ProductState; width: number }) {
  const s = p.c.scent;
  if (p.tab === "notes") {
    return (
      <div className="flex flex-col gap-[8px] items-start" style={{ width }}>
        {([["Top", s.notes.top], ["Heart", s.notes.heart], ["Base", s.notes.base]] as const).map(([k, v]) => (
          <p key={k} className={T14}><span className="text-[#6b625b]">{k}: </span>{v}</p>
        ))}
        <p className={T14}><span className="text-[#6b625b]">Wear it: </span>{s.wear}</p>
      </div>
    );
  }
  return (
    <p className={T14} style={{ width }}>
      The full ingredient and allergen list is printed on each box. Every bottle is eau de parfum, mixed by hand after you order.
    </p>
  );
}

export function Meter({ label, value, ends, barW, segW, width, gapClass }: { label: string; value: number; ends: [string, string, string]; barW?: number; segW: number; width: number; gapClass?: string }) {
  return (
    <div className="flex flex-col gap-[10px] items-start relative shrink-0" style={{ width }}>
      <p className={`${T14} whitespace-nowrap`}>{label}</p>
      <div className={`flex items-start relative shrink-0 ${gapClass ?? "gap-[4px]"}`} style={barW ? { width: barW } : undefined} role="img" aria-label={`${label}: ${value} of 5`}>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className={`h-[3px] rounded-[3px] shrink-0 ${i === value ? "bg-[#2b231f]" : "bg-[#d1cdc4]"}`} style={{ width: segW }} />
        ))}
      </div>
      <div className={`flex items-start relative shrink-0 w-full ${T12}`}>
        <p className="flex-[1_0_0] min-w-px">{ends[0]}</p>
        <p className="flex-[1_0_0] min-w-px text-center">{ends[1]}</p>
        <p className="flex-[1_0_0] min-w-px text-right">{ends[2]}</p>
      </div>
    </div>
  );
}

export function Upsell({ width, textW, bagX, wrap = false }: { width: number; textW: number; bagX: number; wrap?: boolean }) {
  const { add } = useCart();
  return (
    <div className="bg-white h-[120px] relative shrink-0" style={{ width }}>
      <Link href="/discovery/" className="absolute left-0 top-0 size-[120px]" aria-label="Discovery Set">
        <img alt="" src={asset("/img/product/discovery.webp")} className="size-full object-cover" />
      </Link>
      <div className={`absolute flex flex-col gap-[6px] items-start left-[144px] top-0 ${wrap ? "" : "whitespace-nowrap"}`} style={{ width: textW }}>
        <p className={T14}>Discovery Set (6 × 2ml)</p>
        <p className={`${T12} !text-[#6b625b] w-full`}>All six house scents · $22 credited to your first full bottle</p>
        <p className={T12}>$22.00</p>
      </div>
      <button type="button" aria-label="Add Discovery Set to bag" className="absolute size-[32px] top-[88px] flex items-center justify-center before:absolute before:-inset-[6px]"
        style={{ left: bagX }}
        onClick={() => add({ kind: "discovery", sku: "DS-06", title: "Discovery Set", price: PRICES.discovery, tint: "#D9D9D9" })}>
        <Bag className="size-[16px] text-[#2b231f]" />
      </button>
    </div>
  );
}

export function Gap({ h }: { h: number }) {
  return <div className="shrink-0 w-[10px]" style={{ height: h }} />;
}

export function Divider({ w }: { w: number }) {
  return <div className="bg-[#d1cdc4] h-px shrink-0" style={{ width: w }} />;
}
