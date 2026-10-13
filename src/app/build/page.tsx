import type { Metadata } from "next";
import { Suspense } from "react";
import { Builder } from "@/components/Builder";

export const metadata: Metadata = {
  title: "Build your own cologne",
  description: "Build a made-to-order Fieldnote cologne in six questions. Tune your notes, name your scent, and save your formula for easy reorders.",
  alternates: { canonical: "/build/" },
};

export default function BuildPage() {
  return (
    <Suspense fallback={<div className="wrap py-24"><p className="meta">Loading the builder…</p></div>}>
      <Builder />
    </Suspense>
  );
}
