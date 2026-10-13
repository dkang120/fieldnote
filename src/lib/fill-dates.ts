/**
 * Fresh-fill scheduling. Bench sessions run Mon–Fri at 10:00 and 15:00 Pacific.
 * An order placed before the 15:00 cutoff on a weekday is mixed that day;
 * otherwise it is mixed at the next weekday's first session. It ships the next weekday.
 * Holidays the studio is closed can be listed in CLOSED_DAYS (YYYY-MM-DD, Pacific).
 */
export const STUDIO_TZ = "America/Los_Angeles";
export const LAST_SESSION_HOUR = 15;
export const CLOSED_DAYS = new Set<string>(["2026-11-26", "2026-11-27", "2026-12-25", "2027-01-01"]);

const ymd = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

/** Calendar date + hour in the studio's time zone, as a local Date at midnight. */
export function studioNow(now = new Date()) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone: STUDIO_TZ, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", hourCycle: "h23",
    })
      .formatToParts(now)
      .map((p) => [p.type, p.value]),
  );
  return { date: new Date(+parts.year, +parts.month - 1, +parts.day), hour: +parts.hour };
}

export const isBenchDay = (d: Date) => d.getDay() > 0 && d.getDay() < 6 && !CLOSED_DAYS.has(ymd(d));

export function nextBenchDay(d: Date) {
  const n = new Date(d);
  do n.setDate(n.getDate() + 1);
  while (!isBenchDay(n));
  return n;
}

export function fillDates(now = new Date()) {
  const { date, hour } = studioNow(now);
  const compounded = isBenchDay(date) && hour < LAST_SESSION_HOUR ? date : nextBenchDay(date);
  return { compounded, ships: nextBenchDay(compounded) };
}

export const fmtDay = (d: Date) => d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
export const fmtLabelDate = (d: Date) =>
  d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }).toUpperCase();
export const isoDay = ymd;
