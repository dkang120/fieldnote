"use client";

import { MotionConfig } from "motion/react";

/** reducedMotion="user": with the OS setting on, Motion drops transform/layout movement and keeps opacity changes. */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user" transition={{ ease: [0.16, 1, 0.3, 1] }}>{children}</MotionConfig>;
}

/** Shared timing: confident arrivals, quicker exits. */
export const EASE = [0.16, 1, 0.3, 1] as const;
