"use client";

import Link from "next/link";
import { useState } from "react";
import { Bottle } from "./Bottle";
import { LabelFields, emptyPersonalization } from "./LabelFields";
import { useFillDates } from "@/lib/use-fill-dates";
import { SCENTS } from "@/lib/scents";
import { PRICES, asset, money } from "@/lib/site";

/** Swap these files in /public/assets to replace the placeholders (same names, any B&W photo). */
const CARDS = [
  { title: "Shop House Scents", body: `Six scents, mixed when you order. From ${money(PRICES.house[50])}.`, href: "/scents/", cta: "Shop scents", img: "/assets/card-house-scents.jpg" },
  { title: "Discovery Set", body: `All six in 2 ml vials. The ${money(PRICES.discovery)} comes off your first bottle.`, href: "/discovery/", cta: "Try all six", img: "/assets/card-discovery-set.jpg" },
  { title: "Make Your Label", body: "Build your own blend and put your name on it.", href: "/build/", cta: "Create yours", img: "/assets/card-make-your-label.jpg" },
];

/** Hero, category band and the label section share one personalization, so typing a name updates both bottles. */
export function HomeTop() {
  const [p, setP] = useState(emptyPersonalization);
  const dates = useFillDates();
  const s = SCENTS[1];
  const date = dates?.compounded ?? null;

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="wrap grid min-h-[calc(100svh-100px)] grid-rows-[auto_1fr_auto] gap-6 py-8 md:min-h-[640px] md:py-12 lg:max-h-[860px]">
          <div className="relative z-20">
            <h1 className="eyebrow max-w-[13ch] font-sans text-[12px] leading-[2.1] tracking-[0.3em] md:text-[13px]">
              Cologne that waits for you.
            </h1>
            <span aria-hidden="true" className="mt-2 block h-px w-10 bg-ink" />
          </div>

          <div className="relative grid min-h-[min(96vw,440px)] place-items-center md:min-h-[400px]">
            <p
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 select-none whitespace-nowrap text-center font-serif uppercase leading-[0.8]
                         tracking-[-0.02em] text-ink text-[clamp(64px,23.6vw,300px)]"
            >
              Fieldnote
            </p>
            <div className="absolute left-1/2 top-1/2 z-10 h-[86%] -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_24px_30px_rgba(17,17,17,0.22)] md:h-[140%] sm:h-[110%]">
              {/* To use a photo instead: <img src={asset("/assets/hero-bottle.png")} alt="" className="h-full w-auto" /> */}
              <Bottle
                title={s.name} no={s.no} tint={s.tint} name={p.name} city={p.city} date={date} backdrop="#E6E5E3"
                className="h-full w-auto motion-safe:animate-[settle_1.1s_cubic-bezier(.2,.7,.2,1)_both]"
              />
            </div>
          </div>

          <div className="relative z-20 flex flex-wrap items-end justify-between gap-x-8 gap-y-8">
            <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
              <Link href="/scents/" className="btn">Shop scents</Link>
              <Link href="/how-its-made/" className="link-line">How it&apos;s made</Link>
            </div>
            <p className="eyebrow ml-auto text-right text-[11px] leading-[2.1] md:text-xs">
              Mixed after<br />you order<br />from {money(PRICES.house[50])}
              <span aria-hidden="true" className="ml-auto mt-2 block h-px w-10 bg-ink" />
            </p>
          </div>
        </div>
      </section>

      <section className="bg-ink text-on-ink">
        <div className="wrap grid gap-8 py-10 md:grid-cols-3 md:gap-6 md:py-12">
          {CARDS.map((c, i) => (
            <Link key={c.href} href={c.href} className="reveal group flex items-center gap-5 no-underline" style={{ transitionDelay: `${i * 90}ms` }}>
              <span className="zoom block aspect-[4/5] w-[104px] flex-none bg-surface md:w-[112px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={asset(c.img)} alt="" width={640} height={800} loading="lazy" className="photo h-full w-full object-cover" />
              </span>
              <span className="min-w-0">
                <span className="block font-mono text-[13px] font-medium uppercase tracking-[0.16em]">{c.title}</span>
                <span className="mt-2 block text-[15px] leading-snug text-on-ink/70">{c.body}</span>
                <span className="mt-3 inline-block border-b border-current pb-0.5 font-mono text-[11px] uppercase tracking-[0.16em]">
                  {c.cta} <span aria-hidden="true" className="inline-block transition-transform group-hover:translate-x-1">→</span>
                </span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden border-b border-line bg-surface">
        <div className="wrap grid items-center gap-10 py-16 md:grid-cols-[1fr_1fr] md:py-24">
          <div className="reveal relative z-10">
            <p className="eyebrow mb-6 text-muted">Made for you</p>
            <h2 className="text-[clamp(44px,6.4vw,88px)] leading-[0.95] tracking-[-0.01em]">Your name. Your city.<br />Your date.</h2>
            <p className="lede mt-6">
              Nothing here is mixed until you order it. We fill your bottle by hand within 48 hours and print your name, city and date on the label.
            </p>
            <div className="mt-8 max-w-[440px]">
              <p className="meta mb-2">Try it: type your name and see your label.</p>
              <LabelFields value={p} onChange={setP} surface="home" showMessage={false} idPrefix="hero" />
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
              <Link href="/build/" className="btn">Create yours</Link>
              <Link href="/scents/" className="link-line">Shop house scents</Link>
            </div>
          </div>
          {/* Label close-up: the live bottle, scaled up and cropped by the right edge. */}
          <div aria-hidden="true" className="relative h-[420px] md:h-[640px]">
            <div className="zoom absolute -right-[22%] top-1/2 h-[150%] -translate-y-[44%] md:-right-[34%] md:h-[175%]">
              <Bottle title={s.name} no={s.no} tint={s.tint} name={p.name} city={p.city} date={date} backdrop="#E6E5E3" className="h-full w-auto" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
