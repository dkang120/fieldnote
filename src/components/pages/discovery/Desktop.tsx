"use client";

/* Discovery Set — Desktop 1440 (Figma 24:1550) + sticky buy bar (60:1882). */
import { useRef, useState } from "react";
import { HeaderDesktop, FooterDesktop } from "@/components/site/Chrome";
import { Newsletter } from "@/components/site/Newsletter";
import { Button } from "@/components/site/ui";
import { ChevronRight } from "@/components/icons";
import { asset } from "@/lib/site";
import {
  TITLE, GALLERY, GALLERY_START, GalleryPic, Thumbs, useCycle, OptionSelected, FeatureCheck, GiftIcon, QtySelect,
  DESCRIPTION, HOW_TO_USE, INCLUDES_D, DISCLAIMER, STEPS, REDEEM, TABS, type Tab, INGREDIENTS_NOTE, NotesPanel,
  FAMILIES, NoteLines, useReserveDiscovery, usePassed,
} from "./shared";

const RESERVE = "Reserve, pay at launch";

function Hero({ reserveRef }: { reserveRef: React.RefObject<HTMLDivElement> }) {
  const g = useCycle(GALLERY.length, GALLERY_START);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<Tab>("Description");
  const reserve = useReserveDiscovery();
  return (
    <section className="bg-white min-h-[1040px] relative w-[1440px]" aria-label="Discovery Set">
      <div className="absolute h-[782px] left-[32px] top-[90px] w-[688px]">
        <GalleryPic i={g.i} eager className="absolute left-0 size-[688px] top-0" />
        <button type="button" onClick={g.prev} aria-label="Previous image" className="absolute bg-white left-[-20px] size-[40px] top-[324px]">
          <ChevronRight className="absolute left-[12px] size-[16px] top-[12px] rotate-180 text-[#2b231f]" />
        </button>
        <button type="button" onClick={g.next} aria-label="Next image" className="absolute bg-white left-[668px] size-[40px] top-[324px]">
          <ChevronRight className="absolute left-[12px] size-[16px] top-[12px] text-[#2b231f]" />
        </button>
        <div className="absolute left-0 top-[698px]">
          <Thumbs active={g.i} onPick={g.setI} />
        </div>
      </div>

      <div className="relative flex flex-col items-start ml-[805px] pt-[90px] pb-[74px] w-[550px]">
        <h1 className="font-serif leading-[1.3] text-[20px] text-[#2b231f] whitespace-nowrap">{TITLE}</h1>
        <div className="h-[46px] shrink-0" />
        <OptionSelected />
        <div className="h-[16px] shrink-0" />
        <div className="bg-white flex gap-[16px] h-[60px] items-center px-[20px] py-[13px] w-[550px]">
          <FeatureCheck className="shrink-0 size-[14px]" />
          <p className="font-sans font-normal leading-[1.4] text-[12px] text-[#2b231f] whitespace-nowrap">INCLUDES $22 CREDIT TOWARD YOUR FIRST FULL BOTTLE</p>
        </div>
        <div className="h-[26px] shrink-0" />
        <div ref={reserveRef} className="flex gap-[10px] items-start">
          <QtySelect value={qty} onChange={setQty} className="h-[47px] w-[105px]" textClass="pl-[12px] text-[12px] leading-[1.4]" chevronClass="left-[79px] top-[17.5px] size-[12px]" />
          <Button onClick={() => reserve(qty)} className="h-[47px] w-[435px] px-[32px]">{RESERVE}</Button>
        </div>
        <div className="h-[20px] shrink-0" />
        <div className="bg-white flex gap-[16px] h-[134px] items-start px-[20px] py-[13px] w-[550px]">
          <GiftIcon />
          <div className="flex flex-col font-sans font-normal gap-[4px] items-start text-[14px] text-[#2b231f] whitespace-nowrap">
            <p className="leading-[1.5]">How To Use Your Set</p>
            <ul className="list-disc marker:text-[10px]">
              {HOW_TO_USE.map((t) => <li key={t} className="ms-[21px] leading-[1.5]">{t}</li>)}
            </ul>
          </div>
        </div>
        <div className="h-[37px] shrink-0" />
        <div role="tablist" aria-label="Product details" className="flex gap-[34px] items-start">
          {TABS.map((t) => (
            <button key={t} role="tab" type="button" aria-selected={tab === t} onClick={() => setTab(t)} className="flex flex-col gap-[4px] items-start">
              <span className="font-sans font-normal leading-[1.4] text-[12px] text-[#2b231f] whitespace-nowrap">{t}</span>
              {tab === t ? <span className="bg-[#2b231f] h-px w-full block" /> : null}
            </button>
          ))}
        </div>
        <div className="h-[30px] shrink-0" />
        <div role="tabpanel" aria-label={tab}>
          {tab === "Description" ? (
            <>
              <div className="font-sans font-normal text-[14px] text-[#2b231f] w-[535px]">
                {DESCRIPTION.map((p) => <p key={p} className="leading-[1.5]">{p}</p>)}
              </div>
              <div className="h-[12px]" />
              <div className="font-sans font-normal text-[14px] text-[#2b231f] w-[535px]">
                <p className="leading-[1.5]">Includes</p>
                <ul className="list-disc marker:text-[10px]">{INCLUDES_D.map((t) => <li key={t} className="ms-[21px] leading-[1.5]">{t}</li>)}</ul>
              </div>
            </>
          ) : tab === "Notes" ? (
            <NotesPanel className="w-[535px]" />
          ) : (
            <p className="font-sans font-normal leading-[1.5] text-[14px] text-[#2b231f] w-[535px]">{INGREDIENTS_NOTE}</p>
          )}
        </div>
        <div className="h-[31px] shrink-0" />
        <p className="font-sans font-normal leading-[1.5] text-[14px] text-[#6b625b] w-[480px]">{DISCLAIMER}</p>
      </div>
    </section>
  );
}

function Accordion() {
  const [open, setOpen] = useState(true);
  return (
    <section className={`bg-white relative w-[1440px] ${open ? "h-[300px]" : "h-[68px]"}`}>
      <div className="absolute h-full left-[176px] top-0 w-[1088px]">
        <div className="absolute bg-[#d1cdc4] h-px left-0 top-0 w-[1088px]" />
        <button type="button" aria-expanded={open} aria-controls="ds-redeem-d" onClick={() => setOpen(!open)} className="absolute left-0 top-0 h-[68px] w-[1088px] text-left">
          <h2 className="absolute font-sans font-normal leading-[1.5] left-0 text-[16px] text-[#2b231f] top-[21.5px] whitespace-nowrap">FROM DISCOVERY TO BOTTLE</h2>
          <ChevronRight className={`absolute left-[1068px] size-[14px] top-[10px] text-[#2b231f] ${open ? "-rotate-90" : "rotate-90"}`} />
        </button>
        {open ? (
          <div id="ds-redeem-d">
            <p className="absolute font-sans font-normal leading-[1.5] left-0 text-[16px] text-[#2b231f] top-[108px] whitespace-nowrap">{REDEEM}</p>
            <div className="absolute font-sans font-normal left-0 text-[12px] text-[#2b231f] top-[138px] w-[1088px]">
              {STEPS.map((s) => <p key={s} className="leading-[17px]">{s}</p>)}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}

const EDITORIAL = [
  { n: "01", title: "THE SIX", titleLeft: 899, img: "ed-1", pTop: 451, labels: null as null | [string, number][],
    p: "Six house scents, from green and fresh to dry and woody. Each one is built to be worn every day, close to the skin, and each vial gives you about a week of real wear to decide." },
  { n: "02", title: "FILLED TO ORDER", titleLeft: 816, img: "ed-2", pTop: 433, labels: [["BLEND", 471], ["FILL", 519], ["LABEL", 557], ["SHIP", 604]] as [string, number][],
    p: "Nothing sits in a warehouse. Your full bottle is mixed at the next bench session after you order, filled by hand, and shipped the next weekday." },
  { n: "03", title: "YOUR NAME ON IT", titleLeft: 810, img: "ed-3", pTop: 433, labels: [["NAME", 471], ["CITY", 516], ["DATE", 556]] as [string, number][],
    p: "Every full bottle carries the name you choose, your city, and the date it was filled — so you always know exactly when it was made, and who it was made for." },
];
const SIX = ["LIBRARY MUSK", "FIG STUDY", "FIELD VETIVER", "LATE TEA", "SALT HOUR", "WORN LEATHER"];

function Editorial({ e }: { e: (typeof EDITORIAL)[number] }) {
  return (
    <section className="bg-[#f7f4f0] h-[640px] relative w-[1440px]">
      <p className="absolute font-serif leading-[1.25] left-[471px] text-[24px] text-[#2b231f] top-[40px] whitespace-nowrap">{e.n}</p>
      <div className="absolute bg-[#2b231f] h-px left-[471px] top-[76px] w-[80px]" />
      <h2 className="absolute font-serif leading-[1.25] text-[24px] text-[#2b231f] top-[41px] whitespace-nowrap" style={{ left: e.titleLeft }}>{e.title}</h2>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img alt="" loading="lazy" decoding="async" src={asset(`/img/discovery/${e.img}.webp`)} className="absolute h-[290px] left-[471px] top-[101px] w-[498px] object-cover" />
      {e.labels ? (
        e.labels.map(([t, l]) => (
          <p key={t} className="absolute font-sans font-normal leading-[1.4] text-[12px] text-[#2b231f] top-[409px] whitespace-nowrap" style={{ left: l }}>{t}</p>
        ))
      ) : (
        <div className="absolute flex flex-wrap gap-[4px_16px] items-start font-sans font-normal leading-[1.4] left-[471px] text-[12px] text-[#2b231f] top-[409px] w-[498px] whitespace-nowrap">
          {SIX.map((s) => <p key={s}>{s}</p>)}
        </div>
      )}
      <p className="absolute font-sans font-normal leading-[1.4] left-[471px] text-[12px] text-[#6b625b] text-justify w-[498px]" style={{ top: e.pTop }}>{e.p}</p>
    </section>
  );
}

function Family({ f, h, top }: { f: (typeof FAMILIES)[number]; h: number; top: number }) {
  return (
    <div className="bg-[#f7f4f0] relative text-[#2b231f] text-center w-[1440px]" style={{ height: h }}>
      <h2 className="absolute font-serif leading-[1.2] left-[176px] text-[32px] w-[1088px]" style={{ top }}>{f.name}</h2>
      <p className="absolute font-sans font-normal leading-[1.5] left-[176px] text-[16px] w-[1088px]" style={{ top: top + 46 }}>{f.words}</p>
    </div>
  );
}

function Slideshow({ f }: { f: (typeof FAMILIES)[number] }) {
  const c = useCycle(2);
  return (
    <section aria-roledescription="carousel" aria-label={`${f.name.toLowerCase()} scents`} className="bg-[#f7f4f0] h-[632px] overflow-hidden relative w-[1440px]">
      {f.slides.map((s, k) => (
        <div key={s.name} aria-hidden={k !== c.i} className={`absolute h-[632px] left-[471px] top-0 w-[498px] transition-opacity duration-300 ${k === c.i ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt={`${s.name.toLowerCase()} bottle`} loading="lazy" decoding="async" src={asset(`/img/discovery/${s.d}.webp`)} className="absolute h-[520px] left-0 top-0 w-[498px] object-cover" />
          <div className="absolute bg-white font-sans font-normal h-[112px] left-0 top-[520px] w-[498px] whitespace-nowrap">
            <h3 className="absolute leading-[1.5] left-[20px] text-[18px] text-[#2b231f] top-[20px]">{s.name}</h3>
            <p className="absolute leading-[1.4] left-[20px] text-[12px] text-[#6b625b] top-[45px]">{s.sub}</p>
            <p className="absolute leading-[1.4] left-[250px] text-[12px] text-[#2b231f] top-[20px]">{s.line}</p>
            <div className="absolute left-[250px] top-[38px]"><NoteLines notes={s.notes} /></div>
          </div>
        </div>
      ))}
      <button type="button" onClick={c.prev} aria-label="Previous scent" className="absolute bg-[#2b231f] left-[-20px] size-[40px] top-[296px]">
        <ChevronRight className="absolute left-[12px] size-[16px] top-[12px] rotate-180 text-white" />
      </button>
      <button type="button" onClick={c.next} aria-label="Next scent" className="absolute bg-[#2b231f] left-[1420px] size-[40px] top-[296px]">
        <ChevronRight className="absolute left-[12px] size-[16px] top-[12px] text-white" />
      </button>
      <div className="absolute h-[2px] left-[675px] top-[496px] w-[90px]">
        {[0, 1].map((k) => (
          <button key={k} type="button" onClick={() => c.setI(k)} aria-label={`Show ${f.slides[k].name.toLowerCase()}`}
            className={`absolute h-[2px] top-0 w-[40px] ${k === c.i ? "bg-white" : "border border-white border-solid"}`} style={{ left: k * 50 }} />
        ))}
      </div>
    </section>
  );
}

const VALUES = [
  { icon: "ic-genderless", label: "Genderless Fragrances", left: 180, w: 150 },
  { icon: "ic-vegan", label: "Vegan & Cruelty-Free", left: 474.5, w: 145 },
  { icon: "ic-filled", label: "Filled to Order", left: 796.5, w: 98 },
  { icon: "ic-ingredients", label: "Exceptional Ingredients", left: 1044.5, w: 160 },
];

function Values() {
  return (
    <section className="bg-[#ece8e1] h-[240px] relative w-[1440px]" aria-label="What we stand for">
      {VALUES.map((v) => (
        <div key={v.icon} className="absolute flex flex-col gap-[45px] items-center top-[66px]" style={{ left: v.left, width: v.w }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt="" src={asset(`/img/discovery/${v.icon}.png`)} className="shrink-0 size-[44px]" />
          <p className="font-serif leading-[1.3] text-[20px] text-[#2b231f] text-center whitespace-nowrap">{v.label}</p>
        </div>
      ))}
    </section>
  );
}

function StickyBar({ show }: { show: boolean }) {
  const reserve = useReserveDiscovery();
  return (
    <div aria-hidden={!show} className={`fixed bottom-0 left-0 z-40 bg-white border-t border-[#d1cdc4] h-[80px] w-[1440px] transition-transform duration-300 ${show ? "translate-y-0" : "translate-y-full invisible"}`}>
      <p className="absolute font-sans font-normal leading-[1.5] left-[32px] text-[16px] text-[#2b231f] top-[30.5px] whitespace-nowrap">{TITLE}</p>
      <p className="absolute font-sans font-normal leading-[1.5] left-[290px] text-[14px] text-[#2b231f] top-[31.5px] whitespace-nowrap">• $22.00</p>
      <Button onClick={() => reserve(1)} className="!absolute left-[1148px] top-[15px] h-[50px] w-[260px] px-[32px]">{RESERVE}</Button>
    </div>
  );
}

export function DiscoveryDesktop() {
  const reserveRef = useRef<HTMLDivElement>(null);
  const passed = usePassed(reserveRef);
  return (
    <>
      <HeaderDesktop />
      <Hero reserveRef={reserveRef} />
      <Accordion />
      <section className="bg-[#ece8e1] h-[1068px] relative w-[1440px]" aria-label="Discover your scent">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img alt="Discover your scent. Every Fieldnote house scent in one set." loading="lazy" decoding="async" src={asset("/img/discovery/campaign-d.webp")} className="absolute h-[1068px] left-[471px] top-0 w-[498px] object-cover" />
      </section>
      {EDITORIAL.map((e) => <Editorial key={e.n} e={e} />)}
      <div className="bg-[#f7f4f0] h-[100px] w-[1440px]" />
      {FAMILIES.map((f, k) => (
        <div key={f.name}>
          <Family f={f} h={k === 0 ? 185 : 225} top={k === 0 ? 100 : 140} />
          <Slideshow f={f} />
        </div>
      ))}
      <div className="bg-[#f7f4f0] h-[130px] w-[1440px]" />
      <Values />
      <Newsletter device="d" />
      <FooterDesktop />
      <StickyBar show={passed} />
    </>
  );
}
