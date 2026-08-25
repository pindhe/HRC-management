"use client";

import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { useI18n } from "@/lib/i18n/language-provider";

export function ReadingCulture() {
  const { t } = useI18n();

  return (
    <section className="scroll-mt-24 bg-beige-warm/70 py-16 sm:py-20 lg:py-28">
      <Container>
        <Reveal>
          <h2 className="font-heading mx-auto max-w-4xl text-center text-3xl leading-tight font-semibold text-balance text-forest sm:text-4xl lg:text-5xl">
            {t.culture.title}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-center text-base leading-relaxed text-muted sm:text-lg">
            {t.culture.text}
          </p>
        </Reveal>

        <div className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
          {t.culture.stats.map((stat, index) => (
            <Reveal key={stat.label} delay={index * 0.08}>
              <article className="rounded-3xl border border-forest/8 bg-ivory px-5 py-7 text-center shadow-sm">
                <p className="font-heading text-3xl text-gold sm:text-4xl">{stat.number}</p>
                <p className="mt-2 text-sm font-medium tracking-wide text-forest uppercase">
                  {stat.label}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
