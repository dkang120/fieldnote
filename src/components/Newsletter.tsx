"use client";

import { useState } from "react";
import { integrations } from "@/lib/integrations";
import { track } from "@/lib/analytics";
import { useCart } from "@/lib/cart";

export function Newsletter({ source, cta = "Sign up", tone = "light" }: { source: string; cta?: string; tone?: "light" | "dark" }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { toast } = useCart();
  const id = `email-${source}`;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const res = await integrations.email.subscribe(email.trim(), source);
    if (!res.ok) { setError(res.message); return; }
    setError(null); setEmail("");
    track("newsletter_signup", { source });
    toast(res.message);
  }

  return (
    <form onSubmit={submit} noValidate className="max-w-[440px]">
      <div className="flex flex-col gap-2 sm:flex-row">
        <label htmlFor={id} className="sr-only">Email</label>
        <input id={id} type="email" className="input" placeholder="you@school.edu" value={email} onChange={(e) => setEmail(e.target.value)} />
        <button className={`btn ${tone === "dark" ? "btn-ghost border-on-ink text-on-ink hover:bg-on-ink hover:text-ink" : ""}`} type="submit">{cta}</button>
      </div>
      {error && <p className={`mt-2 text-sm ${tone === "dark" ? "text-line" : "text-ink"}`} role="alert">{error}</p>}
    </form>
  );
}
