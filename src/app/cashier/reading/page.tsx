import { CashierReading } from "@/components/cashier/CashierReading";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Read book",
};

export default function CashierReadingPage() {
  return <CashierReading />;
}
