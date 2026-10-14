import type { Metadata } from "next";
import { Frames } from "@/components/Frames";
import { HeaderDesktop, HeaderPhone, FooterDesktop, FooterPhone } from "@/components/site/Chrome";
import { Newsletter } from "@/components/site/Newsletter";
import { AboutDesktop, AboutPhone } from "@/components/pages/about/About";

export const metadata: Metadata = {
  title: "About",
  description: "Fieldnote mixes every bottle by hand after you order and labels it with your name, your city and the day it was made.",
  alternates: { canonical: "/about/" },
};

export default function AboutPage() {
  return (
    <Frames
      phone={<><HeaderPhone /><AboutPhone /><Newsletter device="p" /><FooterPhone /></>}
      desktop={<><HeaderDesktop /><AboutDesktop /><Newsletter device="d" /><FooterDesktop /></>}
    />
  );
}
