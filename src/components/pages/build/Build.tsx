"use client";

/* Build your own — Figma 171:1914 (desktop 1440) and 171:2088 (phone 390). Exact px values from the frames. */
import { Frames } from "@/components/Frames";
import { HeaderDesktop, HeaderPhone, FooterDesktop, FooterPhone } from "@/components/site/Chrome";
import { Button } from "@/components/site/ui";
import { ACCORDS } from "@/lib/builder";
import { CITY_MAX, NAME_MAX } from "@/lib/cart-types";
import { asset } from "@/lib/site";
import {
  BASES, EXAMPLE, PRICE_TEXT, ROMAN, STEPS, STRENGTH, useBuild, type BuildState, type Note, type Strength,
} from "./useBuild";

type Dev = "d" | "p";
const INK = "text-[#2b231f]";
const MUTED = "text-[#6b625b]";
const EYEBROW = "font-sans font-medium leading-[16px] text-[12px] tracking-[0.72px] uppercase whitespace-nowrap";

const stepId = (dev: Dev, i: number) => `build-${dev}-step-${i + 1}`;

function scrollToStep(dev: Dev, i: number) {
  document.getElementById(stepId(dev, i))?.scrollIntoView({ behavior: "smooth", block: "start" });
}

/* ---------- pieces shared by both frames ---------- */

function StepIndex({ s, dev }: { s: BuildState; dev: Dev }) {
  return (
    <nav aria-label="Builder steps" className={`flex font-sans font-medium items-start leading-[16px] text-[12px] tracking-[0.72px] uppercase whitespace-pre ${dev === "d" ? "gap-[32px]" : "gap-[20px]"}`}>
      {STEPS.map((label, i) => {
        const on = i === s.reached;
        return (
          <button
            key={label}
            type="button"
            onClick={() => { s.reach(i); scrollToStep(dev, i); }}
            aria-current={on ? "step" : undefined}
            className={`relative shrink-0 uppercase ${on ? `${INK} underline decoration-[1px] decoration-solid underline-offset-[2px]` : `${MUTED} link-hover`}`}
          >
            {`${ROMAN[i]}${dev === "d" ? "  " : " "}${label}`}
          </button>
        );
      })}
    </nav>
  );
}

function StepHead({ i, title, sub, dev }: { i: number; title: string; sub?: string; dev: Dev }) {
  return (
    <div id={stepId(dev, i)} className={`flex flex-col items-start scroll-mt-[24px] ${dev === "d" ? "gap-[12px]" : "gap-[10px]"}`}>
      <p className={`${EYEBROW} ${MUTED}`}>{ROMAN[i]}</p>
      <h2 className={`font-serif font-normal ${INK} whitespace-nowrap ${dev === "d" ? "text-[32px] leading-[35px]" : "text-[28px] leading-[31px]"}`}>{title}</h2>
      {sub ? <p className={`font-sans leading-[1.5] text-[14px] ${MUTED} whitespace-nowrap`}>{sub}</p> : null}
    </div>
  );
}

function Bases({ s, dev }: { s: BuildState; dev: Dev }) {
  const d = dev === "d";
  return (
    <div role="radiogroup" aria-label="Base" className={d ? "flex flex-wrap content-start gap-[36px_40px] items-start w-[600px]" : "flex flex-col gap-[24px] items-start w-[358px]"}>
      {BASES.map((id) => {
        const a = ACCORDS[id];
        const on = s.base === id;
        return (
          <button
            key={id}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => s.setBase(id)}
            className={`flex gap-[12px] items-start text-left shrink-0 group ${d ? "w-[280px]" : "w-[358px]"}`}
          >
            <span className="relative h-[17px] w-[8px] shrink-0" aria-hidden>
              <span className={`absolute left-0 top-[9px] size-[8px] rounded-full ${on ? "bg-[#2b231f]" : "border border-solid border-[#6b625b] group-hover:border-[#2b231f]"}`} />
            </span>
            <span className={`flex flex-col items-start ${d ? "gap-[6px]" : "gap-[4px]"}`}>
              <span className={`font-serif ${INK} whitespace-nowrap ${on ? "italic" : "not-italic"} ${d ? "text-[22px] leading-[29px]" : "text-[21px] leading-[27px]"}`}>{a.name}</span>
              <span className={`font-sans leading-[1.5] text-[14px] ${MUTED} ${d ? "w-[250px]" : "w-[320px]"}`}>{a.line}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

function Slider({ s, n, dev }: { s: BuildState; n: Note; dev: Dev }) {
  const d = dev === "d";
  const w = d ? 520 : 358;
  const h = d ? 12 : 24;
  const k = d ? 12 : 14;
  const fill = (w * n.level) / 100;
  const id = `build-${dev}-${n.id}`;
  return (
    <div className={`flex flex-col items-start ${d ? "gap-[14px] w-[520px]" : "gap-[12px] w-[358px]"}`}>
      <div className="flex items-start justify-between w-full whitespace-nowrap">
        <label htmlFor={id} className={`font-serif ${INK} ${d ? "text-[20px] leading-[26px]" : "text-[19px] leading-[25px]"}`}>{n.name}</label>
        <p className={`font-mono leading-[17px] text-[12px] ${MUTED}`} aria-hidden>{n.level}%</p>
      </div>
      <div className="relative shrink-0" style={{ width: w, height: h }}>
        <div className="absolute left-0 h-px bg-[#d1cdc4]" style={{ top: (h - 1) / 2, width: w }} />
        <div className="absolute left-0 h-px bg-[#2b231f]" style={{ top: (h - 1) / 2, width: fill }} />
        <input
          id={id}
          type="range"
          min={0}
          max={100}
          step={5}
          value={n.level}
          onChange={(e) => s.setLevel(n.id, Number(e.target.value))}
          aria-valuetext={`${n.level}%`}
          className="peer absolute inset-0 m-0 h-full w-full cursor-pointer opacity-0"
        />
        <div
          className="pointer-events-none absolute rounded-full bg-[#2b231f] peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#2b231f]"
          style={{ width: k, height: k, left: fill - k / 2, top: (h - k) / 2 }}
        />
      </div>
    </div>
  );
}

function Strengths({ s, dev }: { s: BuildState; dev: Dev }) {
  const d = dev === "d";
  return (
    <div role="radiogroup" aria-label="Strength" className={`flex items-baseline whitespace-nowrap ${d ? "gap-[40px] text-[24px] leading-[30px]" : "gap-[28px] text-[22px] leading-[28px]"}`}>
      {(Object.keys(STRENGTH) as Strength[]).map((k) => {
        const on = s.strength === k;
        return (
          <button
            key={k}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => s.setStrength(k)}
            className={`font-serif shrink-0 ${on ? `italic ${INK} underline decoration-[1px] decoration-solid` : `not-italic ${MUTED} link-hover`}`}
          >
            {STRENGTH[k].label}
          </button>
        );
      })}
    </div>
  );
}

function LabelField({ s, dev, field }: { s: BuildState; dev: Dev; field: "name" | "city" }) {
  const max = field === "name" ? NAME_MAX : CITY_MAX;
  const value = s.p[field];
  const shown = value.trim() || EXAMPLE[field];
  const id = `build-${dev}-${field}`;
  const err = s.error?.field === field ? s.error.message : "";
  return (
    <div className={`flex flex-col gap-[12px] items-start ${dev === "d" ? "w-[520px]" : "w-[358px]"}`}>
      <div className={`flex items-start justify-between text-[12px] ${MUTED} w-full whitespace-nowrap`}>
        <label htmlFor={id} className="font-sans font-medium leading-[16px] tracking-[0.72px] uppercase">
          {field === "name" ? "Name on the label" : "City"}
        </label>
        <p className="font-mono leading-[17px]" aria-hidden>{String(shown.length).padStart(2, "0")}/{max}</p>
      </div>
      <input
        id={id}
        data-field={field}
        type="text"
        value={value}
        maxLength={max}
        placeholder={EXAMPLE[field]}
        autoComplete={field === "name" ? "name" : "address-level2"}
        aria-invalid={err ? true : undefined}
        aria-describedby={err ? `${id}-err` : undefined}
        onChange={(e) => s.setField(field, e.target.value)}
        className={`block h-[21px] w-full bg-transparent p-0 border-0 outline-none font-mono leading-[normal] text-[16px] ${INK} uppercase placeholder:text-[#2b231f] focus:placeholder:text-[#6b625b]`}
      />
      <div className={`h-px w-full ${err ? "bg-[#9a4f31]" : "bg-[#2b231f]"}`} />
      {err ? <p id={`${id}-err`} role="alert" className="font-sans leading-[1.4] text-[14px] text-[#9a4f31]">{err}</p> : null}
    </div>
  );
}

function Caption() {
  return <p className={`${EYEBROW} ${MUTED}`}>Your label, as it will print</p>;
}

function Formula({ s }: { s: BuildState }) {
  return <p className={`font-mono leading-[17px] text-[12px] ${MUTED} whitespace-pre`}>{`Formula  ${s.code}`}</p>;
}

/* ---------- desktop 1440 ---------- */

function PreviewDesktop({ s }: { s: BuildState }) {
  return (
    <div className="sticky top-[40px] flex flex-col gap-[14px] items-start shrink-0 w-[560px]">
      <div className="relative h-[700px] w-[560px] overflow-clip" role="img" aria-label={`Label preview: ${s.baseName}, made for ${s.name}, ${s.city}`}>
        <img alt="" src={asset("/img/build/preview-d.webp")} className="absolute inset-0 size-full object-cover pointer-events-none" />
        <div aria-hidden className={`absolute left-[183px] top-[122px] h-[489px] w-[284px] flex flex-col items-center justify-center overflow-clip mix-blend-multiply opacity-90 ${INK} text-center whitespace-nowrap`}>
          <p className="font-sans leading-[normal] text-[12px] tracking-[4.08px]">FIELDNOTE</p>
          <div className="h-[24px] shrink-0" />
          <p className="font-serif italic leading-[normal] text-[17px] opacity-75">Custom blend</p>
          <div className="h-[6px] shrink-0" />
          <p className="font-serif leading-none text-[33px]">{s.baseName}</p>
          <div className="h-[16px] shrink-0" />
          <div className="h-px w-[116px] bg-[#2b231f] shrink-0" />
          <div className="h-[18px] shrink-0" />
          <p className="font-mono leading-[normal] text-[12px] opacity-75">MADE FOR</p>
          <div className="h-[4px] shrink-0" />
          <p className="font-mono leading-[normal] text-[15px]">{s.name.toUpperCase()}</p>
          <div className="h-[10px] shrink-0" />
          <p className="font-mono leading-[normal] text-[12px] opacity-75">{s.city.toUpperCase()}</p>
          <div className="h-[2px] shrink-0" />
          <p className="font-mono leading-[normal] text-[12px] opacity-75">{s.strengthLine}</p>
        </div>
      </div>
      <Caption />
    </div>
  );
}

function BuildDesktop({ s }: { s: BuildState }) {
  return (
    <div className="bg-[#f7f4f0] flex flex-col items-start w-[1440px]">
      <div className="relative h-[600px] w-[1440px] overflow-clip">
        <img alt="" src={asset("/img/build/hero-d.webp")} className="absolute inset-0 size-full object-cover pointer-events-none" />
        <div className="absolute left-[80px] top-[380px] flex flex-col items-start text-[#f4f0e8]">
          <p className={EYEBROW}>Build your own</p>
          <div className="h-[20px] shrink-0" />
          <h1 className="font-serif font-normal text-[56px] tracking-[-0.56px] whitespace-nowrap">
            <span className="block leading-none">A blend that&apos;s</span>
            <span className="block italic leading-none">only yours.</span>
          </h1>
        </div>
      </div>
      <div className="flex items-start gap-[120px] pt-[96px] pb-[140px] px-[80px] w-full">
        <PreviewDesktop s={s} />
        <div className="flex flex-col items-start w-[600px]">
          <p className={`font-sans leading-[26px] text-[16px] ${MUTED} w-[520px]`}>
            Answer a few quiet questions. We match you to a base, then you tune it with up to three notes. Name it, keep the formula, and reorder it exactly.
          </p>
          <div className="h-[40px] shrink-0" />
          <StepIndex s={s} dev="d" />
          <div className="h-[88px] shrink-0" />
          <StepHead i={0} title="Choose a base" dev="d" />
          <div className="h-[32px] shrink-0" />
          <Bases s={s} dev="d" />
          <div className="h-[88px] shrink-0" />
          <StepHead i={1} title="Tune the notes" sub="Up to three, on top of your base." dev="d" />
          <div className="h-[32px] shrink-0" />
          <div className="flex flex-col gap-[28px] items-start">
            {s.notes.map((n) => <Slider key={n.id} s={s} n={n} dev="d" />)}
          </div>
          <div className="h-[116px] shrink-0" />
          <StepHead i={2} title="Strength" dev="d" />
          <div className="h-[32px] shrink-0" />
          <Strengths s={s} dev="d" />
          <div className="h-[12px] shrink-0" />
          <p className={`font-sans leading-[1.5] text-[14px] ${MUTED} whitespace-nowrap`}>{STRENGTH[s.strength].line}</p>
          <div className="h-[88px] shrink-0" />
          <StepHead i={3} title="Your label" dev="d" />
          <div className="h-[32px] shrink-0" />
          <LabelField s={s} dev="d" field="name" />
          <div className="h-[32px] shrink-0" />
          <LabelField s={s} dev="d" field="city" />
          <div className="h-[104px] shrink-0" />
          <section aria-label="Your blend" className="flex flex-col items-start w-[600px]">
            <p className={`${EYEBROW} ${MUTED}`}>Your blend</p>
            <div className="h-[20px] shrink-0" />
            <p className={`font-serif leading-[35px] text-[30px] ${INK} w-[580px]`} aria-live="polite">{s.summary}</p>
            <div className="h-[16px] shrink-0" />
            <Formula s={s} />
            <div className="h-[40px] shrink-0" />
            <div className="flex gap-[32px] items-center">
              <Button onClick={s.reserve}>Reserve, pay at launch</Button>
              <p className={`font-sans leading-[1.5] text-[16px] ${INK} whitespace-nowrap`}>{PRICE_TEXT}</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

/* ---------- phone 390 ---------- */

function BuildPhone({ s }: { s: BuildState }) {
  return (
    <div className="bg-[#f7f4f0] flex flex-col items-start pb-[96px] w-[390px]">
      <div className="relative h-[520px] w-[390px] overflow-clip">
        <img alt="" src={asset("/img/build/hero-p.webp")} className="absolute inset-0 size-full object-cover pointer-events-none" />
        <div className="absolute left-[16px] top-[378px] flex flex-col gap-[14px] items-start text-[#f4f0e8] whitespace-nowrap">
          <p className={EYEBROW}>Build your own</p>
          <h1 className="font-serif font-normal text-[40px] tracking-[-0.4px]">
            <span className="block leading-none">A blend that&apos;s</span>
            <span className="block italic leading-none">only yours.</span>
          </h1>
        </div>
      </div>
      <div className="flex flex-col items-start pt-[48px] px-[16px] w-[390px]">
        <p className={`font-sans leading-[22px] text-[14px] ${MUTED} w-[340px]`}>
          Answer a few quiet questions. We match you to a base, then you tune it with up to three notes. Name it, keep the formula, and reorder it exactly.
        </p>
        <div className="h-[32px] shrink-0" />
        <StepIndex s={s} dev="p" />
        <div className="h-[64px] shrink-0" />
        <StepHead i={0} title="Choose a base" dev="p" />
        <div className="h-[24px] shrink-0" />
        <Bases s={s} dev="p" />
        <div className="h-[64px] shrink-0" />
        <StepHead i={1} title="Tune the notes" sub="Up to three, on top of your base." dev="p" />
        <div className="h-[24px] shrink-0" />
        <div className="flex flex-col gap-[20px] items-start">
          {s.notes.map((n) => <Slider key={n.id} s={s} n={n} dev="p" />)}
        </div>
        <div className="h-[84px] shrink-0" />
        <StepHead i={2} title="Strength" dev="p" />
        <div className="h-[24px] shrink-0" />
        <Strengths s={s} dev="p" />
        <div className="h-[10px] shrink-0" />
        <p className={`font-sans leading-[1.5] text-[14px] ${MUTED} w-[340px]`}>{STRENGTH[s.strength].line}</p>
        <div className="h-[64px] shrink-0" />
        <StepHead i={3} title="Your label" dev="p" />
        <div className="h-[24px] shrink-0" />
        <div className="relative h-[440px] w-[358px] overflow-clip shrink-0" role="img" aria-label={`Label preview: ${s.baseName}, made for ${s.name}, ${s.city}`}>
          <img alt="" src={asset("/img/build/preview-p.webp")} className="absolute inset-0 size-full object-cover pointer-events-none" />
          <div aria-hidden className={`absolute left-[59px] top-[14px] h-[413px] w-[240px] flex flex-col items-center justify-center overflow-clip mix-blend-multiply opacity-90 ${INK} text-center whitespace-nowrap`}>
            <p className="font-sans leading-[normal] text-[12px] tracking-[3.6px]">FIELDNOTE</p>
            <div className="h-[18px] shrink-0" />
            <p className="font-serif leading-none text-[30px]">{s.baseName}</p>
            <div className="h-[12px] shrink-0" />
            <div className="h-px w-[96px] bg-[#2b231f] shrink-0" />
            <div className="h-[14px] shrink-0" />
            <p className="font-mono leading-[normal] text-[14px]">{s.name.toUpperCase()}</p>
            <div className="h-[6px] shrink-0" />
            <p className="font-mono leading-[normal] text-[12px] opacity-75">{s.city.toUpperCase()}</p>
          </div>
        </div>
        <div className="h-[12px] shrink-0" />
        <Caption />
        <div className="h-[32px] shrink-0" />
        <LabelField s={s} dev="p" field="name" />
        <div className="h-[28px] shrink-0" />
        <LabelField s={s} dev="p" field="city" />
        <div className="h-[76px] shrink-0" />
        <p className={`${EYEBROW} ${MUTED}`}>Your blend</p>
        <div className="h-[16px] shrink-0" />
        <p className={`font-serif leading-[29px] text-[24px] ${INK} w-[358px]`} aria-live="polite">{s.summary}</p>
        <div className="h-[12px] shrink-0" />
        <Formula s={s} />
        <div className="h-[32px] shrink-0" />
        <p className={`font-sans leading-[1.5] text-[16px] ${INK} whitespace-nowrap`}>{PRICE_TEXT}</p>
        <div className="h-[14px] shrink-0" />
        <Button onClick={s.reserve} className="h-[50px] px-[32px] w-full">Reserve, pay at launch</Button>
      </div>
    </div>
  );
}

export function Build() {
  const s = useBuild();
  return (
    <Frames
      phone={<><HeaderPhone /><BuildPhone s={s} /><FooterPhone /></>}
      desktop={<><HeaderDesktop /><BuildDesktop s={s} /><FooterDesktop /></>}
    />
  );
}
