export const roles = ["admin", "member", "cashier"] as const;

export type Role = (typeof roles)[number];

export const ROLE_HOME: Record<Role, string> = {
  admin: "/admin",
  member: "/home",
  cashier: "/cashier",
};

export function parseRole(value: string | undefined): Role | null {
  if (value === "admin" || value === "member" || value === "cashier") {
    return value;
  }
  if (value === "1") return "member";
  return null;
}

export function canAccess(pathname: string, role: Role): boolean {
  if (pathname.startsWith("/admin")) return role === "admin";
  if (pathname.startsWith("/cashier")) return role === "cashier" || role === "admin";
  if (pathname.startsWith("/home")) return role === "member" || role === "admin";
  return true;
}
