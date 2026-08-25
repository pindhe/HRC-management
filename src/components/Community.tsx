"use client";

import Image from "next/image";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { useI18n } from "@/lib/i18n/language-provider";
import { images } from "@/lib/images";

export function Community() {
  const { t } = useI18n();

  return (
    <section className="scroll-mt-24 py-16 sm:py-20 lg:py-28">
      <Container>
        <Reveal>
          <SectionHeading
            title={t.community.title}
            subtitle={t.community.text}
            align="center"
          />
        </Reveal>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:gap-6">
          {t.community.members.map((member, index) => (
            <Reveal key={member.role} delay={index * 0.05}>
              <article className="group overflow-hidden rounded-3xl border border-forest/8 bg-ivory shadow-sm">
                <div className="relative aspect-[3/4] overflow-hidden">
                  <Image
                    src={images.community[index]}
                    alt={member.imageAlt}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/75 via-transparent to-transparent" />
                  <p className="font-heading absolute inset-x-0 bottom-0 p-4 text-lg text-ivory">
                    {member.role}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
