"use client";

import Image from "next/image";
import { Container } from "@/components/Container";
import { LogoMark } from "@/components/Logo";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/language-provider";
import { images } from "@/lib/images";

export function CTA() {
  const { t } = useI18n();

  return (
    <section id="join" className="relative scroll-mt-24 overflow-hidden py-20 sm:py-24 lg:py-32">
      <Image
        src={images.cta}
        alt=""
        fill
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-forest-deep/80" />
      <div className="pattern-overlay pointer-events-none absolute inset-0 opacity-20" />

      <Container className="relative">
        <Reveal className="mx-auto max-w-3xl text-center">
          <div className="mx-auto mb-6 w-fit rounded-full bg-gold/20 p-1 ring-1 ring-gold/35">
            <LogoMark size="lg" surface="dark" />
          </div>
          <h2 className="font-heading text-3xl leading-tight font-semibold text-balance text-ivory sm:text-4xl lg:text-5xl">
            {t.cta.title}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-ivory/80 sm:text-lg">
            {t.cta.text}
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild variant="gold" size="lg">
              <a href="#contact">{t.cta.primary}</a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href="#about">{t.cta.secondary}</a>
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
