import type { Metadata } from "next";
import Link from "next/link";
import { Catalog } from "@/components/Catalog";
import { PRICES, money } from "@/lib/site";

export const metadata: Metadata = {
  title: "House scents",
  description: "Six eaux de parfum, each mixed after you order and labeled with your name. 50 ml $78, 100 ml $128.",
  alternates: { canonical: "/scents/" },
};

export default function ScentsPage() {
  return (
    <>
      <section className="py-10 md:py-16">
        <div className="wrap">
          <h1 className="mb-4 text-display">House scents</h1>
          <p className="lede mb-10">Six eaux de parfum, built to be worn every day. Each one is mixed for you after you order and labeled with your name.</p>
          <Catalog />
        </div>
      </section>
      <section className="bg-paper-deep py-12 md:py-20">
        <div className="wrap grid items-center gap-6 md:grid-cols-2">
          <h2 className="text-h2">Can't choose?</h2>
          <div>
            <p className="lede mb-5">Try all six at home for {money(PRICES.discovery)}, or answer six questions and build your own.</p>
            <div className="flex flex-wrap gap-3">
              <Link className="btn" href="/discovery/">Get the Discovery Set</Link>
              <Link className="btn btn-ghost" href="/build/">Create yours</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
