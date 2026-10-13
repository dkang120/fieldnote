import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SCENTS, getScent, shortNotes } from "@/lib/scents";
import { ProductBuy } from "@/components/ProductBuy";
import { ScentCard } from "@/components/ScentCard";
import { JsonLd } from "@/components/JsonLd";
import { PRICES, SITE } from "@/lib/site";

export const dynamicParams = false;
export function generateStaticParams() { return SCENTS.map((s) => ({ slug: s.slug })); }

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const s = getScent(params.slug);
  if (!s) return {};
  const description = `${s.name} is a made-to-order Fieldnote cologne with ${shortNotes(s).toLowerCase()}. Mixed by hand and labeled with your name, city, and date. From $${PRICES.house[50]}.`;
  return { title: `${s.name} cologne | Made to order`, description, alternates: { canonical: `/scents/${s.slug}/` }, openGraph: { title: `${s.name} | Fieldnote`, description } };
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
      <ProductBuy scent={s} />
      <section className="pb-32 pt-16 md:pb-24 md:pt-20">
        <div className="wrap">
          <h2 className="mb-8 text-h2">You might also like</h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-16 md:grid-cols-3 [&>*:nth-child(3)]:max-md:hidden">
            {more.map((x) => <ScentCard key={x.slug} scent={x} list="related" />)}
          </div>
        </div>
      </section>
    </>
  );
}
