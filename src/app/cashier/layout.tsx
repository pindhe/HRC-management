import type { ReactNode } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { CashierShell } from "@/components/cashier/CashierShell";
import { SESSION_COOKIE } from "@/lib/prefs";
import { parseRole, ROLE_HOME } from "@/lib/roles";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cashier",
  robots: { index: false, follow: false },
};

export default async function CashierLayout({ children }: { children: ReactNode }) {
  const role = parseRole((await cookies()).get(SESSION_COOKIE)?.value);
  if (!role || (role !== "cashier" && role !== "admin")) {
    redirect(role ? ROLE_HOME[role] : "/");
  }

  return <CashierShell role={role}>{children}</CashierShell>;
}
