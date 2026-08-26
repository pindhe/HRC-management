"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  CreditCard,
  Plus,
  Shield,
  UserRound,
  Users,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getMembers,
  getPayments,
  type ClubMember,
  type Payment,
} from "@/lib/club-store";
import { useI18n } from "@/lib/i18n/language-provider";
import { roles, type Role } from "@/lib/roles";
import { cn } from "@/lib/utils";

function isSameDay(iso: string, day: Date) {
  const value = new Date(iso);
  return (
    value.getFullYear() === day.getFullYear() &&
    value.getMonth() === day.getMonth() &&
    value.getDate() === day.getDate()
  );
}

const roleIcons: Record<Role, typeof Shield> = {
  admin: Shield,
  member: UserRound,
  cashier: Wallet,
};

export function AdminOverview() {
  const { t, locale } = useI18n();
  const [members, setMembers] = useState<ClubMember[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);

  useEffect(() => {
    setMembers(getMembers());
    setPayments(getPayments());
  }, []);

  const dateLabel = useMemo(
    () =>
      new Date().toLocaleDateString(locale === "so" ? "so-SO" : locale, {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    [locale],
  );

  const stats = useMemo(() => {
    const totalCollected = payments.reduce((sum, item) => sum + item.amount, 0);
    const today = new Date();
    const todayPayments = payments.filter((item) => isSameDay(item.createdAt, today));
    const byRole = Object.fromEntries(
      roles.map((role) => [role, members.filter((item) => item.role === role).length]),
    ) as Record<Role, number>;
    const byMethod = {
      cash: payments.filter((item) => item.method === "cash").reduce((sum, item) => sum + item.amount, 0),
      transfer: payments
        .filter((item) => item.method === "transfer")
        .reduce((sum, item) => sum + item.amount, 0),
      mobile: payments.filter((item) => item.method === "mobile").reduce((sum, item) => sum + item.amount, 0),
    };
    return { totalCollected, todayCount: todayPayments.length, byRole, byMethod };
  }, [members, payments]);

  const recentMembers = members.slice(0, 5);
  const recentPayments = payments.slice(0, 5);
  const methodTotal = stats.totalCollected || 0;

  const cards = [
    {
      href: "/admin/members",
      label: t.admin.countMembers,
      value: members.length.toLocaleString(locale),
      icon: Users,
    },
    {
      href: "/admin/payments",
      label: t.admin.countPayments,
      value: payments.length.toLocaleString(locale),
      icon: CreditCard,
    },
    {
      href: "/admin/payments",
      label: t.admin.totalCollected,
      value: stats.totalCollected.toLocaleString(locale),
      icon: Wallet,
    },
    {
      href: "/admin/payments",
      label: t.admin.todayPayments,
      value: stats.todayCount.toLocaleString(locale),
      icon: ArrowUpRight,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold tracking-[0.18em] text-gold uppercase">
            {t.admin.welcome}
          </p>
          <h1 className="font-heading mt-1 text-3xl text-forest sm:text-4xl">
            {t.admin.dashboard}
          </h1>
          <p className="mt-2 max-w-2xl text-muted">{t.admin.subtitle}</p>
          <p className="mt-1 text-sm text-muted/80">{dateLabel}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild size="sm">
            <Link href="/admin/members/add">
              <Plus aria-hidden />
              {t.admin.addMember}
            </Link>
          </Button>
          <Button asChild size="sm" variant="secondary">
            <Link href="/cashier">{t.cashier.collect}</Link>
          </Button>
        </div>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              className="rounded-3xl border border-forest/10 bg-ivory p-5 shadow-sm transition-colors hover:border-gold/50 focus-visible:ring-2 focus-visible:ring-gold focus-visible:outline-none"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-xs font-semibold tracking-[0.16em] text-gold uppercase">
                  {t.admin.overview}
                </p>
                <span className="flex size-9 items-center justify-center rounded-xl bg-beige text-forest">
                  <Icon className="size-4" aria-hidden />
                </span>
              </div>
              <p className="mt-4 text-sm text-muted">{item.label}</p>
              <p className="font-heading mt-1 text-3xl text-forest">{item.value}</p>
            </Link>
          );
        })}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <article className="rounded-3xl border border-forest/10 bg-ivory p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-heading text-xl text-forest">{t.admin.roleBreakdown}</h2>
            <Link
              href="/admin/members"
              className="text-sm font-medium text-gold hover:underline focus-visible:outline-none"
            >
              {t.admin.viewAll}
            </Link>
          </div>
          <ul className="mt-5 space-y-4">
            {roles.map((role) => {
              const Icon = roleIcons[role];
              const count = stats.byRole[role];
              const percent = members.length ? Math.round((count / members.length) * 100) : 0;
              return (
                <li key={role}>
                  <div className="mb-1.5 flex items-center justify-between gap-3 text-sm">
                    <span className="inline-flex items-center gap-2 text-forest-deep">
                      <Icon className="size-4 text-gold" aria-hidden />
                      {t.roles[role]}
                    </span>
                    <span className="text-muted">
                      {count} · {percent}%
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-beige">
                    <div
                      className="h-full rounded-full bg-forest"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </article>

        <article className="rounded-3xl border border-forest/10 bg-ivory p-6 shadow-sm">
          <h2 className="font-heading text-xl text-forest">{t.admin.paymentMethods}</h2>
          <ul className="mt-5 space-y-4">
            {(["cash", "transfer", "mobile"] as const).map((method) => {
              const amount = stats.byMethod[method];
              const percent = methodTotal ? Math.round((amount / methodTotal) * 100) : 0;
              return (
                <li key={method}>
                  <div className="mb-1.5 flex items-center justify-between gap-3 text-sm">
                    <span className="text-forest-deep">{t.cashier[method]}</span>
                    <span className="text-muted">
                      {amount.toLocaleString(locale)} · {percent}%
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-beige">
                    <div
                      className="h-full rounded-full bg-gold"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </article>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <article className="rounded-3xl border border-forest/10 bg-ivory p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-heading text-xl text-forest">{t.admin.recentMembers}</h2>
            <Link
              href="/admin/members"
              className="text-sm font-medium text-gold hover:underline"
            >
              {t.admin.viewAll}
            </Link>
          </div>
          {recentMembers.length === 0 ? (
            <p className="mt-6 text-sm text-muted">{t.admin.empty}</p>
          ) : (
            <ul className="mt-5 divide-y divide-forest/10">
              {recentMembers.map((member) => (
                <li key={member.id} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-forest-deep">{member.name}</p>
                    <p className="truncate text-sm text-muted">{member.email}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-beige px-2.5 py-1 text-[11px] font-semibold tracking-wide text-forest uppercase">
                    {t.roles[member.role]}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </article>

        <article className="rounded-3xl border border-forest/10 bg-ivory p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-heading text-xl text-forest">{t.admin.recentPayments}</h2>
            <Link
              href="/admin/payments"
              className="text-sm font-medium text-gold hover:underline"
            >
              {t.admin.viewAll}
            </Link>
          </div>
          {recentPayments.length === 0 ? (
            <p className="mt-6 text-sm text-muted">{t.cashier.empty}</p>
          ) : (
            <ul className="mt-5 divide-y divide-forest/10">
              {recentPayments.map((payment) => (
                <li key={payment.id} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-forest-deep">
                      {payment.memberName}
                    </p>
                    <p className="text-sm text-muted">
                      {payment.fineType === "book"
                        ? t.cashier.fineBook
                        : payment.fineType === "absence"
                          ? t.cashier.fineAbsence
                          : t.cashier[payment.method]}
                    </p>
                  </div>
                  <span className="shrink-0 font-semibold text-forest">
                    {payment.amount.toLocaleString(locale)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </article>
      </section>

      <section className="rounded-3xl border border-forest/10 bg-ivory p-6 shadow-sm">
        <h2 className="font-heading text-xl text-forest">{t.admin.quickActions}</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {[
            { href: "/admin/members/add", label: t.admin.addMember, hint: t.admin.members },
            { href: "/cashier", label: t.cashier.collect, hint: t.admin.payments },
          ].map((action) => (
            <Link
              key={action.href + action.label}
              href={action.href}
              className={cn(
                "rounded-2xl border border-forest/10 px-4 py-4 transition-colors hover:border-gold/50 focus-visible:ring-2 focus-visible:ring-gold focus-visible:outline-none",
              )}
            >
              <p className="font-medium text-forest-deep">{action.label}</p>
              <p className="mt-1 text-sm text-muted">{action.hint}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
