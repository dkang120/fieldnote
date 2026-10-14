"use client";

/* Discovery Set page (Figma 24:1550 desktop, 24:1688 phone, 60:1882 sticky bar): data and shared pieces. */
import { useCallback, useEffect, useRef, useState, type RefObject, type TouchEvent } from "react";
import { useCart } from "@/lib/cart";
import { track } from "@/lib/analytics";
import { QTY_MAX } from "@/lib/cart-types";
import { PRICES, asset } from "@/lib/site";
import { ChevronRight } from "@/components/icons";

export const TITLE = "The Discovery Set + $22 Credit";
const ITEM = { item_id: "DS-06", item_name: "Discovery Set", item_category: "discovery" as const, price: PRICES.discovery };

/** Adds the Discovery Set (DiscoveryLine, $22) to the bag. Same action for the main button, sticky bar and phone cart bar. */
export function useReserveDiscovery() {
  const { add } = useCart();
  useEffect(() => { track("view_item", { currency: "USD", value: PRICES.discovery, items: [ITEM] }); }, []);
  return useCallback(
    (qty = 1) => add({ kind: "discovery", sku: "DS-06", title: "Discovery Set", price: PRICES.discovery, tint: "#D9D9D9", qty: Math.max(1, Math.min(QTY_MAX, qty)) }),
    [add],
  );
}

/* ---------- gallery ---------- */
type Crop = { l: number; t: number; s: number } | null;
export const GALLERY: { src: string; crop: Crop; alt: string }[] = [
  { src: "/img/discovery/gal-b.webp", crop: null, alt: "Discovery Set box open, six vials inside" },
  { src: "/img/discovery/gal-a.webp", crop: null, alt: "Discovery Set box next to a full bottle" },
  { src: "/img/discovery/gal-a.webp", crop: { l: -45, t: -75, s: 250 }, alt: "Discovery Set lid detail" },
  { src: "/img/discovery/gal-a.webp", crop: { l: -16.67, t: -33.33, s: 166.67 }, alt: "Discovery Set box, closed, from the front" },
  { src: "/img/discovery/gal-b.webp", crop: { l: -36.36, t: -45.45, s: 181.82 }, alt: "Open Discovery Set from above" },
  { src: "/img/discovery/gal-a.webp", crop: { l: -15, t: -12.5, s: 125 }, alt: "Discovery Set box at an angle" },
];
export const GALLERY_START = 1;

/** One gallery picture in a square box; the crop is in % of the box, as in the Figma thumbnails. */
export function GalleryPic({ i, className, eager = false, alt = true }: { i: number; className: string; eager?: boolean; alt?: boolean }) {
  const g = GALLERY[i];
  const img = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt={alt ? g.alt : ""}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      src={asset(g.src)}
      className={g.crop ? "absolute max-w-none" : "absolute inset-0 max-w-none object-cover size-full"}
      style={g.crop ? { left: `${g.crop.l}%`, top: `${g.crop.t}%`, width: `${g.crop.s}%`, height: `${g.crop.s}%` } : undefined}
    />
  );
  return <div className={`overflow-hidden ${className}`}>{img}</div>;
}

/** Thumbnail strip: 75px squares, 10px apart, 2px ink underline 7px below the active one. */
export function Thumbs({ active, onPick }: { active: number; onPick: (i: number) => void }) {
  return (
    <div className="flex gap-[10px] items-start">
      {GALLERY.map((g, i) => (
        <button key={i} type="button" onClick={() => onPick(i)} aria-label={`Show image ${i + 1}: ${g.alt}`} aria-current={i === active}
          className="flex flex-col gap-[7px] items-start relative shrink-0">
          <GalleryPic i={i} alt={false} className="relative shrink-0 size-[75px]" />
          <span className={`block h-[2px] w-[75px] ${i === active ? "bg-[#2b231f]" : ""}`} />
        </button>
      ))}
    </div>
  );
}

/** Horizontal swipe on touch screens. */
export function useSwipe(onPrev: () => void, onNext: () => void) {
  const x = useRef<number | null>(null);
  return {
    onTouchStart: (e: TouchEvent) => { x.current = e.touches[0].clientX; },
    onTouchEnd: (e: TouchEvent) => {
      if (x.current == null) return;
      const dx = e.changedTouches[0].clientX - x.current;
      x.current = null;
      if (Math.abs(dx) > 40) (dx < 0 ? onNext : onPrev)();
    },
  };
}

export function useCycle(n: number, start = 0) {
  const [i, setI] = useState(start);
  const prev = useCallback(() => setI((v) => (v + n - 1) % n), [n]);
  const next = useCallback(() => setI((v) => (v + 1) % n), [n]);
  return { i, setI, prev, next };
}

/* ---------- option swatch: six vials (Figma Vial 23:1604) ---------- */
export function VialsSwatch() {
  return (
    <div className="bg-white overflow-clip relative shrink-0 size-[60px]" aria-hidden>
      {[3, 12.4, 21.8, 31.2, 40.6, 50].map((l) => (
        <div key={l} className="absolute h-[45px] top-[7.5px] w-[12px]" style={{ left: l }}>
          <div className="absolute bg-[#2b231f] h-[6px] left-[3.9px] rounded-[2px] top-[0.6px] w-[4.2px]" />
          <div className="absolute bg-[#d1cdc4] shadow-[inset_0_0_0_0.3px_#2b231f] h-[37.2px] left-[2.7px] rounded-[10px] top-[6.6px] w-[6.6px]" />
          <div className="absolute bg-[#f7f4f0] h-[10.8px] left-[3.3px] top-[21px] w-[5.4px]" />
          <p className="-translate-x-1/2 absolute font-sans font-normal leading-[1.4] left-[6px] text-[1.08px] text-[#2b231f] text-center top-[24.3px] w-[5.4px]">02</p>
        </div>
      ))}
    </div>
  );
}

/** Figma "Option — 6 vials · 2ml each (selected)". */
export function OptionSelected({ className = "" }: { className?: string }) {
  return (
    <div role="radiogroup" aria-label="Set" className={className}>
      <div role="radio" aria-checked className="bg-[#2b231f] border border-[#2b231f] border-solid flex flex-col h-[117px] items-center justify-between p-[10px] w-[189px]">
        <VialsSwatch />
        <p className="font-sans font-normal leading-[1.4] shrink-0 text-[12px] text-white whitespace-nowrap">6 vials · 2ml each</p>
      </div>
    </div>
  );
}

/** Light check used in the feature line (stroke #d1cdc4 in Figma). */
export function FeatureCheck({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 14 14" fill="none" aria-hidden className={className}>
      <path d="M2.2 7.6 5.3 10.6 11.8 3.8" stroke="#d1cdc4" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Figma "Icon / gift": box, lid and ribbon. */
export function GiftIcon({ className = "" }: { className?: string }) {
  return (
    <div className={`relative shrink-0 size-[16px] ${className}`} aria-hidden>
      <div className="absolute border-[1.2px] border-[#2b231f] border-solid h-[9px] left-px top-[6px] w-[14px]" />
      <div className="absolute border-[1.2px] border-[#2b231f] border-solid h-[3px] left-0 top-[3px] w-[16px]" />
      <div className="absolute bg-[#2b231f] h-[12px] left-[7.4px] top-[3px] w-[1.2px]" />
    </div>
  );
}

/** Quantity picker (Figma "Quantity (1–10+)"); capped at the bag's per-line limit. */
export function QtySelect({ value, onChange, className, textClass, chevronClass }: {
  value: number; onChange: (n: number) => void; className: string; textClass: string; chevronClass: string;
}) {
  return (
    <label className={`bg-white border border-[#d1cdc4] border-solid relative shrink-0 block ${className}`}>
      <span className="sr-only">Quantity</span>
      <select value={value} onChange={(e) => onChange(Number(e.target.value))}
        className={`absolute inset-0 appearance-none bg-transparent font-sans font-normal text-[#2b231f] cursor-pointer outline-offset-2 ${textClass}`}>
        {Array.from({ length: QTY_MAX }, (_, k) => k + 1).map((n) => <option key={n} value={n}>{n}</option>)}
      </select>
      <ChevronRight className={`absolute pointer-events-none rotate-90 text-[#2b231f] ${chevronClass}`} />
    </label>
  );
}

/* ---------- copy ---------- */
export const DESCRIPTION = [
  "Try every Fieldnote house scent before you commit. Six scents in 2ml vials, so you can wear each one for a full day on your own time — in class, at work, out at night.",
  "Each vial is filled from the same small batches we use for full bottles, so what you test is exactly what you'll get.",
  "When you've found the one, your $22 goes toward your first full bottle — mixed to order with your name on the label.",
];
export const HOW_TO_USE = ["One vial per day → six days, six scents", "Find your favorite → order the full bottle", "$22 credit → applied at checkout"];
export const INCLUDES_D = ["6 house scent vials (2ml each)", "1 printed scent guide with notes for each", "1 code for $22 off your first full bottle"];
export const INCLUDES_P = [
  "No. 01 Library Musk — Aldehydes, clean musk",
  "No. 02 Fig Study — Fig leaf, cedar",
  "No. 03 Field Vetiver — Grapefruit, haitian vetiver",
  "No. 04 Late Tea — Black tea, amber",
  "No. 05 Salt Hour — Sea salt, driftwood",
  "No. 06 Worn Leather — Saffron, birch tar",
];
export const DISCLAIMER = "*Vials are filled on order and may show slight color variation between batches. This is natural and not a defect.";
export const STEPS = [
  "Step 1 Your Discovery Set includes a code worth $22 toward any full-size Fieldnote bottle.",
  "Step 2 Wear one vial a day until a scent feels like yours.",
  "Step 3 Visit fieldnote.co, choose your scent and size, and add your name and city for the label.",
  "Step 4 Enter your code at checkout and the $22 comes off your order.",
  "Step 5 We mix, fill and label your bottle at the next bench session and ship it the next weekday. Codes are valid for 90 days and can be used once.",
];
export const REDEEM = "How To Redeem Your Credit and Find Your Signature Scent";
export const TABS = ["Description", "Notes", "Ingredients"] as const;
export type Tab = (typeof TABS)[number];
export const INGREDIENTS_NOTE = "A full ingredient list is printed on each box.";

export interface Slide { name: string; no: string; sub: string; line: string; notes: [string, string, string]; d: string; p: string }
export const FAMILIES: { name: string; words: string; slides: [Slide, Slide] }[] = [
  {
    name: "FRESH", words: "uplifting / clean / bright / easy",
    slides: [
      { name: "FIELD VETIVER", no: "03", sub: "CUT GRASS, GRAPEFRUIT PEEL", line: "FRESH GREEN VETIVER", notes: ["Grapefruit, Pink Pepper", "Clary Sage, Geranium", "Haitian Vetiver, Oakmoss"], d: "sd-vetiver", p: "sp-vetiver" },
      { name: "SALT HOUR", no: "05", sub: "SKIN AFTER THE OCEAN", line: "SALTY MINERAL CITRUS", notes: ["Sea Salt, Lemon", "Ambrette, Sage", "Driftwood, Mineral Musk"], d: "sd-salt", p: "sp-salt" },
    ],
  },
  {
    name: "WOODY", words: "smooth / grounded / quiet / warm",
    slides: [
      { name: "FIG STUDY", no: "02", sub: "GREEN FIG LEAF", line: "GREEN WOODY FIG", notes: ["Green Fig Leaf", "Ripe Fig", "Dry Cedar"], d: "sd-fig", p: "sp-fig" },
      { name: "LIBRARY MUSK", no: "01", sub: "CLEAN SHEETS, OLD PAPER", line: "SOFT CLEAN MUSK", notes: ["Aldehydes, Pear Skin", "Iris, White Tea", "Clean Musk, Cashmeran"], d: "sd-musk", p: "sp-musk" },
    ],
  },
  {
    name: "WARM", words: "close / nostalgic / rich / soft",
    slides: [
      { name: "LATE TEA", no: "04", sub: "BLACK TEA, OPEN NOTEBOOK", line: "WARM TEA AMBER", notes: ["Black Tea, Cardamom", "Orange Blossom, Honey", "Amber, Tonka Bean"], d: "sd-tea", p: "sp-tea" },
      { name: "WORN LEATHER", no: "06", sub: "A WELL-WORN SUEDE JACKET", line: "SMOKY SUEDE LEATHER", notes: ["Saffron, Black Pepper", "Suede, Raspberry Leaf", "Birch Tar, Sandalwood"], d: "sd-leather", p: "sp-leather" },
    ],
  },
];
export const ALL_SLIDES = FAMILIES.flatMap((f) => f.slides).sort((a, b) => a.no.localeCompare(b.no));

/** TOP | … / HEART | … / BASE | … lines (12px, muted bar). */
export function NoteLines({ notes }: { notes: [string, string, string] }) {
  return (
    <>
      {(["TOP", "HEART", "BASE"] as const).map((k, j) => (
        <p key={k} className="font-sans text-[12px] leading-[1.4] text-[#2b231f]">
          {k} <span className="text-[#6b625b]">|</span> {notes[j]}
        </p>
      ))}
    </>
  );
}

/** Content of the Notes and Ingredients tabs (Description is laid out per frame). */
export function NotesPanel({ className = "" }: { className?: string }) {
  return (
    <ul className={`font-sans font-normal text-[14px] leading-[1.5] text-[#2b231f] flex flex-col gap-[8px] ${className}`}>
      {ALL_SLIDES.map((s) => (
        <li key={s.no}>
          No. {s.no} {s.name.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())}
          <span className="block text-[#6b625b]">Top: {s.notes[0]} · Heart: {s.notes[1]} · Base: {s.notes[2]}</span>
        </li>
      ))}
    </ul>
  );
}

/** True once the element has scrolled up out of view (used for the sticky buy bar / phone cart bar). */
export function usePassed(ref: RefObject<Element>) {
  const [passed, setPassed] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setPassed(!e.isIntersecting && e.boundingClientRect.top < 0));
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);
  return passed;
}

/** True while the element is on screen. */
export function useInView(ref: RefObject<Element>) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);
  return inView;
}
