"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState, type ReactNode } from "react";
import type { CartLine, NewCartLine } from "./cart-types";
import { toItem } from "./cart-types";
import { track } from "./analytics";

type State = { lines: CartLine[]; hydrated: boolean };
type Action =
  | { type: "hydrate"; lines: CartLine[] }
  | { type: "add"; line: CartLine }
  | { type: "remove"; id: string }
  | { type: "clear" };

function reducer(state: State, a: Action): State {
  switch (a.type) {
    case "hydrate": return { lines: a.lines, hydrated: true };
    case "add": return { ...state, lines: [...state.lines, a.line] };
    case "remove": return { ...state, lines: state.lines.filter((l) => l.id !== a.id) };
    case "clear": return { ...state, lines: [] };
  }
}

const KEY = "fn-bag-v2";

interface CartApi {
  lines: CartLine[];
  subtotal: number;
  open: boolean;
  setOpen: (o: boolean) => void;
  add: (line: NewCartLine) => void;
  remove: (id: string) => void;
  clear: () => void;
  toast: (msg: string) => void;
  toastMsg: string | null;
}

const Ctx = createContext<CartApi | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { lines: [], hydrated: false });
  const [open, setOpenState] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    let lines: CartLine[] = [];
    try { lines = JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { /* storage blocked */ }
    dispatch({ type: "hydrate", lines: Array.isArray(lines) ? lines : [] });
  }, []);

  useEffect(() => {
    if (!state.hydrated) return;
    try { localStorage.setItem(KEY, JSON.stringify(state.lines)); } catch { /* storage blocked */ }
  }, [state]);

  const subtotal = useMemo(() => state.lines.reduce((s, l) => s + l.price, 0), [state.lines]);

  const toast = useCallback((msg: string) => {
    setToastMsg(msg);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToastMsg(null), 2600);
  }, []);

  const setOpen = useCallback((o: boolean) => {
    setOpenState(o);
    if (o) track("view_cart", { currency: "USD", value: state.lines.reduce((s, l) => s + l.price, 0), items: state.lines.map(toItem) });
  }, [state.lines]);

  const add = useCallback((line: NewCartLine) => {
    const full = { ...line, id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}` } as CartLine;
    dispatch({ type: "add", line: full });
    track("add_to_cart", { currency: "USD", value: full.price, items: [toItem(full)] });
    setOpenState(true);
  }, []);

  const remove = useCallback((id: string) => {
    const line = state.lines.find((l) => l.id === id);
    dispatch({ type: "remove", id });
    if (line) track("remove_from_cart", { currency: "USD", value: line.price, items: [toItem(line)] });
  }, [state.lines]);

  const clear = useCallback(() => dispatch({ type: "clear" }), []);

  const api = useMemo<CartApi>(
    () => ({ lines: state.lines, subtotal, open, setOpen, add, remove, clear, toast, toastMsg }),
    [state.lines, subtotal, open, setOpen, add, remove, clear, toast, toastMsg],
  );
  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be used inside <CartProvider>");
  return c;
}
