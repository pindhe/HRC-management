import { SESSION_COOKIE, USER_COOKIE } from "@/lib/prefs";
import { parseRole, type Role } from "@/lib/roles";

function cookieMaxAge(remember: boolean) {
  return remember ? "max-age=2592000" : "";
}

export function writeSession(role: Role, remember: boolean, email = "") {
  const extra = cookieMaxAge(remember);
  const session = [`${SESSION_COOKIE}=${role}`, "path=/", "SameSite=Lax"];
  if (extra) session.push(extra);
  document.cookie = session.join("; ");

  const user = [
    `${USER_COOKIE}=${encodeURIComponent(email.trim().toLowerCase())}`,
    "path=/",
    "SameSite=Lax",
  ];
  if (extra) user.push(extra);
  document.cookie = user.join("; ");
}

export function clearSession() {
  document.cookie = `${SESSION_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
  document.cookie = `${USER_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
}

export function readClientRole(): Role | null {
  const raw = document.cookie
    .split("; ")
    .find((part) => part.startsWith(`${SESSION_COOKIE}=`));
  return parseRole(raw?.slice(SESSION_COOKIE.length + 1));
}

export function readClientEmail(): string {
  const raw = document.cookie
    .split("; ")
    .find((part) => part.startsWith(`${USER_COOKIE}=`));
  if (!raw) return "";
  try {
    return decodeURIComponent(raw.slice(USER_COOKIE.length + 1)).trim().toLowerCase();
  } catch {
    return "";
  }
}
