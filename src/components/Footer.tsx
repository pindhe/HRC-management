"use client";

import { Container } from "@/components/Container";
import { Logo } from "@/components/Logo";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
  WhatsAppIcon,
} from "@/components/SocialIcons";
import { useI18n } from "@/lib/i18n/language-provider";
import { site } from "@/lib/site";

export function Footer() {
  const { t } = useI18n();

  const explore = [
    { href: "#about", label: t.nav.about },
    { href: "#what-we-do", label: t.nav.whatWeDo },
    { href: "#mission", label: t.nav.mission },
    { href: "#activities", label: t.nav.activities },
  ];

  const community = [
    { href: "#join", label: t.nav.cta },
    { href: "#activities", label: t.footer.events },
    { href: "#what-we-do", label: t.footer.discussions },
    { href: "#contact", label: t.nav.contact },
  ];

  const social = [
    { href: site.contact.facebook, label: t.contact.facebook, icon: FacebookIcon },
    { href: site.contact.instagram, label: t.contact.instagram, icon: InstagramIcon },
    { href: site.contact.whatsapp, label: t.contact.whatsapp, icon: WhatsAppIcon },
    { href: site.contact.linkedin, label: t.footer.linkedin, icon: LinkedInIcon },
  ];

  return (
    <footer className="border-t border-forest/10 bg-forest-deep text-ivory">
      <Container className="py-14 lg:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <a
              href="#home"
              aria-label="Hage Reading Club"
              className="inline-flex rounded-lg focus-visible:ring-2 focus-visible:ring-gold focus-visible:outline-none"
            >
              <Logo light />
            </a>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ivory/70">
              {t.footer.description}
            </p>
          </div>

          <div>
            <h2 className="text-xs font-semibold tracking-[0.2em] text-gold uppercase">
              {t.footer.explore}
            </h2>
            <ul className="mt-4 space-y-2 text-sm">
              {explore.map((item) => (
                <li key={item.href + item.label}>
                  <a
                    href={item.href}
                    className="text-ivory/75 transition-colors hover:text-gold focus-visible:rounded focus-visible:ring-2 focus-visible:ring-gold focus-visible:outline-none"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-xs font-semibold tracking-[0.2em] text-gold uppercase">
              {t.footer.community}
            </h2>
            <ul className="mt-4 space-y-2 text-sm">
              {community.map((item) => (
                <li key={item.href + item.label}>
                  <a
                    href={item.href}
                    className="text-ivory/75 transition-colors hover:text-gold focus-visible:rounded focus-visible:ring-2 focus-visible:ring-gold focus-visible:outline-none"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-xs font-semibold tracking-[0.2em] text-gold uppercase">
              {t.footer.follow}
            </h2>
            <ul className="mt-4 space-y-2 text-sm">
              {social.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="inline-flex items-center gap-2 text-ivory/75 transition-colors hover:text-gold focus-visible:rounded focus-visible:ring-2 focus-visible:ring-gold focus-visible:outline-none"
                  >
                    <item.icon />
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-ivory/10 pt-6 text-sm text-ivory/55 sm:flex-row sm:items-center sm:justify-between">
          <p>{t.footer.copyright}</p>
          <p>{t.footer.madeWith}</p>
        </div>
      </Container>
    </footer>
  );
}
