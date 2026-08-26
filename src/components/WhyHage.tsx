"use client";

import { Brain, HeartHandshake, Library, Users } from "lucide-react";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { useI18n } from "@/lib/i18n/language-provider";

const pointIcons = [Library, Users, Brain, HeartHandshake];

export function WhyHage() {
  const { t } = useI18n();

  return (
    <section id="why-hage" className="scroll-mt-24 py-16 sm:py-20 lg:py-28">
      <Container className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        <div>
          <Reveal>
            <SectionHeading title={t.whyHage.title} />
          </Reveal>
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {t.whyHage.points.map((point, index) => {
              const Icon = pointIcons[index];
              return (
                <Reveal key={point.title} delay={index * 0.07}>
                  <article className="h-full rounded-3xl border border-forest/8 bg-ivory p-5 shadow-sm">
                    <span className="flex size-10 items-center justify-center rounded-xl bg-beige text-forest">
                      <Icon className="size-5" aria-hidden />
                    </span>
                    <h3 className="font-heading mt-4 text-lg text-forest">{point.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{point.text}</p>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>

        <Reveal delay={0.1}>
          <blockquote className="relative overflow-hidden rounded-[2rem] bg-forest px-8 py-12 text-ivory shadow-[0_30px_60px_-32px_rgba(13,40,24,0.7)] sm:px-12 sm:py-16">
            <div className="pattern-overlay pointer-events-none absolute inset-0 opacity-20" />
            <p className="font-heading relative text-3xl leading-snug font-medium text-balance sm:text-4xl">
              “{t.whyHage.quote}”
            </p>
          </blockquote>
        </Reveal>
      </Container>
    </section>
  );
}
