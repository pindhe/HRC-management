import { CashierMembers } from "@/components/cashier/CashierMembers";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Members",
};

export default function CashierMembersPage() {
  return <CashierMembers />;
}
