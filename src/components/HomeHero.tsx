"use client";

import Link from "next/link";
import { useState } from "react";
import { Bottle } from "./Bottle";
import { LabelFields, emptyPersonalization } from "./LabelFields";
import { useFillDates } from "@/lib/use-fill-dates";
import { SCENTS } from "@/lib/scents";
import { PRICES, money } from "@/lib/site";

export function HomeHero() {
  const [p, setP] = useState(emptyPersonalization);
  const dates = useFillDates();
  const s = SCENTS[1];
  return (
    <section className="pb-16 pt-10 md:pb-24 md:pt-16">
      <div className="wrap grid items-center gap-8 md:grid-cols-[1.05fr_1fr] md:gap-16">
        <div>
          <h1 className="mb-6 text-display">Cologne that waits for you.</h1>
          <p className="lede mb-8">
            Nothing here is mixed until you order it. We fill your bottle by hand within 48 hours and print your name, city and date on the label.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/scents/" className="btn">Shop house scents</Link>
            <Link href="/build/" className="btn btn-ghost">Create yours</Link>
          </div>
          <div className="mt-8 max-w-[440px]">
            <p className="meta mb-2">Try it: type your name and see your label.</p>
            <LabelFields value={p} onChange={setP} surface="home" showMessage={false} idPrefix="hero" />
          </div>
          <p className="meta mt-4">Or try all six scents for {money(PRICES.discovery)}. <Link href="/discovery/" className="text-ink underline underline-offset-4">Discovery Set</Link></p>
        </div>
        <div className="order-first grid aspect-square place-items-center rounded bg-paper-deep md:order-none md:aspect-[4/5]">
          <Bottle title={s.name} no={s.no} tint={s.tint} name={p.name} city={p.city} date={dates?.compounded ?? null} className="w-[48%] motion-safe:animate-[settle_1.1s_cubic-bezier(.2,.7,.2,1)_both] md:w-[62%]" />
        </div>
      </div>
    </section>
  );
}
