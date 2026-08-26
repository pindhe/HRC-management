"use client";

import type { ReactNode } from "react";
import { LogOut } from "lucide-react";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { clearSession } from "@/lib/auth";
import { useI18n } from "@/lib/i18n/language-provider";
import type { Role } from "@/lib/roles";

export function AppShell({
  role,
  title,
  children,
}: {
  role: Role;
  title: string;
  children: ReactNode;
}) {
  const { t } = useI18n();

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
            <span className="hidden rounded-full bg-gold/20 px-3 py-1 text-[11px] font-semibold tracking-[0.16em] text-forest uppercase sm:inline-flex dark:text-gold">
              {t.roles[role]}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <p className="hidden text-sm text-muted md:block">{title}</p>
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
      </header>
      <div className="mx-auto w-full max-w-7xl flex-1 px-5 py-10 sm:px-6 lg:px-8">
        {children}
      </div>
    </div>
  );
}
