import type { ReactNode } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { MemberShell } from "@/components/member/MemberShell";
import { SESSION_COOKIE } from "@/lib/prefs";
import { parseRole, ROLE_HOME } from "@/lib/roles";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Member",
  robots: { index: false, follow: false },
};

export default async function MemberLayout({ children }: { children: ReactNode }) {
  const role = parseRole((await cookies()).get(SESSION_COOKIE)?.value);
  if (role !== "member" && role !== "admin") {
    redirect(role ? ROLE_HOME[role] : "/");
  }

  return <MemberShell>{children}</MemberShell>;
}
