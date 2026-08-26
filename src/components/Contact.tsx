"use client";

import { FormEvent, useState } from "react";
import { Mail, Phone, Send } from "lucide-react";
import { Container } from "@/components/Container";
import { LogoMark } from "@/components/Logo";
import { Reveal } from "@/components/Reveal";
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
    <section id="contact" className="scroll-mt-24 py-20 sm:py-24 lg:py-32">
      <Container>
        <div className="overflow-hidden rounded-[2rem] border border-forest/8 shadow-[0_30px_60px_-32px_rgba(27,67,50,0.35)] lg:grid lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal className="relative bg-forest-deep px-7 py-10 text-ivory sm:px-10 sm:py-12">
            <div className="pattern-overlay pointer-events-none absolute inset-0 opacity-20" />
            <div className="relative">
              <LogoMark size="md" surface="dark" />
              <h2 className="font-heading mt-6 text-3xl font-semibold text-balance sm:text-4xl">
                {t.contact.title}
              </h2>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-ivory/80 sm:text-base">
                {t.contact.text}
              </p>
              <ul className="mt-8 space-y-3">
                {channels.map((channel) => (
                  <li key={channel.label}>
                    <a
                      href={channel.href}
                      className="flex items-center gap-3 rounded-2xl border border-ivory/10 bg-ivory/8 px-4 py-3 text-sm backdrop-blur-sm transition-colors hover:border-gold/40 hover:bg-ivory/12 focus-visible:ring-2 focus-visible:ring-gold focus-visible:outline-none"
                    >
                      <span className="flex size-10 items-center justify-center rounded-xl bg-gold/15 text-gold">
                        <channel.icon className="size-4" />
                      </span>
                      <span>
                        <span className="block text-xs tracking-wide text-ivory/55 uppercase">
                          {channel.label}
                        </span>
                        <span className="font-medium text-ivory">{channel.value}</span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal className="bg-ivory p-7 sm:p-10">
            {status === "success" ? (
              <div
                className="flex min-h-80 items-center justify-center text-center"
                role="status"
              >
                <p className="font-heading max-w-sm text-2xl text-forest">
                  {t.contact.form.success}
                </p>
              </div>
            ) : (
              <form onSubmit={onSubmit} noValidate>
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
                <Button
                  type="submit"
                  size="lg"
                  variant="gold"
                  className="mt-7 w-full sm:w-auto"
                  disabled={status === "submitting"}
                >
                  <Send aria-hidden />
                  {status === "submitting" ? t.contact.form.sending : t.contact.form.submit}
                </Button>
              </form>
            )}
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
