"use client";

import { useEffect, useState } from "react";

const KEY = "fieldnote:saved";
const read = (): string[] => {
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
};

/** Bookmarks live in this browser only until accounts exist. */
export function useSaved(slug: string) {
  const [saved, setSaved] = useState(false);
  useEffect(() => setSaved(read().includes(slug)), [slug]);
  const toggle = () => {
    const next = !saved;
    setSaved(next);
    try {
      const all = read().filter((x) => x !== slug);
      localStorage.setItem(KEY, JSON.stringify(next ? [...all, slug] : all));
    } catch { /* storage unavailable: keep the in-page state */ }
  };
  return [saved, toggle] as const;
}
