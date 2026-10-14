"use client";
/* eslint-disable @next/next/no-img-element */

/* Sections below the buy area: Video (91:1507 / 100:2058), Divider, Campaign still, Notes trio, Definition + collection,
   Related grid (91:1540 / 100:2092) and Value bar (91:1598 / 100:2140). Desktop "d" and phone "p" only; tablet has none. */
import Link from "next/link";
import { useState } from "react";
import { asset } from "@/lib/site";
import { getScent, type Scent } from "@/lib/scents";
import { PROFILE, relatedFor } from "./data";
import { T12, T14 } from "./parts";
import type { ProductState } from "./useProduct";

type D = "d" | "p";
const P = "/img/product";

function Pause({ x, y }: { x: number; y: number }) {
  // The design shows a play/pause control over a still; there is no film yet, so it is drawn but not interactive.
  return (
    <div aria-hidden className="absolute bg-white size-[40px]" style={{ left: x, top: y }}>
      <span className="absolute bg-[#2b231f] h-[10px] w-[2.5px] left-[16px] top-[15px]" />
      <span className="absolute bg-[#2b231f] h-[10px] w-[2.5px] left-[21.5px] top-[15px]" />
    </div>
  );
}

export function Video({ d }: { d: D }) {
  const [w, h] = d === "d" ? [1440, 811] : [390, 220];
  return (
    <section className="bg-white relative overflow-clip" style={{ width: w, height: h }} aria-label="At the bench">
      <img alt="Hands pouring Fig Study into a bottle on a kitchen scale, finished labeled bottles on the bench" src={asset(`${P}/video.webp`)} className="absolute inset-0 size-full object-cover" />
      {d === "d" ? <Pause x={700} y={385.5} /> : <Pause x={175} y={90} />}
    </section>
  );
}

export function Rule({ d }: { d: D }) {
  return d === "d" ? (
    <div className="bg-white h-[101px] relative w-[1440px]"><div className="absolute bg-[#d1cdc4] h-px left-[32px] top-[50px] w-[1376px]" /></div>
  ) : (
    <div className="bg-white h-[61px] relative w-[390px]"><div className="absolute bg-[#d1cdc4] h-px left-[16px] top-[30px] w-[358px]" /></div>
  );
}

export function Campaign({ d }: { d: D }) {
  const img = <img alt="Fig Study on a stone slab under a fig branch, with a split fig and a small white vase" src={asset(`${P}/campaign.webp`)} className="absolute inset-0 size-full object-cover" />;
  return d === "d" ? (
    <div className="bg-white h-[627px] relative w-[1440px]"><div className="absolute left-[472px] top-0 h-[627px] w-[496px]">{img}</div></div>
  ) : (
    <div className="bg-white h-[494px] relative w-[390px]">{img}</div>
  );
}

const NOTES = [
  { img: "note1", alt: "A fig leaf", label: "TOP", lines: "Fig leaf\nBergamot" },
  { img: "note2", alt: "A ripe fig cut in half", label: "HEART", lines: "Fig milk\nViolet leaf" },
  { img: "note3", alt: "A block of cedar with wood shavings", label: "BASE", lines: "Cedar\nCoconut wood" },
];

export function NotesTrio({ d }: { d: D }) {
  const dk = d === "d";
  const xs = dk ? [508, 656, 804] : [28, 144, 261];
  const [pw, ph, py] = dk ? [128, 168, 219] : [101, 132, 173];
  const [ly, iy] = dk ? [409.5, 443.9] : [323.8, 350.2];
  return (
    <section className="bg-white relative" style={{ width: dk ? 1440 : 390, height: dk ? 617 : 486 }} aria-labelledby={`notes-${d}`}>
      {dk ? (
        <h2 id={`notes-${d}`} className="absolute font-serif font-normal leading-[1.3] text-[20px] text-[#2b231f] whitespace-nowrap left-[511px] top-[80.4px]">GREEN WOODY FIG</h2>
      ) : (
        <h2 id={`notes-${d}`} className="absolute font-sans font-normal leading-[1.5] text-[16px] text-[#2b231f] whitespace-nowrap left-[31px] top-[63.6px]">GREEN WOODY FIG</h2>
      )}
      <div className="absolute bg-[#6b625b] h-px" style={dk ? { left: 716, top: 96, width: 213 } : { left: 196, top: 73, width: 164 }} />
      <p className={`absolute font-sans font-normal leading-[1.5] text-[#2b231f] whitespace-nowrap ${dk ? "text-[18px] left-[509.8px] top-[111.7px]" : "text-[14px] left-[30px] top-[87.7px]"}`}>Green &amp; Milky</p>
      {NOTES.map((n, i) => (
        <div key={n.label}>
          <img alt={n.alt} src={asset(`${P}/${n.img}.webp`)} className="absolute object-cover" style={{ left: xs[i], top: py, width: pw, height: ph }} />
          <p className={`absolute ${T12} whitespace-nowrap text-center -translate-x-1/2`} style={{ left: xs[i] + pw / 2, top: ly }}>{n.label}</p>
          <p className={`absolute ${T12} whitespace-pre text-center -translate-x-1/2`} style={{ left: xs[i] + pw / 2, top: iy }}>{n.lines}</p>
        </div>
      ))}
    </section>
  );
}

const COLLECTION_P = "Six house scents, built to be worn every day. Library Musk, Fig Study, Field Vetiver, Late Tea, Salt Hour and Worn Leather each start from a short list of good materials and one clear place they belong: a quiet floor at 9am, or the walk across campus. Each bottle is mixed after you order and labeled with your name.";
const COLLECTION = "Six house scents, built to be worn every day. Library Musk, Fig Study, Field Vetiver, Late Tea, Salt Hour and Worn Leather each start from a short list of good materials and one clear place they belong: a quiet floor at 9am, the walk across campus, the hour before sunset. Each bottle is mixed after you order and labeled with your name.";

/** Definition + collection. `definition` is false for scents other than Fig Study: only the collection block shows. */
export function Definition({ d, definition }: { d: D; definition: boolean }) {
  const dk = d === "d";
  const off = definition ? 0 : dk ? 370 - 64 : 292 - 40; // move the collection block up when the definition is hidden
  const H = (dk ? 933 : 735) - off;
  return (
    <section className="bg-white relative" style={{ width: dk ? 1440 : 390, height: H }}>
      {definition ? (
        dk ? (
          <>
            <p className="absolute font-serif font-normal leading-[1.2] text-[32px] text-[#2b231f] whitespace-nowrap left-[639.5px] top-[37.9px]">FIG STUDY</p>
            <p className="absolute font-sans font-normal leading-[1.5] text-[18px] text-[#6b625b] whitespace-pre left-[645.9px] top-[98.7px]">No. 02  /fig ˈstədē/</p>
            <div className="absolute bg-[#6b625b] h-[2px] left-[565px] top-[138px] w-[310px]" />
            <p className="absolute font-sans font-normal leading-[1.5] text-[16px] text-[#2b231f] whitespace-nowrap left-[598px] top-[173.8px]">noun</p>
            <p className="absolute font-sans font-normal leading-[1.5] text-[16px] text-[#2b231f] whitespace-pre left-[658px] top-[173.8px]">{"a close look at one fig tree at the end of summer.\ngreen leaf over milky fruit, settled on dry cedar.\nsomething worn to a morning class with the windows open."}</p>
          </>
        ) : (
          <>
            <p className="absolute font-serif font-normal leading-[1.25] text-[24px] text-[#2b231f] whitespace-nowrap left-[133.6px] top-[29.2px]">FIG STUDY</p>
            <p className="absolute font-sans font-normal leading-[1.5] text-[14px] text-[#6b625b] whitespace-pre left-[138.3px] top-[76.7px]">No. 02  /fig ˈstədē/</p>
            <div className="absolute bg-[#6b625b] h-[2px] left-[73px] top-[108px] w-[244px]" />
            <p className="absolute font-sans font-normal leading-[1.5] text-[14px] text-[#2b231f] whitespace-nowrap left-[99px] top-[138.2px]">noun</p>
            <p className="absolute font-sans font-normal leading-[1.5] text-[14px] text-[#2b231f] whitespace-pre-line left-[139px] top-[138.2px] w-[235px]">{"a close look at one fig tree at the end of summer.\ngreen leaf over milky fruit, settled on dry cedar.\nsomething worn to a morning class with the windows open."}</p>
          </>
        )
      ) : null}
      {dk ? (
        <>
          <img alt="The six house scents in a row on a stone slab" src={asset(`${P}/group.webp`)} className="absolute object-cover left-[528px] h-[277px] w-[384px]" style={{ top: 370 - off }} />
          <h2 className="absolute font-sans font-normal leading-[1.5] text-[18px] text-[#2b231f] whitespace-nowrap left-[529.2px]" style={{ top: 699 - off }}>THE HOUSE SCENTS</h2>
          <p className={`absolute ${T12} whitespace-nowrap left-[820.6px]`} style={{ top: 705.1 - off }}>COLLECTION 1</p>
          <p className={`absolute ${T14} text-justify left-[528px] w-[386px]`} style={{ top: 739.7 - off }}>{COLLECTION}</p>
        </>
      ) : (
        <>
          <img alt="The six house scents in a row on a stone slab" src={asset(`${P}/group.webp`)} className="absolute object-cover left-[44px] h-[217px] w-[302px]" style={{ top: 292 - off }} />
          <h2 className={`absolute ${T14} whitespace-nowrap left-[45px]`} style={{ top: 550.4 - off }}>THE HOUSE SCENTS</h2>
          <p className={`absolute ${T12} whitespace-nowrap left-[268.5px]`} style={{ top: 553.5 - off }}>COLLECTION 1</p>
          <p className={`absolute ${T12} text-justify left-[45px] w-[300px]`} style={{ top: 583.2 - off }}>{COLLECTION_P}</p>
        </>
      )}
    </section>
  );
}

/** Product card from the Figma "Product card" component (desktop 361×441, phone slide 338×413). */
function Card({ s, d, x }: { s: Scent; d: D; x: number }) {
  const dk = d === "d";
  const badge = s.slug === "library-musk" ? "Best Seller" : null; // as drawn on this frame
  return (
    <Link href={`/scents/${s.slug}/`} className="absolute bg-white border border-[#d1cdc4] border-solid block group" style={{ left: x, top: 0, width: dk ? 361 : 338, height: dk ? 441 : 413 }}>
      <img alt="" src={asset(`/img/scents/${s.slug}.webp`)} className="absolute left-0 top-0 object-cover" style={{ width: dk ? 359 : 336, height: dk ? 360 : 338 }} />
      <div className="absolute left-0 bg-[#d1cdc4] h-px" style={{ top: dk ? 360 : 338, width: dk ? 359 : 336 }} />
      {badge ? (
        <span className={`absolute left-[6px] top-[6px] bg-[#6b625b] ${T12} !text-white whitespace-nowrap ${dk ? "px-[15px] py-[6px]" : "px-[14px] py-[5px]"}`}>{badge}</span>
      ) : null}
      <div className="absolute" style={dk ? { left: 20, top: 370, width: 319 } : { left: 12, top: 351, width: 312 }}>
        <p className={`${T12} text-center w-full group-hover:underline`}>{s.name.toUpperCase()} (No. {s.no}) Eau De Parfum</p>
        <p className={`${T12} !text-[#6b625b] text-center w-full ${dk ? "mt-[4px]" : "mt-[3px]"}`}>{PROFILE[s.slug]}</p>
        <p className={`${T12} !text-[#6b625b] flex gap-[4px] justify-center w-full ${dk ? "mt-[6px]" : "mt-[3px]"}`}><span>From</span><span>$78.00</span></p>
      </div>
    </Link>
  );
}

export function Related({ d, p }: { d: D; p: ProductState }) {
  const dk = d === "d";
  const [tab, setTab] = useState<"related" | "viewed">("related");
  const list = tab === "related" ? relatedFor(p.c.scent) : p.viewed.map((x) => getScent(x)).filter((x): x is Scent => !!x).slice(0, 4);
  const step = dk ? 360 : 337;
  const tabCls = `absolute ${T12} whitespace-nowrap`;
  const tabs = dk ? { a: 588.5, b: 740.5, y: 34.8, ux: 589, uy: 48, uwA: 121, uwB: 113 } : { a: 63, b: 215, y: 23, ux: 63, uy: 41, uwA: 130, uwB: 117 };
  return (
    <section className="bg-white relative" style={{ width: dk ? 1440 : 390, height: dk ? 532 : 472 }} aria-label="More scents">
      <div role="tablist" aria-label="More scents">
        <button type="button" role="tab" aria-selected={tab === "related"} onClick={() => setTab("related")} className={tabCls} style={{ left: tabs.a, top: tabs.y }}>RELATED PRODUCTS</button>
        <button type="button" role="tab" aria-selected={tab === "viewed"} onClick={() => setTab("viewed")} className={tabCls} style={{ left: tabs.b, top: tabs.y }}>RECENTLY VIEWED</button>
      </div>
      <div className="absolute bg-[#2b231f] h-px" style={tab === "related" ? { left: tabs.ux, top: tabs.uy, width: tabs.uwA } : { left: tabs.b, top: tabs.uy, width: tabs.uwB }} />
      <div className={`absolute left-0 w-full ${dk ? "top-[90px] h-[442px]" : "top-[59px] h-[413px] overflow-x-auto overflow-y-clip [scrollbar-width:none] snap-x snap-mandatory"}`}>
        <div className="relative h-full" style={{ width: dk ? 1440 : Math.max(390, step * list.length + 1) }}>
          {list.length ? list.map((s, i) => (
            <div key={s.slug} className="snap-start">
              <Card s={s} d={d} x={step * i - (dk && i === 3 ? 1 : 0)} />
            </div>
          )) : (
            <p className={`absolute ${T14} !text-[#6b625b] whitespace-nowrap ${dk ? "left-[588.5px] top-[24px]" : "left-[63px] top-[24px]"}`}>Scents you open will show up here.</p>
          )}
        </div>
      </div>
    </section>
  );
}

const VALUES = [
  { icon: "icon-genderless", d: "Genderless Fragrances", p: "Genderless Fragrances" },
  { icon: "icon-vegan", d: "Vegan & Cruelty-Free", p: "Vegan & Cruelty-Free" },
  { icon: "icon-filled", d: "Filled to Order", p: "Filled to Order" },
  { icon: "icon-ingredients", d: "Exceptional Ingredients", p: "Plain-Word Ingredients" },
];

export function Values({ d }: { d: D }) {
  if (d === "d") {
    return (
      <section className="bg-[#ece8e1] h-[220px] relative w-[1440px]">
        {VALUES.map((v, i) => (
          <div key={v.icon} className="absolute flex flex-col gap-[19px] items-center top-[41px] w-[248px]" style={{ left: 176 + 280 * i }}>
            <img alt="" src={asset(`${P}/${v.icon}.png`)} className="size-[80px]" />
            <p className="font-sans font-normal leading-[1.5] text-[16px] text-[#2b231f] text-center w-full">{v.d}</p>
          </div>
        ))}
      </section>
    );
  }
  return (
    <section className="bg-[#ece8e1] h-[318px] relative w-[390px]">
      {VALUES.map((v, i) => (
        <div key={v.icon}>
          <img alt="" src={asset(`${P}/${v.icon}.png`)} className="absolute size-[80px]" style={{ left: i % 2 ? 248 : 61, top: i < 2 ? 25 : 168 }} />
          <p className={`absolute ${T12} text-center w-[170px]`} style={{ left: i % 2 ? 203 : 16, top: i < 2 ? 121 : 264 }}>{v.p}</p>
        </div>
      ))}
    </section>
  );
}
