export function toDatetimeLocal(iso: string) {
  if (!iso) return "";
  const date = new Date(iso);
  if (!Number.isFinite(date.getTime())) return "";
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function fromDatetimeLocal(value: string) {
  if (!value.trim()) return "";
  const date = new Date(value);
  return Number.isFinite(date.getTime()) ? date.toISOString() : "";
}

export function isValidDateWindow(start: string, end: string) {
  const startAt = new Date(start).getTime();
  const endAt = new Date(end).getTime();
  return Number.isFinite(startAt) && Number.isFinite(endAt) && endAt > startAt;
}

export function remainingMs(endDate: string, now = Date.now()) {
  const endAt = new Date(endDate).getTime();
  if (!Number.isFinite(endAt)) return null;
  return endAt - now;
}

export function isBookEnded(endDate: string, now = Date.now()) {
  const left = remainingMs(endDate, now);
  return left !== null && left <= 0;
}

export function formatDateTime(iso: string, locale: string) {
  const date = new Date(iso);
  if (!Number.isFinite(date.getTime())) return "";
  return date.toLocaleString(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatRemaining(ms: number) {
  const total = Math.max(0, ms);
  if (total < 60_000) return "<1m";
  const days = Math.floor(total / 86_400_000);
  const hours = Math.floor((total % 86_400_000) / 3_600_000);
  const minutes = Math.floor((total % 3_600_000) / 60_000);
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}
