"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Globe,
  LayoutDashboard,
  LogOut,
  Menu,
  Users,
  Wallet,
  X,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { clearSession } from "@/lib/auth";
import { useI18n } from "@/lib/i18n/language-provider";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", key: "dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/members", key: "members", icon: Users, exact: false },
  { href: "/admin/payments", key: "payments", icon: Wallet, exact: false },
  { href: "/home", key: "clubSite", icon: Globe, exact: false },
] as const;

export function AdminShell({ children }: { children: ReactNode }) {
  const { t } = useI18n();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  function logout() {
    clearSession();
    window.location.assign("/");
  }

  const labels = {
    dashboard: t.admin.dashboard,
    members: t.admin.members,
    payments: t.admin.payments,
    clubSite: t.admin.clubSite,
  };

  const pageTitle =
    pathname === "/admin/members"
      ? t.admin.members
      : pathname === "/admin/payments"
        ? t.admin.payments
        : t.admin.dashboard;

  return (
    <div className="flex min-h-full flex-1 bg-page">
      {open ? (
        <button
          type="button"
          aria-label={t.admin.closeMenu}
          className="fixed inset-0 z-40 bg-forest-deep/50 lg:hidden"
          onClick={() => setOpen(false)}
        />
      ) : null}

      <aside
        className={cn(
          "fixed inset-y-0 start-0 z-50 flex w-72 flex-col bg-forest-deep text-ivory transition-transform duration-300",
          open
            ? "translate-x-0"
            : "max-lg:-translate-x-full max-lg:rtl:translate-x-full",
        )}
      >
        <div className="flex items-center justify-between gap-3 border-b border-ivory/10 px-5 py-5">
          <Logo light surface="dark" compact />
          <button
            type="button"
            className="inline-flex size-10 items-center justify-center rounded-full border border-ivory/20 text-ivory lg:hidden"
            onClick={() => setOpen(false)}
            aria-label={t.admin.closeMenu}
          >
            <X className="size-4" />
          </button>
        </div>

        <p className="px-5 pt-5 text-[11px] font-semibold tracking-[0.2em] text-gold uppercase">
          {t.roles.admin}
        </p>

        <nav className="mt-4 flex-1 space-y-1 px-3" aria-label={t.admin.title}>
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
                  "flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-gold focus-visible:outline-none",
                  active
                    ? "bg-gold/20 text-gold"
                    : "text-ivory/75 hover:bg-ivory/10 hover:text-ivory",
                )}
              >
                <Icon className="size-4 shrink-0" aria-hidden />
                {labels[item.key]}
              </Link>
            );
          })}
        </nav>

        <div className="space-y-3 border-t border-ivory/10 p-4">
          <div className="flex items-center justify-between">
            <ThemeToggle light />
            <button
              type="button"
              onClick={logout}
              className="inline-flex h-11 items-center gap-2 rounded-full border border-ivory/20 px-4 text-sm font-semibold text-ivory hover:border-gold hover:text-gold focus-visible:ring-2 focus-visible:ring-gold focus-visible:outline-none"
            >
              <LogOut className="size-4" aria-hidden />
              {t.nav.logout}
            </button>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col lg:ps-72">
        <div className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-forest/10 bg-page/90 px-4 backdrop-blur lg:hidden">
          <button
            type="button"
            className="inline-flex size-10 items-center justify-center rounded-full border border-forest/15 text-forest dark:border-ivory/20 dark:text-ivory"
            onClick={() => setOpen(true)}
            aria-label={t.admin.openMenu}
          >
            <Menu className="size-5" />
          </button>
          <p className="font-heading text-lg text-forest">{pageTitle}</p>
        </div>
        <div className="flex-1 px-5 py-8 sm:px-8 lg:px-10 lg:py-10">{children}</div>
      </div>
    </div>
  );
}
