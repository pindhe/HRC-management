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
      className="scroll-mt-24 bg-beige-warm/60 py-16 sm:py-20 lg:py-28"
    >
      <Container>
        <Reveal>
          <SectionHeading
            title={t.whatWeDo.title}
            subtitle={t.whatWeDo.subtitle}
            align="center"
          />
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {t.whatWeDo.items.map((item, index) => {
            const Icon = icons[index];
            return (
              <Reveal key={item.number} delay={index * 0.06}>
                <article className="group h-full rounded-3xl border border-forest/8 bg-ivory p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <div className="flex items-start justify-between">
                    <span className="flex size-12 items-center justify-center rounded-2xl bg-forest text-gold transition-transform duration-300 group-hover:scale-105">
                      <Icon className="size-5" aria-hidden />
                    </span>
                    <span className="font-heading text-sm tracking-widest text-gold">
                      {item.number}
                    </span>
                  </div>
                  <h3 className="font-heading mt-5 text-xl text-forest">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{item.text}</p>
                </article>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
