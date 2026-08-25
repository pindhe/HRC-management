"use client";

import { FormEvent, useState } from "react";
import { Mail, Phone } from "lucide-react";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import {
  FacebookIcon,
  InstagramIcon,
  WhatsAppIcon,
} from "@/components/SocialIcons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useI18n } from "@/lib/i18n/language-provider";
import { site } from "@/lib/site";

type FormState = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

const emptyForm: FormState = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function Contact() {
  const { t } = useI18n();
  const [form, setForm] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");

  function validate(values: FormState) {
    const next: Partial<FormState> = {};
    if (!values.name.trim()) next.name = t.contact.form.nameError;
    if (!isValidEmail(values.email)) next.email = t.contact.form.emailError;
    if (!values.subject.trim()) next.subject = t.contact.form.subjectError;
    if (!values.message.trim()) next.message = t.contact.form.messageError;
    return next;
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setStatus("submitting");
    window.setTimeout(() => {
      setStatus("success");
      setForm(emptyForm);
    }, 600);
  }

  const channels = [
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
    {
      href: site.contact.facebook,
      label: t.contact.facebook,
      value: "Facebook",
      icon: FacebookIcon,
    },
    {
      href: site.contact.instagram,
      label: t.contact.instagram,
      value: "Instagram",
      icon: InstagramIcon,
    },
    {
      href: site.contact.whatsapp,
      label: t.contact.whatsapp,
      value: "WhatsApp",
      icon: WhatsAppIcon,
    },
  ];

  return (
    <section id="contact" className="scroll-mt-24 py-16 sm:py-20 lg:py-28">
      <Container className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <Reveal>
          <SectionHeading title={t.contact.title} subtitle={t.contact.text} />
          <ul className="mt-8 space-y-3">
            {channels.map((channel) => (
              <li key={channel.label}>
                <a
                  href={channel.href}
                  className="flex items-center gap-3 rounded-2xl border border-forest/8 bg-ivory px-4 py-3 text-sm shadow-sm transition-colors hover:border-gold/40 focus-visible:ring-2 focus-visible:ring-gold focus-visible:outline-none"
                >
                  <span className="flex size-10 items-center justify-center rounded-xl bg-beige text-forest">
                    <channel.icon className="size-4" />
                  </span>
                  <span>
                    <span className="block text-xs tracking-wide text-muted uppercase">
                      {channel.label}
                    </span>
                    <span className="font-medium text-forest">{channel.value}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal>
          {status === "success" ? (
            <div
              className="flex min-h-80 items-center rounded-3xl border border-forest/10 bg-beige-warm/60 p-8 text-center"
              role="status"
            >
              <p className="font-heading text-2xl text-forest">{t.contact.form.success}</p>
            </div>
          ) : (
            <form
              onSubmit={onSubmit}
              noValidate
              className="rounded-3xl border border-forest/8 bg-ivory p-6 shadow-sm sm:p-8"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">{t.contact.form.name}</Label>
                  <Input
                    id="name"
                    name="name"
                    autoComplete="name"
                    value={form.name}
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? "name-error" : undefined}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, name: event.target.value }))
                    }
                  />
                  {errors.name ? (
                    <p id="name-error" className="text-xs text-red-700">
                      {errors.name}
                    </p>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">{t.contact.form.email}</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={form.email}
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, email: event.target.value }))
                    }
                  />
                  {errors.email ? (
                    <p id="email-error" className="text-xs text-red-700">
                      {errors.email}
                    </p>
                  ) : null}
                </div>
              </div>
              <div className="mt-5 space-y-2">
                <Label htmlFor="subject">{t.contact.form.subject}</Label>
                <Input
                  id="subject"
                  name="subject"
                  value={form.subject}
                  aria-invalid={Boolean(errors.subject)}
                  aria-describedby={errors.subject ? "subject-error" : undefined}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, subject: event.target.value }))
                  }
                />
                {errors.subject ? (
                  <p id="subject-error" className="text-xs text-red-700">
                    {errors.subject}
                  </p>
                ) : null}
              </div>
              <div className="mt-5 space-y-2">
                <Label htmlFor="message">{t.contact.form.message}</Label>
                <Textarea
                  id="message"
                  name="message"
                  value={form.message}
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={errors.message ? "message-error" : undefined}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, message: event.target.value }))
                  }
                />
                {errors.message ? (
                  <p id="message-error" className="text-xs text-red-700">
                    {errors.message}
                  </p>
                ) : null}
              </div>
              <Button type="submit" size="lg" className="mt-6 w-full sm:w-auto" disabled={status === "submitting"}>
                {status === "submitting" ? t.contact.form.sending : t.contact.form.submit}
              </Button>
            </form>
          )}
        </Reveal>
      </Container>
    </section>
  );
}
