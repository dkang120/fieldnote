import { fmtLabelDate } from "@/lib/fill-dates";

/* Figma Bottle component (6:4). SVG fills can't read CSS variables, so the tokens are mirrored here. */
const INK = "#2B231F";
const LABEL = "#F7F4F0";
const MUTED = "#6B625B";
const CANVAS = "#ECE8E1";

/** Liquid tints stay in the scent data; the illustration renders them as a neutral gray of the same lightness. */
export function grayTint(hex: string, k = 1) {
  const n = parseInt(hex.replace("#", ""), 16);
  const y = Math.round((0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) * k);
  const h = y.toString(16).padStart(2, "0");
  return `#${h}${h}${h}`;
}

interface Props {
  title: string;
  /** "01" for house scents; "C" for custom blends */
  no: string;
  tint: string;
  name?: string;
  city?: string;
  date?: Date | null;
  size?: 50 | 100;
  className?: string;
  label?: string;
  /** Fill behind the glass so the bottle reads as solid when it sits over type (home hero). */
  backdrop?: string;
}

/** Straight glass bottle with a Diptyque-style oval label. Everything on the label is live data. */
export function Bottle({ title, no, tint, name = "", city = "", date = null, size = 50, className = "", label, backdrop }: Props) {
  const who = (name.trim() || "Your name").slice(0, 20);
  const where = (city.trim() || "Your city").slice(0, 18);
  const h = size === 100 ? 330 : 300;
  const top = 340 - h;
  const cy = top + 48 + (h - 50) / 2 + 6;
  const liquid = grayTint(tint);
  const dateText = date ? `${fmtLabelDate(date)} · ${size}ML` : `MIXED ON ORDER · ${size}ML`;
  // Label text baselines, relative to the label centre. Figma places each line by its top with a 1.3 line height;
  // these are those tops converted with the fonts' ascent/descent (Figtree .95/.25, Instrument Serif .99/.31, Plex Mono 1.03/.28).
  const longTitle = title.length > 12;
  const longName = who.length > 14;
  return (
    <svg viewBox="0 0 200 360" role="img" aria-label={label ?? `${title}, made for ${who} in ${where}`} className={`block h-auto ${className}`}>
      <rect x="24" y={top + 48} width="152" height={h - 50} rx="12" fill={backdrop ?? CANVAS} />
      <rect x="24.5" y={top + 48.5} width="151" height={h - 51} rx="11.5" fill={liquid} stroke={INK} />
      <rect x="24" y={top + 74} width="152" height={h - 76} rx="12" fill={liquid} />
      <rect x="34" y={top + 60} width="5" height={h - 90} rx="2.5" fill="#fff" />
      <rect x="86" y={top + 38} width="28" height="12" fill={MUTED} />
      <rect x="78" y={top - 8} width="44" height="48" rx="3" fill={INK} />
      <g transform={`translate(100 ${cy})`} fill={INK}>
        <ellipse rx="61.5" ry="77.5" fill={LABEL} stroke={INK} strokeWidth="1" />
        <ellipse rx="56.75" ry="72.75" fill="none" stroke={INK} strokeWidth=".5" />
        <rect x="-30" y="8" width="60" height=".5" />
        <text y="-44" dx="1.1" textAnchor="middle" fontFamily="Figtree, sans-serif" fontSize="7.5" letterSpacing="2.2">FIELDNOTE</text>
        <text y="-22.11" textAnchor="middle" fontFamily="Instrument Serif, serif" fontSize="11" fill={MUTED}>
          {no === "C" ? "Custom" : `No. ${no}`}
        </text>
        <text y={longTitle ? -2.85 : -2.17} textAnchor="middle" fontFamily="Instrument Serif, serif" fontSize={longTitle ? 15 : 17}>{title}</text>
        <g fontFamily="IBM Plex Mono, monospace" textAnchor="middle">
          <text y="26.17" fontSize="6.6" fill={MUTED}>MADE FOR</text>
          <text y={longName ? 37.69 : 38.21} fontSize={longName ? 7 : 8.4}>{who.toUpperCase()}</text>
          <text y="52.17" fontSize="6.6" fill={MUTED}>{where.toUpperCase()}</text>
          <text y="62.15" fontSize="5.8" fill={MUTED}>{dateText}</text>
        </g>
      </g>
    </svg>
  );
}

export function Vial({ no, tint }: { no: string; tint: string }) {
  const liquid = grayTint(tint);
  return (
    <svg viewBox="0 0 40 150" aria-hidden="true" className="block h-auto w-full">
      <rect x="13" y="2" width="14" height="20" rx="2" fill={INK} />
      <rect x="9" y="22" width="22" height="124" rx="10" fill={liquid} fillOpacity=".7" stroke={INK} strokeOpacity=".3" />
      <rect x="11" y="70" width="18" height="36" fill={LABEL} />
      <text x="20" y="92" textAnchor="middle" fontFamily="Instrument Serif, serif" fontSize="11" fill={INK}>{no}</text>
    </svg>
  );
}
