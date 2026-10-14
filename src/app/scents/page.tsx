import type { Metadata } from "next";
import { ScentsPage } from "@/components/pages/scents/Scents";

export const metadata: Metadata = {
  title: { absolute: "House scents | Fieldnote cologne" },
  description: "Explore six made-to-order Fieldnote house scents. Each bottle is hand mixed, freshly filled, and labeled with your name, city, and date.",
  alternates: { canonical: "/scents/" },
};

export default function Page() {
  return <ScentsPage />;
}
