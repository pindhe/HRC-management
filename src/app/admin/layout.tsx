import type { ReactNode } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { SESSION_COOKIE } from "@/lib/prefs";
import { parseRole, ROLE_HOME } from "@/lib/roles";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const role = parseRole((await cookies()).get(SESSION_COOKIE)?.value);
  if (role !== "admin") {
    redirect(role ? ROLE_HOME[role] : "/");
  }

  return <AdminShell>{children}</AdminShell>;
}
