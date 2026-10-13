"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart";

const NAV = [
  { href: "/scents/", label: "Scents" },
  { href: "/discovery/", label: "Discovery Set" },
  { href: "/how-its-made/", label: "How it's made" },
];
/** Also listed in the mobile menu; on desktop these live in the footer and home page. */
const MORE = [
  { href: "/build/", label: "Create yours" },
  { href: "/journal/", label: "Journal" },
];

export function Header() {
  const { lines, setOpen } = useCart();
  const [menu, setMenu] = useState(false);
  const path = usePathname();
  useEffect(() => setMenu(false), [path]);
  const isActive = (href: string) => path?.startsWith(href.replace(/\/$/, ""));
  /* Product pages carry their own floating back/bag pills on phones, so the header steps aside there. */
  const bare = /^\/scents\/[^/]+\/?$/.test(path ?? "") ? "max-md:hidden" : "";

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:z-50 focus:bg-canvas focus:px-3 focus:py-2">Skip to content</a>
      <div className={`bg-ink px-4 py-2 text-center text-meta text-on-ink ${bare}`}>
        Every bottle mixed and labeled after you order.
      </div>
      <header className={`sticky top-0 z-40 border-b border-line bg-canvas/90 backdrop-blur ${bare}`}>
        <div className="wrap relative grid h-16 grid-cols-[1fr_auto_1fr] items-center gap-4">
          <div>
            <button className="min-h-[44px] pr-3 text-[15px] lg:hidden" aria-expanded={menu} aria-controls="site-nav" onClick={() => setMenu((m) => !m)}>
              {menu ? "Close" : "Menu"}
            </button>
            <nav
              id="site-nav"
              className={`${menu ? "flex" : "hidden"} absolute inset-x-0 top-16 flex-col border-b border-line bg-canvas px-4 pb-4 sm:px-8
                          lg:static lg:flex lg:flex-row lg:gap-8 lg:border-0 lg:bg-transparent lg:p-0`}
            >
              {[...NAV, ...MORE].map((n, i) => (
                <Link
                  key={n.href} href={n.href} aria-current={isActive(n.href) ? "page" : undefined}
                  className={`border-b border-line py-3 text-lg no-underline lg:border-0 lg:py-3 lg:text-[15px]
                    ${i >= NAV.length ? "lg:hidden" : ""}
                    ${isActive(n.href) ? "text-ink lg:underline lg:decoration-1 lg:underline-offset-[6px]" : "text-muted hover:text-ink"}`}
                >
                  {n.label}
                </Link>
              ))}
            </nav>
          </div>
          <Link href="/" className="text-[19px] font-medium uppercase leading-none tracking-[-0.01em] no-underline lg:text-[22px]">Fieldnote</Link>
          <button
            className="flex min-h-[44px] items-center gap-2 justify-self-end pl-3 text-[15px]"
            onClick={() => setOpen(true)} aria-label={`Bag, ${lines.length} item${lines.length === 1 ? "" : "s"}`}
          >
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
              <path d="M5 8h14l-1 12H6L5 8Z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" />
            </svg>
            <span aria-hidden="true">({lines.length})</span>
          </button>
        </div>
      </header>
    </>
  );
}
