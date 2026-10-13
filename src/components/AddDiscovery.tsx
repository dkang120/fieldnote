"use client";
import { useEffect } from "react";
import { useCart } from "@/lib/cart";
import { track } from "@/lib/analytics";
import { PRICES, money } from "@/lib/site";

const ITEM = { item_id: "DS-06", item_name: "Discovery Set", item_category: "discovery" as const, price: PRICES.discovery };

export function AddDiscovery() {
  const { add } = useCart();
  useEffect(() => { track("view_item", { currency: "USD", value: PRICES.discovery, items: [ITEM] }); }, []);
  const go = () => add({ kind: "discovery", sku: "DS-06", title: "Discovery Set", price: PRICES.discovery, tint: "#DFE1D2" });
  return (
    <>
      <button className="btn my-3 w-full" onClick={go}>Add to bag, {money(PRICES.discovery)}</button>
      <div className="fixed inset-x-0 bottom-0 z-30 flex items-center gap-3 border-t border-rule bg-paper px-4 pb-[calc(12px+env(safe-area-inset-bottom))] pt-3 md:hidden">
        <span>{money(PRICES.discovery)}</span>
        <button className="btn flex-1" onClick={go}>Add to bag</button>
      </div>
    </>
  );
}
