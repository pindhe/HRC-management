"use client";

import { ClubBooks } from "@/components/books/ClubBooks";
import { useI18n } from "@/lib/i18n/language-provider";

export function CashierReading() {
  const { t } = useI18n();
  return <ClubBooks heading={t.cashier.reading} />;
}
