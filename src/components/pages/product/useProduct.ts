"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useCart } from "@/lib/cart";
import { usePersonalization } from "@/lib/personalization";
import { labelProblem, stripLabelText } from "@/lib/cart-types";
import { fillDates, fmtDay } from "@/lib/fill-dates";
import { track } from "@/lib/analytics";
import { PRICES, type Size } from "@/lib/site";
import type { Scent } from "@/lib/scents";
import { contentFor, LABEL_MAX, type ProductContent } from "./data";

export type Tab = "description" | "notes" | "ingredients";
export type Device = "d" | "t" | "p";

const VIEWED = "fieldnote:viewed";

export interface ProductState {
  c: ProductContent;
  /** Index into c.thumbs; null shows the main image (initial state, thumbnail 1 underlined as designed). */
  image: number | null;
  active: number;
  pick: (i: number) => void;
  step: (d: 1 | -1) => void;
  size: Size;
  setSize: (s: Size) => void;
  price: number;
  qty: number;
  setQty: (q: number) => void;
  tab: Tab;
  setTab: (t: Tab) => void;
  name: string;
  city: string;
  setName: (v: string) => void;
  setCity: (v: string) => void;
  error: string | null;
  ships: string | null;
  reserve: (device: Device) => void;
  /** Main Reserve button per device, observed to show the sticky / cart bar. */
  buyRef: (d: Device) => (el: HTMLElement | null) => void;
  nameRef: (d: Device) => (el: HTMLInputElement | null) => void;
  barVisible: boolean;
  viewed: string[];
}

export function useProduct(scent: Scent): ProductState {
  const c = contentFor(scent);
  const { add } = useCart();
  const [p, setP] = usePersonalization();
  const [image, setImage] = useState<number | null>(null);
  const [active, setActive] = useState(0);
  const [size, setSize] = useState<Size>(50);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<Tab>("description");
  const [error, setError] = useState<string | null>(null);
  const [ships, setShips] = useState<string | null>(null);
  const [barVisible, setBarVisible] = useState(false);
  const [viewed, setViewed] = useState<string[]>([]);
  const buys = useRef<Partial<Record<Device, HTMLElement | null>>>({});
  const names = useRef<Partial<Record<Device, HTMLInputElement | null>>>({});

  useEffect(() => {
    setShips(fmtDay(fillDates().ships));
    track("view_item", { currency: "USD", value: PRICES.house[50], items: [{ item_id: scent.code, item_name: scent.name, item_category: "house", price: PRICES.house[50] }] });
    try {
      const prev: string[] = JSON.parse(localStorage.getItem(VIEWED) || "[]");
      const list = Array.isArray(prev) ? prev.filter((x) => typeof x === "string") : [];
      setViewed(list.filter((x) => x !== scent.slug));
      localStorage.setItem(VIEWED, JSON.stringify([scent.slug, ...list.filter((x) => x !== scent.slug)].slice(0, 8)));
    } catch { /* storage blocked */ }
  }, [scent]);

  // Sticky bar (desktop) / cart bar (phone): shown once the visible main Reserve button has scrolled above the window.
  useEffect(() => {
    const onScroll = () => {
      const el = Object.values(buys.current).find((e) => e && e.offsetParent !== null);
      if (!el) return setBarVisible(false);
      setBarVisible(el.getBoundingClientRect().bottom < 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); };
  }, []);

  const n = c.thumbs?.length ?? 0;
  const pick = useCallback((i: number) => { setActive(i); setImage(i); }, []);
  const step = useCallback((d: 1 | -1) => {
    if (!n) return;
    setActive((a) => { const next = (a + d + n) % n; setImage(next); return next; });
  }, [n]);

  const clean = (v: string) => stripLabelText(v).slice(0, LABEL_MAX);
  const setName = (v: string) => { setP({ ...p, name: clean(v) }); setError(null); };
  const setCity = (v: string) => { setP({ ...p, city: clean(v) }); setError(null); };

  const price = PRICES.house[size];

  function reserve(device: Device) {
    const personalization = { name: p.name.trim(), city: p.city.trim(), message: "" };
    const problem = labelProblem(personalization);
    if (problem) {
      setError(problem.message);
      const el = names.current[device] ?? null;
      el?.scrollIntoView({ block: "center", behavior: "smooth" });
      el?.focus({ preventScroll: true });
      return;
    }
    add({
      kind: "house", sku: `${scent.code}-${size}`, title: scent.name, price, tint: scent.tint, qty,
      slug: scent.slug, no: scent.no, size, personalization,
    });
  }

  return {
    c, image, active, pick, step, size, setSize, price, qty, setQty, tab, setTab,
    name: p.name, city: p.city, setName, setCity, error, ships, reserve,
    buyRef: (d) => (el) => { buys.current[d] = el; },
    nameRef: (d) => (el) => { names.current[d] = el; },
    barVisible, viewed,
  };
}
