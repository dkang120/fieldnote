"use client";
/* eslint-disable @next/next/no-img-element */

/* Product page frames: desktop 22:1307 (1440), tablet 174:2530 (768), phone 23:1482 (390);
   sticky buy bar 57:1913 (desktop) and the phone "Cart bar" (100:2185). */
import { Frames } from "@/components/Frames";
import { HeaderDesktop, HeaderPhone, FooterDesktop, FooterPhone } from "@/components/site/Chrome";
import { Newsletter } from "@/components/site/Newsletter";
import { Button } from "@/components/site/ui";
import { asset } from "@/lib/site";
import { getScent } from "@/lib/scents";
import { Info } from "./Info";
import { Campaign, Definition, NotesTrio, Related, Rule, Values, Video } from "./Sections";
import { Callout, Chevron, Divider, OtherPanel, QtySelect, SizeTiles, T12, T14, Tabs, Upsell } from "./parts";
import { DISCLAIMER, HELPER, LABEL_MAX, fmt } from "./data";
import { useProduct, type ProductState } from "./useProduct";

function MainImage({ p, className, style }: { p: ProductState; className?: string; style?: React.CSSProperties }) {
  const img = p.image === null || !p.c.thumbs ? p.c.main : p.c.thumbs[p.image];
  return <img alt={img.alt} src={asset(img.src)} className={`object-cover ${className ?? ""}`} style={style} />;
}

function Thumbs({ p, size, gap, under }: { p: ProductState; size: number; gap: number; under: number }) {
  if (!p.c.thumbs) return null;
  return (
    <div className="flex items-start relative shrink-0" style={{ gap }} role="group" aria-label="Product images">
      {p.c.thumbs.map((t, i) => (
        <button key={t.src} type="button" onClick={() => p.pick(i)} aria-label={`Show image ${i + 1}: ${t.alt}`} aria-pressed={p.active === i}
          className="flex flex-col items-start relative shrink-0" style={{ width: size }}>
          <img alt="" src={asset(t.thumb)} className="object-cover shrink-0" style={{ width: size, height: size }} />
          <span className={`h-[2px] w-full shrink-0 ${p.active === i ? "bg-[#2b231f]" : ""}`} style={{ marginTop: under }} />
        </button>
      ))}
    </div>
  );
}

function Desktop({ p }: { p: ProductState }) {
  const fig = p.c.figStudy;
  return (
    <>
      <HeaderDesktop />
      <main className="bg-white flex gap-[85px] items-start min-h-[1216px] pl-[32px] pt-[70px] pb-[6px] relative w-[1440px]">
        <div className="relative shrink-0 w-[688px]">
          <MainImage p={p} className="block size-[688px]" />
          {p.c.thumbs ? (
            <>
              <button type="button" aria-label="Previous image" onClick={() => p.step(-1)} className="absolute bg-white flex items-center justify-center left-[-20px] size-[40px] top-[324px]">
                <Chevron size={16} dir="left" />
              </button>
              <button type="button" aria-label="Next image" onClick={() => p.step(1)} className="absolute bg-white flex items-center justify-center left-[668px] size-[40px] top-[324px]">
                <Chevron size={16} />
              </button>
              <div className="mt-[10px]"><Thumbs p={p} size={76} gap={10} under={7} /></div>
            </>
          ) : null}
        </div>
        <Info p={p} device="d" />
      </main>
      {fig ? (<><Video d="d" /><Rule d="d" /><Campaign d="d" /><NotesTrio d="d" /></>) : null}
      <Definition d="d" definition={fig} />
      <Related d="d" p={p} />
      <Values d="d" />
      <Newsletter device="d" />
      <FooterDesktop />
      <StickyBar p={p} />
    </>
  );
}

function StickyBar({ p }: { p: ProductState }) {
  if (!p.barVisible) return null;
  return (
    <div className="fixed bottom-0 inset-x-0 z-40 flex justify-center pointer-events-none">
      <div className="bg-white border-[#d1cdc4] border-t border-solid h-[80px] relative w-[1440px] pointer-events-auto">
        <p className="absolute font-sans font-normal leading-[1.5] text-[16px] text-[#2b231f] whitespace-nowrap left-[32px] top-[29.5px]">{p.c.title}</p>
        <p className={`absolute ${T14} whitespace-pre left-[320px] top-[30.5px]`}>{`•  ${fmt(p.price)}`}</p>
        <Button className="absolute h-[50px] left-[1148px] px-[32px] top-[14px] w-[260px]" onClick={() => p.reserve("d")}>Reserve, pay at launch</Button>
      </div>
    </div>
  );
}

function Tablet({ p }: { p: ProductState }) {
  return (
    <>
      <HeaderPhone width={768} />
      <main className="flex flex-col gap-[16px] items-start pb-[64px] pt-[24px] px-[32px] relative w-[768px]">
        <div className="flex flex-col gap-[16px] items-start w-[704px]">
          {p.c.stacked.map((s, i) => (
            i === 0 ? <MainImage key="main" p={p} className="block w-[704px]" style={{ height: s.h }} />
              : <img key={s.src} alt={s.alt} src={asset(s.src)} className="block object-cover w-[704px]" style={{ height: s.h }} />
          ))}
        </div>
        <Info p={p} device="t" />
      </main>
      <Newsletter device="t" />
      <FooterPhone width={768} />
    </>
  );
}

function PhoneMain({ p }: { p: ProductState }) {
  const c = p.c;
  const input = "bg-white border border-[#d1cdc4] border-solid h-[47px] pl-[14px] pt-[4px] w-[358px] font-sans font-normal leading-[1.5] text-[14px] text-[#2b231f] outline-none focus:border-[#2b231f] shrink-0";
  return (
    <main className="bg-white flex flex-col items-start pb-[40px] pt-[42px] relative w-[390px]">
      <MainImage p={p} className="block ml-[16px] size-[358px] shrink-0" />
      {c.thumbs ? (
        <div className="ml-[16px] mt-[10px] h-[84px] w-[374px] overflow-x-auto overflow-y-clip shrink-0 [scrollbar-width:none]">
          <Thumbs p={p} size={75} gap={9.868} under={6.9} />
        </div>
      ) : null}
      <div className="flex flex-col items-start px-[16px] w-[390px]" style={{ marginTop: c.thumbs ? 11 : 15 }}>
        <h1 className="font-sans font-normal leading-[1.5] text-[16px] text-[#2b231f] w-[358px]">{c.title}</h1>
        <p className={`${T12} mt-[15px] w-[358px]`}>{c.scent.mood}</p>
        <Callout ships={p.ships} className="mt-[14px] min-h-[50px] w-[358px] gap-[16px] pl-[16px] pr-[32px] pt-[11px] pb-[5px] items-start [&>svg]:mt-[7px]" textClass="w-[280px]" />
        <div className="mt-[42px]"><SizeTiles p={p} idp="p" /></div>
        <p className={`${T12} mt-[24px] whitespace-nowrap`} id="lbl-p">YOUR LABEL</p>
        <input ref={p.nameRef("p")} aria-labelledby="lbl-p" aria-label="Name on label" aria-invalid={!!p.error} aria-describedby="help-p" placeholder="Name (e.g. Avery M.)" maxLength={LABEL_MAX}
          value={p.name} onChange={(e) => p.setName(e.target.value)} autoComplete="name" className={`${input} mt-[7px]`} />
        <input aria-label="City on label" placeholder="City (e.g. Los Angeles, CA)" maxLength={LABEL_MAX}
          value={p.city} onChange={(e) => p.setCity(e.target.value)} autoComplete="address-level2" className={`${input} mt-[10px]`} />
        <p id="help-p" role={p.error ? "alert" : undefined} className={`${T12} mt-[8px] w-[358px] ${p.error ? "!text-[#9a4f31]" : "!text-[#6b625b]"}`}>{p.error ?? HELPER}</p>
        <div className="flex gap-[10px] items-start mt-[8px] h-[44px]">
          <QtySelect p={p} id="qty-p" className="h-[40px] mt-[2px] [&>svg]:left-[78px] [&>svg]:top-[12.5px]" />
          <div ref={p.buyRef("p")}>
            <Button className="h-[44px] px-[32px] w-[243px]" onClick={() => p.reserve("p")}>Reserve, pay at launch</Button>
          </div>
        </div>
        <div className="relative h-[19px] mt-[45px] w-[358px] -ml-[16px]"><Tabs p={p} idp="p" upper /></div>
        <div id="panel-p" role="tabpanel" aria-labelledby={`tab-p-${p.tab}`} className="flex flex-col items-start mt-[25px]">
          {p.tab === "description" ? (
            <>
              <p className={`${T14} whitespace-nowrap`}>FRAGRANCE PROFILE: {c.profile}</p>
              <div className="mt-[13px]"><Divider w={343} /></div>
              <p className={`${T14} mt-[19px] w-[343px]`}>{c.story}</p>
              <p className={`${T14} !text-[#6b625b] mt-[16px] w-[343px]`}>{DISCLAIMER}</p>
            </>
          ) : <OtherPanel p={p} width={343} />}
        </div>
        <div className="mt-[10px]"><Divider w={358} /></div>
        {c.meters ? (
          <>
            <div className="mt-[21px]">
              <PhoneMeter label="Projection / Sillage" value={c.meters.projection} ends={["Soft", "Moderate", "Strong"]} xs={[0, 151.5, 320]} />
            </div>
            <div className="mt-[2px]">
              <PhoneMeter label="Longevity" value={c.meters.longevity} ends={["1 Hour", "4 Hours", "8 Hours"]} xs={[0, 156.5, 313]} />
            </div>
            <div className="mt-[16px]"><Divider w={358} /></div>
          </>
        ) : null}
        <h2 className={`${T12} mt-[21px] whitespace-nowrap`}>Related Products</h2>
        <div className="mt-[14px]"><Upsell width={358} textW={174} bagX={326} wrap /></div>
      </div>
    </main>
  );
}

/** Phone meters: segments at x 0/72/145/217/290 (68 wide), labels placed as drawn. */
function PhoneMeter({ label, value, ends, xs }: { label: string; value: number; ends: [string, string, string]; xs: [number, number, number] }) {
  return (
    <div className="relative h-[60px] w-[358px]">
      <p className={`${T14} whitespace-nowrap`}>{label}</p>
      <div role="img" aria-label={`${label}: ${value} of 5`}>
        {[0, 72, 145, 217, 290].map((x, i) => (
          <div key={x} className={`absolute h-[3px] rounded-[3px] top-[27px] w-[68px] ${i + 1 === value ? "bg-[#2b231f]" : "bg-[#d1cdc4]"}`} style={{ left: x }} />
        ))}
      </div>
      {ends.map((e, i) => <p key={e} className={`absolute ${T12} whitespace-nowrap top-[43px]`} style={{ left: xs[i] }}>{e}</p>)}
    </div>
  );
}

function CartBar({ p }: { p: ProductState }) {
  if (!p.barVisible) return null;
  return (
    <div className="fixed bottom-0 inset-x-0 z-40 flex justify-center pointer-events-none">
      <div className="bg-white border-[#d1cdc4] border-t border-solid h-[120px] relative w-[390px] pointer-events-auto">
        <p className={`absolute ${T14} text-center left-[16px] top-[17px] w-[358px]`}>{p.c.title}</p>
        <p className={`absolute ${T12} text-center left-[16px] top-[36px] w-[358px]`}>{fmt(p.price)}</p>
        <Button className="absolute h-[44px] left-[16px] px-[32px] top-[57.5px] w-[358px]" onClick={() => p.reserve("p")}>Reserve, pay at launch</Button>
      </div>
    </div>
  );
}

function Phone({ p }: { p: ProductState }) {
  const fig = p.c.figStudy;
  return (
    <div className="pb-[120px] bg-white">
      <HeaderPhone />
      <PhoneMain p={p} />
      {fig ? (<><Video d="p" /><Rule d="p" /><Campaign d="p" /><NotesTrio d="p" /></>) : null}
      <Definition d="p" definition={fig} />
      <Related d="p" p={p} />
      <Values d="p" />
      <Newsletter device="p" />
      <FooterPhone />
      <CartBar p={p} />
    </div>
  );
}

export function Product({ slug }: { slug: string }) {
  const scent = getScent(slug)!;
  const p = useProduct(scent);
  return <Frames phone={<Phone p={p} />} tablet={<Tablet p={p} />} desktop={<Desktop p={p} />} />;
}
