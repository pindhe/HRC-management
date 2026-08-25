"use client";

import { BookOpen, Lightbulb, Users } from "lucide-react";
import Image from "next/image";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { useI18n } from "@/lib/i18n/language-provider";
import { images } from "@/lib/images";

const highlightIcons = [BookOpen, Lightbulb, Users];

export function About() {
  const { t } = useI18n();

  return (
    <section id="about" className="scroll-mt-24 py-16 sm:py-20 lg:py-28">
      <Container className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <Reveal className="relative">
          <div className="absolute -start-4 -top-4 h-28 w-28 rounded-3xl border border-gold/40" aria-hidden />
          <div className="relative overflow-hidden rounded-[1.75rem] shadow-[0_24px_50px_-28px_rgba(27,67,50,0.4)]">
            <Image
              src={images.about}
              alt={t.about.imageAlt}
              width={1400}
              height={1000}
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
        </Reveal>

        <div>
          <Reveal>
            <SectionHeading title={t.about.title} subtitle={t.about.text} />
          </Reveal>
          <div className="mt-8 space-y-5">
            {t.about.highlights.map((item, index) => {
              const Icon = highlightIcons[index];
              return (
                <Reveal key={item.title} delay={index * 0.08}>
                  <div className="flex gap-4 rounded-2xl border border-forest/8 bg-ivory p-4 shadow-sm">
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-beige text-forest">
                      <Icon className="size-5" aria-hidden />
                    </span>
                    <div>
                      <h3 className="font-heading text-lg text-forest">{item.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-muted">{item.text}</p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
