"use client";

import { useId, useState } from "react";
import { integrations } from "@/lib/integrations";
import { track } from "@/lib/analytics";
import { Alert, Check } from "./icons";

interface Props {
  source: string;
  cta?: string;
  tone?: "light" | "dark";
  /** Adds an optional "Your campus" select; the choice is sent as part of the source. */
  campuses?: string[];
}

/** Email capture with a visible label, an inline error tied to the field, and an inline confirmation. */
export function Newsletter({ source, cta = "Sign up", tone = "light", campuses }: Props) {
  const [email, setEmail] = useState("");
  const [campus, setCampus] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const id = useId();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const src = campus ? `${source}:${campus}` : source;
    const res = await integrations.email.subscribe(email.trim(), src);
    setBusy(false);
    if (!res.ok) { setError(res.message); document.getElementById(`${id}-email`)?.focus(); return; }
    setError(null); setEmail("");
    track("newsletter_signup", { source: src });
    setDone(campus ? `You're on the list. We'll write when ${campus} has a date.` : res.message);
  }

  if (done) {
    return (
      <p role="status" className="flex max-w-[440px] items-center gap-2 text-base">
        <Check className="size-5 flex-none" /> {done}
      </p>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="grid max-w-[440px] gap-3">
      {campuses && (
        <div>
          <label htmlFor={`${id}-campus`} className="mb-1.5 block text-[15px]">Your campus <span className="text-muted">(optional)</span></label>
          <select id={`${id}-campus`} className="input rounded-full px-5" value={campus} onChange={(e) => setCampus(e.target.value)}>
            <option value="">Choose a campus</option>
            {campuses.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      )}
      <div>
        <label htmlFor={`${id}-email`} className={`mb-1.5 block text-[15px] ${tone === "dark" ? "text-on-ink" : ""}`}>Email</label>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            id={`${id}-email`} type="email" inputMode="email" autoComplete="email" className={`input ${error ? "border-ink" : ""}`}
            placeholder="you@school.edu" value={email} onChange={(e) => setEmail(e.target.value)}
            aria-invalid={!!error} aria-describedby={error ? `${id}-err` : undefined}
          />
          <button className={`btn ${tone === "dark" ? "btn-ghost border-on-ink text-on-ink hover:bg-on-ink hover:text-ink" : ""}`} type="submit" disabled={busy}>
            {busy ? "Sending…" : cta}
          </button>
        </div>
        {error && (
          <p id={`${id}-err`} className={`mt-1.5 flex items-start gap-1.5 text-[14px] ${tone === "dark" ? "text-on-ink" : "text-ink"}`}>
            <Alert className="mt-[3px] size-4 flex-none" /> {error}
          </p>
        )}
      </div>
    </form>
  );
}
