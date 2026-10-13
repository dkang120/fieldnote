import Link from "next/link";
import { HomeTop } from "@/components/HomeTop";
import { ScentCard } from "@/components/ScentCard";
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

const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 1.2, strokeLinecap: "round", strokeLinejoin: "round" } as const;
const TRUST = [
  { title: "Fresh-filled", body: "Mixed after you order", icon: <><path d="M9 3h6M10 3v5l-4.5 9.5A2.5 2.5 0 0 0 7.8 21h8.4a2.5 2.5 0 0 0 2.3-3.5L14 8V3" {...stroke} /><path d="M7.5 14h9" {...stroke} /></> },
  { title: "Personalized label", body: "Name, city and fill date", icon: <><ellipse cx="12" cy="12" rx="7" ry="9" {...stroke} /><path d="M9 10.5h6M9.5 13.5h5" {...stroke} /></> },
  { title: "Free returns on Discovery Set", body: "Not for you? Send it back", icon: <><path d="M4 9h11a5 5 0 0 1 0 10H8" {...stroke} /><path d="M8 5 4 9l4 4" {...stroke} /></> },
  { title: "Secure checkout", body: "Opens at launch", icon: <><rect x="5" y="10.5" width="14" height="10" rx="1.5" {...stroke} /><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5M12 14.5v2.5" {...stroke} /></> },
];

export default function Home() {
  return (
    <>
      <HomeTop />

      <section aria-label="Why Fieldnote" className="border-b border-line">
        <ul className="wrap grid grid-cols-2 gap-x-6 gap-y-8 py-10 md:grid-cols-4 md:py-12">
          {TRUST.map((t, i) => (
            <li key={t.title} className="reveal flex items-start gap-3.5" style={{ transitionDelay: `${i * 70}ms` }}>
              <svg viewBox="0 0 24 24" className="size-8 flex-none" aria-hidden="true">{t.icon}</svg>
              <span>
                <span className="block font-mono text-[11px] font-medium uppercase leading-snug tracking-[0.14em]">{t.title}</span>
                <span className="mt-1 block text-[13px] text-muted">{t.body}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="mb-10 flex items-end justify-between gap-4">
            <h2 className="font-sans text-lg font-medium uppercase tracking-[0.14em] md:text-xl">The house scents</h2>
            <Link href="/scents/" className="link-line text-[12px]">View all</Link>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 md:gap-y-12">
            {SCENTS.map((s, i) => (
              <div key={s.slug} className="reveal" style={{ transitionDelay: `${(i % 3) * 80}ms` }}>
                <ScentCard scent={s} list="home" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section border-t border-line pt-14 md:pt-20">
        <div className="wrap">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-h2">From your order to your desk</h2>
            <p className="meta font-mono text-[13px]">Next bench session: <NextBench /></p>
          </div>
          <ol className="grid border-t border-ink md:grid-cols-3">
            {STEPS.map((s, i) => (
              <li key={s.title} className="reveal border-b border-line py-6 md:border-b-0 md:border-r md:px-7 md:first:pl-0 md:last:border-r-0" style={{ transitionDelay: `${i * 90}ms` }}>
                <span className="mb-4 block font-mono text-xs tracking-[0.2em] text-muted">0{i + 1}</span>
                <h3 className="mb-2.5 text-h3">{s.title}</h3>
                <p className="text-muted">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section bg-ink text-on-ink">
        <div className="wrap reveal grid items-center gap-10 md:grid-cols-2 md:gap-20">
          <div>
            <p className="eyebrow mb-6 text-on-ink/60">Custom</p>
            <h2 className="text-h2">Or build one that&apos;s only yours.</h2>
            <p className="lede mt-5 text-on-ink/70">
              Answer six quick questions. We match you to a base, you tune it with up to three notes, and name it. Your formula is saved, so you can reorder it exactly.
            </p>
            <Link href="/build/" className="btn mt-8 border-on-ink bg-on-ink text-ink hover:bg-transparent hover:text-on-ink">
              Start building, from {money(PRICES.custom[50])}
            </Link>
          </div>
          <dl className="grid grid-cols-[110px_1fr] gap-y-3 border-t border-on-ink/20 pt-5 font-mono text-sm text-on-ink/80">
            <dt className="text-on-ink/50">Base</dt><dd>Green Fig</dd>
            <dt className="text-on-ink/50">Notes</dt><dd>Bergamot, cedar</dd>
            <dt className="text-on-ink/50">Warmth</dt><dd>A little warmer</dd>
            <dt className="text-on-ink/50">Strength</dt><dd>Classic, 17%</dd>
            <dt className="text-on-ink/50">Formula</dt><dd>CMP-A2-M01.M09-W+1-I17</dd>
          </dl>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-h2">Every label is one of one</h2>
            <p className="meta">Example labels. Yours carries your own name, city and date.</p>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {EXAMPLES.map(([t, n, c, s], i) => (
              <div key={t} className="reveal border border-line bg-surface p-4 font-mono text-xs leading-[1.7]" style={{ transitionDelay: `${i * 70}ms` }}>
                <b className="font-medium">{t}</b><br />MADE FOR {n}<br />{c}<br />{s}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section border-t border-line">
        <div className="wrap reveal grid items-center gap-8 md:grid-cols-2 md:gap-20">
          <div>
            <h2 className="text-h2">Find us on campus</h2>
            <p className="lede mt-5">This fall we&apos;re setting up a blending table at UCLA, USC, NYU, UT Austin and Michigan. Smell everything, then order on the spot.</p>
          </div>
          <Newsletter source="campus" cta="Get pop-up dates" />
        </div>
      </section>
    </>
  );
}
