"use client";

/* Overlays from Figma: Cart drawer (172:1988 / empty 172:2113, phone sheets 172:2130 / 172:2171),
   Menu sheet (172:2189), Reserve modal (166:1589 desktop, 166:1607 phone) and the Reserve success toast (states board). */
import NextLink from "next/link";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/lib/cart";
import { useUi } from "@/lib/ui";
import { lineQty, lineTotal, type CartLine } from "@/lib/cart-types";
import { integrations } from "@/lib/integrations";
import { asset, PRICES } from "@/lib/site";
import { Bag, Check, ChevronRight } from "@/components/icons";
import { Button, TextLink } from "./ui";

const fmt = (n: number) => `$${n.toFixed(2)}`;

function useEscape(open: boolean, close: () => void) {
  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", k);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", k); document.body.style.overflow = prev; };
  }, [open, close]);
}

function thumbFor(l: CartLine) {
  if (l.kind === "house") return asset(`/img/scents/${l.slug}.webp`);
  if (l.kind === "discovery") return asset("/img/scents/discovery-set.webp");
  return asset("/img/scents/build-your-own.webp");
}

function detailFor(l: CartLine) {
  if (l.kind === "discovery") return ["Six 2 ml vials"];
  const p = l.personalization;
  const strength = l.kind === "custom" && l.formula.intensity === "soft" ? "Eau de cologne" : "Eau de parfum";
  return [`${l.size} ml · ${strength}`, p.name ? `Made for ${p.name}${p.city ? ` · ${p.city}` : ""}` : "Label details to come"];
}

function CartPanel({ px }: { px: number }) {
  const { lines, subtotal, setOpen, remove } = useCart();
  const { openReserve } = useUi();
  const count = lines.reduce((n, l) => n + lineQty(l), 0);
  const hasBottle = lines.some((l) => l.kind !== "discovery");
  const hasDiscovery = lines.some((l) => l.kind === "discovery");
  const credit = hasBottle && hasDiscovery ? PRICES.discovery : 0;
  const pad = { paddingLeft: px, paddingRight: px };
  return (
    <div className="bg-[#f7f4f0] flex flex-col items-start relative h-full w-full">
      <div className="border-[#d1cdc4] border-b border-solid flex items-center justify-between overflow-clip py-[20px] relative shrink-0 w-full" style={pad}>
        <h2 className="font-serif font-normal leading-[1.25] not-italic text-[24px] text-[#2b231f] whitespace-nowrap">Your bag ({count})</h2>
        <TextLink arrow={false} onClick={() => setOpen(false)}>Close</TextLink>
      </div>
      {lines.length === 0 ? (
        <div className="flex flex-[1_0_0] flex-col items-start min-h-px overflow-auto py-[24px] relative w-full" style={pad}>
          <div className="flex flex-col gap-[16px] items-start pt-[48px] relative shrink-0 w-full">
            <p className="font-serif leading-[1.25] text-[24px] text-[#2b231f] whitespace-nowrap">Your bag is empty.</p>
            <p className="font-sans leading-[1.5] text-[16px] text-[#6b625b] w-full">Not sure where to start? Two questions, one pick.</p>
            <Button href="/scents/#find" onClick={() => setOpen(false)}>Find your scent</Button>
            <TextLink href="/discovery/" onClick={() => setOpen(false)}>Or start with the Discovery Set</TextLink>
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-[1_0_0] flex-col gap-[24px] items-start min-h-px overflow-auto py-[24px] relative w-full" style={pad}>
            {lines.map((l) => (
              <div key={l.id} className="flex gap-[16px] items-start relative shrink-0 w-full">
                <img alt="" src={thumbFor(l)} className="relative shrink-0 size-[96px] object-cover" />
                <div className="flex flex-[1_0_0] flex-col gap-[4px] items-start min-w-px relative">
                  <div className="flex items-start justify-between relative shrink-0 text-[#2b231f] w-full whitespace-nowrap">
                    <p className="font-sans leading-[1.5] text-[16px]">{l.title}</p>
                    <p className="font-mono leading-[1.4] text-[14px]">{fmt(lineTotal(l))}</p>
                  </div>
                  {detailFor(l).map((d) => (
                    <p key={d} className="font-sans leading-[1.5] text-[14px] text-[#6b625b] w-full">{d}</p>
                  ))}
                  <div className="flex gap-[16px] items-start pt-[8px] relative shrink-0">
                    <p className="font-sans leading-[1.5] text-[14px] text-[#2b231f] whitespace-nowrap">Qty {lineQty(l)}</p>
                    <TextLink arrow={false} onClick={() => remove(l.id)}>Remove</TextLink>
                  </div>
                </div>
              </div>
            ))}
            <div className="border-[#d1cdc4] border-solid border-t flex flex-col gap-[12px] items-start pt-[20px] relative shrink-0 w-full">
              <Row k="Subtotal" v={fmt(subtotal)} />
              {credit ? <Row k="Discovery Set credit" v={`−${fmt(credit)}`} /> : null}
              <div className="flex font-sans items-start justify-between leading-[1.5] text-[14px] text-[#6b625b] w-full whitespace-nowrap">
                <p>Shipping</p>
                <p>Free ground shipping over $75</p>
              </div>
              <div className="border-[#d1cdc4] border-solid border-t flex items-start justify-between pt-[12px] text-[#2b231f] w-full whitespace-nowrap">
                <p className="font-sans leading-[1.5] text-[16px]">Total today</p>
                <p className="font-mono leading-[1.4] text-[14px]">$0.00</p>
              </div>
              <p className="font-sans leading-[1.4] text-[12px] text-[#6b625b] w-full">Reserved bottles are charged {fmt(subtotal - credit)} when checkout opens.</p>
            </div>
          </div>
          <div className="border-[#d1cdc4] border-solid border-t flex flex-col gap-[12px] items-start py-[24px] relative shrink-0 w-full" style={pad}>
            <Button className="h-[50px] px-[32px] w-full" onClick={() => { setOpen(false); openReserve(null); }}>Reserve, pay at launch</Button>
            <p className="font-sans leading-[1.4] text-[12px] text-[#6b625b] w-full">Nothing is charged today.</p>
          </div>
        </>
      )}
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-start justify-between text-[14px] text-[#2b231f] w-full whitespace-nowrap">
      <p className="font-sans leading-[1.5]">{k}</p>
      <p className="font-mono leading-[1.4]">{v}</p>
    </div>
  );
}

function CartOverlay() {
  const { open, setOpen } = useCart();
  useEscape(open, () => setOpen(false));
  if (!open) return null;
  return (
    <div role="dialog" aria-modal="true" aria-label="Bag" className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-[rgba(43,35,31,0.4)]" onClick={() => setOpen(false)} />
      <div className="ov-d absolute right-0 top-0 h-full w-[440px]"><CartPanel px={32} /></div>
      <div className="ov-p absolute inset-y-0 left-1/2 -translate-x-1/2 h-full w-[390px]"><CartPanel px={16} /></div>
    </div>
  );
}

function MenuOverlay() {
  const { menuOpen, setMenuOpen } = useUi();
  const { lines, setOpen } = useCart();
  useEscape(menuOpen, () => setMenuOpen(false));
  if (!menuOpen) return null;
  const close = () => setMenuOpen(false);
  const items = [["/scents/", "Scents"], ["/build/", "Build your own"], ["/discovery/", "Discovery Set"], ["/how-its-made/", "How it's made"], ["/about/", "About"]];
  return (
    <div role="dialog" aria-modal="true" aria-label="Menu" className="fixed inset-0 z-50 bg-[#f7f4f0]">
      <div className="ov-p w-[390px] mx-auto h-full bg-[#f7f4f0] flex flex-col items-start">
        <div className="border-[#d1cdc4] border-b border-solid flex items-center justify-between px-[16px] py-[20px] shrink-0 w-full">
          <NextLink href="/" onClick={close} className="font-sans font-medium leading-[23px] text-[18px] text-[#2b231f]">FIELDNOTE</NextLink>
          <TextLink arrow={false} onClick={close}>Close</TextLink>
        </div>
        <nav className="flex flex-[1_0_0] flex-col items-start min-h-px pt-[16px] px-[16px] w-full">
          {items.map(([href, label]) => (
            <NextLink key={href} href={href} onClick={close} className="border-[#d1cdc4] border-b border-solid flex items-center justify-between py-[16px] shrink-0 w-full">
              <span className="font-serif leading-[1.25] text-[24px] text-[#2b231f]">{label}</span>
              <ChevronRight className="shrink-0 size-[24px] text-[#2b231f]" />
            </NextLink>
          ))}
        </nav>
        <div className="flex flex-col items-start pb-[32px] px-[16px] shrink-0 w-full">
          <a href="mailto:hello@fieldnote.studio?subject=My%20account" className="border-[#d1cdc4] border-solid border-t flex items-center py-[14px] w-full font-sans leading-[1.5] text-[16px] text-[#2b231f]">Account</a>
          <button type="button" onClick={() => { close(); setOpen(true); }} className="border-[#d1cdc4] border-solid border-t flex gap-[12px] items-center py-[14px] w-full">
            <Bag className="shrink-0 size-[20px] text-[#2b231f]" />
            <span className="font-sans leading-[1.5] text-[16px] text-[#2b231f]">Bag ({lines.reduce((n, l) => n + lineQty(l), 0)})</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function ReservePanel({ phone }: { phone: boolean }) {
  const { reserve, closeReserve, showToast } = useUi();
  const [email, setEmail] = useState("");
  const [err, setErr] = useState("");
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => { input.current?.focus({ preventScroll: true }); }, []);
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const r = await integrations.email.subscribe(email.trim(), `reserve:${reserve?.id ?? "bag"}`);
    if (!r.ok) { setErr("Enter a full email address, like you@school.edu."); return; }
    closeReserve();
    showToast("Reserved. We'll email you when checkout opens.");
  }
  return (
    <form
      onSubmit={submit}
      noValidate
      className={`bg-[#f7f4f0] flex flex-col gap-[24px] items-start relative ${phone ? "w-[390px] px-[16px] pt-[24px] pb-[32px] rounded-tl-[16px] rounded-tr-[16px]" : "w-[480px] p-[40px]"}`}
    >
      {phone ? <div className="h-[4px] w-[40px] rounded-[2px] bg-[#6b625b] opacity-40 self-center" /> : null}
      <div className="flex flex-col gap-[8px] items-start w-full">
        <h2 className="font-serif font-normal leading-[1.25] text-[24px] text-[#2b231f] w-full">Reserve your bottle</h2>
        <p className="font-sans leading-[1.5] text-[16px] text-[#6b625b] w-full">We&apos;ll email you when checkout opens. Nothing is charged today.</p>
      </div>
      <div className="flex flex-col gap-[6px] items-start w-full">
        <label htmlFor={`rsv-${phone ? "p" : "d"}`} className="font-sans leading-[1.5] text-[16px] text-[#2b231f]">Email</label>
        <input
          ref={input}
          id={`rsv-${phone ? "p" : "d"}`}
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setErr(""); }}
          placeholder="you@example.com"
          className={`bg-[#f7f4f0] border border-solid h-[48px] px-[16px] w-full font-sans leading-[1.5] text-[16px] text-[#2b231f] outline-none focus:border-[#2b231f] ${err ? "border-[#9a4f31]" : "border-[#d1cdc4]"}`}
        />
        {err ? <p className="font-sans leading-[1.4] text-[14px] text-[#9a4f31]">{err}</p> : null}
      </div>
      <div className="flex flex-col gap-[12px] items-center w-full">
        <Button type="submit" className="h-[50px] px-[32px] w-full">Reserve</Button>
        <TextLink arrow={false} onClick={closeReserve}>Not now</TextLink>
      </div>
    </form>
  );
}

function ReserveOverlay() {
  const { reserve, closeReserve } = useUi();
  const open = reserve !== undefined;
  useEscape(open, closeReserve);
  if (!open) return null;
  return (
    <div role="dialog" aria-modal="true" aria-label="Reserve your bottle" className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-[rgba(43,35,31,0.4)]" onClick={closeReserve} />
      <div className="ov-d absolute inset-0 flex items-center justify-center pointer-events-none"><div className="pointer-events-auto"><ReservePanel phone={false} /></div></div>
      <div className="ov-p absolute inset-x-0 bottom-0 flex justify-center pointer-events-none"><div className="pointer-events-auto"><ReservePanel phone /></div></div>
    </div>
  );
}

function Toast() {
  const { toast } = useUi();
  if (!toast) return null;
  return (
    <div className="fixed inset-x-0 bottom-[24px] z-[60] flex justify-center pointer-events-none" role="status">
      <div className="bg-[#2b231f] rounded-[12px] flex gap-[12px] items-center px-[20px] py-[14px]">
        <Check className="size-[18px] text-[#f4f0e8]" />
        <p className="font-sans leading-[1.5] text-[14px] text-[#f4f0e8]">{toast}</p>
      </div>
    </div>
  );
}

export function Overlays() {
  return (
    <>
      <CartOverlay />
      <MenuOverlay />
      <ReserveOverlay />
      <Toast />
    </>
  );
}
