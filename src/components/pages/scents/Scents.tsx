"use client";

/* Scents page, built from Figma frames 17:791 (desktop 1440), 174:2363 (tablet 768) and 20:1050 (phone 390).
   Filters drawer 92:1617 / 99:2169 and Sort menu 92:1685 are the open states of the filter bar. */
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Frames } from "@/components/Frames";
import { HeaderDesktop, HeaderPhone, FooterDesktop, FooterPhone } from "@/components/site/Chrome";
import { Newsletter } from "@/components/site/Newsletter";
import { Button } from "@/components/site/ui";
import { useUi } from "@/lib/ui";
import { asset } from "@/lib/site";
import { CARDS, EMPTY_FILTERS, activeCount, applyFilters, type Card, type Filters, type Sort } from "./data";
import { ChevronDown, FilterDrawer, Funnel, SortMenu, useOverlay } from "./Controls";

const WHITE = "text-white";
const T12 = "font-sans font-normal leading-[1.4] text-[12px]";
const INK = "text-[#2b231f]";
const MUTED = "text-[#6b625b]";
const money2 = (n: number) => `$${n.toFixed(2)}`;

interface State {
  list: Card[];
  filters: Filters;
  setFilters: (f: Filters) => void;
  sort: Sort;
  setSort: (s: Sort) => void;
  drawer: boolean;
  setDrawer: (o: boolean) => void;
  sortOpen: boolean;
  setSortOpen: (o: boolean) => void;
}

function Img({ src, alt = "", className = "", eager = false }: { src: string; alt?: string; className?: string; eager?: boolean }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={alt} src={asset(src)} loading={eager ? "eager" : "lazy"} decoding="async" className={`absolute inset-0 max-w-none object-cover pointer-events-none size-full ${className}`} />
  );
}

/* ---------------- product cards ---------------- */

/** Desktop / tablet card, Figma "Product card" 90:51 (361 × 441). */
function CardD({ c, style }: { c: Card; style: React.CSSProperties }) {
  const { openReserve } = useUi();
  return (
    <div className="absolute bg-white border border-[#d1cdc4] border-solid group h-[441px] w-[361px] transition-[left,top] duration-500 ease-out" style={style}>
      <Link href={c.href} className="absolute inset-0 block" aria-label={c.reserveName}>
        <div className="absolute h-[360px] left-0 top-0 w-[359px] overflow-hidden">
          <Img src={c.img} alt={c.alt} className="!object-fill" />
        </div>
        <div className="absolute bg-[#d1cdc4] h-px left-0 top-[360px] w-[359px]" />
        <p className={`-translate-x-1/2 absolute left-[179.5px] text-center top-[370px] w-[319px] ${T12} ${INK}`}>{c.name}</p>
        <p className={`-translate-x-1/2 absolute left-[179.5px] text-center top-[391px] w-[319px] ${T12} ${MUTED}`}>{c.profileLine}</p>
        <div className={`absolute flex gap-[4px] items-baseline justify-center left-[20px] top-[414px] w-[319px] whitespace-nowrap ${T12} ${MUTED}`}>
          {c.from ? <span>From</span> : null}
          <span>{money2(c.price)}</span>
        </div>
        {c.badge ? (
          <div className="absolute bg-[#6b625b] flex items-center left-[6px] px-[15px] py-[6px] top-[6px]">
            <span className={`${T12} ${WHITE} whitespace-nowrap`}>{c.badge}</span>
          </div>
        ) : null}
      </Link>
      <div className="absolute left-[119px] top-[305px] opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-500">
        <Button
          className="h-[44px] w-[228px] px-[32px]"
          onClick={() => openReserve({ id: c.id, name: c.reserveName, price: c.reservePrice, detail: c.profileLine })}
        >
          Reserve, pay at launch
        </Button>
      </div>
    </div>
  );
}

/** Phone card, Figma "Product card — Phone" 98:51 (196 × 270). No quick-add on phones. */
function CardP({ c, style }: { c: Card; style: React.CSSProperties }) {
  return (
    <Link
      href={c.href}
      className="absolute bg-white border border-[#d1cdc4] border-solid block h-[270px] w-[196px] transition-[left,top] duration-500 ease-out"
      style={style}
    >
      <div className="absolute inset-[0_0_73px_0] overflow-hidden">
        <Img src={c.img} alt={c.alt} className="!object-fill" />
      </div>
      <div className="absolute bg-[#d1cdc4] bottom-[72px] h-px left-0 right-0" />
      {c.badge ? (
        <div className="absolute bg-[#6b625b] flex h-[27px] items-center left-[6px] px-[14px] top-[6px]">
          <span className={`${T12} ${WHITE} whitespace-nowrap`}>{c.badge}</span>
        </div>
      ) : null}
      <div className={`absolute bottom-[3px] flex flex-col gap-[3px] items-start left-[12px] right-[12px] ${T12}`}>
        <p className={`text-center w-full ${INK}`}>{c.name}</p>
        <p className={`text-center w-full ${MUTED}`}>{c.profileLine}</p>
        <div className={`flex gap-[4px] items-baseline justify-center w-full whitespace-nowrap ${MUTED}`}>
          {c.from ? <span>From</span> : null}
          <span>{money2(c.price)}</span>
        </div>
      </div>
    </Link>
  );
}

function Empty({ s, className }: { s: State; className: string }) {
  return (
    <div className={`absolute flex flex-col gap-[12px] items-center ${className}`}>
      <p className={`${T12} ${INK}`}>No scents match these filters.</p>
      <button type="button" onClick={() => s.setFilters(EMPTY_FILTERS)} className={`${T12} ${INK} underline [text-underline-position:from-font] link-hover`}>
        Clear filters
      </button>
    </div>
  );
}

/* ---------------- filter bars ---------------- */

function FiltersLabel({ s }: { s: State }) {
  const n = activeCount(s.filters);
  return <>{n ? `FILTERS (${n})` : "FILTERS"}</>;
}

function FilterBarD({ s }: { s: State }) {
  return (
    <div className="bg-white border-[#d1cdc4] border-b border-solid h-[64px] relative shrink-0 w-[1440px]">
      <button type="button" onClick={() => s.setDrawer(true)} aria-haspopup="dialog" className="absolute border-[#d1cdc4] border-r border-solid h-[62px] left-0 top-0 w-[132px] group">
        <Funnel className="absolute left-[32px] top-[24px]" />
        <span className={`absolute left-[54px] top-[24px] whitespace-nowrap ${T12} ${INK} group-hover:opacity-60 transition-opacity`}><FiltersLabel s={s} /></span>
      </button>
      <div className="absolute h-[62px] left-[1300px] top-0 w-[140px]">
        <button type="button" onClick={() => s.setSortOpen(!s.sortOpen)} aria-haspopup="menu" aria-expanded={s.sortOpen} className="absolute inset-0 group">
          <span className={`absolute left-[33px] top-[24px] whitespace-nowrap ${T12} ${INK} group-hover:opacity-60 transition-opacity`}>SORT BY</span>
          <ChevronDown size={16} className={`absolute left-[92px] top-[23px] transition-transform ${s.sortOpen ? "rotate-180" : ""}`} />
        </button>
        {s.sortOpen ? <SortMenu sort={s.sort} choose={s.setSort} close={() => s.setSortOpen(false)} /> : null}
      </div>
    </div>
  );
}

function FilterBarP({ s }: { s: State }) {
  return (
    <div className="bg-white border-[#d1cdc4] border-b border-solid h-[58px] relative shrink-0 w-[390px]">
      <button type="button" onClick={() => s.setDrawer(true)} aria-haspopup="dialog" className="absolute border-[#d1cdc4] border-r border-solid h-[56px] left-0 top-0 w-[110px]">
        <Funnel className="absolute left-[16px] top-[21px]" />
        <span className={`absolute left-[36px] top-[20px] whitespace-nowrap ${T12} ${INK}`}><FiltersLabel s={s} /></span>
      </button>
      <div className="absolute border-[#d1cdc4] border-l border-solid h-[56px] left-[282px] top-0 w-[108px]">
        <button type="button" onClick={() => s.setSortOpen(!s.sortOpen)} aria-haspopup="menu" aria-expanded={s.sortOpen} className="absolute inset-0">
          <span className={`absolute left-[13px] top-[20px] whitespace-nowrap ${T12} ${INK}`}>SORT BY</span>
          <ChevronDown size={12} className={`absolute left-[81px] top-[22px] transition-transform ${s.sortOpen ? "rotate-180" : ""}`} />
        </button>
        {s.sortOpen ? <SortMenu sort={s.sort} choose={s.setSort} close={() => s.setSortOpen(false)} /> : null}
      </div>
    </div>
  );
}

function FilterBarT({ s }: { s: State }) {
  const mono = `font-mono font-normal leading-[1.3] text-[12px] tracking-[1.6px] uppercase whitespace-nowrap ${INK}`;
  return (
    <div className="border-[#d1cdc4] border-b border-solid h-[57px] relative shrink-0 w-[768px]">
      <button type="button" onClick={() => s.setDrawer(true)} aria-haspopup="dialog" className={`absolute left-[32px] top-[20px] link-hover ${mono}`}>
        <FiltersLabel s={s} />
      </button>
      <div className="absolute right-[32px] top-[20px]">
        <button type="button" onClick={() => s.setSortOpen(!s.sortOpen)} aria-haspopup="menu" aria-expanded={s.sortOpen} className={`link-hover ${mono}`}>
          Sort by
        </button>
        {s.sortOpen ? <div className="absolute right-[-32px] top-[37px]"><SortMenu sort={s.sort} choose={s.setSort} close={() => s.setSortOpen(false)} /></div> : null}
      </div>
    </div>
  );
}

/* ---------------- grids ---------------- */

const DX = [0, 360, 720, 1079];
function GridD({ s }: { s: State }) {
  const rows = Math.max(1, Math.ceil(s.list.length / 4));
  return (
    <div id="find" data-find className="bg-white relative shrink-0 w-[1440px] scroll-mt-[64px]" style={{ height: rows * 440 + 1 }}>
      {s.list.map((c, i) => <CardD key={c.id} c={c} style={{ left: DX[i % 4], top: Math.floor(i / 4) * 440 }} />)}
      {s.list.length === 0 ? <Empty s={s} className="left-0 right-0 top-[180px]" /> : null}
    </div>
  );
}

function GridT({ s }: { s: State }) {
  const rows = Math.max(1, Math.ceil(s.list.length / 2));
  return (
    <div data-find className="relative shrink-0 w-[768px] scroll-mt-[57px]" style={{ height: 24 + rows * 441 + (rows - 1) * 24 + 48 }}>
      {s.list.map((c, i) => <CardD key={c.id} c={c} style={{ left: 15 + (i % 2) * 369, top: 24 + Math.floor(i / 2) * 465 }} />)}
      {s.list.length === 0 ? <Empty s={s} className="left-0 right-0 top-[200px]" /> : null}
    </div>
  );
}

function GridP({ s }: { s: State }) {
  const rows = Math.max(1, Math.ceil(s.list.length / 2));
  return (
    <div data-find className="bg-white overflow-x-clip relative shrink-0 w-[390px] scroll-mt-[58px]" style={{ height: rows * 269 + 1 }}>
      {s.list.map((c, i) => <CardP key={c.id} c={c} style={{ left: (i % 2) * 195, top: Math.floor(i / 2) * 269 }} />)}
      {s.list.length === 0 ? <Empty s={s} className="left-0 right-0 top-[110px]" /> : null}
    </div>
  );
}

/* ---------------- sections ---------------- */

const HERO_ALT = "A pipette letting a drop fall into a frosted glass bottle on a wooden stool";
const BENCH_ALT = "Hands setting the cap on a freshly labeled Fig Study bottle at the workbench";
const VALUES = [
  ["/img/scents/icon-genderless.svg", "Genderless Fragrances"],
  ["/img/scents/icon-vegan.svg", "Vegan & Cruelty-Free"],
  ["/img/scents/icon-filled.svg", "Filled to Order"],
  ["/img/scents/icon-ingredients.svg", "Plain-Word Ingredients"],
] as const;
const SCRIM = "linear-gradient(180deg, rgba(43,35,31,0) 0%, rgba(43,35,31,0.7) 40%, rgba(43,35,31,0.85) 100%)";
const BODY = "Weighed, blended and hand-filled within 48 hours of your order, then labeled with your name, city and the day it was made.";

function Desktop({ s }: { s: State }) {
  return (
    <>
      <HeaderDesktop />
      <section className="h-[600px] relative shrink-0 w-[1440px] overflow-hidden">
        <Img src="/img/scents/hero-d.webp" alt={HERO_ALT} eager />
        <h1 className={`absolute font-serif font-normal leading-[1.2] left-[32px] text-[32px] top-[444px] w-[589px] ${WHITE}`}>Scents</h1>
        <p className={`absolute font-sans font-normal leading-[1.5] left-[32px] text-[16px] top-[502px] w-[589px] ${WHITE}`}>Six eaux de parfum, built to be worn every day.</p>
        <p className={`absolute font-sans font-normal leading-[1.5] left-[32px] text-[16px] top-[541px] w-[589px] ${WHITE}`}>Mixed after you order. Labeled with your name.</p>
      </section>
      <div className="relative">
        <div className="sticky top-0 z-20"><FilterBarD s={s} /></div>
        <GridD s={s} />
      </div>
      <section className="h-[675px] relative shrink-0 w-[1440px] overflow-hidden">
        <Img src="/img/scents/bench-d.webp" alt={BENCH_ALT} />
        <h2 className={`absolute font-serif font-normal leading-[1.2] left-[32px] text-[32px] top-[545px] whitespace-nowrap ${WHITE}`}>FILLED TO ORDER</h2>
        <p className={`absolute font-sans font-normal leading-[1.5] left-[32px] text-[14px] top-[602px] w-[656px] ${WHITE}`}>{BODY}</p>
      </section>
      <section className="bg-[#ece8e1] h-[220px] relative shrink-0 w-[1440px]">
        {VALUES.map(([src, label], i) => (
          <div key={label} className="absolute h-[123px] top-[41px] w-[248px]" style={{ left: 176 + i * 280 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt="" src={asset(src)} className="absolute left-[84px] size-[80px] top-0" />
            <p className={`absolute font-sans font-normal leading-[1.5] left-0 text-[16px] text-center top-[99px] w-[248px] ${INK}`}>{label}</p>
          </div>
        ))}
      </section>
      <Newsletter device="d" />
      <FooterDesktop />
    </>
  );
}

function Tablet({ s }: { s: State }) {
  const cream = "text-[#ede6d6]";
  return (
    <>
      <HeaderPhone width={768} />
      <section className="h-[560px] relative shrink-0 w-[768px] overflow-hidden">
        <Img src="/img/scents/hero-t.webp" alt={HERO_ALT} eager />
        <div className="absolute h-[320px] left-0 top-[240px] w-[768px]" style={{ backgroundImage: SCRIM }} />
        <h1 className={`absolute font-serif font-normal leading-[1.05] left-[32px] text-[36px] top-[402px] tracking-[-0.36px] whitespace-nowrap ${cream}`}>Scents</h1>
        <p className={`absolute font-sans font-normal leading-[1.5] left-[32px] text-[16px] top-[452px] w-[704px] ${cream}`}>Six eaux de parfum, built to be worn every day.</p>
        <p className={`absolute font-sans font-normal leading-[1.5] left-[32px] text-[16px] top-[488px] w-[704px] ${cream}`}>Mixed after you order. Labeled with your name.</p>
      </section>
      <div className="relative">
        <div className="sticky top-0 z-20 bg-[#ece8e1]"><FilterBarT s={s} /></div>
        <GridT s={s} />
      </div>
      <section className="h-[520px] relative shrink-0 w-[768px] overflow-hidden">
        <Img src="/img/scents/bench-t.webp" alt={BENCH_ALT} />
        <div className="absolute h-[300px] left-0 top-[220px] w-[768px]" style={{ backgroundImage: SCRIM }} />
        <h2 className={`absolute font-serif font-normal leading-[1.2] left-[32px] text-[32px] top-[388px] whitespace-nowrap ${cream}`}>Filled to order</h2>
        <p className={`absolute font-sans font-normal leading-[1.5] left-[32px] text-[14px] top-[438px] w-[704px] ${cream}`}>{BODY}</p>
      </section>
      <Newsletter device="t" />
      <FooterPhone width={768} />
    </>
  );
}

function Phone({ s }: { s: State }) {
  return (
    <>
      <HeaderPhone />
      <section className="h-[557px] relative shrink-0 w-[390px] overflow-hidden">
        <Img src="/img/scents/hero-p.webp" alt={HERO_ALT} eager />
        <h1 className={`absolute font-serif font-normal leading-[1.25] left-[16px] text-[24px] top-[422px] w-[358px] ${WHITE}`}>Scents</h1>
        <p className={`absolute font-sans font-normal leading-[1.5] left-[16px] text-[14px] top-[467px] w-[358px] ${WHITE}`}>Six eaux de parfum, built to be worn every day.</p>
        <p className={`absolute font-sans font-normal leading-[1.5] left-[16px] text-[14px] top-[517px] w-[358px] ${WHITE}`}>Mixed after you order. Labeled with your name.</p>
      </section>
      <div className="relative">
        <div className="sticky top-0 z-20"><FilterBarP s={s} /></div>
        <GridP s={s} />
      </div>
      <section className="h-[633px] relative shrink-0 w-[390px] overflow-hidden">
        <Img src="/img/scents/bench-p.webp" alt={BENCH_ALT} />
        <h2 className={`absolute font-serif font-normal leading-[1.25] left-[16px] text-[24px] top-[538px] whitespace-nowrap ${WHITE}`}>FILLED TO ORDER</h2>
        <p className={`absolute font-sans font-normal leading-[1.4] left-[16px] text-[12px] top-[582px] w-[358px] ${WHITE}`}>{BODY}</p>
      </section>
      <section className="bg-[#ece8e1] h-[318px] relative shrink-0 w-[390px]">
        {VALUES.map(([src, label], i) => (
          <div key={label}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt="" src={asset(src)} className="absolute size-[80px]" style={{ left: i % 2 ? 248 : 61, top: i < 2 ? 25 : 168 }} />
            <p className={`absolute text-center w-[170px] ${T12} ${INK}`} style={{ left: i % 2 ? 203 : 16, top: i < 2 ? 121 : 264 }}>{label}</p>
          </div>
        ))}
      </section>
      <Newsletter device="p" />
      <FooterPhone />
    </>
  );
}

/** "#find" links: only one frame is displayed, so scroll to the grid in the visible frame. */
function useFindAnchor() {
  useEffect(() => {
    const go = () => {
      if (window.location.hash !== "#find") return;
      const el = Array.from(document.querySelectorAll<HTMLElement>("[data-find]")).find((e) => e.offsetParent !== null);
      el?.scrollIntoView({ block: "start" });
    };
    const t = window.setTimeout(go, 0);
    window.addEventListener("hashchange", go);
    return () => { window.clearTimeout(t); window.removeEventListener("hashchange", go); };
  }, []);
}

export function ScentsPage() {
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [sort, setSort] = useState<Sort>("Featured");
  const [drawer, setDrawer] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const list = useMemo(() => applyFilters(CARDS, filters, sort), [filters, sort]);
  const closeDrawer = useCallback(() => setDrawer(false), []);
  useOverlay(drawer, closeDrawer);
  useFindAnchor();
  const s: State = { list, filters, setFilters, sort, setSort, drawer, setDrawer, sortOpen, setSortOpen };
  return (
    <Frames
      phone={<><Phone s={s} />{drawer ? <FilterDrawer layout="p" f={filters} set={setFilters} close={closeDrawer} /> : null}</>}
      tablet={<><Tablet s={s} />{drawer ? <FilterDrawer layout="t" f={filters} set={setFilters} close={closeDrawer} /> : null}</>}
      desktop={<><Desktop s={s} />{drawer ? <FilterDrawer layout="d" f={filters} set={setFilters} close={closeDrawer} /> : null}</>}
    />
  );
}
