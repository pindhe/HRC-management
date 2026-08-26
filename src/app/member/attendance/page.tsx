import { MemberAttendance } from "@/components/member/MemberAttendance";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Attendance",
};

export default function MemberAttendancePage() {
  return <MemberAttendance />;
}
