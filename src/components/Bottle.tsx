import { fmtLabelDate } from "@/lib/fill-dates";

/* Mirrors the :root tokens in globals.css (SVG fill attributes can't read CSS variables). */
const INK = "#111111";
const LABEL = "#F2F1EF";
const MUTED = "#6B6B6B";

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
  return (
    <svg viewBox="0 0 200 360" role="img" aria-label={label ?? `${title}, made for ${who} in ${where}`} className={`block h-auto ${className}`}>
      {backdrop && <rect x="24" y={top + 48} width="152" height={h - 50} rx="12" fill={backdrop} />}
      <rect x="78" y={top - 8} width="44" height="48" rx="3" fill={INK} />
      <rect x="86" y={top + 38} width="28" height="12" fill="#8A8A8A" />
      <rect x="24" y={top + 48} width="152" height={h - 50} rx="12" fill={liquid} fillOpacity=".55" stroke={INK} strokeOpacity=".28" />
      <rect x="24" y={top + 74} width="152" height={h - 76} rx="12" fill={liquid} fillOpacity=".55" />
      <rect x="34" y={top + 60} width="5" height={h - 90} rx="2.5" fill="#fff" fillOpacity=".45" />
      <g transform={`translate(100 ${cy})`} fill={INK}>
        <ellipse rx="62" ry="78" fill={LABEL} stroke={INK} strokeWidth="1" />
        <ellipse rx="57" ry="73" fill="none" stroke={INK} strokeWidth=".5" />
        <text y="-46" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="7.5" letterSpacing="2.2">FIELDNOTE</text>
        <text y="-24" textAnchor="middle" fontFamily="Instrument Serif, serif" fontSize="11" fill={MUTED}>
          {no === "C" ? "Custom" : `No. ${no}`}
        </text>
        <text y="-4" textAnchor="middle" fontFamily="Instrument Serif, serif" fontSize={title.length > 12 ? 15 : 17}>{title}</text>
        <line x1="-30" x2="30" y1="8" y2="8" stroke={INK} strokeWidth=".5" />
        <g fontFamily="IBM Plex Mono, monospace" textAnchor="middle">
          <text y="24" fontSize="6.6" fill={MUTED}>MADE FOR</text>
          <text y="36" fontSize={who.length > 14 ? 7 : 8.4}>{who.toUpperCase()}</text>
          <text y="50" fontSize="6.6" fill={MUTED}>{where.toUpperCase()}</text>
          <text y="60" fontSize="5.8" fill={MUTED}>{dateText}</text>
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
