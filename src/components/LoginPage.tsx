"use client";

import { FormEvent, useEffect, useId, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { writeSession } from "@/lib/auth";
import { demoUsers, findDemoUser } from "@/lib/demo-users";
import { useI18n } from "@/lib/i18n/language-provider";
import { images } from "@/lib/images";
import { ROLE_HOME } from "@/lib/roles";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function LoginPage() {
  const { t } = useI18n();
  const reduce = useReducedMotion();
  const emailId = useId();
  const passwordId = useId();
  const rememberId = useId();

  const [index, setIndex] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    form?: string;
  }>({});

  useEffect(() => {
    if (reduce) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % images.login.length);
    }, 7000);
    return () => window.clearInterval(timer);
  }, [reduce]);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next: { email?: string; password?: string; form?: string } = {};
    if (!isValidEmail(email.trim())) next.email = t.login.emailError;
    if (password.length < 8) next.password = t.login.passwordError;
    if (Object.keys(next).length > 0) {
      setErrors(next);
      return;
    }

    const user = findDemoUser(email, password);
    if (!user) {
      setErrors({ form: t.login.invalidCredentials });
      return;
    }

    setErrors({});
    setSubmitting(true);
    writeSession(user.role, remember);
    window.location.assign(ROLE_HOME[user.role]);
  }

  return (
    <main className="relative isolate min-h-full flex-1 overflow-hidden">
      {images.login.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt={i === 0 ? t.login.imageAlt : ""}
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
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-forest-deep/80 via-forest-deep/45 to-forest-deep/30" />

      <div className="relative z-10 grid min-h-[100svh] lg:grid-cols-2">
        <section className="hidden flex-col justify-between px-10 py-12 lg:flex xl:px-16">
          <Logo light surface="dark" priority />
          <div className="max-w-lg">
            <p className="font-heading text-4xl leading-snug text-balance text-ivory xl:text-5xl">
              {t.login.quote}
            </p>
            <p className="mt-5 text-sm tracking-[0.18em] text-gold uppercase">
              {t.login.quoteBy}
            </p>
            <div className="mt-10 flex gap-2">
              {images.login.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`${t.login.imageAlt} ${i + 1}`}
                  aria-current={i === index}
                  className={cn(
                    "relative h-16 w-24 overflow-hidden rounded-xl ring-2 transition-all focus-visible:ring-gold focus-visible:outline-none",
                    i === index
                      ? "ring-gold opacity-100"
                      : "ring-ivory/20 opacity-70 hover:opacity-100",
                  )}
                >
                  <Image src={src} alt="" fill sizes="96px" className="object-cover" />
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center px-5 py-12 sm:px-8">
          <div className="login-panel w-full max-w-[26.5rem] rounded-[2rem] border border-ivory/20 bg-ivory/95 p-7 shadow-[0_28px_80px_-24px_rgba(0,0,0,0.55)] backdrop-blur-md sm:p-9">
            <div className="lg:hidden">
              <Logo surface="light" priority />
            </div>
            <h1 className="font-heading mt-6 text-3xl text-forest lg:mt-0">
              {t.login.title}
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {t.login.subtitle}
            </p>

            <form className="mt-8 space-y-5" onSubmit={onSubmit} noValidate>
              {errors.form ? (
                <p className="rounded-xl bg-red-50 px-3 py-2 text-xs text-red-700" role="alert">
                  {errors.form}
                </p>
              ) : null}
              <div className="space-y-2">
                <Label htmlFor={emailId}>{t.login.email}</Label>
                <Input
                  id={emailId}
                  name="email"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? `${emailId}-error` : undefined}
                />
                {errors.email ? (
                  <p id={`${emailId}-error`} className="text-xs text-red-700">
                    {errors.email}
                  </p>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor={passwordId}>{t.login.password}</Label>
                <div className="relative">
                  <Input
                    id={passwordId}
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="pe-12"
                    aria-invalid={Boolean(errors.password)}
                    aria-describedby={
                      errors.password ? `${passwordId}-error` : undefined
                    }
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute inset-y-0 end-0 flex w-12 items-center justify-center text-muted transition-colors hover:text-forest focus-visible:text-forest focus-visible:outline-none"
                    aria-label={
                      showPassword ? t.login.hidePassword : t.login.showPassword
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" aria-hidden />
                    ) : (
                      <Eye className="size-4" aria-hidden />
                    )}
                  </button>
                </div>
                {errors.password ? (
                  <p id={`${passwordId}-error`} className="text-xs text-red-700">
                    {errors.password}
                  </p>
                ) : null}
              </div>

              <label
                htmlFor={rememberId}
                className="flex cursor-pointer items-center gap-2.5 text-sm text-forest-deep"
              >
                <input
                  id={rememberId}
                  type="checkbox"
                  checked={remember}
                  onChange={(event) => setRemember(event.target.checked)}
                  className="size-4 rounded border-forest/30 accent-gold"
                />
                {t.login.remember}
              </label>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                disabled={submitting}
              >
                {submitting ? t.login.submitting : t.login.submit}
              </Button>
            </form>

            <div className="mt-6 rounded-2xl border border-forest/10 bg-beige/50 p-4">
              <p className="text-[11px] font-semibold tracking-[0.16em] text-forest uppercase">
                {t.login.demoAccounts}
              </p>
              <ul className="mt-3 space-y-2">
                {demoUsers.map((user) => (
                  <li key={user.email}>
                    <button
                      type="button"
                      onClick={() => {
                        setEmail(user.email);
                        setPassword(user.password);
                        setErrors({});
                      }}
                      className="w-full rounded-xl px-2 py-1.5 text-start transition-colors hover:bg-ivory focus-visible:ring-2 focus-visible:ring-gold focus-visible:outline-none"
                    >
                      <span className="block text-xs font-semibold text-forest-deep">
                        {t.roles[user.role]}
                      </span>
                      <span className="block truncate text-[11px] text-muted">
                        {user.email} · {user.password}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <p className="mt-5 text-center text-xs tracking-wide text-muted">
              {site.name}
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
