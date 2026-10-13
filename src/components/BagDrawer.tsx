"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/lib/cart";
import { integrations } from "@/lib/integrations";
import { QTY_MAX, lineQty, lineTotal, toItem, type CartLine } from "@/lib/cart-types";
import { Plus } from "./icons";
import { fmtDay, isoDay } from "@/lib/fill-dates";
import { useFillDates } from "@/lib/use-fill-dates";
import { track } from "@/lib/analytics";
import { FREE_SHIP_THRESHOLD, PRICES, money } from "@/lib/site";
import { Bottle, Vial } from "./Bottle";
import { SCENTS } from "@/lib/scents";

function Thumb({ line, date }: { line: CartLine; date: Date | null }) {
  if (line.kind === "discovery") {
    return <div className="flex w-1/2 gap-0.5">{SCENTS.slice(0, 3).map((s) => <Vial key={s.slug} no={s.no} tint={s.tint} />)}</div>;
  }
  const p = line.personalization;
  return (
    <Bottle
      className="w-1/2" title={line.kind === "custom" ? line.blendName : line.title} no={line.kind === "custom" ? "C" : line.no}
      tint={line.tint} name={p.name} city={p.city} size={line.size} date={date} label={line.title}
    />
  );
}

export function BagDrawer() {
  const { lines, subtotal, open, setOpen, remove, setQty, toast, toastMsg } = useCart();
  const dates = useFillDates();
  const [busy, setBusy] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);

  // Modal behavior: focus moves in, Tab stays inside, Escape closes, focus returns to whatever opened the bag.
  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setOpen(false); return; }
      if (e.key !== "Tab" || !panelRef.current) return;
      const els = [...panelRef.current.querySelectorAll<HTMLElement>("a[href],button:not([disabled]),input,select,[tabindex]:not([tabindex='-1'])")];
      if (!els.length) return;
      const first = els[0], last = els[els.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      if (opener && document.contains(opener)) opener.focus();
    };
  }, [open, setOpen]);

  const ship = integrations.shipping.quote(lines);
  const total = subtotal + ship.price;

  async function checkout() {
    if (!dates) return;
    setBusy(true);
    track("begin_checkout", { currency: "USD", value: total, items: lines.map(toItem), fill_date: isoDay(dates.compounded) });
    try {
      const res = await integrations.payments.createCheckout(lines, { fillDate: isoDay(dates.compounded), shipDate: isoDay(dates.ships) });
      if (res.status === "redirect") window.location.assign(res.url);
      else toast(res.message);
    } catch (err) {
      toast(err instanceof Error ? err.message : "Couldn't start checkout. Try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <div className={`fixed inset-0 z-[60] bg-ink/35 transition-opacity ${open ? "opacity-100" : "pointer-events-none opacity-0"}`} onClick={() => setOpen(false)} />
      <aside
        ref={panelRef} role="dialog" aria-modal="true" aria-labelledby="bag-title" aria-hidden={!open}
        className={`fixed inset-y-0 right-0 z-[70] flex w-full max-w-[440px] flex-col bg-canvas duration-300 ease-settle ${open ? "visible translate-x-0 transition-transform" : "invisible translate-x-full transition-[transform,visibility]"}`}
      >
        <header className="flex items-center justify-between border-b border-line px-4 py-5 sm:px-8">
          <h2 id="bag-title" className="text-[22px]">Your bag</h2>
          <button ref={closeRef} className="min-h-[44px] pl-3 text-[15px] underline underline-offset-4" onClick={() => setOpen(false)} aria-label="Close bag">Close</button>
        </header>

        <div className="flex-1 overflow-auto px-4 sm:px-8">
          {!lines.length ? (
            <div className="py-10">
              <p className="text-title">Your bag is empty.</p>
              <p className="mt-2 text-muted">
                Not sure where to start? Try all six house scents in the Discovery Set. The {money(PRICES.discovery)} is applied to your first full bottle.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
                <Link href="/discovery/" className="btn" onClick={() => setOpen(false)}>Shop the Discovery Set</Link>
                <Link href="/scents/#find" className="link-line text-[15px]" onClick={() => setOpen(false)}>Find your scent</Link>
              </div>
            </div>
          ) : (
            lines.map((l) => (
              <div key={l.id} className="grid grid-cols-[64px_1fr_auto] gap-3.5 border-b border-line py-4">
                <div className="grid h-20 place-items-center bg-surface"><Thumb line={l} date={dates?.compounded ?? null} /></div>
                <div className="min-w-0">
                  <h3 className="text-title">{l.kind === "custom" ? `${l.blendName}` : l.title}</h3>
                  <p className="mt-1 text-meta text-muted">
                    {l.kind === "discovery" ? "6 × 2 ml samples" : `${l.size} ml · for ${l.personalization.name}${l.personalization.city ? `, ${l.personalization.city}` : ""}`}
                  </p>
                  {l.kind === "custom" && <p className="mt-0.5 break-all text-meta text-muted">{l.formulaCode}</p>}
                  {l.kind !== "discovery" && l.personalization.message && (
                    <p className="mt-0.5 text-[13px] italic text-muted">Card: “{l.personalization.message}”</p>
                  )}
                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
                    <div className="flex items-center rounded-full border border-line" role="group" aria-label={`Quantity for ${l.title}`}>
                      <button type="button" className="grid size-10 place-items-center disabled:opacity-30" aria-label="Decrease quantity"
                        disabled={lineQty(l) <= 1} onClick={() => setQty(l.id, lineQty(l) - 1)}>
                        <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" aria-hidden="true"><path d="M6 12h12" /></svg>
                      </button>
                      <span className="price w-6 text-center text-[15px]" aria-live="polite" aria-label={`Quantity ${lineQty(l)}`}>{lineQty(l)}</span>
                      <button type="button" className="grid size-10 place-items-center disabled:opacity-30" aria-label="Increase quantity"
                        disabled={lineQty(l) >= QTY_MAX} onClick={() => setQty(l.id, lineQty(l) + 1)}>
                        <Plus className="size-4" />
                      </button>
                    </div>
                    <button className="min-h-[40px] text-[13px] text-muted underline underline-offset-4" onClick={() => remove(l.id)}>
                      Remove<span className="sr-only"> {l.title}</span>
                    </button>
                  </div>
                </div>
                <div className="price">{money(lineTotal(l))}</div>
              </div>
            ))
          )}
        </div>

        {!!lines.length && (
          <footer className="border-t border-line px-4 pb-[calc(18px+env(safe-area-inset-bottom))] pt-4 sm:px-8">
            <p className="meta">{ship.freeShippingRemaining ? `${money(ship.freeShippingRemaining)} away from free shipping` : "Free shipping unlocked"}</p>
            <div className="mb-4 mt-2 h-[3px] overflow-hidden bg-line">
              <span className="block h-full bg-ink transition-[width] duration-500" style={{ width: `${Math.min(100, (subtotal / FREE_SHIP_THRESHOLD) * 100)}%` }} />
            </div>
            <dl className="mb-2 grid grid-cols-[1fr_auto] gap-y-1 tabular-nums">
              <dt className="text-muted">Subtotal</dt><dd>{money(subtotal)}</dd>
              <dt className="text-muted">Ground shipping</dt><dd>{ship.price ? money(ship.price) : "Free"}</dd>
              <dt className="text-lg">Total</dt><dd className="text-lg">{money(total)}</dd>
            </dl>
            <p className="meta mb-3">
              {dates ? <>Mixed <strong className="text-ink">{fmtDay(dates.compounded)}</strong>, ships {fmtDay(dates.ships)}, arrives in {ship.etaBusinessDays[0]}–{ship.etaBusinessDays[1]} business days.</> : "Mixed within 48 hours."}
            </p>
            <button className="btn w-full" onClick={checkout} disabled={busy || !dates}>{busy ? "Starting checkout…" : "Check out"}</button>
          </footer>
        )}
      </aside>
      <div
        role="status" aria-live="polite"
        className={`pointer-events-none fixed bottom-6 left-1/2 z-[80] -translate-x-1/2 rounded-full bg-ink px-5 py-3 text-[15px] text-on-ink transition-all ${toastMsg ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
      >
        {toastMsg}
      </div>
    </>
  );
}
