import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SCENTS, getScent } from "@/lib/scents";
import { ProductBuy } from "@/components/ProductBuy";
import { ScentCard } from "@/components/ScentCard";
import { JsonLd } from "@/components/JsonLd";
import { Plus } from "@/components/icons";
import { PRICES, SITE } from "@/lib/site";

export const dynamicParams = false;
export function generateStaticParams() { return SCENTS.map((s) => ({ slug: s.slug })); }

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const s = getScent(params.slug);
  if (!s) return {};
  const description = `${s.name}: ${s.notes.top.toLowerCase()}, ${s.notes.heart.toLowerCase()}, ${s.notes.base.toLowerCase()}. Mixed after you order and labeled with your name. From $${PRICES.house[50]}.`;
  return { title: `${s.name} cologne`, description, alternates: { canonical: `/scents/${s.slug}/` }, openGraph: { title: `${s.name} | Fieldnote`, description } };
}

export default function ScentPage({ params }: { params: { slug: string } }) {
  const s = getScent(params.slug);
  if (!s) notFound();
  const more = SCENTS.filter((x) => x.slug !== s.slug).slice(0, 3);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org", "@type": "Product", name: `${s.name} Eau de Parfum`, sku: s.code,
          brand: { "@type": "Brand", name: "Fieldnote" }, description: s.story, url: `${SITE.url}/scents/${s.slug}/`,
          offers: ([50, 100] as const).map((z) => ({
            "@type": "Offer", sku: `${s.code}-${z}`, price: PRICES.house[z], priceCurrency: "USD", availability: "https://schema.org/MadeToOrder",
            url: `${SITE.url}/scents/${s.slug}/`,
          })),
          additionalProperty: [
            { "@type": "PropertyValue", name: "Top notes", value: s.notes.top },
            { "@type": "PropertyValue", name: "Heart notes", value: s.notes.heart },
            { "@type": "PropertyValue", name: "Base notes", value: s.notes.base },
          ],
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org", "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "House scents", item: `${SITE.url}/scents/` },
            { "@type": "ListItem", position: 2, name: s.name, item: `${SITE.url}/scents/${s.slug}/` },
          ],
        }}
      />
      <div className="wrap">
        <ProductBuy scent={s} after={<div className="mt-10">
            <dl className="border-t border-ink">
              {[["Top", s.notes.top], ["Heart", s.notes.heart], ["Base", s.notes.base], ["Wear it", s.wear], ["Formula", s.code]].map(([k, v]) => (
                <div key={k} className="grid grid-cols-[110px_1fr] gap-3 border-b border-line py-3.5">
                  <dt className="text-[15px] text-muted">{k}</dt><dd>{v}</dd>
                </div>
              ))}
            </dl>
            {[
              ["The story", s.story, true],
              ["How fresh is fresh?", "Your bottle is mixed at the next bench session after you order: weekdays, with a 3pm Pacific cutoff. The date on your label is the day it was made, not the day it left a warehouse.", false],
              ["Shipping and returns", "Free ground shipping on orders over $75. Because every bottle carries your name we can't restock it, but if a scent isn't right we'll remake it once in another house scent.", false],
            ].map(([q, a, open]) => (
              <details key={q as string} open={open as boolean} className="group border-b border-line">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-[17px] [&::-webkit-details-marker]:hidden">
                  {q}<Plus className="size-5 flex-none transition-transform duration-200 group-open:rotate-45" />
                </summary>
                <p className="pb-4 text-muted">{a}</p>
              </details>
            ))}
          </div>}>
          <nav aria-label="Breadcrumb" className="meta mb-5"><Link href="/scents/" className="no-underline hover:text-ink">House scents</Link> / {s.name}</nav>
          <h1 className="mb-2 text-[clamp(44px,5vw,68px)] leading-none">{s.name}</h1>
          <p className="mb-5 font-serif text-[22px] text-muted">{s.mood}</p>
        </ProductBuy>
      </div>
      <section className="bg-surface py-12 md:py-20">
        <div className="wrap">
          <h2 className="mb-8 text-h2">You might also like</h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 md:gap-x-7 [&>*:nth-child(3)]:max-md:hidden">
            {more.map((x) => <ScentCard key={x.slug} scent={x} list="related" />)}
          </div>
        </div>
      </section>
    </>
  );
}
