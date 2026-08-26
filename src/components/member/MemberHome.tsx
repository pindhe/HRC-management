"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { BookOpen, CalendarCheck } from "lucide-react";
import { ClubBackdrop } from "@/components/ClubBackdrop";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { readClientEmail } from "@/lib/auth";
import { resolveMemberName } from "@/lib/demo-users";
import { useI18n } from "@/lib/i18n/language-provider";
import { site } from "@/lib/site";

export function MemberHome() {
  const { t, locale } = useI18n();
  const reduce = useReducedMotion();
  const [name, setName] = useState("");
  const tagline = locale === "so" ? site.taglineSo : site.taglineEn;

  useEffect(() => {
    setName(resolveMemberName(readClientEmail()));
  }, []);

  return (
    <section
      id="home"
      className="relative isolate flex min-h-[100dvh] w-full flex-1 items-center justify-center overflow-hidden"
    >
      <ClubBackdrop alt={t.hero.imageAlt} priority alive />

      <span
        aria-hidden
        className="pointer-events-none absolute start-4 top-[4.75rem] size-10 border-s border-t border-gold/70 sm:start-8 sm:top-24 sm:size-14"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute end-4 top-[4.75rem] size-10 border-e border-t border-gold/70 sm:end-8 sm:top-24 sm:size-14"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute start-4 bottom-28 size-10 border-s border-b border-gold/70 sm:start-8 sm:bottom-10 sm:size-14"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute end-4 bottom-28 size-10 border-e border-b border-gold/70 sm:end-8 sm:bottom-10 sm:size-14"
      />

      <header className="absolute inset-x-0 top-0 z-20 flex items-center justify-between gap-4 bg-gradient-to-b from-forest-deep/60 to-transparent px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-4 sm:px-8 sm:py-4">
        <Logo light surface="dark" />
        <Button type="button" variant="gold" size="sm">
          {t.member.pro}
        </Button>
      </header>

      <motion.div
        initial={reduce ? false : { opacity: 0, y: 28, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative z-10 mx-4 mb-24 w-full max-w-xl rounded-[1.75rem] border border-ivory/30 bg-forest-deep/35 px-6 py-8 text-center shadow-[0_24px_60px_-28px_rgba(0,0,0,0.55)] backdrop-blur-sm sm:mx-6 sm:mb-8 sm:px-10 sm:py-10"
        style={{ perspective: "900px" }}
      >
        <p className="text-[11px] font-semibold tracking-[0.38em] text-gold uppercase">
          {t.member.welcome}
        </p>
        <span
          aria-hidden
          className="mx-auto mt-4 block h-px w-16 bg-gradient-to-r from-transparent via-gold to-transparent"
        />
        <motion.h1
          initial={reduce ? false : { opacity: 0, rotateX: 36 }}
          animate={
            reduce
              ? { opacity: 1, rotateX: 6 }
              : { opacity: 1, rotateX: [8, 3, 8], y: [0, -5, 0] }
          }
          transition={
            reduce
              ? { duration: 0.5 }
              : {
                  opacity: { duration: 0.7, delay: 0.15 },
                  rotateX: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.8 },
                  y: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.8 },
                }
          }
          className="welcome-3d font-heading mt-5 text-[1.85rem] leading-tight font-semibold text-balance text-ivory sm:text-5xl"
        >
          {name || t.member.welcome}
        </motion.h1>
        <p className="mt-4 text-xs tracking-[0.22em] text-ivory/75 uppercase">
          {t.roles.member} · {tagline}
        </p>
        <p className="mt-2 text-sm text-ivory/70">{t.member.subtitle}</p>

        <div className="mt-7 grid grid-cols-2 gap-3">
          <Link
            href="/member/books"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-gold/40 bg-gold/90 text-sm font-semibold text-forest-deep shadow-sm hover:bg-gold"
          >
            <BookOpen className="size-4" aria-hidden />
            {t.member.goRead}
          </Link>
          <Link
            href="/member/attendance"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-ivory/30 bg-ivory/10 text-sm font-semibold text-ivory hover:bg-ivory/16"
          >
            <CalendarCheck className="size-4" aria-hidden />
            {t.member.goAttendance}
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
