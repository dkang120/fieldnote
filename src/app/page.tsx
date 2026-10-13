import Link from "next/link";
import { HomeHero } from "@/components/HomeHero";
import { ScentCard } from "@/components/ScentCard";
import { Vial } from "@/components/Bottle";
import { NextBench } from "@/components/FillDateNote";
import { Newsletter } from "@/components/Newsletter";
import { SCENTS } from "@/lib/scents";
import { PRICES, money } from "@/lib/site";

const STEPS = [
  { title: "You choose", body: "Pick a house scent, or answer six questions and build your own. Then tell us whose name goes on the label." },
  { title: "We mix it", body: "At the next bench session we weigh the concentrate, blend it into the base and fill your bottle by hand." },
  { title: "It's labeled for you", body: "Your name, city and the day it was made print on the label. It ships the next weekday." },
];

const EXAMPLES = [
  ["FIG STUDY · No. 02", "AVA R.", "AUSTIN, TX", "50 ML"],
  ["FIELD VETIVER · No. 03", "JUNHO K.", "ANN ARBOR, MI", "100 ML"],
  ["NIGHT SHIFT · CUSTOM", "PRIYA S.", "LOS ANGELES, CA", "50 ML"],
  ["LIBRARY MUSK · No. 01", "SAM O.", "NEW YORK, NY", "50 ML"],
];

export default function Home() {
  return (
    <>
      <HomeHero />

      <section className="py-10 md:py-16">
        <div className="wrap">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-h2">From your order to your desk</h2>
            <p className="meta">Next bench session: <NextBench /></p>
          </div>
          <ol className="grid border-t border-ink md:grid-cols-3">
            {STEPS.map((s, i) => (
              <li key={s.title} className="border-b border-rule py-6 md:border-b-0 md:border-r md:px-7 md:first:pl-0 md:last:border-r-0">
                <span className="mb-4 block font-serif text-[44px] leading-none text-clay">{i + 1}</span>
                <h3 className="mb-2.5 text-h3">{s.title}</h3>
                <p className="text-ink-soft">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-h2">Six house scents</h2>
            <Link href="/scents/" className="btn btn-ghost">See all scents</Link>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 md:gap-x-7 md:gap-y-10">
            {SCENTS.map((s) => <ScentCard key={s.slug} scent={s} list="home" />)}
          </div>
        </div>
      </section>

      <section className="section bg-ink text-paper">
        <div className="wrap grid items-center gap-10 md:grid-cols-2 md:gap-20">
          <div>
            <h2 className="text-h2">Or build one that's only yours.</h2>
            <p className="lede mt-5 text-[#B9B3A8]">
              Answer six quick questions. We match you to a base, you tune it with up to three notes, and name it. Your formula is saved, so you can reorder it exactly.
            </p>
            <Link href="/build/" className="btn btn-ghost mt-7 border-paper text-paper hover:bg-paper hover:text-ink">Start building, from {money(PRICES.custom[50])}</Link>
          </div>
          <dl className="grid grid-cols-[110px_1fr] gap-y-3 border-t border-paper/20 pt-5 font-mono text-sm text-[#D8D2C6]">
            <dt className="text-stone">Base</dt><dd>Green Fig</dd>
            <dt className="text-stone">Notes</dt><dd>Bergamot, cedar</dd>
            <dt className="text-stone">Warmth</dt><dd>A little warmer</dd>
            <dt className="text-stone">Strength</dt><dd>Classic, 17%</dd>
            <dt className="text-stone">Formula</dt><dd>CMP-A2-M01.M09-W+1-I17</dd>
          </dl>
        </div>
      </section>

      <section className="section bg-paper-deep">
        <div className="wrap grid items-center gap-10 md:grid-cols-2 md:gap-20">
          <div className="flex items-end justify-center gap-[3%] px-[6%] py-[12%]">
            {SCENTS.map((s) => <div key={s.slug} className="w-[12%]"><Vial no={s.no} tint={s.tint} /></div>)}
          </div>
          <div>
            <h2 className="text-h2">Not sure yet? Start with six.</h2>
            <p className="lede mt-5">All six house scents in 2 ml vials. Wear each one for a day. When you find yours, the {money(PRICES.discovery)} comes off your first full bottle.</p>
            <Link href="/discovery/" className="btn mt-7">Get the Discovery Set, {money(PRICES.discovery)}</Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-h2">Every label is one of one</h2>
            <p className="meta">Example labels. Yours carries your own name, city and date.</p>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {EXAMPLES.map(([t, n, c, s]) => (
              <div key={t} className="rounded-sm bg-paper-tag p-4 font-mono text-xs leading-[1.7] shadow-[0_1px_0_rgba(0,0,0,.08)]">
                <b className="font-medium">{t}</b><br />MADE FOR {n}<br />{c}<br />{s}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section border-t border-rule">
        <div className="wrap grid items-center gap-8 md:grid-cols-2 md:gap-20">
          <div>
            <h2 className="text-h2">Find us on campus</h2>
            <p className="lede mt-5">This fall we're setting up a blending table at UCLA, USC, NYU, UT Austin and Michigan. Smell everything, then order on the spot.</p>
          </div>
          <Newsletter source="campus" cta="Get pop-up dates" />
        </div>
      </section>
    </>
  );
}
