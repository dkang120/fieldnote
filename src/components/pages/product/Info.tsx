"use client";

/* Info column: desktop "Info" (57:1750, 550 wide) and tablet "Info" (174:2557, 704 wide). */
import { Button } from "@/components/site/ui";
import { Callout, Divider, Gap, Meter, OtherPanel, QtySelect, SizeTiles, T12, T14, Tabs, Upsell } from "./parts";
import { DISCLAIMER, HELPER, LABEL_MAX } from "./data";
import type { ProductState } from "./useProduct";

export function Info({ p, device }: { p: ProductState; device: "d" | "t" }) {
  const W = device === "d" ? 550 : 704;
  const storyW = device === "d" ? 535 : 704;
  const idp = device;
  const c = p.c;
  const input = "bg-white border border-[#2b231f] border-solid h-[47px] pl-[14px] w-[270px] font-sans font-normal leading-[1.5] text-[14px] text-[#2b231f] outline-none focus:border-[1.5px]";
  return (
    <div className="flex flex-col items-start relative shrink-0" style={{ width: W }}>
      <h1 className="font-serif font-normal leading-[1.3] not-italic text-[20px] text-[#2b231f] whitespace-nowrap">{c.title}</h1>
      <Gap h={20} />
      <p className={`${T14} whitespace-nowrap`}>{c.scent.mood}</p>
      <Gap h={20} />
      <Callout ships={p.ships} className={`gap-[16px] h-[60px] items-center px-[20px] py-[13px] ${device === "d" ? "w-[550px]" : "w-[704px]"}`} textClass="whitespace-nowrap" />
      <Gap h={38} />
      <SizeTiles p={p} idp={idp} />
      <Gap h={24} />
      <p className={`${T12} whitespace-nowrap`} id={`lbl-${idp}`}>Your label</p>
      <Gap h={8} />
      <div className="flex gap-[10px] items-start relative shrink-0" role="group" aria-labelledby={`lbl-${idp}`}>
        <input ref={p.nameRef(idp)} aria-label="Name on label" aria-invalid={!!p.error} aria-describedby={`help-${idp}`} placeholder="Name (e.g. Avery M.)" maxLength={LABEL_MAX}
          value={p.name} onChange={(e) => p.setName(e.target.value)} autoComplete="name" className={input} />
        <input aria-label="City on label" placeholder="City (e.g. Los Angeles, CA)" maxLength={LABEL_MAX}
          value={p.city} onChange={(e) => p.setCity(e.target.value)} autoComplete="address-level2" className={input} />
      </div>
      <Gap h={8} />
      <p id={`help-${idp}`} role={p.error ? "alert" : undefined} className={`${T12} ${p.error ? "!text-[#9a4f31]" : "!text-[#6b625b]"} ${device === "d" ? "whitespace-nowrap" : ""}`} style={device === "t" ? { width: W } : undefined}>
        {p.error ?? HELPER}
      </p>
      <Gap h={16} />
      <div className="flex gap-[10px] items-start relative shrink-0">
        <QtySelect p={p} id={`qty-${idp}`} className="h-[47px] [&>svg]:left-[90px] [&>svg]:top-[17.5px]" />
        <div ref={p.buyRef(idp)}>
          <Button className="h-[47px] px-[32px] w-[435px]" onClick={() => p.reserve(idp)}>Reserve, pay at launch</Button>
        </div>
      </div>
      <Gap h={37} />
      <Tabs p={p} idp={idp} />
      <Gap h={30} />
      <div id={`panel-${idp}`} role="tabpanel" aria-labelledby={`tab-${idp}-${p.tab}`} className="flex flex-col items-start">
        {p.tab === "description" ? (
          <>
            <p className={`${T14} whitespace-nowrap`}>FRAGRANCE PROFILE: {c.profile}</p>
            <Gap h={17} />
            <Divider w={storyW} />
            <Gap h={19} />
            <p className={T14} style={{ width: storyW }}>{c.story}</p>
            <Gap h={30} />
            <p className={`${T14} !text-[#6b625b]`} style={{ width: device === "d" ? 480 : 704 }}>{DISCLAIMER}</p>
          </>
        ) : (
          <OtherPanel p={p} width={storyW} />
        )}
      </div>
      <Gap h={22} />
      <Divider w={W} />
      {c.meters ? (
        <>
          <Gap h={21} />
          <Meter label="Projection / Sillage" value={c.meters.projection} ends={["Soft", "Moderate", "Strong"]} segW={107} width={W} />
          <Gap h={8} />
          <Meter label="Longevity" value={c.meters.longevity} ends={["1 Hour", "4 Hours", "8 Hours"]} segW={107} width={W} />
          <Gap h={19} />
          <Divider w={W} />
        </>
      ) : null}
      <Gap h={21} />
      <h2 className={`${T14} whitespace-nowrap`}>Related Products</h2>
      <Gap h={16} />
      <Upsell width={W} textW={302} bagX={518} />
    </div>
  );
}
