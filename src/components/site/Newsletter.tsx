"use client";

/* "Letters from the bench" signup. Figma: Newsletter / Desktop (110:51), / Phone (110:99), tablet frame (174:2828). */
import { useState } from "react";
import { asset } from "@/lib/site";
import { integrations } from "@/lib/integrations";
import { track } from "@/lib/analytics";

type Device = "d" | "t" | "p";
const G: Record<Device, { w: number; h: number; x: number; img: string; eyebrowY: number; bodyY: number; bodyW: number; fieldY: number; fieldW: number; lineW: number; btnY: number; btnW: number; btnH: number; scrim: string }> = {
  d: { w: 1440, h: 550, x: 80, img: "/img/shared/newsletter-d.webp", eyebrowY: 104, bodyY: 200, bodyW: 460, fieldY: 313, fieldW: 350, lineW: 350, btnY: 389, btnW: 354, btnH: 47,
       scrim: "linear-gradient(90deg, rgba(43,35,31,0.45) 0%, rgba(43,35,31,0.15) 45%, rgba(43,35,31,0) 60%, rgba(43,35,31,0) 100%)" },
  t: { w: 768, h: 560, x: 32, img: "/img/shared/newsletter-t.webp", eyebrowY: 56, bodyY: 112, bodyW: 480, fieldY: 260, fieldW: 480, lineW: 358, btnY: 330, btnW: 480, btnH: 48,
       scrim: "linear-gradient(180deg, rgba(43,35,31,0.55) 0%, rgba(43,35,31,0.1) 70%, rgba(43,35,31,0.1) 100%)" },
  p: { w: 390, h: 560, x: 16, img: "/img/shared/newsletter-p.webp", eyebrowY: 56, bodyY: 112, bodyW: 358, fieldY: 260, fieldW: 358, lineW: 358, btnY: 330, btnW: 358, btnH: 48,
       scrim: "linear-gradient(180deg, rgba(43,35,31,0.55) 0%, rgba(43,35,31,0.1) 70%, rgba(43,35,31,0.1) 100%)" },
};

export function Newsletter({ device }: { device: Device }) {
  const g = G[device];
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "error" | "done">("idle");
  const [msg, setMsg] = useState("");
  const mono = "font-mono font-normal not-italic text-[#f4f0e8]";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const r = await integrations.email.subscribe(email.trim(), `newsletter-${device}`);
    setState(r.ok ? "done" : "error");
    setMsg(r.ok ? "You're on the list. Your code is on its way." : r.message);
    if (r.ok) track("newsletter_signup", { source: "footer" });
  }

  return (
    <section className="bg-[#2b231f] overflow-clip relative" style={{ width: g.w, height: g.h }}>
      <img alt="" loading="lazy" decoding="async" src={asset(g.img)} className="absolute left-0 top-0 max-w-none object-cover" style={{ width: g.w, height: g.h }} />
      <div className="absolute left-0 top-0" style={{ width: g.w, height: g.h, backgroundImage: g.scrim }} />
      <p className={`absolute leading-[16px] text-[12px] tracking-[1.6px] uppercase whitespace-nowrap ${mono}`} style={{ left: g.x, top: g.eyebrowY }}>
        Letters from the bench
      </p>
      <div className={`[word-break:break-word] absolute text-[14px] ${mono}`} style={{ left: g.x, top: g.bodyY, width: g.bodyW }}>
        {device === "d" ? (
          <>
            <p className="leading-[20px] mb-0">Join the list for new scents, campus pop-up dates</p>
            <p className="leading-[20px] mb-0">and notes from the bench.</p>
          </>
        ) : (
          <p className="leading-[20px] mb-0">Join the list for new scents, campus pop-up dates and notes from the bench.</p>
        )}
        <p className="leading-[20px]">Your first bottle is 10% off.</p>
      </div>
      <form onSubmit={submit} noValidate>
        <div className="absolute h-[30px]" style={{ left: g.x, top: g.fieldY, width: g.fieldW }}>
          <label htmlFor={`nl-${device}`} className="sr-only">Email</label>
          <input
            id={`nl-${device}`}
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); if (state !== "idle") setState("idle"); }}
            placeholder="Your email"
            className={`absolute left-0 top-0 w-full bg-transparent border-0 p-0 outline-none leading-[1.4] text-[14px] ${mono} placeholder:text-[#f4f0e8]`}
          />
          <div className={`absolute h-px left-0 top-[29px] ${state === "error" ? "bg-[#9a4f31]" : "bg-[#f4f0e8]"}`} style={{ width: g.lineW }} />
          {state !== "idle" ? (
            <p role="status" className={`absolute left-0 top-[38px] text-[12px] leading-[1.4] whitespace-nowrap ${mono}`}>{msg}</p>
          ) : null}
        </div>
        <button
          type="submit"
          className="absolute border border-[#f4f0e8] border-solid overflow-clip flex items-center justify-center hover:bg-[#f4f0e8] group transition-colors"
          style={{ left: g.x, top: g.btnY, width: g.btnW, height: g.btnH }}
        >
          <span className={`leading-[1.3] text-[12px] tracking-[1.6px] uppercase whitespace-nowrap ${mono} group-hover:text-[#2b231f]`}>Join</span>
        </button>
      </form>
    </section>
  );
}
