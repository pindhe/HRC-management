"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  CalendarCheck,
  Users,
  Wallet,
} from "lucide-react";
import {
  getAttendanceOnDate,
  getMembers,
  getPayments,
  getReadingDone,
  localDateKey,
  type ClubMember,
  type Payment,
  type ReadingDone,
} from "@/lib/club-store";
import { useI18n } from "@/lib/i18n/language-provider";

const actions = [
  { href: "/cashier/members", key: "goList", icon: Users },
  { href: "/cashier/attendance", key: "goAttendance", icon: CalendarCheck },
  { href: "/cashier/pay", key: "goPay", icon: Wallet },
  { href: "/cashier/reading", key: "goReading", icon: BookOpen },
] as const;

function isToday(iso: string) {
  return localDateKey(new Date(iso)) === localDateKey();
}

export function CashierHome() {
  const { t, locale } = useI18n();
  const [members, setMembers] = useState<ClubMember[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [done, setDone] = useState<ReadingDone[]>([]);
  const [presentEmails, setPresentEmails] = useState<string[]>([]);

  useEffect(() => {
    setMembers(getMembers());
    setPayments(getPayments());
    setDone(getReadingDone());
    setPresentEmails(getAttendanceOnDate().map((item) => item.email));
  }, []);

  const todayLabel = useMemo(
    () =>
      new Date().toLocaleDateString(locale, {
        weekday: "long",
        day: "numeric",
        month: "long",
      }),
    [locale],
  );

  const presentMembers = members.filter((member) =>
    presentEmails.includes(member.email),
  );
  const paidToday = payments.filter((item) => isToday(item.createdAt));
  const finishedToday = done.filter((item) => isToday(item.createdAt));

  return (
    <div>
      <p className="text-xs font-semibold tracking-[0.18em] text-gold uppercase">
        {t.cashier.today}
      </p>
      <h1 className="font-heading mt-2 text-3xl text-forest sm:text-4xl">
        {t.cashier.todayList}
      </h1>
      <p className="mt-2 capitalize text-muted">{todayLabel}</p>
      <p className="mt-2 max-w-2xl text-muted">{t.cashier.todayHint}</p>

      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-forest/10 bg-ivory p-4 shadow-sm">
          <p className="text-xs font-semibold tracking-wide text-muted uppercase">
            {t.cashier.presentToday}
          </p>
          <p className="mt-2 text-3xl font-semibold text-forest">{presentMembers.length}</p>
        </div>
        <div className="rounded-2xl border border-forest/10 bg-ivory p-4 shadow-sm">
          <p className="text-xs font-semibold tracking-wide text-muted uppercase">
            {t.cashier.paidToday}
          </p>
          <p className="mt-2 text-3xl font-semibold text-forest">{paidToday.length}</p>
        </div>
        <div className="rounded-2xl border border-forest/10 bg-ivory p-4 shadow-sm">
          <p className="text-xs font-semibold tracking-wide text-muted uppercase">
            {t.cashier.finishedToday}
          </p>
          <p className="mt-2 text-3xl font-semibold text-forest">{finishedToday.length}</p>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {actions.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-4 rounded-3xl border border-forest/10 bg-ivory p-5 shadow-sm transition-colors hover:border-gold/50"
            >
              <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-gold/15 text-forest">
                <Icon className="size-5" aria-hidden />
              </span>
              <span className="font-heading text-xl text-forest">
                {item.key === "goReading" ? t.cashier.reading : t.cashier[item.key]}
              </span>
            </Link>
          );
        })}
      </div>

      <section className="mt-10 rounded-3xl border border-forest/10 bg-ivory p-5 shadow-sm sm:p-6">
        <h2 className="font-heading text-xl text-forest">{t.cashier.presentToday}</h2>
        {presentMembers.length === 0 ? (
          <p className="mt-4 text-sm text-muted">{t.cashier.membersEmpty}</p>
        ) : (
          <ul className="mt-4 divide-y divide-forest/10">
            {presentMembers.map((member) => (
              <li key={member.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="truncate font-medium text-forest-deep">{member.name}</p>
                  <p className="truncate text-sm text-muted">{member.email}</p>
                </div>
                <span className="rounded-full bg-gold/15 px-2.5 py-1 text-[11px] font-semibold text-forest uppercase">
                  {t.cashier.present}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
