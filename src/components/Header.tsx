"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart";
import { FREE_SHIP_THRESHOLD, money } from "@/lib/site";

const NAV = [
  { href: "/scents/", label: "House scents" },
  { href: "/build/", label: "Create yours" },
  { href: "/discovery/", label: "Discovery Set" },
  { href: "/how-its-made/", label: "How it's made" },
  { href: "/journal/", label: "Journal" },
];

export function Header() {
  const { lines, setOpen } = useCart();
  const [menu, setMenu] = useState(false);
  const path = usePathname();
  useEffect(() => setMenu(false), [path]);

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:z-50 focus:bg-paper focus:px-3 focus:py-2">Skip to content</a>
      <div className="bg-ink px-4 py-2 text-center text-[13px] text-paper">
        Every bottle is mixed after you order. Free shipping over {money(FREE_SHIP_THRESHOLD)}.
      </div>
      <header className="sticky top-0 z-40 border-b border-rule bg-paper/90 backdrop-blur">
        <div className="wrap relative flex h-16 items-center justify-between gap-4">
          <button className="py-2 text-[15px] lg:hidden" aria-expanded={menu} aria-controls="site-nav" onClick={() => setMenu((m) => !m)}>
            {menu ? "Close" : "Menu"}
          </button>
          <Link href="/" className="font-serif text-[26px] leading-none no-underline lg:text-[30px]">Fieldnote</Link>
          <nav
            id="site-nav"
            className={`${menu ? "flex" : "hidden"} absolute inset-x-0 top-16 flex-col border-b border-rule bg-paper px-4 pb-4 sm:px-8
                        lg:static lg:flex lg:flex-row lg:gap-7 lg:border-0 lg:bg-transparent lg:p-0`}
          >
            {NAV.map((n) => {
              const active = path?.startsWith(n.href.replace(/\/$/, ""));
              return (
                <Link
                  key={n.href} href={n.href} aria-current={active ? "page" : undefined}
                  className={`border-b border-rule py-3 text-lg no-underline lg:border-0 lg:py-0 lg:text-[15px]
                    ${active ? "text-ink lg:underline lg:decoration-1 lg:underline-offset-[6px]" : "text-ink-soft hover:text-ink"}`}
                >
                  {n.label}
                </Link>
              );
            })}
          </nav>
          <button
            className="rounded-full border border-ink px-4 py-[7px] text-sm transition-colors hover:bg-ink hover:text-paper"
            onClick={() => setOpen(true)}
          >
            Bag ({lines.length})
          </button>
        </div>
      </header>
    </>
  );
}
