import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { Frames } from "@/components/Frames";
import { HeaderDesktop, HeaderPhone, FooterDesktop, FooterPhone } from "@/components/site/Chrome";
import { HowDesktop } from "@/components/pages/how/HowDesktop";
import { HowPhone } from "@/components/pages/how/HowPhone";
import { ShippingAnchor } from "@/components/pages/how/ShippingAnchor";
import { FAQ } from "@/components/pages/how/content";

export const metadata: Metadata = {
  title: "How it's made",
  description: "Every Fieldnote bottle is mixed by hand after you order and labeled with the date it was made. Here's a bottle's first day.",
  alternates: { canonical: "/how-its-made/" },
};

export default function MadePage() {
  return (
    <>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) }} />
      <ShippingAnchor />
      <Frames
        phone={<><HeaderPhone /><HowPhone /><FooterPhone /></>}
        desktop={<><HeaderDesktop /><HowDesktop /><FooterDesktop /></>}
      />
    </>
  );
}
