import type { Config } from "tailwindcss";

/* Fieldnote tokens: monochrome. Values live as CSS variables on :root (globals.css).
   Serif carries the voice, grotesk does the work, mono appears where a label or metadata prints. */
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
        serif: ['"Instrument Serif"', '"Times New Roman"', "serif"],
        sans: ['"Hanken Grotesk"', "system-ui", "sans-serif"],
        mono: ['"IBM Plex Mono"', "ui-monospace", "monospace"],
      },
      fontSize: {
        display: ["clamp(44px, 7vw, 92px)", { lineHeight: "0.98", letterSpacing: "-0.01em" }],
        h2: ["clamp(34px, 4.6vw, 58px)", { lineHeight: "1.04", letterSpacing: "-0.01em" }],
        h3: ["clamp(24px, 2.4vw, 30px)", { lineHeight: "1.15" }],
      },
      maxWidth: { site: "1240px" },
      transitionTimingFunction: { settle: "cubic-bezier(.2,.7,.2,1)" },
    },
  },
  plugins: [],
} satisfies Config;
