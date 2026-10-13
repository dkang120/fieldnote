import type { Metadata } from "next";
import { FillDateNote } from "@/components/FillDateNote";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "How it's made",
  description: "Every Fieldnote bottle is mixed by hand after you order and labeled with the date it was made. Here's a bottle's first day.",
  alternates: { canonical: "/how-its-made/" },
};

const LOG = [
  ["Your order", "The formula is written down", "Your scent or custom formula, size, name and city go onto a bench card with a formula code, so it can be remade exactly, years from now."],
  ["10:00 / 15:00", "Weighed by hand", "Two bench sessions every weekday. We weigh fragrance concentrate into perfumer's alcohol on a scale accurate to a hundredth of a gram."],
  ["+ 1 hour", "Mixed and filled", "The blend is stirred, filled into heavy glass, and the atomizer is crimped on so it can't leak."],
  ["+ 4 hours", "Rested and checked", "Every batch rests, then we check it for clarity and smell it against the master sample. We keep a small retained sample from each batch for a year."],
  ["Same day", "Labeled for you", "Your label prints with your name, your city and the day it was made. It's boxed with your card message and a vial of another house scent."],
  ["Next weekday", "On its way", "Ground shipping, usually 2 to 5 business days."],
];

const FAQ = [
  ["When will my order ship?", "Orders placed on a weekday before 3pm Pacific are mixed the same day. Everything ships the next weekday by ground, usually arriving in 2 to 5 business days."],
  ["Why ground shipping only?", "Cologne is alcohol-based, so carriers won't fly it. Ground is the safe, legal way to send it."],
  ["Does fresh-made fragrance last longer?", "We don't claim that. What we can promise is that your bottle never sat in a warehouse, and the date on the label shows it."],
  ["Can I change the name after ordering?", "Yes, until your bottle is mixed. Reply to your order email before the next bench session and we'll update it."],
  ["Can I reorder a custom blend?", "Yes. Every custom bottle has a formula code on its label and in your order email. Paste it into the builder, or reply with it, and we'll mix the same blend."],
];

export default function MadePage() {
  return (
    <>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) }} />
      <section className="pb-12 pt-10 md:pb-16 md:pt-16">
        <div className="wrap">
          <h1 className="max-w-[14ch] text-display">A bottle's first day</h1>
          <p className="lede mt-6">Most cologne is made months before anyone buys it. Ours starts when you click order. Here's what happens next.</p>
          <FillDateNote className="mt-8 max-w-[520px]" />
        </div>
      </section>

      <section className="pb-16 md:pb-24">
        <div className="wrap">
          <ol className="border-t border-ink">
            {LOG.map(([t, h, p]) => (
              <li key={h} className="grid gap-2 border-b border-line py-7 md:grid-cols-[130px_1fr_1.2fr] md:items-baseline md:gap-6">
                <span className="font-mono text-sm text-ink">{t}</span>
                <h2 className="text-[26px] leading-tight">{h}</h2>
                <p className="text-muted">{p}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section bg-ink text-on-ink">
        <div className="wrap">
          <h2 className="mb-10 text-h2">Shelf bottle or Fieldnote</h2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] border-collapse text-left">
              <thead><tr className="text-sm text-on-ink/70"><th className="py-3 font-normal" /><th className="py-3 font-normal">A typical bottle</th><th className="py-3 font-normal">Fieldnote</th></tr></thead>
              <tbody>
                {[
                  ["When it's made", "Months before you buy it", "Within 48 hours after you order"],
                  ["Where it waits", "Warehouses, trucks, store shelves", "It doesn't"],
                  ["The label", "The same as everyone's", "Your name, city and date"],
                  ["Reordering", "Hope it's still in stock", "Your formula code is saved"],
                  ["50 ml price", "Often $150 to $250 for niche brands", "$78, or $108 custom"],
                ].map(([k, a, b]) => (
                  <tr key={k} className="border-t border-on-ink/20 align-top">
                    <td className="w-[34%] py-4 pr-3 text-on-ink/70">{k}</td><td className="py-4 pr-3">{a}</td><td className="py-4">{b}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="section" id="ingredients">
        <div className="wrap grid gap-8 md:grid-cols-2 md:gap-20">
          <h2 className="text-h2">What's inside</h2>
          <div>
            <p className="lede mb-4">Eau de parfum at 15 to 18 percent fragrance concentrate, blended into perfumer's alcohol.</p>
            <p className="text-muted">Our concentrates come from a fragrance house that certifies every accord to IFRA safety standards. Custom blends use only note combinations we've already tested together. A full ingredient list is printed on each box.</p>
          </div>
        </div>
      </section>

      <section className="section bg-surface" id="faq">
        <div className="wrap grid gap-8 md:grid-cols-2 md:gap-20">
          <h2 className="text-h2">Questions</h2>
          <div>
            {FAQ.map(([q, a]) => (
              <details key={q} className="group border-b border-line">
                <summary className="flex cursor-pointer list-none justify-between gap-4 py-4 [&::-webkit-details-marker]:hidden">{q}<span aria-hidden className="text-[22px] leading-none transition-transform group-open:rotate-45">+</span></summary>
                <p className="pb-4 text-muted">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
