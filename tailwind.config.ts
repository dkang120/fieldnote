import type { Config } from "tailwindcss";

/* Fieldnote tokens: paper, ink, kraft, stone, clay.
   Serif carries the voice, grotesk does the work, mono appears only where a label prints. */
export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: { DEFAULT: "#F3EFE7", deep: "#E9E3D7", tag: "#F7F3EA" },
        ink: { DEFAULT: "#1C1B19", soft: "#4A4741" },
        stone: "#8B877F",
        kraft: "#C9B796",
        clay: { DEFAULT: "#A95F3B", deep: "#8C4B2C" },
        rule: "rgba(28,27,25,0.16)",
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
