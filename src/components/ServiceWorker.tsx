"use client";

import { useEffect } from "react";
import { SITE } from "@/lib/site";

/** Registers /sw.js in production so the installed app opens fast and survives a bad connection. */
export function ServiceWorker() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;
    const base = SITE.basePath;
    navigator.serviceWorker.register(`${base}/sw.js`, { scope: `${base}/` }).catch(() => {});
  }, []);
  return null;
}
