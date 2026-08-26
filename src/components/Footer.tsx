"use client";

import { ArrowUp, Mail, Phone } from "lucide-react";
import { Container } from "@/components/Container";
import { Logo } from "@/components/Logo";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
  WhatsAppIcon,
} from "@/components/SocialIcons";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/language-provider";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

const headingClass =
  "text-[11px] font-semibold tracking-[0.22em] text-gold uppercase";

const navLinkClass =
  "text-sm text-ivory/70 transition-colors duration-200 hover:text-gold focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-gold focus-visible:outline-none";

function externalProps(href: string) {
  if (href.startsWith("http")) {
    return { href, target: "_blank" as const, rel: "noopener noreferrer" };
  }
  return { href };
}

export function Footer() {
  const { t } = useI18n();

  const explore = [
    { href: "#home", label: t.nav.home },
    { href: "#about", label: t.nav.about },
    { href: "#what-we-do", label: t.nav.whatWeDo },
    { href: "#why-hage", label: t.whyHage.title },
    { href: "#join", label: t.nav.join },
    { href: "#contact", label: t.nav.contact },
  ];

  const contacts = [
    {
      href: `mailto:${site.contact.email}`,
      label: t.contact.email,
      value: site.contact.email,
      icon: Mail,
    },
    {
      href: `tel:${site.contact.phone.replace(/\s/g, "")}`,
      label: t.contact.phone,
      value: site.contact.phone,
      icon: Phone,
    },
  ];

  const social = [
    { href: site.contact.facebook, label: t.contact.facebook, icon: FacebookIcon },
    { href: site.contact.instagram, label: t.contact.instagram, icon: InstagramIcon },
    { href: site.contact.whatsapp, label: t.contact.whatsapp, icon: WhatsAppIcon },
    { href: site.contact.linkedin, label: t.footer.linkedin, icon: LinkedInIcon },
  ];

  return (
    <footer className="relative overflow-hidden bg-forest-deep text-ivory">
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/80 to-transparent"
      />
      <div className="pattern-overlay pointer-events-none absolute inset-0 opacity-[0.06]" />

      <Container className="relative py-16 lg:py-20">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-12 lg:gap-10">
          <div className="sm:col-span-2 lg:col-span-5">
            <a
              href="#home"
              aria-label={site.name}
              className="inline-flex rounded-lg focus-visible:ring-2 focus-visible:ring-gold focus-visible:outline-none"
            >
              <Logo light surface="dark" />
            </a>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-ivory/70">
              {t.footer.description}
            </p>
            <Button
              asChild
              variant="gold"
              size="sm"
              className="mt-6 focus-visible:ring-offset-forest-deep"
            >
              <a href="#join">{t.nav.cta}</a>
            </Button>
          </div>

          <nav className="lg:col-span-3" aria-labelledby="footer-explore">
            <h2 id="footer-explore" className={headingClass}>
              {t.footer.explore}
            </h2>
            <ul className="mt-5 space-y-3">
              {explore.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className={navLinkClass}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-4">
            <h2 id="footer-connect" className={headingClass}>
              {t.footer.connect}
            </h2>
            <ul className="mt-5 space-y-3" aria-labelledby="footer-connect">
              {contacts.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="group flex items-center gap-3 rounded-xl focus-visible:ring-2 focus-visible:ring-gold focus-visible:outline-none"
                  >
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-ivory/12 bg-ivory/5 text-gold transition-colors group-hover:border-gold/50 group-hover:bg-gold/10">
                      <item.icon className="size-4" aria-hidden />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[11px] font-medium tracking-[0.16em] text-gold/80 uppercase">
                        {item.label}
                      </span>
                      <span className="block truncate text-sm text-ivory/80 transition-colors group-hover:text-gold">
                        {item.value}
                      </span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>

            <p className={cn(headingClass, "mt-8")}>{t.footer.follow}</p>
            <ul className="mt-4 flex flex-wrap gap-2.5">
              {social.map((item) => (
                <li key={item.label}>
                  <a
                    {...externalProps(item.href)}
                    aria-label={item.label}
                    className="flex size-10 items-center justify-center rounded-full border border-ivory/12 bg-ivory/5 text-ivory/80 transition-all duration-200 hover:border-gold hover:bg-gold hover:text-forest-deep focus-visible:ring-2 focus-visible:ring-gold focus-visible:outline-none"
                  >
                    <item.icon className="size-4" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-ivory/10 pt-6 text-sm text-ivory/50 sm:flex-row sm:items-center sm:justify-between">
          <p>{t.footer.copyright}</p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <p>{t.footer.madeWith}</p>
            <a
              href="#home"
              className="inline-flex items-center gap-1.5 text-ivory/70 transition-colors hover:text-gold focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-gold focus-visible:outline-none"
            >
              {t.footer.backToTop}
              <ArrowUp className="size-3.5" aria-hidden />
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
