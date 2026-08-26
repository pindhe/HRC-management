import { AdminPayments } from "@/components/admin/AdminPayments";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payments",
};

export default function AdminPaymentsPage() {
  return <AdminPayments />;
}
