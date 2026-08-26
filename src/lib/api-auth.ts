import { cookies } from "next/headers";
import { SESSION_COOKIE } from "@/lib/prefs";
import { parseRole, type Role } from "@/lib/roles";

export async function getRequestRole(): Promise<Role | null> {
  return parseRole((await cookies()).get(SESSION_COOKIE)?.value);
}

export async function requireRole(allowed: Role[]) {
  const role = await getRequestRole();
  if (!role || !allowed.includes(role)) return null;
  return role;
}
