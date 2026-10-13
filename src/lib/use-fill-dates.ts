"use client";
import { useEffect, useState } from "react";
import { fillDates } from "./fill-dates";

/** Dates depend on "now", so they are computed after mount to avoid a build-time date in static HTML. */
export function useFillDates() {
  const [d, setD] = useState<ReturnType<typeof fillDates> | null>(null);
  useEffect(() => {
    setD(fillDates());
    const t = setInterval(() => setD(fillDates()), 60_000);
    return () => clearInterval(t);
  }, []);
  return d;
}
