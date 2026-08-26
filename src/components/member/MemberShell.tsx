"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, CalendarCheck, Home, UserRound } from "lucide-react";
import { useI18n } from "@/lib/i18n/language-provider";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/member", key: "home", icon: Home, exact: true },
  { href: "/member/books", key: "readBook", icon: BookOpen, exact: false },
  { href: "/member/attendance", key: "attendance", icon: CalendarCheck, exact: false },
  { href: "/member/profile", key: "profile", icon: UserRound, exact: false },
] as const;

export function MemberShell({ children }: { children: ReactNode }) {
  const { t } = useI18n();
  const pathname = usePathname();
  const isHome = pathname === "/member";

  const labels = {
    home: t.member.home,
    readBook: t.member.readBook,
    attendance: t.member.attendance,
    profile: t.member.profile,
  };

  return (
    <div className="flex min-h-full flex-1 flex-col bg-page">
      <div
        className={
          isHome
            ? "relative flex min-h-0 flex-1 flex-col overflow-hidden"
            : "mx-auto w-full max-w-3xl flex-1 px-5 py-8 pb-28 sm:px-6"
        }
      >
        {children}
      </div>

      <nav
        aria-label={t.roles.member}
        className={cn(
          "fixed inset-x-0 bottom-0 z-50 pb-[env(safe-area-inset-bottom)]",
          isHome
            ? "border-t border-ivory/20 bg-ivory/45 backdrop-blur-sm dark:border-ivory/10 dark:bg-forest-deep/45"
            : "border-t border-forest/10 bg-ivory/95 backdrop-blur-xl dark:border-ivory/10 dark:bg-forest-deep/95",
        )}
      >
        <div className="mx-auto grid h-[4.25rem] max-w-3xl grid-cols-4">
          {NAV.map((item) => {
            const Icon = item.icon;
            const active = item.exact
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 text-[11px] font-medium tracking-wide transition-colors",
                  active ? "text-gold" : "text-muted hover:text-forest dark:hover:text-ivory",
                )}
              >
                <span
                  className={cn(
                    "inline-flex size-9 items-center justify-center rounded-2xl",
                    active ? "bg-gold/15" : "",
                  )}
                >
                  <Icon className="size-5" aria-hidden />
                </span>
                {labels[item.key]}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
