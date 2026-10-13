import Link from "next/link";
import { Newsletter } from "./Newsletter";
import { SITE } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-line pb-10 pt-16">
      <div className="wrap">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div className="col-span-2 md:col-span-1">
            <h2 className="mb-3 font-sans text-[15px] font-medium">Letters from the bench</h2>
            <p className="mb-4 text-[15px] text-muted">New scents, campus pop-up dates, and 10% off your first bottle.</p>
            <Newsletter source="footer" />
          </div>
          <div>
            <h2 className="mb-3 font-sans text-[15px] font-medium">Shop</h2>
            <ul className="grid gap-0.5 text-muted">
              <li><Link className="inline-block py-1.5 no-underline hover:text-ink" href="/scents/">House scents</Link></li>
              <li><Link className="inline-block py-1.5 no-underline hover:text-ink" href="/build/">Create yours</Link></li>
              <li><Link className="inline-block py-1.5 no-underline hover:text-ink" href="/discovery/">Discovery Set</Link></li>
            </ul>
          </div>
          <div>
            <h2 className="mb-3 font-sans text-[15px] font-medium">Learn</h2>
            <ul className="grid gap-0.5 text-muted">
              <li><Link className="inline-block py-1.5 no-underline hover:text-ink" href="/how-its-made/">How it's made</Link></li>
              <li><Link className="inline-block py-1.5 no-underline hover:text-ink" href="/journal/">Journal</Link></li>
              <li><Link className="inline-block py-1.5 no-underline hover:text-ink" href="/how-its-made/#faq">Shipping and fill times</Link></li>
              <li className="select-all">{SITE.email}</li>
            </ul>
          </div>
        </div>
        <p aria-hidden="true" className="mt-14 text-[clamp(56px,13vw,170px)] font-medium uppercase leading-[0.85] tracking-[-0.04em]">Fieldnote</p>
        <div className="mt-6 flex flex-wrap justify-between gap-4 text-[13px] text-muted">
          <span>Mixed by hand in Los Angeles. Every bottle carries the day it was made.</span>
          <span>© {new Date().getFullYear()} Fieldnote. Preview site; checkout opens at launch.</span>
        </div>
      </div>
    </footer>
  );
}
