"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { Bottle } from "./Bottle";
import { ArrowRight } from "./icons";
import { EASE } from "./MotionProvider";
import { LabelFields } from "./LabelFields";
import { usePersonalization } from "@/lib/personalization";
import { useFillDates } from "@/lib/use-fill-dates";
import { SCENTS } from "@/lib/scents";
import { PRICES, asset, money } from "@/lib/site";

/** Swap these files in /public/assets to replace the placeholders (same names, any B&W photo). */
const CARDS = [
  { title: "House scents", body: `Six scents, mixed when you order. From ${money(PRICES.house[50])}.`, href: "/scents/", cta: "Explore scents", img: "/assets/card-house-scents.jpg" },
  {
    title: "Discovery Set", body: `All six Fieldnote scents in 2 ml vials. Try them on your own time.`, href: "/discovery/", cta: "Start with all six",
    img: "/assets/card-discovery-set.jpg", start: true,
    points: ["Includes all six house scents", `${money(PRICES.discovery)} applied to your first full bottle`],
  },
  { title: "Make your label", body: "Build your own blend and put your name on it.", href: "/build/", cta: "Start building", img: "/assets/card-make-your-label.jpg" },
];

/** Hero, category band and the label section share one personalization, so typing a name updates both bottles. */
export function HomeTop() {
  const [p, setP] = usePersonalization();
  const dates = useFillDates();
  const s = SCENTS[1];
  const date = dates?.compounded ?? null;
  const still = useReducedMotion();

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="wrap grid min-h-[calc(100svh-100px)] grid-rows-[auto_1fr_auto] gap-6 py-8 md:min-h-[640px] md:py-12 lg:max-h-[860px]">
          <div className="relative z-20 flex items-start justify-between gap-8">
            <div className="max-w-[30rem]">
              <h1 className="text-[clamp(26px,3vw,36px)] leading-[1.15] tracking-[-0.01em]">Your cologne, made after you order.</h1>
              <p className="mt-3 max-w-[40ch] text-[15px] leading-[1.55] text-muted md:text-base">
                Choose one of six house scents, or build your own. We blend, fill, and print your name, city and made-on date within 48 hours.
              </p>
            </div>
            <p className="hidden flex-none text-right text-base md:block">
              Cologne that<br />waits for you.
              <span aria-hidden="true" className="ml-auto mt-2 block h-px w-10 bg-ink" />
            </p>
          </div>

          <div className="relative grid min-h-[min(72vw,440px)] place-items-center md:min-h-[360px]">
            {/* The page's one authored moment: the wordmark opens from the center and the bottle is set down onto it.
                Both start visible, so nothing is hidden before hydration; reduced motion skips the movement. */}
            <motion.p
              aria-hidden="true"
              initial={still ? false : { clipPath: "inset(0% 22% 0% 22%)" }}
              animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
              transition={{ duration: 1.1, ease: EASE, delay: 0.1 }}
              className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 select-none whitespace-nowrap text-center font-bold uppercase leading-[0.8]
                         tracking-[-0.045em] text-ink text-[clamp(56px,17.6vw,226px)]"
            >
              Fieldnote
            </motion.p>
            <div className="absolute left-1/2 top-1/2 z-10 h-[86%] -translate-x-1/2 -translate-y-1/2 sm:h-[110%] md:h-[140%]">
              <motion.div
                className="h-full"
                initial={still ? false : { y: -22, filter: "drop-shadow(0px 46px 40px rgba(17,17,17,0.10))" }}
                animate={{ y: 0, filter: "drop-shadow(0px 24px 26px rgba(17,17,17,0.24))" }}
                transition={{ duration: 0.9, ease: EASE, delay: 0.25 }}
              >
              {/* To use a photo instead: <img src={asset("/assets/hero-bottle.png")} alt="" className="h-full w-auto" /> */}
              <Bottle
                title={s.name} no={s.no} tint={s.tint} name={p.name} city={p.city} date={date} backdrop="#E6E5E3"
                className="h-full w-auto"
              />
              </motion.div>
            </div>
          </div>

          <div className="relative z-20 flex flex-wrap items-end justify-between gap-x-8 gap-y-8">
            <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
              <Link href="/scents/#find" className="btn">Find your scent</Link>
              <Link href="#label" className="link-line">Make your label</Link>
            </div>
            <ul className="text-meta text-muted md:text-right md:text-[14px] md:leading-[1.7]" aria-label="At a glance">
              <li className="inline md:block">From {money(PRICES.house[50])}</li>
              <li className="inline before:mx-1.5 before:content-['·'] md:block md:before:hidden">{money(PRICES.discovery)} Discovery Set applies to your first bottle</li>
              <li className="inline before:mx-1.5 before:content-['·'] md:block md:before:hidden">Ships the next weekday after filling</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-ink text-on-ink">
        <div className="wrap grid gap-8 py-10 md:grid-cols-3 md:gap-6 md:py-12">
          {CARDS.map((c) => (
            <Link
              key={c.href} href={c.href}
              className={`group flex min-h-[44px] items-center gap-5 no-underline ${c.start ? "-m-4 rounded-[14px] border border-on-ink/25 p-4 md:-my-4" : ""}`}
            >
              <span className="zoom block aspect-[4/5] w-[104px] flex-none bg-surface md:w-[112px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={asset(c.img)} alt="" width={640} height={800} loading="lazy" className="photo h-full w-full object-cover" />
              </span>
              <span className="min-w-0">
                <span className="block text-title">{c.title}{c.start && <span className="text-on-ink/70"> · Start here if you&apos;re new</span>}</span>
                <span className="mt-2 block text-[15px] leading-snug text-on-ink/70">{c.body}</span>
                {c.points && (
                  <span className="mt-2 block text-meta text-on-ink/70">{c.points.join(" · ")}</span>
                )}
                <span className="mt-3 inline-flex items-center gap-1.5 text-[15px] underline decoration-1 underline-offset-[5px]">
                  {c.cta} <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                </span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section id="label" className="relative scroll-mt-20 overflow-hidden border-b border-line bg-surface">
        <div className="wrap grid items-center gap-10 py-16 md:grid-cols-[1fr_1fr] md:py-24">
          <div className="relative z-10">
            <h2 className="text-[clamp(34px,4.6vw,60px)] leading-[1.08] tracking-[-0.015em]">Your name. Your city.<br />Your date.</h2>
            <p className="lede mt-6">
              Nothing is mixed until you order it. We fill your bottle by hand within 48 hours and print your name, city and the day it was made.
            </p>
            <div className="mt-8 max-w-[440px]">
              <p className="meta mb-2">Try it: type your name and see your label.</p>
              <LabelFields value={p} onChange={setP} surface="home" showMessage={false} showReady idPrefix="hero" />
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-4">
              <Link href="/scents/#find" className="btn">Find your scent</Link>
              <Link href="/build/" className="link-line">Or build your own</Link>
            </div>
            <p className="meta mt-3">Your name and city come with you to any bottle you pick.</p>
          </div>
          {/* Label close-up: the live bottle, scaled up and cropped by the right edge. */}
          {/* On phones it sits above the fields so the label stays in view while typing. */}
          <div aria-hidden="true" className="relative order-first h-[300px] md:order-none md:h-[640px]">
            <div className="zoom absolute -right-[22%] top-1/2 h-[150%] -translate-y-[44%] max-md:right-[-6%] max-md:h-[135%] md:-right-[34%] md:h-[175%]">
              <Bottle title={s.name} no={s.no} tint={s.tint} name={p.name} city={p.city} date={date} backdrop="#E6E5E3" className="h-full w-auto" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
