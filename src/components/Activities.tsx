"use client";

import {
  BookOpen,
  CalendarDays,
  Flag,
  MessagesSquare,
  UsersRound,
} from "lucide-react";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { useI18n } from "@/lib/i18n/language-provider";

const activityIcons = [BookOpen, MessagesSquare, CalendarDays, UsersRound, Flag];

export function Activities() {
  const { t } = useI18n();

  return (
    <section id="activities" className="scroll-mt-24 py-16 sm:py-20 lg:py-28">
      <Container>
        <Reveal>
          <SectionHeading title={t.activities.title} align="center" />
        </Reveal>

        <ol className="relative mx-auto mt-14 max-w-3xl">
          <span
            className="absolute start-[1.35rem] top-3 bottom-3 w-px bg-gold/40 sm:start-1/2 sm:-translate-x-px rtl:sm:translate-x-px"
            aria-hidden
          />
          {t.activities.items.map((item, index) => {
            const Icon = activityIcons[index];
            const left = index % 2 === 0;
            return (
              <li key={item.title} className="relative mb-8 last:mb-0 sm:mb-12">
                <Reveal>
                  <div
                    className={`flex gap-5 sm:grid sm:grid-cols-2 sm:gap-12 ${
                      left ? "" : "sm:[&>article]:col-start-2"
                    }`}
                  >
                    <span className="relative z-10 mt-1 flex size-11 shrink-0 items-center justify-center rounded-full border-4 border-ivory bg-forest text-gold sm:absolute sm:start-1/2 sm:top-4 sm:-translate-x-1/2 rtl:sm:translate-x-1/2">
                      <Icon className="size-4" aria-hidden />
                    </span>
                    <article className="rounded-3xl border border-forest/8 bg-ivory p-5 shadow-sm sm:p-6">
                      <p className="font-heading text-xs tracking-[0.2em] text-gold">
                        {String(index + 1).padStart(2, "0")}
                      </p>
                      <h3 className="font-heading mt-2 text-xl text-forest">{item.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted">{item.text}</p>
                    </article>
                  </div>
                </Reveal>
              </li>
            );
          })}
        </ol>
      </Container>
    </section>
  );
}
