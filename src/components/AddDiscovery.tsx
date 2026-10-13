"use client";
import { useEffect } from "react";
import { useCart } from "@/lib/cart";
import { track } from "@/lib/analytics";
import { PRICES, money } from "@/lib/site";

const ITEM = { item_id: "DS-06", item_name: "Discovery Set", item_category: "discovery" as const, price: PRICES.discovery };

export function AddDiscovery() {
  const { add } = useCart();
  useEffect(() => { track("view_item", { currency: "USD", value: PRICES.discovery, items: [ITEM] }); }, []);
  const go = () => add({ kind: "discovery", sku: "DS-06", title: "Discovery Set", price: PRICES.discovery, tint: "#D9D9D9" });
  return (
    <>
      <button className="btn my-3 w-full" onClick={go}>Start with all six, {money(PRICES.discovery)}</button>
      <div className="fixed inset-x-3 bottom-[calc(env(safe-area-inset-bottom)+12px)] z-30 md:hidden">
        <button onClick={go} className="flex h-14 w-full items-center justify-between rounded-full bg-ink px-7 text-on-ink shadow-[0_6px_20px_rgba(17,17,17,0.18)]">
          <span className="font-medium">Add to bag</span><span className="price">{money(PRICES.discovery)}</span>
        </button>
      </div>
    </>
  );
}
