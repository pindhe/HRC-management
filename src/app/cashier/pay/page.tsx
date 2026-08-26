import { CashierPay } from "@/components/cashier/CashierPay";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pay",
};

export default function CashierPayPage() {
  return <CashierPay />;
}
