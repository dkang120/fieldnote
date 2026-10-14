"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

/** Open/close state for the overlays drawn in Figma: menu sheet, reserve modal, success toast.
 *  The cart drawer's open state lives in the cart context. */
export type ReserveItem = { id: string; name: string; price: number; detail?: string };

interface UiApi {
  menuOpen: boolean;
  setMenuOpen: (o: boolean) => void;
  reserve: ReserveItem | null | undefined; // undefined = closed, null = open with no specific item
  openReserve: (item?: ReserveItem | null) => void;
  closeReserve: () => void;
  toast: string | null;
  showToast: (msg: string) => void;
}

const Ctx = createContext<UiApi | null>(null);

export function UiProvider({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [reserve, setReserve] = useState<ReserveItem | null | undefined>(undefined);
  const [toast, setToast] = useState<string | null>(null);
  const openReserve = useCallback((item?: ReserveItem | null) => setReserve(item ?? null), []);
  const closeReserve = useCallback(() => setReserve(undefined), []);
  const showToast = useCallback((msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 3200);
  }, []);
  const api = useMemo(() => ({ menuOpen, setMenuOpen, reserve, openReserve, closeReserve, toast, showToast }), [menuOpen, reserve, openReserve, closeReserve, toast, showToast]);
  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useUi() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useUi must be used inside <UiProvider>");
  return c;
}
