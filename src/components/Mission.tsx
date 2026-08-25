"use client";

import { BookOpen, GraduationCap, Share2 } from "lucide-react";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { useI18n } from "@/lib/i18n/language-provider";

const pillarIcons = [BookOpen, GraduationCap, Share2];

export function Mission() {
  const { t } = useI18n();

  return (
    <section
      id="mission"
      className="relative scroll-mt-24 overflow-hidden bg-forest-deep py-16 text-ivory sm:py-20 lg:py-28"
    >
      <div className="pattern-overlay pointer-events-none absolute inset-0 opacity-25" />
      <div className="pointer-events-none absolute -top-24 end-[-10%] h-72 w-72 rounded-full bg-gold/15 blur-3xl" />

      <Container className="relative">
        <Reveal>
          <SectionHeading
            title={t.mission.title}
            subtitle={t.mission.text}
            align="center"
            light
          />
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {t.mission.pillars.map((pillar, index) => {
            const Icon = pillarIcons[index];
            return (
              <Reveal key={pillar.title} delay={index * 0.1}>
                <article className="h-full rounded-3xl border border-ivory/10 bg-ivory/5 p-8 text-center backdrop-blur-sm">
                  <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-gold/15 text-gold">
                    <Icon className="size-6" aria-hidden />
                  </span>
                  <h3 className="font-heading mt-5 text-2xl tracking-[0.18em] uppercase">
                    {pillar.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-ivory/75">{pillar.text}</p>
                </article>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
