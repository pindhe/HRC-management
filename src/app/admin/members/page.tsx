import { AdminMembers } from "@/components/admin/AdminMembers";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Members",
};

export default function AdminMembersPage() {
  return <AdminMembers />;
}
