import type { Config } from "tailwindcss";

/* Fieldnote tokens: monochrome. Values live as CSS variables on :root (globals.css).
   One geometric sans (Figtree) everywhere, 400 for nearly everything, 500 max; 700 only for the hero wordmark.
   The bottle label SVG keeps its own printed-label faces (see Bottle.tsx). */
const v = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        surface: v("surface"),
        ink: v("ink"),
        muted: v("muted"),
        line: v("line"),
        "on-ink": v("on-ink"),
        canvas: v("canvas"),
      },
      fontFamily: {
        sans: ["Figtree", "Outfit", "system-ui", "sans-serif"],
      },
      fontSize: {
        display: ["clamp(30px, 3.6vw, 44px)", { lineHeight: "1.15", letterSpacing: "-0.01em" }],
        h2: ["clamp(24px, 2.6vw, 32px)", { lineHeight: "1.2", letterSpacing: "-0.005em" }],
        h3: ["18px", { lineHeight: "1.45" }],
        title: ["17px", { lineHeight: "1.45" }],
        meta: ["13px", { lineHeight: "1.45" }],
      },
      maxWidth: { site: "1240px" },
      transitionTimingFunction: { settle: "cubic-bezier(.2,.7,.2,1)" },
    },
  },
  plugins: [],
} satisfies Config;
