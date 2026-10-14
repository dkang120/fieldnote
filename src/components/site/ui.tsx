"use client";

/* Figma components: Button (4:40), Link (169:1720). */
import NextLink from "next/link";
import type { ReactNode, MouseEventHandler } from "react";
import { ArrowRight } from "@/components/icons";

type BtnStyle = "primary" | "secondary" | "onInk";
const BTN: Record<BtnStyle, string> = {
  primary: "bg-[#2b231f] border-[#2b231f] text-[#f4f0e8] hover:bg-transparent hover:text-[#2b231f]",
  secondary: "bg-transparent border-[#2b231f] text-[#2b231f] hover:bg-[#2b231f] hover:text-[#f4f0e8]",
  onInk: "bg-[#f4f0e8] border-[#f4f0e8] text-[#2b231f] hover:bg-transparent hover:text-[#f4f0e8]",
};

/** Pill button. Pass `className` for size/layout overrides taken from the frame (h-[50px] px-[32px] by default). */
export function Button({
  children, href, onClick, variant = "primary", className = "", type = "button", textClass = "text-[16px] leading-[1.5]",
}: {
  children: ReactNode; href?: string; onClick?: MouseEventHandler; variant?: BtnStyle; className?: string; type?: "button" | "submit"; textClass?: string;
}) {
  const cls = `border border-solid flex items-center justify-center relative rounded-[999px] shrink-0 transition-colors duration-200 font-sans font-normal whitespace-nowrap ${textClass} ${BTN[variant]} ${className || "h-[50px] px-[32px]"}`;
  if (href) return <NextLink href={href} className={cls}>{children}</NextLink>;
  return <button type={type} onClick={onClick} className={cls}>{children}</button>;
}

/** Text link with optional arrow (Figma Link: 16px Figtree, 6px gap, 14px arrow). */
export function TextLink({
  children, href, onClick, arrow = true, className = "", textClass = "text-[16px] leading-[1.5] text-[#2b231f]",
}: {
  children: ReactNode; href?: string; onClick?: MouseEventHandler; arrow?: boolean; className?: string; textClass?: string;
}) {
  const inner = (
    <>
      <span className={`font-sans font-normal whitespace-nowrap ${textClass}`}>{children}</span>
      {arrow ? <ArrowRight className="relative shrink-0 size-[14px]" /> : null}
    </>
  );
  const cls = `flex gap-[6px] items-center relative shrink-0 link-hover ${className}`;
  if (href) return <NextLink href={href} className={cls}>{inner}</NextLink>;
  return <button type="button" onClick={onClick} className={cls}>{inner}</button>;
}
