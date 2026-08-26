"use client";

import { BookOpen, Lightbulb, Users } from "lucide-react";
import Image from "next/image";
import { Container } from "@/components/Container";
import { LogoMark } from "@/components/Logo";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { useI18n } from "@/lib/i18n/language-provider";
import { images } from "@/lib/images";
import { useTheme } from "@/lib/theme";

const highlightIcons = [BookOpen, Lightbulb, Users];

export function About() {
  const { t } = useI18n();
  const { theme } = useTheme();

  return (
    <section id="about" className="relative scroll-mt-24 overflow-hidden py-20 sm:py-24 lg:py-32">
      <div className="pointer-events-none absolute -end-20 top-10 h-64 w-64 rounded-full bg-gold/10 blur-3xl" />

      <Container className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <Reveal className="relative mx-auto w-full max-w-lg lg:max-w-none">
          <div className="absolute -start-3 -top-3 h-24 w-24 rounded-3xl border border-gold/50 sm:-start-5 sm:-top-5 sm:h-32 sm:w-32" aria-hidden />
          <div className="relative overflow-hidden rounded-[2rem] shadow-[0_30px_60px_-28px_rgba(27,67,50,0.45)]">
            <Image
              src={images.about}
              alt={t.about.imageAlt}
              width={1400}
              height={1000}
              className="aspect-[4/3] w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/25 via-transparent to-transparent" />
          </div>
          <div className="absolute -end-2 -bottom-8 hidden w-[46%] overflow-hidden rounded-3xl border-4 border-ivory shadow-xl sm:block dark:border-page">
            <Image
              src={images.aboutBooks}
              alt=""
              width={900}
              height={700}
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
          <div className="absolute start-4 bottom-4 rounded-2xl bg-ivory/90 p-2 shadow-lg backdrop-blur-md sm:start-6 sm:bottom-6">
            <LogoMark size="sm" surface={theme === "dark" ? "dark" : "light"} />
          </div>
        </Reveal>

        <div className="lg:ps-4">
          <Reveal>
            <p className="mb-3 text-xs font-semibold tracking-[0.22em] text-gold uppercase">
              Hage
            </p>
            <SectionHeading title={t.about.title} subtitle={t.about.text} />
          </Reveal>
          <div className="mt-10 space-y-4">
            {t.about.highlights.map((item, index) => {
              const Icon = highlightIcons[index];
              return (
                <Reveal key={item.title} delay={index * 0.08}>
                  <article className="group flex gap-4 rounded-2xl border border-forest/8 bg-ivory p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-gold/35 hover:shadow-md">
                    <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-forest text-gold transition-transform duration-300 group-hover:scale-105">
                      <Icon className="size-5" aria-hidden />
                    </span>
                    <div>
                      <p className="font-heading text-[11px] tracking-[0.2em] text-gold">
                        {String(index + 1).padStart(2, "0")}
                      </p>
                      <h3 className="font-heading text-lg text-forest">{item.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-muted">{item.text}</p>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
