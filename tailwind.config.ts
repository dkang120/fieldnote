import type { Config } from "tailwindcss";

/* Pages are generated from the Figma file, so most values are exact arbitrary values
   (text-[14px], gap-[24px], #2b231f). Named tokens below mirror the Figma variables. */
export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "var(--ink)",
        muted: "var(--muted)",
        canvas: "var(--canvas)",
        surface: "var(--surface)",
        accent: "var(--accent)",
        "on-ink": "var(--on-ink)",
        border: "var(--border)",
        cream: "var(--cream)",
      },
      fontFamily: {
        sans: ["Figtree", "system-ui", "sans-serif"],
        serif: ['"Instrument Serif"', "Georgia", "serif"],
        mono: ['"IBM Plex Mono"', "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
} satisfies Config;
