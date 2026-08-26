import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE } from "@/lib/prefs";
import { parseRole, ROLE_HOME } from "@/lib/roles";
import type { ReactNode } from "react";

export default async function HomeLayout({ children }: { children: ReactNode }) {
  const role = parseRole((await cookies()).get(SESSION_COOKIE)?.value);
  if (role !== "admin") {
    redirect(role ? ROLE_HOME[role] : "/");
  }
  return children;
}
