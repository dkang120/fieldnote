"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { track } from "@/lib/analytics";

export function PageView() {
  const path = usePathname();
  useEffect(() => { track("page_view", { path: path ?? "/", title: document.title }); }, [path]);
  return null;
}
