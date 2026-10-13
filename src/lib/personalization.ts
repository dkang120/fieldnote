"use client";

import { useCallback, useEffect, useState } from "react";
import type { Personalization } from "./cart-types";

const KEY = "fieldnote:label";
const empty: Personalization = { name: "", city: "", message: "" };

/** Name and city carry across pages (home demo → product → builder), so a visitor types them once. Card messages stay per bottle. */
export function readSavedLabel(): Pick<Personalization, "name" | "city"> {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) || "{}");
    return { name: typeof v.name === "string" ? v.name : "", city: typeof v.city === "string" ? v.city : "" };
  } catch { return { name: "", city: "" }; }
}

export function saveLabel(p: Personalization) {
  try { localStorage.setItem(KEY, JSON.stringify({ name: p.name, city: p.city })); } catch { /* storage blocked */ }
}

export function usePersonalization() {
  const [p, setP] = useState<Personalization>(empty);
  useEffect(() => setP((cur) => ({ ...cur, ...readSavedLabel() })), []);
  const set = useCallback((v: Personalization) => { setP(v); saveLabel(v); }, []);
  return [p, set] as const;
}
