import type { Metadata } from "next";
import { Frames } from "@/components/Frames";
import { JsonLd } from "@/components/JsonLd";
import { DiscoveryDesktop } from "@/components/pages/discovery/Desktop";
import { DiscoveryPhone } from "@/components/pages/discovery/Phone";
import { PRICES, SITE, money } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "Discovery Set | Six Fieldnote scents" },
  description: `Try all six Fieldnote house scents in 2 ml vials. Your ${money(PRICES.discovery)} Discovery Set is applied to your first full bottle.`,
  alternates: { canonical: "/discovery/" },
};

export default function DiscoveryPage() {
  return (
    <>
      <JsonLd data={{
        "@context": "https://schema.org", "@type": "Product", name: "Fieldnote Discovery Set", sku: "DS-06", brand: { "@type": "Brand", name: "Fieldnote" },
        offers: { "@type": "Offer", price: PRICES.discovery, priceCurrency: "USD", availability: "https://schema.org/InStock", url: `${SITE.url}/discovery/` },
      }} />
      <Frames phone={<DiscoveryPhone />} desktop={<DiscoveryDesktop />} />
    </>
  );
}
