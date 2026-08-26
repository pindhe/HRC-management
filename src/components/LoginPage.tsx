"use client";

import { FormEvent, useId, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { ClubBackdrop } from "@/components/ClubBackdrop";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { writeSession } from "@/lib/auth";
import { findDemoUser } from "@/lib/demo-users";
import { useI18n } from "@/lib/i18n/language-provider";
import { ROLE_HOME } from "@/lib/roles";

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function LoginPage() {
  const { t } = useI18n();
  const emailId = useId();
  const passwordId = useId();
  const rememberId = useId();

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
    writeSession(user.role, remember, user.email);
    window.location.assign(ROLE_HOME[user.role]);
  }

  return (
    <main className="relative isolate min-h-full flex-1 overflow-hidden">
      <ClubBackdrop alt={t.login.imageAlt} priority strength="medium" />

      <div className="relative z-10 grid min-h-[100svh] lg:grid-cols-2">
        <section className="hidden min-h-[100svh] flex-col items-center px-10 py-10 text-center lg:flex xl:px-16">
          <Logo light surface="dark" stacked priority />
          <div className="flex flex-1 flex-col items-center justify-center">
            <p className="font-heading max-w-xl text-4xl leading-snug text-balance text-ivory drop-shadow-[0_8px_24px_rgba(13,40,24,0.7)] xl:text-5xl">
              {t.login.quote}
            </p>
            <p className="mt-5 text-sm tracking-[0.18em] text-gold uppercase">
              {t.login.quoteBy}
            </p>
          </div>
          <p className="text-xs tracking-wide text-ivory/55">{t.footer.copyright}</p>
        </section>

        <section className="flex items-center justify-center px-5 py-12 sm:px-8">
          <div className="login-panel w-full max-w-[26.5rem] rounded-[2rem] border border-ivory/35 bg-ivory/40 p-7 shadow-[0_20px_50px_-24px_rgba(0,0,0,0.45)] backdrop-blur-sm sm:p-9">
            <div className="flex justify-center lg:hidden">
              <Logo surface="light" stacked priority />
            </div>
            <h1 className="font-heading mt-6 text-center text-3xl text-forest lg:mt-0 lg:text-start">
              {t.login.title}
            </h1>
            <p className="mt-2 text-center text-sm leading-relaxed text-muted lg:text-start">
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

            <p className="mt-5 text-center text-xs tracking-wide text-muted">
              {t.footer.copyright}
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
