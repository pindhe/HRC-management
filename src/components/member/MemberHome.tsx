"use client";

import { useEffect, useState } from "react";
import { ClubBackdrop } from "@/components/ClubBackdrop";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { readClientEmail } from "@/lib/auth";
import { resolveMemberName } from "@/lib/demo-users";
import { useI18n } from "@/lib/i18n/language-provider";

export function MemberHome() {
  const { t } = useI18n();
  const [name, setName] = useState("");

  useEffect(() => {
    setName(resolveMemberName(readClientEmail()));
  }, []);

  return (
    <section
      id="home"
      className="relative isolate flex h-full min-h-0 flex-1 items-center justify-center overflow-hidden"
    >
      <ClubBackdrop alt={t.hero.imageAlt} priority />

      <header className="absolute inset-x-0 top-0 z-20 flex items-center justify-between gap-4 bg-gradient-to-b from-forest-deep/50 to-transparent px-5 py-4 sm:px-8">
        <Logo light surface="dark" />
        <Button type="button" variant="gold" size="sm">
          {t.member.pro}
        </Button>
      </header>

      <h1 className="font-heading relative z-10 max-w-4xl px-6 text-center text-4xl leading-tight font-semibold text-balance text-ivory drop-shadow-[0_8px_28px_rgba(13,40,24,0.75)] sm:text-6xl lg:text-7xl">
        {name ? t.member.welcomeName.replace("{name}", name) : t.member.welcome}
      </h1>
    </section>
  );
}
