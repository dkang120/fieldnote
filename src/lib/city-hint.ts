/** Suggest a city from the browser's time zone. No location permission, nothing leaves the device. */
const ZONE_CITY: Record<string, string> = {
  "America/Los_Angeles": "Los Angeles", "America/New_York": "New York", "America/Chicago": "Chicago",
  "America/Denver": "Denver", "America/Phoenix": "Phoenix", "America/Detroit": "Detroit",
  "America/Boise": "Boise", "America/Anchorage": "Anchorage", "Pacific/Honolulu": "Honolulu",
  "America/Indiana/Indianapolis": "Indianapolis", "America/Kentucky/Louisville": "Louisville",
};

export function cityHint(): string | null {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return ZONE_CITY[tz] ?? null;
  } catch { return null; }
}
