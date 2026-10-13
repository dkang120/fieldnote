"use client";
import { fmtDay } from "@/lib/fill-dates";
import { useFillDates } from "@/lib/use-fill-dates";

export function FillDateNote({ className = "" }: { className?: string }) {
  const d = useFillDates();
  return (
    <div className={`flex items-start gap-3 rounded border border-dashed border-kraft bg-[#F8F4EC] px-4 py-3.5 text-[15px] ${className}`} aria-live="polite">
      <span className="mt-2 size-2 flex-none rounded-full bg-clay" />
      <span>
        {d ? (
          <>Filled fresh: order now and we mix it <strong>{fmtDay(d.compounded)}</strong>. It ships <strong>{fmtDay(d.ships)}</strong>.</>
        ) : (
          <>Filled fresh within 48 hours of your order.</>
        )}
      </span>
    </div>
  );
}

export function NextBench() {
  const d = useFillDates();
  return <>{d ? fmtDay(d.compounded) : "today"}</>;
}
