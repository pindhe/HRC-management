"use client";

import {
  BookOpen,
  Calendar,
  Lightbulb,
  MessageCircle,
  Target,
  TrendingUp,
} from "lucide-react";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { useI18n } from "@/lib/i18n/language-provider";

const icons = [BookOpen, MessageCircle, Lightbulb, Target, Calendar, TrendingUp];

export function WhatWeDo() {
  const { t } = useI18n();

  return (
    <section
      id="what-we-do"
      className="relative scroll-mt-24 overflow-hidden bg-beige-warm/60 py-20 sm:py-24 lg:py-32"
    >
      <div className="pointer-events-none absolute start-[-8%] top-10 h-72 w-72 rounded-full bg-gold/15 blur-3xl" />

      <Container>
        <Reveal>
          <SectionHeading
            title={t.whatWeDo.title}
            subtitle={t.whatWeDo.subtitle}
            align="center"
          />
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {t.whatWeDo.items.map((item, index) => {
            const Icon = icons[index];
            return (
              <Reveal key={item.number} delay={index * 0.06}>
                <article className="group relative h-full overflow-hidden rounded-[1.75rem] border border-forest/8 bg-ivory p-7 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-gold/40 hover:shadow-[0_22px_40px_-24px_rgba(27,67,50,0.45)]">
                  <span className="absolute -end-6 -top-6 size-24 rounded-full bg-gold/10 transition-transform duration-500 group-hover:scale-125" aria-hidden />
                  <div className="relative flex items-start justify-between">
                    <span className="flex size-14 items-center justify-center rounded-2xl bg-forest text-gold shadow-md transition-transform duration-300 group-hover:scale-105">
                      <Icon className="size-6" aria-hidden />
                    </span>
                    <span className="font-heading text-sm tracking-[0.22em] text-gold">
                      {item.number}
                    </span>
                  </div>
                  <h3 className="font-heading relative mt-6 text-xl text-forest">{item.title}</h3>
                  <p className="relative mt-3 text-sm leading-relaxed text-muted">{item.text}</p>
                  <span className="relative mt-6 block h-px w-10 bg-gold/70 transition-all duration-300 group-hover:w-16" aria-hidden />
                </article>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
