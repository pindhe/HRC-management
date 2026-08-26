import { CashierAttendance } from "@/components/cashier/CashierAttendance";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Attendance",
};

export default function CashierAttendancePage() {
  return <CashierAttendance />;
}
