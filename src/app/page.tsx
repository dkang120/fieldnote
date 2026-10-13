import Link from "next/link";
import { HomeTop } from "@/components/HomeTop";
import { ScentCard } from "@/components/ScentCard";
import { NextBench } from "@/components/FillDateNote";
import { Newsletter } from "@/components/Newsletter";
import { SCENTS } from "@/lib/scents";
import { PRICES, money } from "@/lib/site";

const STEPS = [
  { title: "You choose", body: "Pick a house scent, or answer six quick questions to start a custom one. Add the name and city for your label." },
  { title: "We mix it", body: "At the next bench session we weigh the concentrate, blend it into the base and fill your bottle by hand, within 48 hours." },
  { title: "It's labeled for you", body: "Your name, city and made-on date are printed on the label. It ships the next weekday." },
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
  { title: "Discovery credit", body: `${money(PRICES.discovery)} back on your first full bottle`, icon: <><rect x="4" y="7" width="16" height="11" rx="1.5" {...stroke} /><path d="M4 11h16M8 15h3" {...stroke} /></> },
  { title: "Ships next weekday", body: "Ground, after your bottle is filled", icon: <><path d="M3.5 7.5h10v9h-10zM13.5 10.5h4l3 3v3h-7" {...stroke} /><circle cx="7.5" cy="17.5" r="1.5" {...stroke} /><circle cx="17" cy="17.5" r="1.5" {...stroke} /></> },
];

export default function Home() {
  return (
    <>
      <HomeTop />

      <section aria-label="Why Fieldnote" className="border-b border-line">
        <ul className="wrap grid grid-cols-2 gap-x-6 gap-y-8 py-10 md:grid-cols-4 md:py-12">
          {TRUST.map((t) => (
            <li key={t.title} className="flex items-start gap-3.5">
              <svg viewBox="0 0 24 24" className="size-8 flex-none" aria-hidden="true">{t.icon}</svg>
              <span>
                <span className="block text-[15px] leading-snug">{t.title}</span>
                <span className="mt-1 block text-[13px] text-muted">{t.body}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="mb-10 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-h2">The house scents</h2>
              <p className="meta mt-1">Not sure yet? <Link href="/scents/#find" className="text-ink underline underline-offset-4">Find your scent</Link> in two questions.</p>
            </div>
            <Link href="/scents/" className="link-line text-[15px]">View all</Link>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-16 md:grid-cols-3">
            {SCENTS.map((s) => <ScentCard key={s.slug} scent={s} list="home" />)}
          </div>
        </div>
      </section>

      <section className="section border-t border-line pt-14 md:pt-20">
        <div className="wrap">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-h2">From your order to your desk</h2>
            <p className="meta text-[13px]">Next bench session: <NextBench /></p>
          </div>
          <ol className="grid border-t border-ink md:grid-cols-3">
            {STEPS.map((s, i) => (
              <li key={s.title} className="border-b border-line py-6 md:border-b-0 md:border-r md:px-7 md:first:pl-0 md:last:border-r-0">
                <span className="mb-4 block text-meta text-muted">0{i + 1}</span>
                <h3 className="mb-2.5 text-h3">{s.title}</h3>
                <p className="text-muted">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section bg-ink text-on-ink">
        <div className="wrap grid items-center gap-10 md:grid-cols-2 md:gap-20">
          <div>
            <h2 className="text-h2">Or build one that&apos;s only yours.</h2>
            <p className="lede mt-5 text-on-ink/70">
              Answer six quick questions. We match you to a starting base, then you tune it with up to three notes. Name it, save the formula, and reorder it exactly.
            </p>
            <Link href="/build/" className="btn mt-8 border-on-ink bg-on-ink text-ink hover:bg-transparent hover:text-on-ink">
              Start building, from {money(PRICES.custom[50])}
            </Link>
          </div>
          {/* Example custom blend, read top to bottom: how it feels, then the record. */}
          <figure className="border-t border-on-ink/20 pt-6">
            <figcaption className="text-meta text-on-ink/60">Example blend</figcaption>
            <p className="mt-3 text-[22px] leading-snug">Your Fieldnote</p>
            <p className="mt-1 text-on-ink/80">Green Fig · Bergamot · Cedar</p>
            <p className="text-on-ink/80">A little warmer · Classic strength</p>
            <p className="mt-5 text-meta text-on-ink/60">Formula <span className="ml-1 text-on-ink/80">CMP-A2-M01.M09-W+1-I17</span></p>
          </figure>
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
              <div key={t} className="bg-surface p-4 text-meta leading-[1.7]">
                <b className="font-medium">{t}</b><br />MADE FOR {n}<br />{c}<br />{s}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section border-t border-line">
        <div className="wrap grid items-center gap-8 md:grid-cols-2 md:gap-20">
          <div>
            <h2 className="text-h2">Find us on campus</h2>
            <p className="lede mt-5">This fall we&apos;re setting up a blending table at UCLA, USC, NYU, UT Austin and Michigan. Smell everything, then order on the spot.</p>
            <p className="meta mt-4">Dates aren&apos;t set yet. We&apos;ll email each campus date and location before the bench opens.</p>
          </div>
          <Newsletter source="campus" cta="Get pop-up updates" campuses={["UCLA", "USC", "NYU", "UT Austin", "University of Michigan", "Another campus"]} />
        </div>
      </section>
    </>
  );
}
