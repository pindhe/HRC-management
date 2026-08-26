import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { CashierDashboard } from "@/components/CashierDashboard";
import { SESSION_COOKIE } from "@/lib/prefs";
import { parseRole, ROLE_HOME } from "@/lib/roles";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cashier",
  robots: { index: false, follow: false },
};

export default async function CashierPage() {
  const role = parseRole((await cookies()).get(SESSION_COOKIE)?.value);
  if (!role || (role !== "cashier" && role !== "admin")) {
    redirect(role ? ROLE_HOME[role] : "/");
  }

  return <CashierDashboard role={role} />;
}
