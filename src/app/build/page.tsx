import type { Metadata } from "next";
import { Suspense } from "react";
import { Builder } from "@/components/Builder";

export const metadata: Metadata = {
  title: "Create your own cologne",
  description: "Answer six questions, tune your base with up to three notes, and name it. Your custom cologne is mixed after you order and your formula is saved for reorders.",
  alternates: { canonical: "/build/" },
};

export default function BuildPage() {
  return (
    <Suspense fallback={<div className="wrap py-24"><p className="meta">Loading the builder…</p></div>}>
      <Builder />
    </Suspense>
  );
}
