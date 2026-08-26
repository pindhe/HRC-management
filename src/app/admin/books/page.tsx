import { AdminBookList } from "@/components/admin/AdminBookList";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Books",
};

export default function AdminBooksPage() {
  return <AdminBookList />;
}
