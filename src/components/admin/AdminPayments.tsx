"use client";

import { useEffect, useState } from "react";
import { PaymentHistory } from "@/components/payments/PaymentHistory";
import { getPayments, type Payment } from "@/lib/club-store";
import { useI18n } from "@/lib/i18n/language-provider";

export function AdminPayments() {
  const { t } = useI18n();
  const [payments, setPayments] = useState<Payment[]>([]);

  function refresh() {
    setPayments(getPayments());
  }

  useEffect(() => {
    refresh();
  }, []);

  return (
    <div>
      <h1 className="font-heading text-3xl text-forest sm:text-4xl">
        {t.admin.payments}
      </h1>
      <p className="mt-2 text-muted">{t.cashier.history}</p>

      <div className="mt-8 rounded-3xl border border-forest/10 bg-ivory p-6 shadow-sm">
        <PaymentHistory payments={payments} onChange={refresh} />
      </div>
    </div>
  );
}
