/* Copy for How it's made (Figma 170:1681 desktop, 170:1837 phone). Copy is final as written in Figma. */

export const STEPS: { label: string; title: string; body: string }[] = [
  { label: "Your order", title: "The formula is written down", body: "Your scent or custom formula, size, name and city go onto a bench card with a formula code, so it can be remade exactly, years from now." },
  { label: "10:00 / 15:00", title: "Weighed by hand", body: "Two bench sessions every weekday. We weigh fragrance concentrate into perfumer's alcohol on a scale accurate to a hundredth of a gram." },
  { label: "+ 1 hour", title: "Mixed and filled", body: "The blend is stirred, filled into heavy glass, and the atomizer is crimped on so it can't leak." },
  { label: "+ 4 hours", title: "Rested and checked", body: "Every batch rests, then we check it for clarity and smell it against the master sample. We keep a small retained sample from each batch for a year." },
  { label: "Same day", title: "Labeled for you", body: "Your label prints with your name, your city and the day it was made. It's boxed with your card message and a vial of another house scent." },
  { label: "Next weekday", title: "On its way", body: "Ground shipping, usually 2 to 5 business days." },
];

export const LINES: { no: string; title: string; body: string }[] = [
  { no: "I", title: "No. and scent", body: "The house scent, or your custom blend." },
  { no: "II", title: "Made for", body: "The name you type, up to 20 characters." },
  { no: "III", title: "City", body: "Up to 18 characters." },
  { no: "IV", title: "Date and size", body: "The day it was mixed, and 50 or 100 ml." },
  { no: "V", title: "Formula code", body: "Custom bottles only, so it can be remade exactly." },
];

export const FACTS: { title: string; body: string }[] = [
  { title: "10:00 & 15:00", body: "Two bench sessions every weekday, Pacific time." },
  { title: "Before 3 pm", body: "Weekday orders placed before 3pm Pacific are mixed the same day." },
  { title: "Next weekday", body: "Ships by ground only. Usually 2 to 5 business days." },
  { title: "Over $75", body: "Free ground shipping." },
];

export const FAQ: [string, string][] = [
  ["When will my order ship?", "Orders placed on a weekday before 3pm Pacific are mixed the same day. Everything ships the next weekday by ground, usually arriving in 2 to 5 business days."],
  ["Why ground shipping only?", "Cologne is alcohol-based, so carriers won't fly it. Ground is the safe, legal way to send it."],
  ["Does fresh-made fragrance last longer?", "We don't claim that. What we can promise is that your bottle never sat in a warehouse, and the date on the label shows it."],
  ["Can I change the name after ordering?", "Yes, until your bottle is mixed. Reply to your order email before the next bench session and we'll update it."],
  ["Can I reorder a custom blend?", "Yes. Every custom bottle has a formula code on its label and in your order email. Paste it into the builder, or reply with it, and we'll mix the same blend."],
];

export const INTRO = {
  eyebrow: "How it's made",
  title: "A bottle's first day",
  lede: "Most cologne is made months before anyone buys it. Ours starts when you click order. Here's what happens next.",
  note: "Order on a weekday before 3pm Pacific and it's mixed the same day.",
};

export const EMAIL = "hello@fieldnote.studio";

/* Shared text styles from the Figma text styles. */
export const T = {
  monoLabel: "font-mono font-normal leading-[1.3] text-[12px] text-[#6b625b] tracking-[1.6px] uppercase whitespace-nowrap",
  eyebrow: "font-sans font-medium leading-[1.3] text-[12px] text-[#6b625b] tracking-[0.72px] uppercase whitespace-nowrap",
};
