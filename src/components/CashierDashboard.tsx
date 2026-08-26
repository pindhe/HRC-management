"use client";

import { FormEvent, useEffect, useId, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  addPayment,
  getPayments,
  type Payment,
} from "@/lib/club-store";
import { useI18n } from "@/lib/i18n/language-provider";
import type { Role } from "@/lib/roles";

const methods = ["cash", "transfer", "mobile"] as const;

export function CashierDashboard() {
  const { t } = useI18n();
  const memberId = useId();
  const amountId = useId();
  const methodId = useId();

  const [payments, setPayments] = useState<Payment[]>([]);
  const [memberName, setMemberName] = useState("");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<(typeof methods)[number]>("cash");
  const [errors, setErrors] = useState<{ memberName?: string; amount?: string }>(
    {},
  );

  useEffect(() => {
    setPayments(getPayments());
  }, []);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = Number(amount);
    const next: { memberName?: string; amount?: string } = {};
    if (!memberName.trim()) next.memberName = t.cashier.memberError;
    if (!Number.isFinite(parsed) || parsed <= 0) next.amount = t.cashier.amountError;
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    addPayment({
      memberName: memberName.trim(),
      amount: parsed,
      method,
    });
    setPayments(getPayments());
    setMemberName("");
    setAmount("");
    setMethod("cash");
    setErrors({});
  }

  return (
    <AppShell role="cashier" title={t.cashier.title}>
      <div className="max-w-3xl">
        <h1 className="font-heading text-3xl text-forest sm:text-4xl">
          {t.cashier.title}
        </h1>
        <p className="mt-2 text-muted">{t.cashier.subtitle}</p>
      </div>

      <section className="mt-10 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <form
          onSubmit={onSubmit}
          className="space-y-4 rounded-3xl border border-forest/10 bg-ivory p-6 shadow-sm"
          noValidate
        >
          <h2 className="font-heading text-xl text-forest">{t.cashier.collect}</h2>
          <div className="space-y-2">
            <Label htmlFor={memberId}>{t.cashier.memberName}</Label>
            <Input
              id={memberId}
              value={memberName}
              onChange={(event) => setMemberName(event.target.value)}
              aria-invalid={Boolean(errors.memberName)}
            />
            {errors.memberName ? (
              <p className="text-xs text-red-700">{errors.memberName}</p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor={amountId}>{t.cashier.amount}</Label>
            <Input
              id={amountId}
              inputMode="decimal"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              aria-invalid={Boolean(errors.amount)}
            />
            {errors.amount ? (
              <p className="text-xs text-red-700">{errors.amount}</p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor={methodId}>{t.cashier.method}</Label>
            <select
              id={methodId}
              value={method}
              onChange={(event) =>
                setMethod(event.target.value as (typeof methods)[number])
              }
              className="flex h-12 w-full rounded-xl border border-forest/15 bg-ivory px-4 text-base text-charcoal shadow-sm focus-visible:border-forest focus-visible:ring-2 focus-visible:ring-gold/40 focus-visible:outline-none dark:bg-[#102018] dark:text-[#f4ede1] dark:border-ivory/16"
            >
              {methods.map((value) => (
                <option key={value} value={value}>
                  {t.cashier[value]}
                </option>
              ))}
            </select>
          </div>
          <Button type="submit" variant="gold" className="w-full">
            {t.cashier.save}
          </Button>
        </form>

        <div className="rounded-3xl border border-forest/10 bg-ivory p-6 shadow-sm">
          <h2 className="font-heading text-xl text-forest">{t.cashier.history}</h2>
          {payments.length === 0 ? (
            <p className="mt-6 text-sm text-muted">{t.cashier.empty}</p>
          ) : (
            <ul className="mt-5 divide-y divide-forest/10">
              {payments.map((payment) => (
                <li key={payment.id} className="flex items-start justify-between gap-4 py-3">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-forest-deep">
                      {payment.memberName}
                    </p>
                    <p className="text-sm text-muted">{t.cashier[payment.method]}</p>
                  </div>
                  <span className="shrink-0 font-semibold text-forest">
                    {payment.amount.toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </AppShell>
  );
}
