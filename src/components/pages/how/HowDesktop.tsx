/* eslint-disable @next/next/no-img-element -- static export: images are pre-sized exports in public/img/how */
/* How it's made, desktop 1440 (Figma 170:1681). Header and footer come from site/Chrome. */
import { asset } from "@/lib/site";
import { EMAIL, FACTS, FAQ, INTRO, LINES, STEPS, T } from "./content";

export function HowDesktop() {
  return (
    <div className="w-[1440px]">
      {/* Intro 170:1697 */}
      <section className="[word-break:break-word] bg-[#ece8e1] flex flex-col gap-[40px] items-start px-[80px] py-[120px] w-full">
        <p className={T.monoLabel}>{INTRO.eyebrow}</p>
        <h1 className="font-serif font-normal leading-none text-[56px] text-[#2b231f] tracking-[-0.56px] w-[900px]">{INTRO.title}</h1>
        <p className="font-sans font-normal leading-[1.5] text-[18px] text-[#6b625b] w-[640px]">{INTRO.lede}</p>
        <p className="font-sans font-normal leading-[1.5] text-[14px] text-[#2b231f] w-[640px]">{INTRO.note}</p>
      </section>

      {/* Bench 170:1702 */}
      <section className="bg-[#f7f4f0] px-[80px] py-[120px] w-full">
        <div className="flex gap-[80px] items-start w-full">
          <div className="h-[720px] relative shrink-0 w-[600px]">
            <img alt="Hands setting a black cap on a freshly filled bottle on a wooden bench" className="absolute inset-0 object-cover size-full" src={asset("/img/how/bench-d.webp")} />
          </div>
          <div className="[word-break:break-word] flex flex-[1_0_0] flex-col items-start min-w-px">
            <h2 className="font-serif font-normal leading-[38px] text-[32px] text-[#2b231f] w-full">How a bottle is filled to order</h2>
            <ol className="w-full">
              {STEPS.map((s) => (
                <li key={s.title} className="border-[#d1cdc4] border-solid border-t flex flex-col gap-[6px] items-start py-[20px] w-full">
                  <p className={T.monoLabel}>{s.label}</p>
                  <h3 className="font-serif font-normal leading-[1.3] text-[20px] text-[#2b231f] whitespace-nowrap">{s.title}</h3>
                  <p className="font-sans font-normal leading-[1.5] text-[14px] text-[#6b625b] w-full">{s.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Video/Bench 170:1731 (a still in the design) */}
      <div className="h-[640px] relative w-full">
        <img alt="Pouring fragrance into a bottle on a scale at the bench" className="absolute inset-0 object-cover size-full" src={asset("/img/how/video-d.webp")} />
      </div>

      {/* What's printed 177:2345 */}
      <section className="bg-[#f7f4f0] h-[1000px] relative w-full">
        <div className="absolute flex flex-col items-start left-[80px] top-[178px] w-[520px]">
          <p className={`[word-break:break-word] ${T.eyebrow}`}>What&apos;s printed</p>
          <div className="h-[24px] shrink-0" />
          <h2 className="font-serif font-normal text-[48px] text-[#2b231f] whitespace-nowrap">
            <span className="block leading-[50px]">Five lines,</span>
            <span className="block italic leading-[50px]">written for one person.</span>
          </h2>
          <div className="h-[24px] shrink-0" />
          <p className="font-sans font-normal leading-[26px] text-[16px] text-[#6b625b] w-[440px]">
            Your label prints with your name, your city and the day it was made.
          </p>
          <div className="h-[48px] shrink-0" />
          <ol className="flex flex-col items-start">
            {LINES.map((l) => (
              <li key={l.no} className="flex gap-[20px] items-start pb-[22px]">
                <div className="flex flex-col items-start pt-[6px] shrink-0 w-[28px]">
                  <span className={T.eyebrow}>{l.no}</span>
                </div>
                <div className="flex flex-col gap-[4px] items-start whitespace-nowrap">
                  <h3 className="font-serif font-normal leading-[29px] text-[22px] text-[#2b231f]">{l.title}</h3>
                  <p className="font-sans font-normal leading-[1.5] text-[14px] text-[#6b625b]">{l.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <div className="absolute h-[800px] left-[720px] overflow-clip top-[100px] w-[640px]">
          <img
            alt="Example label on a Fig Study bottle: Made for Avery M., Los Angeles, CA, 14 Oct 2026, 50 ml"
            className="absolute inset-0 object-cover size-full"
            src={asset("/img/how/printed-d.webp")}
          />
        </div>
      </section>

      {/* Shipping & fill times 177:2405 */}
      <section id="shipping" data-anchor="shipping" className="bg-[#ece8e1] h-[593px] relative w-full scroll-mt-[20px]">
        <div className="absolute flex flex-col items-center left-[320px] top-[120px] w-[800px]">
          <p className={`[word-break:break-word] text-center ${T.eyebrow}`}>Shipping and fill times</p>
          <div className="h-[24px] shrink-0" />
          <h2 className="font-serif font-normal text-[48px] text-[#2b231f] text-center whitespace-nowrap">
            <span className="block leading-[50px]">Mixed the day you order,</span>
            <span className="block italic leading-[50px]">on its way the next.</span>
          </h2>
        </div>
        <ul className="[word-break:break-word] absolute flex gap-[48px] items-start left-[80px] top-[356px]">
          {FACTS.map((f) => (
            <li key={f.title} className="flex flex-col gap-[12px] items-start shrink-0 w-[284px]">
              <h3 className="font-serif font-normal italic leading-[41px] text-[34px] text-[#2b231f] whitespace-nowrap">{f.title}</h3>
              <p className="font-sans font-normal leading-[22px] text-[14px] text-[#6b625b] w-[250px]">{f.body}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Questions 177:2423 */}
      <section className="bg-[#f7f4f0] flex gap-[200px] items-start pb-[160px] pt-[140px] px-[80px] w-full">
        <div className="flex flex-col items-start shrink-0 w-[440px]">
          <p className={`[word-break:break-word] ${T.eyebrow}`}>Questions</p>
          <div className="h-[24px] shrink-0" />
          <h2 className="font-serif font-normal text-[48px] text-[#2b231f] whitespace-nowrap">
            <span className="block leading-[50px]">A few things</span>
            <span className="block italic leading-[50px]">people ask.</span>
          </h2>
          <div className="h-[28px] shrink-0" />
          <p className="font-sans font-normal leading-[1.5] text-[14px] text-[#6b625b] whitespace-nowrap">
            Something else?{" "}
            <a href={`mailto:${EMAIL}`} className="text-[#2b231f] underline [text-underline-position:from-font] decoration-from-font">{EMAIL}</a>
          </p>
        </div>
        <div className="[word-break:break-word] flex flex-col gap-[48px] items-start min-h-[688px] w-[640px]">
          {FAQ.map(([q, a]) => (
            <details key={q} open className="w-[640px]">
              <summary className="cursor-pointer list-none [&::-webkit-details-marker]:hidden font-serif font-normal leading-[30px] text-[26px] text-[#2b231f] w-[600px]">
                <h3 className="font-normal">{q}</h3>
              </summary>
              <p className="font-sans font-normal leading-[26px] mt-[12px] text-[16px] text-[#6b625b] w-[560px]">{a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
