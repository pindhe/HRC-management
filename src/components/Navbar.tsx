"use client";

import { useEffect, useId, useState } from "react";
import { Menu, X } from "lucide-react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/language-provider";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "#home", key: "home" },
  { href: "#about", key: "about" },
  { href: "#what-we-do", key: "whatWeDo" },
  { href: "#mission", key: "mission" },
  { href: "#activities", key: "activities" },
  { href: "#join", key: "join" },
  { href: "#contact", key: "contact" },
] as const;

export function Navbar() {
  const { t } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("#home");
  const menuId = useId();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const ids = NAV_ITEMS.map((item) => item.href.slice(1));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) {
          setActive(`#${visible.target.id}`);
        }
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.25, 0.5] },
    );

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const labels = t.nav;

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-4 focus:z-[80] focus:rounded-full focus:bg-forest focus:px-4 focus:py-2 focus:text-ivory"
      >
        {labels.skipToContent}
      </a>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-300",
          scrolled || open
            ? "border-b border-forest/10 bg-ivory/75 shadow-[0_8px_30px_-18px_rgba(28,25,23,0.35)] backdrop-blur-xl"
            : "bg-transparent",
        )}
      >
        <nav
          className="mx-auto flex h-[4.25rem] w-full max-w-7xl items-center justify-between px-5 sm:px-6 lg:h-[4.75rem] lg:px-8"
          aria-label="Primary"
        >
          <a
            href="#home"
            aria-label="Hage Reading Club"
            className="rounded-lg focus-visible:ring-2 focus-visible:ring-gold focus-visible:outline-none"
          >
            <Logo priority />
          </a>

          <ul className="hidden items-center gap-0.5 xl:flex">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  aria-current={active === item.href ? "page" : undefined}
                  className={cn(
                    "rounded-full px-3 py-2 text-[13px] font-medium transition-colors focus-visible:ring-2 focus-visible:ring-gold focus-visible:outline-none",
                    active === item.href
                      ? "bg-beige/70 text-forest"
                      : "text-muted hover:text-forest",
                  )}
                >
                  {labels[item.key]}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageSwitcher />
            <Button asChild size="sm" className="hidden xl:inline-flex">
              <a href="#join">{labels.cta}</a>
            </Button>
            <button
              type="button"
              className="inline-flex size-11 items-center justify-center rounded-full border border-forest/15 bg-ivory/80 text-forest backdrop-blur xl:hidden focus-visible:ring-2 focus-visible:ring-gold focus-visible:outline-none"
              aria-expanded={open}
              aria-controls={menuId}
              aria-label={open ? labels.closeMenu : labels.openMenu}
              onClick={() => setOpen((value) => !value)}
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </nav>
      </header>

      <div
        id={menuId}
        hidden={!open}
        className={cn(
          "fixed inset-0 z-40 bg-ivory/95 pt-24 backdrop-blur-xl xl:hidden",
          open ? "block" : "hidden",
        )}
        role="dialog"
        aria-modal="true"
        aria-label={labels.openMenu}
      >
        <div className="flex h-full flex-col gap-8 px-6">
          <ul className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="block rounded-2xl px-4 py-3 font-heading text-2xl text-forest transition-colors hover:bg-beige/50 focus-visible:ring-2 focus-visible:ring-gold focus-visible:outline-none"
                  onClick={() => setOpen(false)}
                >
                  {labels[item.key]}
                </a>
              </li>
            ))}
          </ul>
          <Button asChild size="lg" className="w-full">
            <a href="#join" onClick={() => setOpen(false)}>
              {labels.cta}
            </a>
          </Button>
        </div>
      </div>
    </>
  );
}
