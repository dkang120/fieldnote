/* eslint-disable @next/next/no-img-element -- static export: images are pre-sized exports in public/img/how */
/* How it's made, phone 390 (Figma 170:1837). Header and footer come from site/Chrome. */
import { Fragment } from "react";
import { asset } from "@/lib/site";
import { EMAIL, FACTS, FAQ, INTRO, LINES, STEPS, T } from "./content";

export function HowPhone() {
  return (
    <div className="w-[390px]">
      {/* Intro 170:1852 */}
      <section className="[word-break:break-word] bg-[#ece8e1] flex flex-col gap-[24px] items-start px-[16px] py-[56px] w-full">
        <p className={T.monoLabel}>{INTRO.eyebrow}</p>
        <h1 className="font-serif font-normal leading-[38px] text-[36px] text-[#2b231f] tracking-[-0.36px] w-[358px]">{INTRO.title}</h1>
        <p className="font-sans font-normal leading-[1.5] text-[18px] text-[#6b625b] w-[358px]">{INTRO.lede}</p>
        <p className="font-sans font-normal leading-[1.5] text-[14px] text-[#2b231f] w-[358px]">{INTRO.note}</p>
      </section>

      {/* Bench 170:1857 */}
      <section className="bg-[#f7f4f0] px-[16px] py-[56px] w-full">
        <div className="flex flex-col gap-[32px] items-start w-full">
          <div className="h-[280px] relative shrink-0 w-[358px]">
            <img alt="Hands setting a black cap on a freshly filled bottle on a wooden bench" className="absolute inset-0 object-cover size-full" src={asset("/img/how/bench-p.webp")} />
          </div>
          <div className="[word-break:break-word] flex flex-col items-start w-full">
            <h2 className="font-serif font-normal leading-[1.25] text-[24px] text-[#2b231f] w-full">How a bottle is filled to order</h2>
            <ol className="w-full">
              {STEPS.map((s) => (
                <li key={s.title} className="border-[#d1cdc4] border-solid border-t flex flex-col gap-[6px] items-start py-[16px] w-full">
                  <p className={T.monoLabel}>{s.label}</p>
                  <h3 className="font-serif font-normal leading-[1.3] text-[20px] text-[#2b231f] whitespace-nowrap">{s.title}</h3>
                  <p className="font-sans font-normal leading-[1.5] text-[14px] text-[#6b625b] w-full">{s.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Video/Bench 170:1886 (a still in the design) */}
      <div className="h-[220px] relative w-full">
        <img alt="Pouring fragrance into a bottle on a scale at the bench" className="absolute inset-0 object-cover size-full" src={asset("/img/how/video-p.webp")} />
      </div>

      {/* What's printed 177:2515 */}
      <section className="bg-[#f7f4f0] flex flex-col items-start pb-[88px] pt-[72px] px-[16px] w-full">
        <p className={`[word-break:break-word] ${T.eyebrow}`}>What&apos;s printed</p>
        <div className="h-[16px] shrink-0" />
        <h2 className="font-serif font-normal text-[36px] text-[#2b231f] tracking-[-0.36px] whitespace-nowrap">
          <span className="block leading-[37px]">Five lines,</span>
          <span className="block italic leading-[37px]">written for one person.</span>
        </h2>
        <div className="h-[16px] shrink-0" />
        <p className="font-sans font-normal leading-[22px] text-[14px] text-[#6b625b] w-[340px]">
          Your label prints with your name, your city and the day it was made.
        </p>
        <div className="h-[32px] shrink-0" />
        <div className="h-[440px] overflow-clip relative shrink-0 w-[358px]">
          <img
            alt="Example label on a Fig Study bottle: Made for Avery M., Los Angeles, CA"
            className="absolute inset-0 object-cover size-full"
            src={asset("/img/how/printed-p.webp")}
          />
        </div>
        <div className="h-[36px] shrink-0" />
        <ol className="flex flex-col items-start">
          {LINES.map((l) => (
            <li key={l.no} className="flex gap-[16px] items-start pb-[20px]">
              <div className="flex flex-col items-start pt-[5px] shrink-0 w-[28px]">
                <span className={T.eyebrow}>{l.no}</span>
              </div>
              <div className="[word-break:break-word] flex flex-col gap-[4px] items-start">
                <h3 className="font-serif font-normal leading-[1.3] text-[20px] text-[#2b231f] whitespace-nowrap">{l.title}</h3>
                <p className="font-sans font-normal leading-[1.5] text-[14px] text-[#6b625b] w-[300px]">{l.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Shipping & fill times 177:2569 (id="shipping" is on the desktop frame; ShippingAnchor scrolls here on phones) */}
      <section data-anchor="shipping" className="bg-[#ece8e1] flex flex-col items-start pb-[88px] pt-[72px] px-[16px] w-full">
        <p className={`[word-break:break-word] ${T.eyebrow}`}>Shipping and fill times</p>
        <div className="h-[16px] shrink-0" />
        <h2 className="font-serif font-normal text-[32px] text-[#2b231f] tracking-[-0.32px] whitespace-nowrap">
          <span className="block leading-[33px]">Mixed the day you order,</span>
          <span className="block italic leading-[33px]">on its way the next.</span>
        </h2>
        <div className="h-[40px] shrink-0" />
        <ul className="flex flex-col items-start">
          {FACTS.map((f) => (
            <li key={f.title} className="[word-break:break-word] flex flex-col gap-[8px] items-start pb-[28px]">
              <h3 className="font-serif font-normal italic leading-[34px] text-[28px] text-[#2b231f] whitespace-nowrap">{f.title}</h3>
              <p className="font-sans font-normal leading-[22px] text-[14px] text-[#6b625b] w-[320px]">{f.body}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Questions 177:2590 */}
      <section className="bg-[#f7f4f0] flex flex-col items-start pb-[88px] pt-[72px] px-[16px] w-full">
        <p className={`[word-break:break-word] ${T.eyebrow}`}>Questions</p>
        <div className="h-[16px] shrink-0" />
        <h2 className="font-serif font-normal text-[36px] text-[#2b231f] tracking-[-0.36px] whitespace-nowrap">
          <span className="block leading-[37px]">A few things</span>
          <span className="block italic leading-[37px]">people ask.</span>
        </h2>
        <div className="h-[40px] shrink-0" />
        {FAQ.map(([q, a]) => (
          <Fragment key={q}>
            <details open className="[word-break:break-word] w-[358px]">
              <summary className="cursor-pointer list-none [&::-webkit-details-marker]:hidden font-serif font-normal leading-[26px] text-[22px] text-[#2b231f] w-[358px]">
                <h3 className="font-normal">{q}</h3>
              </summary>
              <p className="font-sans font-normal leading-[22px] mt-[10px] text-[14px] text-[#6b625b] w-[358px]">{a}</p>
            </details>
            <div className="h-[36px] shrink-0" />
          </Fragment>
        ))}
        <p className="font-sans font-normal leading-[1.5] text-[14px] text-[#6b625b] whitespace-nowrap">
          Something else?{" "}
          <a href={`mailto:${EMAIL}`} className="text-[#2b231f] underline [text-underline-position:from-font] decoration-from-font">{EMAIL}</a>
        </p>
      </section>
    </div>
  );
}
