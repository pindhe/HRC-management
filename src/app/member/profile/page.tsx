import { MemberProfile } from "@/components/member/MemberProfile";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile",
};

export default function MemberProfilePage() {
  return <MemberProfile />;
}
