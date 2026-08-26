"use client";

import { FormEvent, useEffect, useId, useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  addMember,
  getMembers,
  getPayments,
  type ClubMember,
} from "@/lib/club-store";
import { useI18n } from "@/lib/i18n/language-provider";
import { roles, type Role } from "@/lib/roles";

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function AdminDashboard() {
  const { t } = useI18n();
  const nameId = useId();
  const emailId = useId();
  const roleId = useId();

  const [members, setMembers] = useState<ClubMember[]>([]);
  const [paymentsCount, setPaymentsCount] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("member");
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

  useEffect(() => {
    setMembers(getMembers());
    setPaymentsCount(getPayments().length);
  }, []);

  const counts = useMemo(
    () => [
      { label: t.admin.countMembers, value: members.length },
      { label: t.admin.countPayments, value: paymentsCount },
    ],
    [members.length, paymentsCount, t.admin.countMembers, t.admin.countPayments],
  );

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next: { name?: string; email?: string } = {};
    if (!name.trim()) next.name = t.admin.nameError;
    if (!isValidEmail(email.trim())) next.email = t.admin.emailError;
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    addMember({ name: name.trim(), email: email.trim().toLowerCase(), role });
    setMembers(getMembers());
    setName("");
    setEmail("");
    setRole("member");
    setErrors({});
  }

  return (
    <AppShell role="admin" title={t.admin.title}>
      <div className="max-w-3xl">
        <h1 className="font-heading text-3xl text-forest sm:text-4xl">
          {t.admin.title}
        </h1>
        <p className="mt-2 text-muted">{t.admin.subtitle}</p>
      </div>

      <section className="mt-8 grid gap-4 sm:grid-cols-2">
        {counts.map((item) => (
          <article
            key={item.label}
            className="rounded-3xl border border-forest/10 bg-ivory p-5 shadow-sm"
          >
            <p className="text-xs font-semibold tracking-[0.18em] text-gold uppercase">
              {t.admin.overview}
            </p>
            <p className="mt-3 text-sm text-muted">{item.label}</p>
            <p className="font-heading mt-1 text-3xl text-forest">{item.value}</p>
          </article>
        ))}
      </section>

      <section className="mt-10 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <form
          onSubmit={onSubmit}
          className="space-y-4 rounded-3xl border border-forest/10 bg-ivory p-6 shadow-sm"
          noValidate
        >
          <h2 className="font-heading text-xl text-forest">{t.admin.addMember}</h2>
          <div className="space-y-2">
            <Label htmlFor={nameId}>{t.admin.name}</Label>
            <Input
              id={nameId}
              value={name}
              onChange={(event) => setName(event.target.value)}
              aria-invalid={Boolean(errors.name)}
            />
            {errors.name ? (
              <p className="text-xs text-red-700">{errors.name}</p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor={emailId}>{t.admin.email}</Label>
            <Input
              id={emailId}
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              aria-invalid={Boolean(errors.email)}
            />
            {errors.email ? (
              <p className="text-xs text-red-700">{errors.email}</p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor={roleId}>{t.admin.role}</Label>
            <select
              id={roleId}
              value={role}
              onChange={(event) => setRole(event.target.value as Role)}
              className="flex h-12 w-full rounded-xl border border-forest/15 bg-ivory px-4 text-base text-charcoal shadow-sm focus-visible:border-forest focus-visible:ring-2 focus-visible:ring-gold/40 focus-visible:outline-none dark:bg-[#102018] dark:text-[#f4ede1] dark:border-ivory/16"
            >
              {roles.map((value) => (
                <option key={value} value={value}>
                  {t.roles[value]}
                </option>
              ))}
            </select>
          </div>
          <Button type="submit" variant="primary" className="w-full">
            {t.admin.save}
          </Button>
        </form>

        <div className="rounded-3xl border border-forest/10 bg-ivory p-6 shadow-sm">
          <h2 className="font-heading text-xl text-forest">{t.admin.members}</h2>
          {members.length === 0 ? (
            <p className="mt-6 text-sm text-muted">{t.admin.empty}</p>
          ) : (
            <ul className="mt-5 divide-y divide-forest/10">
              {members.map((member) => (
                <li key={member.id} className="flex items-start justify-between gap-4 py-3">
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
        </div>
      </section>
    </AppShell>
  );
}
