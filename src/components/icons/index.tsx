/** One stroke family for the whole site: 24px grid, 1.3 stroke, round caps. */
const base = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.3, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true } as const;

export const ArrowRight = ({ className = "size-3.5" }: { className?: string }) => (
  <svg {...base} className={className}><path d="M4 12h15M14 7l5 5-5 5" /></svg>
);
export const Plus = ({ className = "size-5" }: { className?: string }) => (
  <svg {...base} className={className}><path d="M12 5v14M5 12h14" /></svg>
);
export const Check = ({ className = "size-5" }: { className?: string }) => (
  <svg {...base} className={className}><path d="m5 12.5 4.5 4.5L19 7.5" /></svg>
);
