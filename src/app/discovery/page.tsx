import type { Metadata } from "next";
import Link from "next/link";
import { SCENTS } from "@/lib/scents";
import { VialRow } from "@/components/VialRow";
import { Plus } from "@/components/icons";
import { AddDiscovery } from "@/components/AddDiscovery";
import { JsonLd } from "@/components/JsonLd";
import { PRICES, SITE, money } from "@/lib/site";

export const metadata: Metadata = {
  title: "Discovery Set",
  description: `All six Fieldnote house scents in 2 ml vials for ${money(PRICES.discovery)}, credited toward your first full bottle.`,
  alternates: { canonical: "/discovery/" },
};

export default function DiscoveryPage() {
  return (
    <div className="wrap">
      <JsonLd data={{
        "@context": "https://schema.org", "@type": "Product", name: "Fieldnote Discovery Set", sku: "DS-06", brand: { "@type": "Brand", name: "Fieldnote" },
        offers: { "@type": "Offer", price: PRICES.discovery, priceCurrency: "USD", availability: "https://schema.org/InStock", url: `${SITE.url}/discovery/` },
      }} />
      <div className="grid items-start gap-8 pb-24 pt-4 md:grid-cols-[1.1fr_1fr] md:gap-16 md:pt-8">
        <div className="flex aspect-square items-end justify-center gap-[3%] bg-surface px-[8%] pb-[18%] md:sticky md:top-[88px] md:aspect-[4/5]">
          <VialRow />
        </div>
        <div className="min-w-0">
          <nav aria-label="Breadcrumb" className="meta mb-5"><Link href="/" className="no-underline hover:text-ink">Home</Link> / Discovery Set</nav>
          <h1 className="mb-2 text-display">Discovery Set</h1>
          <p className="mb-5 text-[17px] text-muted">All six house scents, 2 ml each.</p>
          <p className="price mb-5 text-xl">{money(PRICES.discovery)} <span className="meta">Credited to your first full bottle</span></p>
          <p className="text-muted">Each vial holds about 30 sprays, enough to wear a scent for a few days and see how it wears on you. When you order a full bottle, we take the {money(PRICES.discovery)} off.</p>
          <AddDiscovery />
          <p className="meta">Ships in a padded mailer for $4.50, or free with a full bottle.</p>
          <dl className="mt-10 border-t border-ink">
            {SCENTS.map((s) => (
              <div key={s.slug} className="grid grid-cols-[80px_1fr] gap-3 border-b border-line py-3.5">
                <dt className="text-[15px] text-muted">No. {s.no}</dt>
                <dd><Link href={`/scents/${s.slug}/`} className="underline-offset-4">{s.name}</Link> <span className="meta">{s.notes.top.split(",")[0]}, {s.notes.base.split(",")[0].toLowerCase()}</span></dd>
              </div>
            ))}
          </dl>
          {[
            ["How the credit works", `After your set ships, we email you a one-time ${money(PRICES.discovery)} code. Use it on any house or custom bottle within 90 days.`],
            ["Which one should I start with?", "Start with the one whose top note sounds most like you, then switch every day. Spray your wrist, not paper. Scent changes on skin."],
          ].map(([q, a], i) => (
            <details key={q} open={i === 0} className="group border-b border-line">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 [&::-webkit-details-marker]:hidden">{q}<Plus className="size-5 flex-none transition-transform duration-200 group-open:rotate-45" /></summary>
              <p className="pb-4 text-muted">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
