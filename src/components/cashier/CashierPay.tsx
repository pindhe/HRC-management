"use client";

import { FormEvent, useEffect, useId, useMemo, useState } from "react";
import { BookOpen, CalendarOff } from "lucide-react";
import { BookSchedule } from "@/components/books/BookSchedule";
import { PaymentHistory } from "@/components/payments/PaymentHistory";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { isBookEnded } from "@/lib/book-dates";
import {
  addPayment,
  FINE_TYPES,
  getAttendance,
  getMembers,
  getPayments,
  localDateKey,
  type ClubMember,
  type FineType,
  type Payment,
} from "@/lib/club-store";
import { useI18n } from "@/lib/i18n/language-provider";
import { localeMeta } from "@/lib/i18n/types";
import type { LibraryBook } from "@/lib/library-types";
import { cn } from "@/lib/utils";

const selectClass =
  "flex h-12 w-full rounded-xl border border-forest/15 bg-ivory px-4 text-base text-charcoal shadow-sm focus-visible:border-forest focus-visible:ring-2 focus-visible:ring-gold/40 focus-visible:outline-none dark:bg-[#102018] dark:text-[#f4ede1] dark:border-ivory/16";

function dayKeysForMember(member: ClubMember, today = localDateKey()) {
  const joined = localDateKey(new Date(member.createdAt));
  const keys: string[] = [];
  const cursor = new Date(`${today}T12:00:00`);
  const start = new Date(`${joined}T12:00:00`);
  for (let i = 0; i < 21; i++) {
    if (!Number.isFinite(cursor.getTime()) || cursor < start) break;
    keys.push(localDateKey(cursor));
    cursor.setDate(cursor.getDate() - 1);
  }
  return keys;
}

function formatDay(dateKey: string, locale: string) {
  const date = dateKey.includes("T")
    ? new Date(dateKey)
    : new Date(`${dateKey}T12:00:00`);
  if (!Number.isFinite(date.getTime())) return dateKey;
  return date.toLocaleDateString(locale, {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export function CashierPay() {
  const { t, locale } = useI18n();
  const htmlLang = localeMeta[locale].htmlLang;
  const memberId = useId();
  const amountId = useId();
  const dateId = useId();
  const [members, setMembers] = useState<ClubMember[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [books, setBooks] = useState<LibraryBook[]>([]);
  const [memberIdValue, setMemberIdValue] = useState("");
  const [fineType, setFineType] = useState<FineType | "">("");
  const [fineDate, setFineDate] = useState(localDateKey);
  const [amount, setAmount] = useState("");
  const [presentDays, setPresentDays] = useState<string[]>([]);
  const [errors, setErrors] = useState<{
    memberName?: string;
    fineType?: string;
    fineDate?: string;
    amount?: string;
  }>({});

  const member = members.find((item) => item.id === memberIdValue) ?? null;
  const currentBook =
    books.find((book) => book.startDate && !isBookEnded(book.endDate)) ??
    books[0] ??
    null;

  useEffect(() => {
    setMembers(
      getMembers().slice().sort((a, b) => a.name.localeCompare(b.name)),
    );
    setPayments(getPayments());
    void fetch("/api/books")
      .then((response) => (response.ok ? response.json() : { books: [] }))
      .then((data: { books: LibraryBook[] }) => setBooks(data.books ?? []));
  }, []);

  useEffect(() => {
    if (!member) {
      setPresentDays([]);
      return;
    }
    setPresentDays(getAttendance(member.email).map((item) => item.date));
    setFineType("");
    setFineDate(localDateKey());
    setAmount("");
    setErrors({});
  }, [member?.id, member?.email]);

  const memberDays = useMemo(
    () => (member ? dayKeysForMember(member) : []),
    [member],
  );

  const memberPayments = useMemo(() => {
    if (!member) return [];
    return payments.filter(
      (payment) =>
        (member.email && payment.memberEmail === member.email) ||
        payment.memberName === member.name,
    );
  }, [member, payments]);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = Number(amount);
    const next: typeof errors = {};
    if (!member) next.memberName = t.cashier.memberError;
    if (!fineType) next.fineType = t.cashier.fineTypeError;
    if (!fineDate) next.fineDate = t.cashier.fineDateError;
    if (!Number.isFinite(parsed) || parsed <= 0) next.amount = t.cashier.amountError;
    setErrors(next);
    if (Object.keys(next).length > 0 || !member || !fineType) return;

    addPayment({
      memberName: member.name,
      memberEmail: member.email,
      amount: parsed,
      method: "cash",
      fineType,
      fineDate,
    });
    setPayments(getPayments());
    setFineType("");
    setFineDate(localDateKey());
    setAmount("");
    setErrors({});
  }

  const fineLabels = {
    book: t.cashier.fineBook,
    absence: t.cashier.fineAbsence,
  };

  return (
    <div>
      <h1 className="font-heading text-3xl text-forest sm:text-4xl">
        {t.cashier.pay}
      </h1>
      <p className="mt-2 text-muted">{t.cashier.goPay}</p>

      <section
        className={cn("mt-8 grid gap-8", member && "lg:grid-cols-[0.95fr_1.05fr]")}
      >
        <form
          onSubmit={onSubmit}
          className="space-y-4 rounded-3xl border border-forest/10 bg-ivory p-6 shadow-sm"
          noValidate
        >
          <h2 className="font-heading text-xl text-forest">{t.cashier.collect}</h2>
          <div className="space-y-2">
            <Label htmlFor={memberId}>{t.cashier.memberName}</Label>
            <select
              id={memberId}
              value={memberIdValue}
              onChange={(event) => setMemberIdValue(event.target.value)}
              aria-invalid={Boolean(errors.memberName)}
              className={selectClass}
            >
              <option value="">{t.cashier.selectMember}</option>
              {members.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                  {item.email ? ` · ${item.email}` : ""}
                </option>
              ))}
            </select>
            {members.length === 0 ? (
              <p className="text-xs text-muted">{t.cashier.membersEmpty}</p>
            ) : null}
            {errors.memberName ? (
              <p className="text-xs text-red-700">{errors.memberName}</p>
            ) : null}
          </div>

          {member ? (
            <>
              <div className="rounded-2xl border border-forest/10 bg-beige/40 p-4 dark:bg-forest/20">
                <p className="text-xs font-semibold tracking-wide text-muted uppercase">
                  {t.cashier.memberDates}
                </p>
                <p className="mt-2 font-medium text-forest-deep">{member.name}</p>
                <p className="mt-1 text-sm text-muted">
                  {t.cashier.joinDate}: {formatDay(member.createdAt, htmlLang)}
                </p>
                {currentBook ? (
                  <div className="mt-3">
                    <p className="text-sm font-medium text-forest-deep">
                      {t.cashier.currentBook}: {currentBook.title}
                    </p>
                    <BookSchedule
                      className="mt-1"
                      startDate={currentBook.startDate}
                      endDate={currentBook.endDate}
                    />
                  </div>
                ) : null}
                <div className="mt-3 flex flex-wrap gap-2">
                  {memberDays.length === 0 ? (
                    <p className="text-sm text-muted">{t.cashier.noDates}</p>
                  ) : (
                    memberDays.map((day) => {
                      const present = presentDays.includes(day);
                      const selected = fineDate === day;
                      return (
                        <button
                          key={day}
                          type="button"
                          onClick={() => setFineDate(day)}
                          className={cn(
                            "rounded-full px-3 py-1.5 text-xs font-medium",
                            selected
                              ? "bg-gold text-forest-deep"
                              : present
                                ? "bg-forest/10 text-forest"
                                : "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300",
                          )}
                        >
                          {formatDay(day, htmlLang)} ·{" "}
                          {present ? t.cashier.present : t.cashier.absent}
                        </button>
                      );
                    })
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-forest-deep">
                  {t.cashier.fineType}
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {FINE_TYPES.map((value) => {
                    const Icon = value === "book" ? BookOpen : CalendarOff;
                    const selected = fineType === value;
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setFineType(value)}
                        className={cn(
                          "flex h-14 items-center justify-center gap-2 rounded-2xl border text-sm font-semibold shadow-sm",
                          selected
                            ? "border-gold bg-gold/20 text-forest"
                            : "border-forest/10 bg-ivory text-forest hover:border-gold/50",
                        )}
                      >
                        <Icon className="size-4" aria-hidden />
                        {fineLabels[value]}
                      </button>
                    );
                  })}
                </div>
                {errors.fineType ? (
                  <p className="text-xs text-red-700">{errors.fineType}</p>
                ) : null}
              </div>

              {fineType ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor={dateId}>{t.cashier.selectDay}</Label>
                    <Input
                      id={dateId}
                      type="date"
                      value={fineDate}
                      max={localDateKey()}
                      onChange={(event) => setFineDate(event.target.value)}
                      aria-invalid={Boolean(errors.fineDate)}
                    />
                    {errors.fineDate ? (
                      <p className="text-xs text-red-700">{errors.fineDate}</p>
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
                  <Button type="submit" variant="gold" className="w-full">
                    {t.cashier.save}
                  </Button>
                </>
              ) : null}
            </>
          ) : null}
        </form>

        {member ? (
          <div className="rounded-3xl border border-forest/10 bg-ivory p-6 shadow-sm">
            <h2 className="font-heading text-xl text-forest">{t.cashier.history}</h2>
            <PaymentHistory
              payments={memberPayments}
              onChange={() => setPayments(getPayments())}
            />
          </div>
        ) : null}
      </section>
    </div>
  );
}
