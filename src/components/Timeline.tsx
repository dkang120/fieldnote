"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";

/** How-it's-made's one moment: a rule draws down the bench log as you read through the bottle's day.
 *  The rule is tied to scroll, so it only moves when the reader does; reduced motion shows it fully drawn. */
export function Timeline({ items }: { items: [string, string, string][] }) {
  const ref = useRef<HTMLOListElement>(null);
  const still = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 60%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.4 });
  return (
    <div className="relative">
      <span aria-hidden="true" className="absolute bottom-0 left-0 top-0 w-px bg-line" />
      <motion.span aria-hidden="true" className="absolute bottom-0 left-0 top-0 w-px origin-top bg-ink" style={{ scaleY: still ? 1 : scaleY }} />
      <ol ref={ref} className="border-t border-ink">
        {items.map(([t, h, p]) => (
          <li key={h} className="grid gap-2 border-b border-line py-7 pl-6 md:grid-cols-[130px_1fr_1.2fr] md:items-baseline md:gap-6 md:pl-8">
            <span className="font-mono text-sm text-ink">{t}</span>
            <h2 className="text-[26px] leading-tight">{h}</h2>
            <p className="text-muted">{p}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
