"use client";

import { useEffect, useRef, useState } from "react";
import { CITY_MAX, LABEL_LIMIT_MSG, MESSAGE_MAX, NAME_MAX, stripLabelText, type Personalization } from "@/lib/cart-types";
import { Alert, Check } from "./icons";
import { cityHint } from "@/lib/city-hint";
import { track } from "@/lib/analytics";

interface Props {
  value: Personalization;
  onChange: (p: Personalization) => void;
  surface: "home" | "product" | "builder";
  showMessage?: boolean;
  /** Set by the parent when a purchase is blocked (e.g. missing name). */
  nameError?: string | null;
  /** Show "Your label is ready." once the name (and city, if any) will print. */
  showReady?: boolean;
  idPrefix: string;
}

type Field = "name" | "city" | "message";
const MAX: Record<Field, number> = { name: NAME_MAX, city: CITY_MAX, message: MESSAGE_MAX };

/** Name, city and optional card message. Labels sit above each field, examples below, problems right under the field.
 *  Each field reports its first edit once per page view. */
export function LabelFields({ value, onChange, surface, showMessage = true, nameError, showReady = false, idPrefix }: Props) {
  const [hint, setHint] = useState<string | null>(null);
  const [stripped, setStripped] = useState<Field | null>(null);
  const edited = useRef(new Set<string>());
  useEffect(() => setHint(cityHint()), []);

  const set = (field: Field) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const clean = stripLabelText(e.target.value);
    setStripped(clean !== e.target.value.replace(/\s+/g, " ").trimStart() ? field : null);
    onChange({ ...value, [field]: clean });
    if (!edited.current.has(field)) {
      edited.current.add(field);
      track("label_preview_edit", { field, surface });
    }
  };

  const over = (f: Field) => value[f].trim().length > MAX[f];
  const errorFor = (f: Field): string | null =>
    f === "name" && nameError ? nameError : over(f) ? LABEL_LIMIT_MSG[f] : null;
  const ready = showReady && !!value.name.trim() && !over("name") && !over("city");

  const field = (f: Field, label: React.ReactNode, example: string, autoComplete?: string) => {
    const err = errorFor(f);
    const ids = [`${idPrefix}-${f}-help`, err && `${idPrefix}-${f}-err`, stripped === f && `${idPrefix}-${f}-chars`].filter(Boolean).join(" ");
    return (
      <div>
        <label htmlFor={`${idPrefix}-${f}`} className="mb-1.5 flex justify-between gap-3 text-[15px]">
          <span>{label}</span>
          <span className={`price text-meta ${over(f) ? "text-ink" : "text-muted"}`} aria-hidden="true">{value[f].trim().length}/{MAX[f]}</span>
        </label>
        <input
          id={`${idPrefix}-${f}`} className={`input ${err ? "border-ink" : ""}`} value={value[f]} onChange={set(f)}
          autoComplete={autoComplete} aria-invalid={!!err} aria-describedby={ids}
        />
        <p id={`${idPrefix}-${f}-help`} className="meta mt-1.5">{example} · up to {MAX[f]} characters</p>
        {stripped === f && (
          <p id={`${idPrefix}-${f}-chars`} className="meta mt-1">Labels print letters, numbers, spaces and . , &apos; &amp; - only.</p>
        )}
        {err && (
          <p id={`${idPrefix}-${f}-err`} className="mt-1.5 flex items-start gap-1.5 text-[14px] text-ink">
            <Alert className="mt-[3px] size-4 flex-none" />
            {err}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="grid gap-5">
      {field("name", "Name on the label", "Example: Avery M.", "name")}
      <div>
        {field("city", "City", "Example: Los Angeles, CA", "address-level2")}
        {hint && !value.city && (
          <button
            type="button" className="mt-1 min-h-[44px] text-[14px] text-muted underline underline-offset-4 hover:text-ink"
            onClick={() => { onChange({ ...value, city: hint }); track("label_preview_edit", { field: "city", surface }); }}
          >
            Use {hint}
          </button>
        )}
      </div>
      {showMessage && field("message", <>Card message <span className="text-muted">(optional, printed on the card in the box)</span></>, "Example: Happy graduation, Class of 2027")}
      {showReady && (
        <p role="status" className="flex min-h-[1.5em] items-center gap-2 text-[15px]">
          {ready && <><Check className="size-4" /> Your label is ready.</>}
        </p>
      )}
    </div>
  );
}

export const emptyPersonalization: Personalization = { name: "", city: "", message: "" };
