"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  CalendarCheck,
  LayoutDashboard,
  LogOut,
  Users,
  Wallet,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { clearSession } from "@/lib/auth";
import { useI18n } from "@/lib/i18n/language-provider";
import type { Role } from "@/lib/roles";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/cashier", key: "home", icon: LayoutDashboard, exact: true },
  { href: "/cashier/members", key: "list", icon: Users, exact: false },
  { href: "/cashier/attendance", key: "attendance", icon: CalendarCheck, exact: false },
  { href: "/cashier/pay", key: "pay", icon: Wallet, exact: false },
  { href: "/cashier/reading", key: "reading", icon: BookOpen, exact: false },
] as const;

export function CashierShell({
  role,
  children,
}: {
  role: Role;
  children: ReactNode;
}) {
  const { t } = useI18n();
  const pathname = usePathname();
  const labels = {
    home: t.cashier.home,
    list: t.cashier.list,
    attendance: t.cashier.attendance,
    pay: t.cashier.pay,
    reading: t.cashier.reading,
  };

  function logout() {
    clearSession();
    window.location.assign("/");
  }

  return (
    <div className="flex min-h-full flex-1 flex-col bg-page">
      <header className="sticky top-0 z-40 border-b border-forest/10 bg-ivory/90 backdrop-blur-xl dark:border-ivory/10 dark:bg-forest-deep/90">
        <div className="mx-auto flex h-[4.25rem] w-full max-w-7xl items-center justify-between px-5 sm:px-6 lg:h-[4.75rem] lg:px-8">
          <div className="flex items-center gap-3">
            <Logo surface="auto" />
            <span className="rounded-full bg-gold/20 px-3 py-1 text-[11px] font-semibold tracking-[0.16em] text-forest uppercase dark:text-gold">
              {t.roles[role]}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={logout}
              className="dark:border-ivory/20 dark:bg-ivory/10 dark:text-ivory"
            >
              <LogOut aria-hidden />
              <span className="hidden sm:inline">{t.nav.logout}</span>
            </Button>
          </div>
        </div>
        <nav className="mx-auto flex w-full max-w-7xl gap-1 overflow-x-auto px-3 pb-3 sm:px-6 lg:px-8">
          {NAV.map((item) => {
            const Icon = item.icon;
            const active = item.exact
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "inline-flex shrink-0 items-center gap-2 rounded-full px-3 py-2 text-sm font-medium",
                  active
                    ? "bg-gold/20 text-forest"
                    : "text-muted hover:bg-beige/60 hover:text-forest",
                )}
              >
                <Icon className="size-4" aria-hidden />
                {labels[item.key]}
              </Link>
            );
          })}
        </nav>
      </header>
      <div className="mx-auto w-full max-w-7xl flex-1 px-5 py-8 sm:px-6 lg:px-8">
        {children}
      </div>
    </div>
  );
}
