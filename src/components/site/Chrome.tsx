"use client";

/* Header and footer, built from Figma components Header (7:24 desktop, 7:38 phone) and Footer (7:51, 7:76). */
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/lib/cart";
import { useUi } from "@/lib/ui";
import { Bag } from "@/components/icons";

const NAV = [
  { href: "/scents/", label: "Scents" },
  { href: "/discovery/", label: "Discovery Set" },
  { href: "/how-its-made/", label: "How it's made" },
  { href: "/about/", label: "About" },
];

function useActive() {
  const path = usePathname() || "/";
  return (href: string) => path.startsWith(href);
}

function BagButton({ className }: { className: string }) {
  const { lines, setOpen } = useCart();
  const count = lines.reduce((n, l) => n + (l.qty ?? 1), 0);
  return (
    <button type="button" onClick={() => setOpen(true)} className={className} aria-label={`Bag, ${count} items`}>
      <Bag className="relative shrink-0 size-[20px]" />
      <span className="font-sans font-normal leading-[1.5] relative shrink-0 text-[16px] text-[#2b231f] whitespace-nowrap">({count})</span>
    </button>
  );
}

function Announcement() {
  return (
    <div className="bg-[#2b231f] flex items-start justify-center overflow-clip py-[8px] relative shrink-0 w-full">
      <p className="font-sans font-normal leading-[1.5] relative shrink-0 text-[14px] text-[#f4f0e8] whitespace-nowrap">
        Opening soon. Reserve now, pay nothing until launch.
      </p>
    </div>
  );
}

/** Desktop header (1440). `overHero` keeps it in the page flow at the top of the hero, as on Home. */
export function HeaderDesktop({ className = "" }: { className?: string }) {
  const active = useActive();
  return (
    <header className={`flex flex-col items-start w-[1440px] z-30 ${className}`}>
      <Announcement />
      <div className="bg-[#ece8e1] border-[#d1cdc4] border-b border-solid flex h-[64px] items-center justify-between overflow-clip px-[148px] relative shrink-0 w-full">
        <nav className="flex font-sans font-normal gap-[32px] items-center leading-[1.5] overflow-clip relative shrink-0 text-[16px] w-[393px] whitespace-nowrap">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={`relative shrink-0 link-hover ${active(n.href) ? "text-[#2b231f] underline [text-underline-position:from-font] decoration-from-font" : "text-[#6b625b]"}`}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <Link href="/" className="font-sans font-medium leading-[26px] relative shrink-0 text-[20px] text-[#2b231f] whitespace-nowrap">
          FIELDNOTE
        </Link>
        <div className="flex items-center justify-end overflow-clip relative shrink-0 w-[393px]">
          <BagButton className="flex gap-[8px] items-center" />
        </div>
      </div>
    </header>
  );
}

/** Phone header (390). With `width` it stretches to the tablet frame. */
export function HeaderPhone({ width = 390, className = "" }: { width?: number; className?: string }) {
  const { setMenuOpen } = useUi();
  return (
    <header className={`flex flex-col items-start z-30 ${className}`} style={{ width }}>
      <Announcement />
      <div className="bg-[#ece8e1] border-[#d1cdc4] border-b border-solid flex h-[64px] items-center justify-between overflow-clip px-[16px] relative shrink-0 w-full">
        <div className="flex items-center overflow-clip relative shrink-0 w-[80px]">
          <button type="button" onClick={() => setMenuOpen(true)} className="font-sans font-normal leading-[1.5] text-[16px] text-[#2b231f] whitespace-nowrap py-[10px] -my-[10px] text-left">
            Menu
          </button>
        </div>
        <Link href="/" className="font-sans font-medium leading-[23px] relative shrink-0 text-[18px] text-[#2b231f] whitespace-nowrap">
          FIELDNOTE
        </Link>
        <BagButton className="flex gap-[8px] items-center justify-end overflow-clip relative shrink-0 w-[80px] py-[10px] -my-[10px]" />
      </div>
    </header>
  );
}

const SHOP = [
  { href: "/scents/", label: "House scents" },
  { href: "/build/", label: "Create yours" },
  { href: "/discovery/", label: "Discovery Set" },
];
const LEARN = [
  { href: "/how-its-made/", label: "How it's made" },
  { href: "/about/", label: "About" },
  { href: "/how-its-made/#shipping", label: "Shipping and fill times" },
];

function Col({ title, items, titleSize, email }: { title: string; items: { href: string; label: string }[]; titleSize: string; email?: boolean }) {
  return (
    <div className="flex flex-col gap-[10px] items-start overflow-clip relative shrink-0">
      <p className={`relative shrink-0 ${titleSize} text-[#2b231f]`}>{title}</p>
      {items.map((i) => (
        <Link key={i.href} href={i.href} className="relative shrink-0 text-[16px] text-[#6b625b] link-hover">
          {i.label}
        </Link>
      ))}
      {email ? (
        <a href="mailto:hello@fieldnote.studio" className="relative shrink-0 text-[16px] text-[#6b625b] link-hover">
          hello@fieldnote.studio
        </a>
      ) : null}
    </div>
  );
}

export function FooterDesktop() {
  return (
    <footer className="[word-break:break-word] bg-[#ece8e1] border-[#d1cdc4] border-solid border-t flex flex-col gap-[56px] items-start pb-[36px] pt-[64px] px-[148px] relative w-[1440px] whitespace-nowrap">
      <div className="flex font-sans font-normal gap-[80px] items-start justify-end leading-[1.5] overflow-clip relative shrink-0 w-full">
        <Col title="Shop" items={SHOP} titleSize="text-[18px]" />
        <Col title="Learn" items={LEARN} titleSize="text-[18px]" email />
      </div>
      <p className="font-sans font-medium leading-[0.85] relative shrink-0 text-[170px] text-[#2b231f] tracking-[-6.8px]" aria-hidden>
        FIELDNOTE
      </p>
      <div className="flex font-sans font-normal items-start justify-between leading-[1.5] overflow-clip relative shrink-0 text-[14px] text-[#6b625b] w-full">
        <p className="relative shrink-0">Mixed by hand in Los Angeles. Every bottle carries the day it was made.</p>
        <p className="relative shrink-0">© 2026 Fieldnote. Preview site; checkout opens at launch.</p>
      </div>
    </footer>
  );
}

/** Phone footer (390); `width` stretches it for the tablet frame, as the Figma tablet frames do. */
export function FooterPhone({ width = 390 }: { width?: number }) {
  return (
    <footer className="[word-break:break-word] bg-[#ece8e1] border-[#d1cdc4] border-solid border-t flex flex-col gap-[56px] items-start pb-[36px] pt-[64px] px-[16px] relative" style={{ width }}>
      <div className="flex font-sans font-normal gap-[40px] items-start justify-end leading-[1.5] overflow-clip relative shrink-0 text-[16px] w-full whitespace-nowrap">
        <Col title="Shop" items={SHOP} titleSize="text-[16px]" />
        <Col title="Learn" items={LEARN} titleSize="text-[16px]" email />
      </div>
      <p className="font-sans font-medium leading-[26px] relative shrink-0 text-[20px] text-[#2b231f] whitespace-nowrap" aria-hidden>
        FIELDNOTE
      </p>
      <div className="flex flex-col font-sans font-normal items-start justify-between leading-[1.5] overflow-clip relative shrink-0 text-[14px] text-[#6b625b] w-full">
        <p className="relative shrink-0 w-full">Mixed by hand in Los Angeles. Every bottle carries the day it was made.</p>
        <p className="relative shrink-0 w-full">© 2026 Fieldnote. Preview site; checkout opens at launch.</p>
      </div>
    </footer>
  );
}
