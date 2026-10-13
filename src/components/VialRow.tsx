"use client";

import { motion, useReducedMotion } from "motion/react";
import { SCENTS } from "@/lib/scents";
import { Vial } from "./Bottle";
import { EASE } from "./MotionProvider";

/** Discovery's one moment: the six vials are stood up in order, left to right, like they're packed at the bench. */
export function VialRow() {
  const still = useReducedMotion();
  return (
    <>
      {SCENTS.map((s, i) => (
        <motion.div
          key={s.slug} className="w-[12%]"
          initial={still ? false : { y: 18, opacity: 0.25 }} animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.15 + i * 0.07 }}
        >
          <Vial no={s.no} tint={s.tint} />
        </motion.div>
      ))}
    </>
  );
}
