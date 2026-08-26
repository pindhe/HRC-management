import { SESSION_COOKIE } from "@/lib/prefs";
import { parseRole, type Role } from "@/lib/roles";

export function writeSession(role: Role, remember: boolean) {
  const maxAge = remember ? 60 * 60 * 24 * 30 : "";
  const parts = [`${SESSION_COOKIE}=${role}`, "path=/", "SameSite=Lax"];
  if (maxAge) parts.push(`max-age=${maxAge}`);
  document.cookie = parts.join("; ");
}

export function clearSession() {
  document.cookie = `${SESSION_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
}

export function readClientRole(): Role | null {
  const raw = document.cookie
    .split("; ")
    .find((part) => part.startsWith(`${SESSION_COOKIE}=`));
  return parseRole(raw?.slice(SESSION_COOKIE.length + 1));
}
