import { AdminMemberCreate } from "@/components/admin/AdminMemberCreate";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Add member",
};

export default function AdminAddMemberPage() {
  return <AdminMemberCreate />;
}
