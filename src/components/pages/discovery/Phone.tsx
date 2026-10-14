"use client";

/* Discovery Set — Phone 390 (Figma 24:1688), including the fixed cart bar (102:2141). */
import { useRef, useState } from "react";
import { HeaderPhone, FooterPhone } from "@/components/site/Chrome";
import { Newsletter } from "@/components/site/Newsletter";
import { Button } from "@/components/site/ui";
import { ChevronRight } from "@/components/icons";
import { asset } from "@/lib/site";
import {
  TITLE, GALLERY, GALLERY_START, GalleryPic, Thumbs, useCycle, useSwipe, OptionSelected, FeatureCheck, GiftIcon, QtySelect,
  DESCRIPTION, HOW_TO_USE, INCLUDES_P, DISCLAIMER, STEPS, REDEEM, TABS, type Tab, INGREDIENTS_NOTE, NotesPanel,
  FAMILIES, NoteLines, useReserveDiscovery, usePassed, useInView,
} from "./shared";

const RESERVE = "Reserve, pay at launch";
const TAB_POS: Record<Tab, { left: number; line: number }> = { Description: { left: 16, line: 86 }, Notes: { left: 130, line: 44 }, Ingredients: { left: 203, line: 83 } };

function Main({ reserveRef }: { reserveRef: React.RefObject<HTMLDivElement> }) {
  const g = useCycle(GALLERY.length, GALLERY_START);
  const swipe = useSwipe(g.prev, g.next);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<Tab>("Description");
  const [open, setOpen] = useState(true);
  const reserve = useReserveDiscovery();
  return (
    <section className="bg-white relative w-[390px]" aria-label="Discovery Set">
      <div className="h-[1008px] relative">
        <div {...swipe} className="absolute left-[16px] size-[358px] top-[42px] touch-pan-y" aria-roledescription="carousel" aria-label="Product images">
          <GalleryPic i={g.i} eager className="absolute inset-0" />
        </div>
        <div className="absolute h-[84px] left-[16px] overflow-x-auto no-scrollbar top-[410px] w-[374px]">
          <Thumbs active={g.i} onPick={g.setI} />
        </div>
        <h1 className="absolute font-sans font-normal leading-[1.5] left-[16px] text-[16px] text-[#2b231f] top-[505px] w-[358px]">{TITLE}</h1>
        <OptionSelected className="absolute left-[16px] top-[549px]" />
        <div className="absolute bg-white h-[50px] left-[16px] top-[682px] w-[358px]">
          <FeatureCheck className="absolute left-[16px] size-[14px] top-[18px]" />
          <p className="absolute font-sans font-normal leading-[1.4] left-[46px] text-[12px] text-[#2b231f] top-[11px] w-[296px]">INCLUDES $22 CREDIT TOWARD YOUR FIRST FULL BOTTLE</p>
        </div>
        <div ref={reserveRef} className="absolute left-[16px] top-[746px] h-[44px] w-[358px]">
          <QtySelect value={qty} onChange={setQty} className="!absolute left-0 top-[2px] h-[40px] w-[105px]" textClass="pl-[14px] text-[14px] leading-[1.5]" chevronClass="left-[78px] top-[13px] size-[12px]" />
          <Button onClick={() => reserve(qty)} className="!absolute left-[115px] top-0 h-[44px] w-[243px] px-[32px]">{RESERVE}</Button>
        </div>
        <div className="absolute bg-white h-[116px] left-[16px] top-[808px] w-[358px]">
          <GiftIcon className="!absolute left-[16px] top-[13px]" />
          <p className="absolute font-sans font-normal leading-[1.4] left-[46px] text-[12px] text-[#2b231f] top-[13px] whitespace-nowrap">How To Use Your Set</p>
          <ul className="absolute font-sans font-normal left-[46px] list-disc marker:text-[10px] text-[14px] text-[#2b231f] top-[36px] w-[296px]">
            {HOW_TO_USE.map((t) => <li key={t} className="ms-[21px] leading-[1.5]">{t}</li>)}
          </ul>
        </div>
        <div role="tablist" aria-label="Product details" className="absolute left-0 top-[964px] h-[19px] w-[390px]">
          {TABS.map((t) => (
            <button key={t} role="tab" type="button" aria-selected={tab === t} onClick={() => setTab(t)}
              className="absolute top-0 font-sans font-normal leading-[1.4] text-[12px] text-[#2b231f] whitespace-nowrap uppercase" style={{ left: TAB_POS[t].left }}>
              {t}
            </button>
          ))}
          <span className="absolute bg-[#2b231f] h-px top-[18px]" style={{ left: TAB_POS[tab].left, width: TAB_POS[tab].line }} />
        </div>
      </div>

      <div role="tabpanel" aria-label={tab} className="px-[16px]">
        {tab === "Description" ? (
          <>
            <div className="font-sans font-normal text-[14px] text-[#2b231f] w-[343px]">
              {DESCRIPTION.map((p) => <p key={p} className="leading-[1.5]">{p}</p>)}
            </div>
            <div className="font-sans font-normal text-[14px] text-[#2b231f] mt-[16px] w-[343px]">
              <p className="leading-[1.5]">Includes</p>
              <ul className="list-disc marker:text-[10px]">{INCLUDES_P.map((t) => <li key={t} className="ms-[21px] leading-[1.5]">{t}</li>)}</ul>
            </div>
          </>
        ) : tab === "Notes" ? (
          <NotesPanel className="w-[343px]" />
        ) : (
          <p className="font-sans font-normal leading-[1.5] text-[14px] text-[#2b231f] w-[343px]">{INGREDIENTS_NOTE}</p>
        )}
        <p className="font-sans font-normal leading-[1.5] mt-[3px] text-[14px] text-[#6b625b] w-[343px]">{DISCLAIMER}</p>
      </div>

      <div className="pt-[28px] pb-[40px] px-[16px]">
        <div className={`border-[#d1cdc4] border-b border-solid border-t relative w-[358px] ${open ? "h-[300px]" : "h-[59px]"}`}>
          <button type="button" aria-expanded={open} aria-controls="ds-redeem-p" onClick={() => setOpen(!open)} className="absolute h-[57px] left-0 top-[-1px] w-[358px] text-left">
            <h2 className="absolute font-sans font-normal leading-[1.4] left-0 text-[12px] text-[#2b231f] top-[21.5px] whitespace-nowrap">FROM DISCOVERY TO BOTTLE</h2>
            <ChevronRight className={`absolute left-[344px] size-[14px] top-[21.5px] text-[#2b231f] ${open ? "-rotate-90" : "rotate-90"}`} />
          </button>
          {open ? (
            <div id="ds-redeem-p">
              <p className="absolute font-sans font-normal leading-[1.4] left-0 text-[12px] text-[#2b231f] top-[72px] w-[358px]">{REDEEM}</p>
              <div className="absolute font-sans font-normal left-0 text-[12px] text-[#2b231f] top-[97px] w-[358px]">
                {STEPS.map((s) => <p key={s} className="leading-[17px]">{s}</p>)}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

const EDITORIAL = [
  { n: "01", title: "THE SIX", titleLeft: 304, img: "ed-1", pTop: 365, labels: ["LIBRARY MUSK", "FIG STUDY", "FIELD VETIVER", "LATE TEA", "SALT HOUR", "WORN LEATHER"],
    p: "Six house scents, from green and fresh to dry and woody. Each one is built to be worn every day, close to the skin, and each vial gives you about a week of real wear to decide." },
  { n: "02", title: "FILLED TO ORDER", titleLeft: 221, img: "ed-2", pTop: 345, labels: ["BLEND", "FILL", "LABEL", "SHIP"],
    p: "Nothing sits in a warehouse. Your full bottle is mixed at the next bench session after you order, filled by hand, and shipped the next weekday." },
  { n: "03", title: "YOUR NAME ON IT", titleLeft: 215, img: "ed-3", pTop: 345, labels: ["NAME", "CITY", "DATE"],
    p: "Every full bottle carries the name you choose, your city, and the date it was filled — so you always know exactly when it was made, and who it was made for." },
];

function Editorial({ e }: { e: (typeof EDITORIAL)[number] }) {
  return (
    <section className="bg-[#f7f4f0] h-[508px] relative w-[390px]">
      <p className="absolute font-serif leading-[1.25] left-[16px] text-[24px] text-[#2b231f] top-[32px] whitespace-nowrap">{e.n}</p>
      <div className="absolute bg-[#2b231f] h-px left-[16px] top-[68px] w-[80px]" />
      <h2 className="absolute font-serif leading-[1.25] text-[24px] text-[#2b231f] top-[33px] whitespace-nowrap" style={{ left: e.titleLeft }}>{e.title}</h2>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img alt="" loading="lazy" decoding="async" src={asset(`/img/discovery/${e.img}.webp`)} className="absolute h-[208px] left-[16px] top-[93px] w-[358px] object-cover" />
      <div className="absolute flex flex-wrap gap-[6px_20px] items-start font-sans font-normal leading-[1.4] left-[16px] text-[12px] text-[#2b231f] top-[319px] w-[358px] whitespace-nowrap">
        {e.labels.map((s) => <p key={s}>{s}</p>)}
      </div>
      <p className="absolute font-sans font-normal leading-[1.4] left-[16px] text-[12px] text-[#6b625b] text-justify w-[358px]" style={{ top: e.pTop }}>{e.p}</p>
    </section>
  );
}

function Slideshow({ f }: { f: (typeof FAMILIES)[number] }) {
  const c = useCycle(2);
  const swipe = useSwipe(c.prev, c.next);
  return (
    <>
      <div className="bg-[#f7f4f0] h-[164px] relative text-[#2b231f] w-[390px]">
        <h2 className="absolute font-serif leading-[1.25] left-[16px] text-[24px] top-[84px] whitespace-nowrap">{f.name}</h2>
        <p className="absolute font-sans font-normal leading-[1.5] left-[16px] text-[14px] top-[123px] w-[358px]">{f.words}</p>
      </div>
      <section {...swipe} aria-roledescription="carousel" aria-label={`${f.name.toLowerCase()} scents`} className="bg-[#f7f4f0] h-[498px] overflow-hidden relative touch-pan-y w-[390px]">
        {f.slides.map((s, k) => (
          <div key={s.name} aria-hidden={k !== c.i} className={`absolute h-[498px] left-0 top-0 w-[390px] transition-opacity duration-300 ${k === c.i ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt={`${s.name.toLowerCase()} bottle`} loading="lazy" decoding="async" src={asset(`/img/discovery/${s.p}.webp`)} className="absolute h-[386px] left-0 top-0 w-[390px] object-cover" />
            <div className="absolute bg-white font-sans font-normal h-[112px] left-0 top-[386px] w-[390px]">
              <h3 className="absolute leading-[1.5] left-[16px] text-[18px] text-[#2b231f] top-[16px] whitespace-nowrap">{s.name}</h3>
              <p className="absolute leading-[1.4] left-[16px] text-[12px] text-[#6b625b] top-[41px] w-[168px]">{s.sub}</p>
              <p className="absolute leading-[1.4] left-[200px] text-[12px] text-[#2b231f] top-[16px] whitespace-nowrap">{s.line}</p>
              <div className="absolute left-[200px] top-[34px] w-[174px]"><NoteLines notes={s.notes} /></div>
            </div>
          </div>
        ))}
        <div className="absolute h-[2px] left-[150px] top-[362px] w-[90px]">
          {[0, 1].map((k) => (
            <button key={k} type="button" onClick={() => c.setI(k)} aria-label={`Show ${f.slides[k].name.toLowerCase()}`}
              className={`absolute h-[2px] top-0 w-[40px] ${k === c.i ? "bg-white" : "border border-white border-solid"}`} style={{ left: k * 50 }} />
          ))}
        </div>
      </section>
    </>
  );
}

const VALUES = [
  { icon: "ic-genderless", label: "Genderless Fragrances", x: 61, y: 25 },
  { icon: "ic-vegan", label: "Vegan & Cruelty-Free", x: 248, y: 25 },
  { icon: "ic-filled", label: "Filled to Order", x: 61, y: 168 },
  { icon: "ic-ingredients", label: "Plain-Word Ingredients", x: 248, y: 168 },
];

/** The frame shows the bar at the end of the page; a fixed copy slides in once the main Reserve button has scrolled away. */
function CartBar({ show, fixed = false, barRef }: { show: boolean; fixed?: boolean; barRef?: React.RefObject<HTMLDivElement> }) {
  const reserve = useReserveDiscovery();
  const pos = fixed ? `fixed bottom-0 left-0 z-40 transition-transform duration-300 ${show ? "translate-y-0" : "translate-y-full invisible"}` : "relative";
  return (
    <div ref={barRef} className={`bg-white border-t border-[#d1cdc4] border-solid h-[120px] w-[390px] ${pos}`} aria-hidden={!show}>
      <p className="absolute font-sans font-normal leading-[1.5] left-[16px] text-[14px] text-[#2b231f] text-center top-[17px] w-[358px]">{TITLE}</p>
      <p className="absolute font-sans font-normal leading-[1.4] left-[16px] text-[12px] text-[#2b231f] text-center top-[36px] w-[358px]">$22.00</p>
      <Button onClick={() => reserve(1)} className="!absolute left-[16px] top-[57.5px] h-[44px] w-[358px] px-[32px]">{RESERVE}</Button>
    </div>
  );
}

export function DiscoveryPhone() {
  const reserveRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const passed = usePassed(reserveRef);
  const atEnd = useInView(endRef);
  return (
    <>
      <HeaderPhone />
      <Main reserveRef={reserveRef} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img alt="Discover your scent. Every Fieldnote house scent in one set." loading="lazy" decoding="async" src={asset("/img/discovery/campaign-p.webp")} className="block h-[842px] w-[390px] object-cover" />
      {EDITORIAL.map((e) => <Editorial key={e.n} e={e} />)}
      <div className="bg-[#f7f4f0] h-[60px] w-[390px]" />
      {FAMILIES.map((f) => <Slideshow key={f.name} f={f} />)}
      <section className="bg-[#ece8e1] h-[318px] relative w-[390px]" aria-label="What we stand for">
        {VALUES.map((v) => (
          <div key={v.icon}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt="" src={asset(`/img/discovery/${v.icon}.png`)} className="absolute size-[80px]" style={{ left: v.x, top: v.y }} />
            <p className="-translate-x-1/2 absolute font-sans font-normal leading-[1.4] text-[12px] text-[#2b231f] text-center w-[170px]" style={{ left: v.x + 40, top: v.y + 96 }}>{v.label}</p>
          </div>
        ))}
      </section>
      <Newsletter device="p" />
      <FooterPhone />
      <CartBar show barRef={endRef} />
      <CartBar fixed show={passed && !atEnd} />
    </>
  );
}
