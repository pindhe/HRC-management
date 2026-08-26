import { MemberBooks } from "@/components/member/MemberBooks";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Read book",
};

export default function MemberBooksPage() {
  return <MemberBooks />;
}
