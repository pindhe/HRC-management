"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  BookOpen,
  ChevronDown,
  LayoutDashboard,
  List,
  LogOut,
  Menu,
  Plus,
  Shield,
  Users,
  Wallet,
  X,
  type LucideIcon,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { clearSession } from "@/lib/auth";
import { useI18n } from "@/lib/i18n/language-provider";
import { cn } from "@/lib/utils";

function NavRow({
  active,
  children,
  className,
  onClick,
  href,
  expanded,
}: {
  active: boolean;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  href?: string;
  expanded?: boolean;
}) {
  const classes = cn(
    "group relative flex h-10 w-full items-center gap-3 rounded-xl px-2.5 text-[13px] font-medium transition-colors duration-200",
    active
      ? "bg-ivory/[0.09] text-ivory"
      : "text-ivory/68 hover:bg-ivory/[0.05] hover:text-ivory",
    className,
  );

  if (href) {
    return (
      <Link
        href={href}
        onClick={onClick}
        className={classes}
        aria-current={active ? "page" : undefined}
      >
        {active ? (
          <span
            className="absolute inset-y-2 start-0 w-[3px] rounded-full bg-gold"
            aria-hidden
          />
        ) : null}
        {children}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={classes}
      aria-expanded={expanded}
    >
      {children}
    </button>
  );
}

function NavIcon({
  icon: Icon,
  active,
}: {
  icon: LucideIcon;
  active: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex size-8 shrink-0 items-center justify-center rounded-lg transition-colors duration-200",
        active
          ? "bg-gold/18 text-gold"
          : "bg-ivory/[0.05] text-ivory/70 group-hover:bg-ivory/[0.08] group-hover:text-ivory",
      )}
    >
      <Icon className="size-4" aria-hidden />
    </span>
  );
}

function SidebarNav({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  const { t } = useI18n();
  const reduce = useReducedMotion();
  const membersActive =
    pathname === "/admin/members" || pathname.startsWith("/admin/members/");
  const addActive = pathname === "/admin/members/add";
  const listActive = pathname === "/admin/members";
  const booksActive =
    pathname === "/admin/books" || pathname.startsWith("/admin/books/");
  const bookAddActive = pathname === "/admin/books/add";
  const bookListActive = pathname === "/admin/books";
  const [membersOpen, setMembersOpen] = useState(membersActive);
  const [booksOpen, setBooksOpen] = useState(booksActive);

  useEffect(() => {
    if (membersActive) setMembersOpen(true);
  }, [membersActive]);

  useEffect(() => {
    if (booksActive) setBooksOpen(true);
  }, [booksActive]);

  return (
    <nav
      className="flex-1 space-y-6 overflow-y-auto px-3 py-5"
      aria-label={t.admin.title}
    >
      <div>
        <p className="mb-2 px-2.5 text-[10px] font-semibold tracking-[0.2em] text-gold/75 uppercase">
          {t.admin.overview}
        </p>
        <NavRow
          href="/admin"
          active={pathname === "/admin"}
          onClick={onNavigate}
        >
          <NavIcon icon={LayoutDashboard} active={pathname === "/admin"} />
          {t.admin.dashboard}
        </NavRow>
      </div>

      <div>
        <p className="mb-2 px-2.5 text-[10px] font-semibold tracking-[0.2em] text-gold/75 uppercase">
          {t.admin.navManage}
        </p>
        <div>
          <NavRow
            active={false}
            expanded={membersOpen}
            onClick={() => setMembersOpen((value) => !value)}
            className={cn(membersActive && "text-ivory")}
          >
            <NavIcon icon={Users} active={membersActive} />
            <span className="flex-1 text-start">{t.admin.members}</span>
            <ChevronDown
              className={cn(
                "size-3.5 shrink-0 text-ivory/45 transition-transform duration-200",
                membersOpen && "rotate-180",
              )}
              aria-hidden
            />
          </NavRow>

          <AnimatePresence initial={false}>
            {membersOpen ? (
              <motion.div
                key="members-sub"
                initial={reduce ? false : { height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={reduce ? undefined : { height: 0, opacity: 0 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <div className="relative ms-[1.4rem] mt-1 space-y-0.5 border-s border-ivory/12 ps-3">
                  <Link
                    href="/admin/members/add"
                    onClick={onNavigate}
                    aria-current={addActive ? "page" : undefined}
                    className={cn(
                      "relative flex h-9 items-center gap-2.5 rounded-lg px-2.5 text-[13px] font-medium transition-colors duration-200",
                      addActive
                        ? "bg-gold/14 text-gold"
                        : "text-ivory/58 hover:bg-ivory/[0.05] hover:text-ivory",
                    )}
                  >
                    {addActive ? (
                      <span
                        className="absolute -start-[calc(0.75rem+3px)] top-1/2 size-1.5 -translate-y-1/2 rounded-full bg-gold"
                        aria-hidden
                      />
                    ) : null}
                    <Plus className="size-3.5 shrink-0" aria-hidden />
                    {t.admin.memberAdd}
                  </Link>
                  <Link
                    href="/admin/members"
                    onClick={onNavigate}
                    aria-current={listActive ? "page" : undefined}
                    className={cn(
                      "relative flex h-9 items-center gap-2.5 rounded-lg px-2.5 text-[13px] font-medium transition-colors duration-200",
                      listActive
                        ? "bg-gold/14 text-gold"
                        : "text-ivory/58 hover:bg-ivory/[0.05] hover:text-ivory",
                    )}
                  >
                    {listActive ? (
                      <span
                        className="absolute -start-[calc(0.75rem+3px)] top-1/2 size-1.5 -translate-y-1/2 rounded-full bg-gold"
                        aria-hidden
                      />
                    ) : null}
                    <List className="size-3.5 shrink-0" aria-hidden />
                    {t.admin.memberList}
                  </Link>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        <div className="mt-1">
          <NavRow
            href="/admin/payments"
            active={pathname === "/admin/payments"}
            onClick={onNavigate}
          >
            <NavIcon
              icon={Wallet}
              active={pathname === "/admin/payments"}
            />
            {t.admin.payments}
          </NavRow>
        </div>

        <div className="mt-1">
          <NavRow
            active={false}
            expanded={booksOpen}
            onClick={() => setBooksOpen((value) => !value)}
            className={cn(booksActive && "text-ivory")}
          >
            <NavIcon icon={BookOpen} active={booksActive} />
            <span className="flex-1 text-start">{t.admin.books}</span>
            <ChevronDown
              className={cn(
                "size-3.5 shrink-0 text-ivory/45 transition-transform duration-200",
                booksOpen && "rotate-180",
              )}
              aria-hidden
            />
          </NavRow>
          <AnimatePresence initial={false}>
            {booksOpen ? (
              <motion.div
                key="books-sub"
                initial={reduce ? false : { height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={reduce ? undefined : { height: 0, opacity: 0 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <div className="relative ms-[1.4rem] mt-1 space-y-0.5 border-s border-ivory/12 ps-3">
                  <Link
                    href="/admin/books/add"
                    onClick={onNavigate}
                    aria-current={bookAddActive ? "page" : undefined}
                    className={cn(
                      "relative flex h-9 items-center gap-2.5 rounded-lg px-2.5 text-[13px] font-medium transition-colors duration-200",
                      bookAddActive
                        ? "bg-gold/14 text-gold"
                        : "text-ivory/58 hover:bg-ivory/[0.05] hover:text-ivory",
                    )}
                  >
                    {bookAddActive ? (
                      <span
                        className="absolute -start-[calc(0.75rem+3px)] top-1/2 size-1.5 -translate-y-1/2 rounded-full bg-gold"
                        aria-hidden
                      />
                    ) : null}
                    <Plus className="size-3.5 shrink-0" aria-hidden />
                    {t.admin.memberAdd}
                  </Link>
                  <Link
                    href="/admin/books"
                    onClick={onNavigate}
                    aria-current={bookListActive ? "page" : undefined}
                    className={cn(
                      "relative flex h-9 items-center gap-2.5 rounded-lg px-2.5 text-[13px] font-medium transition-colors duration-200",
                      bookListActive
                        ? "bg-gold/14 text-gold"
                        : "text-ivory/58 hover:bg-ivory/[0.05] hover:text-ivory",
                    )}
                  >
                    {bookListActive ? (
                      <span
                        className="absolute -start-[calc(0.75rem+3px)] top-1/2 size-1.5 -translate-y-1/2 rounded-full bg-gold"
                        aria-hidden
                      />
                    ) : null}
                    <List className="size-3.5 shrink-0" aria-hidden />
                    {t.admin.memberList}
                  </Link>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
}

function SidebarChrome({
  pathname,
  onClose,
  onNavigate,
}: {
  pathname: string;
  onClose?: () => void;
  onNavigate?: () => void;
}) {
  const { t } = useI18n();

  function logout() {
    clearSession();
    window.location.assign("/");
  }

  return (
    <div className="relative flex h-full min-h-0 flex-col">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-gold/10 to-transparent"
        aria-hidden
      />

      <div className="relative flex items-center justify-between gap-3 px-5 pt-6 pb-4">
        <Logo light surface="dark" />
        {onClose ? (
          <button
            type="button"
            className="inline-flex size-9 items-center justify-center rounded-lg border border-ivory/15 text-ivory/80 hover:bg-ivory/10 md:hidden"
            onClick={onClose}
            aria-label={t.admin.closeMenu}
          >
            <X className="size-4" />
          </button>
        ) : null}
      </div>

      <div
        className="mx-5 h-px bg-gradient-to-r from-transparent via-gold/35 to-transparent"
        aria-hidden
      />

      <div className="relative mt-4 px-5">
        <p className="inline-flex items-center rounded-full border border-gold/25 bg-gold/10 px-2.5 py-0.5 text-[10px] font-semibold tracking-[0.18em] text-gold uppercase">
          {t.roles.admin}
        </p>
      </div>

      <SidebarNav pathname={pathname} onNavigate={onNavigate} />

      <div className="relative mt-auto border-t border-ivory/10 p-3">
        <div className="flex items-center gap-2.5 rounded-xl bg-ivory/[0.05] px-2.5 py-2">
          <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-gold/15 ring-1 ring-gold/30">
            <Shield className="size-4 text-gold" aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-ivory">
              {t.roles.admin}
            </p>
            <p className="truncate text-[11px] text-ivory/45">
              {t.admin.workspace}
            </p>
          </div>
          <ThemeToggle light className="size-9" />
        </div>
        <button
          type="button"
          onClick={logout}
          className="mt-1.5 inline-flex h-9 w-full items-center justify-center gap-2 rounded-xl text-[13px] font-medium text-ivory/60 transition-colors hover:bg-ivory/[0.06] hover:text-ivory focus-visible:ring-2 focus-visible:ring-gold focus-visible:outline-none"
        >
          <LogOut className="size-3.5" aria-hidden />
          {t.nav.logout}
        </button>
      </div>
    </div>
  );
}

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

  const pageTitle =
    pathname === "/admin/members/add"
      ? t.admin.addMember
      : pathname === "/admin/members"
        ? t.admin.members
        : pathname === "/admin/payments"
          ? t.admin.payments
          : pathname === "/admin/books/add"
            ? t.admin.uploadBook
            : pathname === "/admin/books"
              ? t.admin.books
              : t.admin.dashboard;

  return (
    <div className="flex min-h-full flex-1 bg-page">
      <aside className="sticky top-0 hidden h-svh w-[17.5rem] shrink-0 flex-col border-e border-gold/10 bg-[linear-gradient(180deg,#0d2818_0%,#081910_100%)] text-ivory shadow-[12px_0_40px_-24px_rgba(8,25,16,0.9)] md:flex">
        <SidebarChrome pathname={pathname} />
      </aside>

      {open ? (
        <button
          type="button"
          aria-label={t.admin.closeMenu}
          className="fixed inset-0 z-40 bg-forest-deep/55 backdrop-blur-[2px] md:hidden"
          onClick={() => setOpen(false)}
        />
      ) : null}

      <aside
        className={cn(
          "fixed inset-y-0 start-0 z-50 flex w-[17.5rem] flex-col border-e border-gold/10 bg-[linear-gradient(180deg,#0d2818_0%,#081910_100%)] text-ivory shadow-2xl transition-transform duration-300 md:hidden",
          open ? "translate-x-0" : "-translate-x-full rtl:translate-x-full",
        )}
      >
        <SidebarChrome
          pathname={pathname}
          onClose={() => setOpen(false)}
          onNavigate={() => setOpen(false)}
        />
      </aside>

      <div
        className={cn(
          "flex min-w-0 flex-1 flex-col",
          pathname === "/admin/members/add" && "h-svh min-h-0 overflow-hidden",
        )}
      >
        <div className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-forest/10 bg-page/90 px-4 backdrop-blur md:hidden">
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
        <div
          className={
            pathname === "/admin/members/add"
              ? "flex min-h-0 flex-1 flex-col overflow-hidden"
              : "flex-1 px-5 py-8 sm:px-8 lg:px-10 lg:py-10"
          }
        >
          {children}
        </div>
      </div>
    </div>
  );
}
