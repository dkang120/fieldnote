/** Preview-mode providers: no money moves, nothing leaves the browser. */
import type { CartLine } from "../cart-types";
import type { CheckoutContext, CheckoutResult, EmailProvider, PaymentProvider } from "./types";

const store = {
  read<T>(k: string, d: T): T { try { const v = localStorage.getItem(k); return v ? (JSON.parse(v) as T) : d; } catch { return d; } },
  write(k: string, v: unknown) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* storage blocked: fine in preview */ } },
};

export const previewPayments: PaymentProvider = {
  id: "preview",
  async createCheckout(lines: CartLine[], ctx: CheckoutContext): Promise<CheckoutResult> {
    const orderId = `FN-PREVIEW-${Date.now().toString(36).toUpperCase()}`;
    const drafts = store.read<unknown[]>("fn-preview-orders", []);
    store.write("fn-preview-orders", [...drafts.slice(-9), { orderId, lines, ...ctx, at: new Date().toISOString() }]);
    return { status: "preview", orderId, message: "Checkout opens at launch. We saved your bag." };
  },
};

export const previewEmail: EmailProvider = {
  id: "preview",
  async subscribe(email: string, source: string) {
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
    if (!ok) return { ok, message: "Enter an email like you@school.edu." };
    const list = store.read<{ email: string; source: string }[]>("fn-preview-subscribers", []);
    store.write("fn-preview-subscribers", [...list, { email, source }]);
    return { ok, message: "You're on the list." };
  },
};
