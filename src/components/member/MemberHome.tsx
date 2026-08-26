"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import Image from "next/image";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { readClientEmail } from "@/lib/auth";
import { resolveMemberName } from "@/lib/demo-users";
import { useI18n } from "@/lib/i18n/language-provider";
import { images } from "@/lib/images";
import { cn } from "@/lib/utils";

export function MemberHome() {
  const { t } = useI18n();
  const reduce = useReducedMotion();
  const [name, setName] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setName(resolveMemberName(readClientEmail()));
  }, []);

  useEffect(() => {
    if (reduce) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % images.login.length);
    }, 7000);
    return () => window.clearInterval(timer);
  }, [reduce]);

  return (
    <section
      id="home"
      className="relative isolate flex h-full min-h-0 flex-1 items-center justify-center overflow-hidden"
    >
      {images.login.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt={i === 0 ? t.hero.imageAlt : ""}
          fill
          priority={i === 0}
          sizes="100vw"
          className={cn(
            "object-cover object-center transition-opacity duration-[1400ms] ease-in-out",
            i === index ? "opacity-100" : "opacity-0",
          )}
        />
      ))}
      <div className="absolute inset-0 bg-forest-deep/72" />
      <div className="pattern-overlay pointer-events-none absolute inset-0 opacity-25" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-forest-deep/40 via-forest-deep/50 to-forest-deep/80" />

      <header className="absolute inset-x-0 top-0 z-20 flex items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <Logo light surface="dark" />
        <Button type="button" variant="gold" size="sm">
          {t.member.pro}
        </Button>
      </header>

      <h1 className="font-heading relative z-10 max-w-4xl px-6 text-center text-4xl leading-tight font-semibold text-balance text-ivory sm:text-6xl lg:text-7xl">
        {name ? t.member.welcomeName.replace("{name}", name) : t.member.welcome}
      </h1>
    </section>
  );
}
