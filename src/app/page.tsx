import type { Metadata } from "next";
import { LoginPage } from "@/components/LoginPage";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to Hage Reading Club.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <LoginPage />;
}
