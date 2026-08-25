"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/language-provider";

export function HowToJoin() {
  const { t, dir } = useI18n();
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;

  return (
    <section id="join" className="scroll-mt-24 bg-beige-warm/50 py-16 sm:py-20 lg:py-28">
      <Container>
        <Reveal>
          <SectionHeading title={t.howToJoin.title} align="center" />
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {t.howToJoin.steps.map((step, index) => (
            <Reveal key={step.number} delay={index * 0.1}>
              <article className="relative h-full rounded-3xl border border-forest/8 bg-ivory p-8 text-center shadow-sm">
                {index < t.howToJoin.steps.length - 1 ? (
                  <Arrow
                    className="absolute top-10 -end-5 hidden size-8 text-gold/70 md:block rtl:rotate-180"
                    aria-hidden
                  />
                ) : null}
                <p className="text-xs font-semibold tracking-[0.22em] text-gold uppercase">
                  {step.number}
                </p>
                <h3 className="font-heading mt-4 text-2xl text-forest">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{step.text}</p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-10 flex justify-center">
          <Button asChild size="lg">
            <a href="#contact">{t.howToJoin.cta}</a>
          </Button>
        </Reveal>
      </Container>
    </section>
  );
}
