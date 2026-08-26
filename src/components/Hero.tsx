"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { ClubBackdrop } from "@/components/ClubBackdrop";
import { Container } from "@/components/Container";
import { LogoMark } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/language-provider";

export function Hero() {
  const { t } = useI18n();
  const reduce = useReducedMotion();

  return (
    <section
      id="home"
      className="relative isolate flex min-h-[100svh] items-center overflow-hidden"
    >
      <ClubBackdrop alt={t.hero.imageAlt} priority strength="medium" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-ivory to-transparent" />

      <Container className="relative z-10 flex w-full flex-col items-center px-5 py-28 text-center sm:py-32">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="mb-7 rounded-full bg-gold/25 p-1 shadow-[0_18px_40px_-18px_rgba(25,97,194,0.8)] ring-1 ring-gold/40"
        >
          <LogoMark size="lg" priority surface="dark" />
        </motion.div>

        <motion.span
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-ivory/10 px-3.5 py-1.5 text-[11px] font-semibold tracking-[0.18em] text-gold uppercase backdrop-blur-sm"
        >
          <Sparkles className="size-3.5" aria-hidden />
          {t.hero.badge}
        </motion.span>

        <motion.h1
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-heading mt-6 max-w-4xl text-4xl leading-[1.12] font-semibold text-balance text-ivory drop-shadow-[0_8px_24px_rgba(13,40,24,0.7)] sm:text-5xl lg:text-6xl"
        >
          {t.hero.title}
        </motion.h1>

        <motion.p
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.18 }}
          className="mt-5 max-w-2xl text-base leading-relaxed text-ivory/85 sm:text-lg"
        >
          {t.hero.text}
        </motion.p>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.26 }}
          className="mt-8 flex w-full flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <Button asChild variant="gold" size="lg">
            <a href="#join">{t.hero.primary}</a>
          </Button>
          <Button asChild variant="outline" size="lg">
            <a href="#about">{t.hero.secondary}</a>
          </Button>
        </motion.div>
      </Container>
    </section>
  );
}
