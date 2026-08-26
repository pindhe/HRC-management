import { AdminBookCreate } from "@/components/admin/AdminBookCreate";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Upload book",
};

export default function AdminAddBookPage() {
  return <AdminBookCreate />;
}
