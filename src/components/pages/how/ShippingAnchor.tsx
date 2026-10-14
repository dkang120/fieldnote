"use client";

import { useEffect } from "react";

/** The page renders a phone and a desktop frame, and only the desktop one can carry id="shipping".
 *  When the URL hash names an anchor, scroll to the copy of it that is visible at this width. */
export function ShippingAnchor() {
  useEffect(() => {
    const go = () => {
      const name = decodeURIComponent(location.hash.slice(1));
      if (!name) return;
      const el = [...document.querySelectorAll<HTMLElement>(`[data-anchor="${CSS.escape(name)}"]`)].find((n) => n.offsetParent !== null);
      if (el) el.scrollIntoView({ block: "start" });
    };
    go();
    addEventListener("hashchange", go);
    return () => removeEventListener("hashchange", go);
  }, []);
  return null;
}
