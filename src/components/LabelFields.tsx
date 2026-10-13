"use client";

import { useEffect, useRef, useState } from "react";
import { CITY_MAX, MESSAGE_MAX, NAME_MAX, cleanLabelText, type Personalization } from "@/lib/cart-types";
import { cityHint } from "@/lib/city-hint";
import { track } from "@/lib/analytics";

interface Props {
  value: Personalization;
  onChange: (p: Personalization) => void;
  surface: "home" | "product" | "builder";
  showMessage?: boolean;
  nameError?: string | null;
  idPrefix: string;
}

/** Name, city and optional card message. Each field reports its first edit once per page view. */
export function LabelFields({ value, onChange, surface, showMessage = true, nameError, idPrefix }: Props) {
  const [hint, setHint] = useState<string | null>(null);
  const edited = useRef(new Set<string>());
  useEffect(() => setHint(cityHint()), []);

  const set = (field: keyof Personalization, max: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...value, [field]: cleanLabelText(e.target.value, max) });
    if (!edited.current.has(field)) {
      edited.current.add(field);
      track("label_preview_edit", { field, surface });
    }
  };

  const count = (s: string, max: number) => <span className="text-stone">{s.length}/{max}</span>;

  return (
    <div className="grid gap-3.5">
      <div>
        <label htmlFor={`${idPrefix}-name`} className="mb-1.5 flex justify-between text-sm text-ink-soft">
          Name on the label {count(value.name, NAME_MAX)}
        </label>
        <input
          id={`${idPrefix}-name`} className="input" value={value.name} onChange={set("name", NAME_MAX)} maxLength={NAME_MAX}
          placeholder="e.g. Daniel K." autoComplete="name" aria-invalid={!!nameError} aria-describedby={nameError ? `${idPrefix}-name-err` : undefined}
        />
        {nameError && <p id={`${idPrefix}-name-err`} className="mt-1.5 text-sm text-clay-deep">{nameError}</p>}
      </div>
      <div>
        <label htmlFor={`${idPrefix}-city`} className="mb-1.5 flex justify-between text-sm text-ink-soft">
          City {count(value.city, CITY_MAX)}
        </label>
        <input
          id={`${idPrefix}-city`} className="input" value={value.city} onChange={set("city", CITY_MAX)} maxLength={CITY_MAX}
          placeholder="e.g. San Ramon" autoComplete="address-level2"
        />
        {hint && !value.city && (
          <button
            type="button" className="mt-1.5 text-sm text-ink-soft underline underline-offset-4 hover:text-ink"
            onClick={() => { onChange({ ...value, city: hint }); track("label_preview_edit", { field: "city", surface }); }}
          >
            Use {hint}
          </button>
        )}
      </div>
      {showMessage && (
        <div>
          <label htmlFor={`${idPrefix}-msg`} className="mb-1.5 flex justify-between text-sm text-ink-soft">
            <span>Card message <span className="text-stone">(optional, printed on the card in the box)</span></span>
            {count(value.message, MESSAGE_MAX)}
          </label>
          <input
            id={`${idPrefix}-msg`} className="input" value={value.message} onChange={set("message", MESSAGE_MAX)} maxLength={MESSAGE_MAX}
            placeholder="e.g. Happy graduation, Class of 2027"
          />
        </div>
      )}
    </div>
  );
}

export const emptyPersonalization: Personalization = { name: "", city: "", message: "" };
