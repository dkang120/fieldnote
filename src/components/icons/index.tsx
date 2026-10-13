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
export const Bookmark = ({ className = "size-5", filled = false }: { className?: string; filled?: boolean }) => (
  <svg {...base} className={className} fill={filled ? "currentColor" : "none"}><path d="M6.5 3.5h11v17l-5.5-4.2-5.5 4.2v-17Z" /></svg>
);
export const ArrowLeft = ({ className = "size-5" }: { className?: string }) => (
  <svg {...base} className={className}><path d="M20 12H5M10 7l-5 5 5 5" /></svg>
);
export const Bag = ({ className = "size-5" }: { className?: string }) => (
  <svg {...base} className={className}><path d="M5 8h14l-1 12H6L5 8Z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></svg>
);
export const Share = ({ className = "size-5" }: { className?: string }) => (
  <svg {...base} className={className}><path d="M12 15V3.5M7.5 8 12 3.5 16.5 8" /><path d="M5 12v7.5h14V12" /></svg>
);
export const ChevronRight = ({ className = "size-5" }: { className?: string }) => (
  <svg {...base} className={className}><path d="m9 5.5 6.5 6.5L9 18.5" /></svg>
);
export const Alert = ({ className = "size-4" }: { className?: string }) => (
  <svg {...base} className={className}><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5v5.5M12 16.2v.3" /></svg>
);
