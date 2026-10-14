import type { ReactNode } from "react";

/** Renders a page's Figma frames. Exactly one is visible per window width (see globals.css):
 *  phone 390 below 600px, tablet 768 from 600px (or phone, when there is no tablet design), desktop 1440 from 1100px.
 *  Each frame is zoomed to the window width, so it matches the design at every size. */
export function Frames({ phone, tablet, desktop }: { phone: ReactNode; tablet?: ReactNode; desktop: ReactNode }) {
  return (
    <div className={tablet ? "has-t" : "no-t"}>
      <div className="bp bp-p">{phone}</div>
      {tablet ? <div className="bp bp-t">{tablet}</div> : null}
      <div className="bp bp-d">{desktop}</div>
    </div>
  );
}
