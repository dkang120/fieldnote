"use client";

/* Filters drawer (Figma 92:1617 desktop, 99:2169 phone) and Sort menu (92:1685). */
import { useEffect, useRef, useState, type ReactNode } from "react";
import { PRICE_MAX, SORTS, type Filters, type Profile, type Season, type Sort } from "./data";

const T12 = "font-sans font-normal leading-[1.4] text-[12px] text-[#2b231f] whitespace-nowrap";

export function Funnel({ className = "" }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden className={className}>
      <path d="M1 2H13L8.5 7.5V12L5.5 10.5V7.5L1 2Z" stroke="#2B231F" />
    </svg>
  );
}

export function ChevronDown({ size, className = "", style }: { size: 12 | 16 | 18; className?: string; style?: React.CSSProperties }) {
  const d = size === 12 ? "M2.5 4.5L6 8L9.5 4.5" : size === 16 ? "M3.5 6L8 10.5L12.5 6" : "M4 7L9 12L14 7";
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none" aria-hidden className={className} style={style}>
      <path d={d} stroke="#2B231F" strokeWidth="1.1" />
    </svg>
  );
}

function Close({ className = "" }: { className?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <path d="M6 6L18 18M18 6L6 18" stroke="#2B231F" strokeWidth="1.2" />
    </svg>
  );
}

/** Closes on Escape and locks page scroll while open. */
export function useOverlay(open: boolean, close: () => void) {
  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", k);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", k); document.body.style.overflow = prev; };
  }, [open, close]);
}

type Variant = "d" | "p";
/* Geometry per variant, from the two drawer frames. */
const V = {
  d: { w: 380, px: 20, sumH: 26, sumLabelY: 3, chevY: 1.5, firstGap: 20, optH: 16, optGap: 11, optFirst: 7, boxY: 1.875, labelY: 0.5, afterSection: 25,
       handlesGap: 7, fieldsGap: 30, fieldW: 160, fieldH: 35, dashX: 167, afterPrice: 25, textY: 10, closeBox: 24, closeX: 336, closeY: 18 },
  p: { w: 390, px: 16, sumH: 44, sumLabelY: 14.5, chevY: 13, firstGap: 12, optH: 44, optGap: 0, optFirst: 0, boxY: 15.875, labelY: 14.5, afterSection: 12,
       handlesGap: 12, fieldsGap: 19, fieldW: 165, fieldH: 44, dashX: 176, afterPrice: 24, textY: 14.5, closeBox: 44, closeX: 330, closeY: 8 },
} as const;

function Section({ v, title, children }: { v: Variant; title: string; children: ReactNode }) {
  const g = V[v];
  const [open, setOpen] = useState(true);
  return (
    <div className="flex flex-col items-start w-full">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className="border-[#d1cdc4] border-b border-solid relative shrink-0 w-full text-left"
        style={{ height: g.sumH }}
      >
        <span className={`absolute left-0 ${T12}`} style={{ top: g.sumLabelY }}>{title}</span>
        <ChevronDown size={18} className={`absolute right-0 transition-transform duration-200 ${open ? "" : "-rotate-90"}`} style={{ top: g.chevY }} />
      </button>
      {open ? <div className="w-full" style={{ marginTop: g.optFirst }}>{children}</div> : null}
    </div>
  );
}

function Option({ v, label, checked, onChange }: { v: Variant; label: string; checked: boolean; onChange: (c: boolean) => void }) {
  const g = V[v];
  return (
    <label className="block relative w-full cursor-pointer group" style={{ height: g.optH, marginBottom: g.optGap }}>
      <input type="checkbox" className="peer sr-only" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span
        aria-hidden
        className={`absolute left-0 size-[12.25px] border border-solid border-[#6b625b] peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-[#9a4f31] ${checked ? "bg-[#2b231f] border-[#2b231f]" : ""}`}
        style={{ top: g.boxY }}
      />
      <span className={`absolute left-[22px] ${T12} group-hover:opacity-60 transition-opacity`} style={{ top: g.labelY }}>{label}</span>
    </label>
  );
}

function PriceRange({ v, f, set }: { v: Variant; f: Filters; set: (f: Filters) => void }) {
  const g = V[v];
  const inner = g.w - g.px * 2; // 340 / 358
  const span = inner - 20; // handle centers travel 320 / 338
  const track = useRef<HTMLDivElement>(null);
  const pos = (val: number) => (val / PRICE_MAX) * span;
  const drag = (which: "min" | "max") => (e: React.PointerEvent<HTMLButtonElement>) => {
    const el = track.current;
    if (!el) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    const move = (ev: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const ratio = Math.min(1, Math.max(0, (ev.clientX - r.left - (10 * r.width) / inner) / ((span * r.width) / inner)));
      const val = Math.round(ratio * PRICE_MAX);
      if (which === "min") set({ ...f, min: Math.min(val, f.max) });
      else set({ ...f, max: Math.max(val, f.min) });
    };
    const up = () => { window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up); };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };
  const key = (which: "min" | "max") => (e: React.KeyboardEvent) => {
    const step = e.key === "ArrowRight" || e.key === "ArrowUp" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowDown" ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    if (which === "min") set({ ...f, min: Math.min(f.max, Math.max(0, f.min + step)) });
    else set({ ...f, max: Math.max(f.min, Math.min(PRICE_MAX, f.max + step)) });
  };
  const field = (which: "min" | "max", left: number) => (
    <label className="absolute border border-solid border-[#2b231f] flex items-start pl-[9px]" style={{ left, top: 20 + g.fieldsGap, width: g.fieldW, height: g.fieldH, paddingTop: g.textY - 1 }}>
      <span className={T12}>$&nbsp;&nbsp;</span>
      <span className="sr-only">{which === "min" ? "Minimum price" : "Maximum price"}</span>
      <input
        inputMode="numeric"
        value={which === "min" ? f.min : f.max}
        onChange={(e) => {
          const n = Math.min(PRICE_MAX, Math.max(0, Number(e.target.value.replace(/\D/g, "")) || 0));
          set(which === "min" ? { ...f, min: Math.min(n, f.max) } : { ...f, max: Math.max(n, f.min) });
        }}
        className={`bg-transparent border-0 p-0 outline-none w-full ${T12}`}
      />
    </label>
  );
  return (
    <div className="relative w-full" style={{ height: 20 + g.fieldsGap + g.fieldH, marginTop: g.handlesGap - g.optFirst }}>
      <div ref={track} className="absolute left-0 top-0 h-[20px] w-full">
        <div className="absolute bg-[#2b231f] h-[2px] top-[9px]" style={{ left: 10 + pos(f.min), width: pos(f.max) - pos(f.min) }} />
        <div className="absolute bg-[#d1cdc4] h-[2px] top-[9px] left-[10px]" style={{ width: pos(f.min) }} />
        <div className="absolute bg-[#d1cdc4] h-[2px] top-[9px]" style={{ left: 10 + pos(f.max), width: span - pos(f.max) }} />
        {(["min", "max"] as const).map((w) => (
          <button
            key={w}
            type="button"
            role="slider"
            aria-label={w === "min" ? "Minimum price" : "Maximum price"}
            aria-valuemin={0}
            aria-valuemax={PRICE_MAX}
            aria-valuenow={f[w]}
            onPointerDown={drag(w)}
            onKeyDown={key(w)}
            className="absolute top-0 size-[20px] bg-[#2b231f] touch-none cursor-grab before:absolute before:-inset-[12px] before:content-['']"
            style={{ left: pos(f[w]) }}
          />
        ))}
      </div>
      {field("min", 0)}
      <span className={`absolute ${T12}`} style={{ left: g.dashX, top: 20 + g.fieldsGap + g.textY }}>-</span>
      {field("max", inner - g.fieldW)}
    </div>
  );
}

export function FilterPanel({ v, f, set, close }: { v: Variant; f: Filters; set: (f: Filters) => void; close: () => void }) {
  const g = V[v];
  const toggle = <K extends "sizes" | "profiles" | "seasons">(k: K, val: Filters[K][number]) => (on: boolean) => {
    const list = f[k] as Filters[K][number][];
    set({ ...f, [k]: on ? [...list, val] : list.filter((x) => x !== val) });
  };
  const gap = (n: number) => <div style={{ height: n }} className="shrink-0" />;
  const after = g.afterSection - g.optGap;
  return (
    <div className="bg-white flex flex-col items-start h-full overflow-y-auto overscroll-contain" style={{ width: g.w }}>
      <div className="border-[#d1cdc4] border-b border-solid h-[60px] relative shrink-0 w-full">
        <h2 className="absolute font-sans font-normal leading-[1.5] text-[14px] text-[#2b231f] top-[21.5px] whitespace-nowrap" style={{ left: g.px }}>FILTERS</h2>
        <button type="button" onClick={close} aria-label="Close filters" className="absolute flex items-center justify-end" style={{ left: g.closeX, top: g.closeY, width: g.closeBox, height: g.closeBox }}>
          <Close />
        </button>
      </div>
      <div className="flex flex-col items-start shrink-0" style={{ paddingLeft: g.px, paddingRight: g.px, paddingTop: g.firstGap, paddingBottom: 36, width: g.w }}>
        <Section v={v} title="Availability">
          <Option v={v} label="In stock" checked={f.avail.in} onChange={(c) => set({ ...f, avail: { ...f.avail, in: c } })} />
          <Option v={v} label="Out of stock" checked={f.avail.out} onChange={(c) => set({ ...f, avail: { ...f.avail, out: c } })} />
        </Section>
        {gap(after)}
        <Section v={v} title="Price">
          <PriceRange v={v} f={f} set={set} />
        </Section>
        {gap(g.afterPrice)}
        <Section v={v} title="Size">
          <Option v={v} label="50ML" checked={f.sizes.includes(50)} onChange={toggle("sizes", 50)} />
          <Option v={v} label="100ML" checked={f.sizes.includes(100)} onChange={toggle("sizes", 100)} />
        </Section>
        {gap(after)}
        <Section v={v} title="Scent Profile">
          {(["Fresh", "Woody", "Warm"] as Profile[]).map((p) => (
            <Option key={p} v={v} label={p} checked={f.profiles.includes(p)} onChange={toggle("profiles", p)} />
          ))}
        </Section>
        {gap(after)}
        <Section v={v} title="Season">
          {(["Spring", "Summer", "Fall", "Winter"] as Season[]).map((s) => (
            <Option key={s} v={v} label={s} checked={f.seasons.includes(s)} onChange={toggle("seasons", s)} />
          ))}
        </Section>
      </div>
    </div>
  );
}

/** The open drawer. `v="d"` is the desktop drawer over the ink underlay; phone is a full-width sheet;
 *  tablet (no frame in Figma) uses the phone panel over the desktop underlay. */
export function FilterDrawer({ layout, f, set, close }: { layout: "d" | "t" | "p"; f: Filters; set: (f: Filters) => void; close: () => void }) {
  const v: Variant = layout === "d" ? "d" : "p";
  return (
    <div role="dialog" aria-modal="true" aria-label="Filters" className="fixed inset-0 z-50">
      {layout !== "p" ? <div className="absolute inset-0 bg-[#2b231f]" onClick={close} /> : null}
      <div className="absolute left-0 top-0 bottom-0">
        <FilterPanel v={v} f={f} set={set} close={close} />
      </div>
    </div>
  );
}

export function SortMenu({ sort, choose, close }: { sort: Sort; choose: (s: Sort) => void; close: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const down = (e: PointerEvent) => { if (ref.current && !ref.current.parentElement?.contains(e.target as Node)) close(); };
    const k = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("pointerdown", down);
    document.addEventListener("keydown", k);
    ref.current?.querySelector<HTMLButtonElement>("[aria-checked=true]")?.focus({ preventScroll: true });
    return () => { document.removeEventListener("pointerdown", down); document.removeEventListener("keydown", k); };
  }, [close]);
  return (
    <div ref={ref} role="menu" aria-label="Sort by" className="absolute right-0 top-full z-40 bg-white border border-[#f7f4f0] border-solid flex flex-col items-start w-[200px]">
      {SORTS.map((s) => (
        <button
          key={s}
          type="button"
          role="menuitemradio"
          aria-checked={s === sort}
          onClick={() => { choose(s); close(); }}
          className={`flex h-[31px] items-center px-[20px] shrink-0 w-full text-left hover:opacity-60 transition-opacity ${T12}`}
        >
          {s}
        </button>
      ))}
    </div>
  );
}

