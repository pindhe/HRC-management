"use client";

import { motion, useReducedMotion } from "framer-motion";
import { BookOpen, Quote, Sparkles } from "lucide-react";
import Image from "next/image";
import { Container } from "@/components/Container";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/language-provider";
import { images } from "@/lib/images";

export function Hero() {
  const { t, dir } = useI18n();
  const reduce = useReducedMotion();
  const offset = dir === "rtl" ? -28 : 28;

  return (
    <section
      id="home"
      className="relative overflow-hidden pt-28 pb-16 sm:pt-32 lg:pt-36 lg:pb-24"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 start-[-10%] h-80 w-80 rounded-full bg-beige/70 blur-3xl" />
        <div className="absolute top-40 end-[-8%] h-72 w-72 rounded-full bg-gold/15 blur-3xl" />
      </div>

      <Container className="relative grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <motion.span
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-beige/50 px-3.5 py-1.5 text-[11px] font-semibold tracking-[0.18em] text-forest uppercase"
          >
            <Sparkles className="size-3.5 text-gold" aria-hidden />
            {t.hero.badge}
          </motion.span>

          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08 }}
            className="font-heading mt-6 max-w-xl text-4xl leading-[1.12] font-semibold text-balance text-forest sm:text-5xl lg:text-6xl"
          >
            {t.hero.title}
          </motion.h1>

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.16 }}
            className="mt-5 max-w-lg text-base leading-relaxed text-muted sm:text-lg"
          >
            {t.hero.text}
          </motion.p>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.24 }}
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <Button asChild size="lg">
              <a href="#join">{t.hero.primary}</a>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <a href="#about">{t.hero.secondary}</a>
            </Button>
          </motion.div>
        </div>

        <motion.div
          initial={reduce ? false : { opacity: 0, x: offset }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.85, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <div className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-gold/30 via-transparent to-forest/20 blur-sm" />
          <div className="relative overflow-hidden rounded-[1.75rem] shadow-[0_30px_60px_-28px_rgba(27,67,50,0.45)]">
            <Image
              src={images.hero}
              alt={t.hero.imageAlt}
              width={1400}
              height={1050}
              priority
              className="aspect-[4/5] w-full object-cover sm:aspect-[5/6] lg:aspect-[4/5]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/35 via-transparent to-transparent" />
          </div>

          <motion.div
            animate={reduce ? undefined : { y: [0, -8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-6 start-4 rounded-2xl border border-ivory/40 bg-ivory/85 px-4 py-3 shadow-lg backdrop-blur-md sm:start-[-1.5rem]"
          >
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-xl bg-forest text-gold">
                <BookOpen className="size-5" aria-hidden />
              </span>
              <div>
                <p className="font-heading text-sm text-forest">{t.hero.floatLabel}</p>
                <p className="text-xs text-muted">{t.hero.floatCommunity}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            animate={reduce ? undefined : { y: [0, 10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
            className="absolute end-3 bottom-8 max-w-[220px] rounded-2xl border border-ivory/50 bg-forest/90 p-4 text-ivory shadow-xl backdrop-blur-md sm:end-[-1rem]"
          >
            <Quote className="mb-2 size-4 text-gold" aria-hidden />
            <p className="font-heading text-sm leading-snug">{t.hero.floatQuote}</p>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
