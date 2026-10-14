import type { Metadata } from "next";
import { Build } from "@/components/pages/build/Build";

export const metadata: Metadata = {
  title: "Build your own cologne",
  description: "Build a made-to-order Fieldnote cologne: choose a base, tune up to three notes, pick the strength and put your name on the label.",
  alternates: { canonical: "/build/" },
};

export default function BuildPage() {
  return <Build />;
}
