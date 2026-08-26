"use client";

import { FormEvent, useId, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Briefcase,
  Check,
  Eye,
  EyeOff,
  Shield,
  UserRound,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  addMember,
  memberEmailTaken,
  type MemberGender,
} from "@/lib/club-store";
import { isReservedEmail } from "@/lib/demo-users";
import { useI18n } from "@/lib/i18n/language-provider";
import { roles, type Role } from "@/lib/roles";
import { cn } from "@/lib/utils";

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidPhone(value: string) {
  const digits = value.replace(/\D/g, "");
  return digits.length >= 7 && /^\+?[0-9][0-9\s\-()]{6,}$/.test(value.trim());
}

const STEPS = [1, 2, 3] as const;
type Step = (typeof STEPS)[number];

const roleIcons = {
  admin: Shield,
  member: UserRound,
  cashier: Wallet,
} as const;

const roleHints = {
  admin: "adminHint",
  member: "memberHint",
  cashier: "cashierHint",
} as const;

type FieldKey =
  | "first"
  | "last"
  | "gender"
  | "phone"
  | "location"
  | "job"
  | "email"
  | "password"
  | "confirm";

type ProfileErrors = Partial<Record<FieldKey, string>>;

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-xs text-red-700 dark:text-red-400">{message}</p>;
}

export function AdminMemberCreate() {
  const { t } = useI18n();
  const router = useRouter();
  const formId = useId();

  const [step, setStep] = useState<Step>(1);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState<MemberGender | "">("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [address, setAddress] = useState("");
  const [isEmployee, setIsEmployee] = useState(false);
  const [occupation, setOccupation] = useState("");
  const [workplace, setWorkplace] = useState("");
  const [notes, setNotes] = useState("");
  const [role, setRole] = useState<Role>("member");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<ProfileErrors>({});

  const stepLabels = [t.admin.stepProfile, t.admin.stepAccount, t.admin.stepDone];
  const genders: { value: MemberGender; label: string }[] = [
    { value: "male", label: t.admin.genderMale },
    { value: "female", label: t.admin.genderFemale },
  ];

  function fieldId(key: FieldKey) {
    return `${formId}-${key}`;
  }

  function showErrors(next: ProfileErrors) {
    setErrors(next);
    const first = (Object.keys(next) as FieldKey[])[0];
    if (!first) return;
    requestAnimationFrame(() => {
      document.getElementById(fieldId(first))?.focus();
      document.getElementById(fieldId(first))?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    });
  }

  function goNextFromProfile() {
    const next: ProfileErrors = {};
    if (!firstName.trim()) next.first = t.admin.firstNameError;
    if (!lastName.trim()) next.last = t.admin.lastNameError;
    if (gender !== "male" && gender !== "female") next.gender = t.admin.genderError;
    if (!isValidPhone(phone)) next.phone = t.admin.phoneError;
    if (!location.trim()) next.location = t.admin.locationError;
    if (isEmployee && !occupation.trim()) next.job = t.admin.occupationError;
    if (Object.keys(next).length > 0) {
      showErrors(next);
      return;
    }
    setErrors({});
    setStep(2);
  }

  function createMember() {
    const next: ProfileErrors = {};
    if (!isValidEmail(email.trim())) next.email = t.admin.emailError;
    if (password.length < 8) next.password = t.admin.passwordError;
    if (password !== confirmPassword) next.confirm = t.admin.confirmError;
    if (!next.email && (memberEmailTaken(email) || isReservedEmail(email))) {
      next.email = t.admin.duplicateEmail;
    }
    if (Object.keys(next).length > 0) {
      showErrors(next);
      return;
    }

    const first = firstName.trim();
    const last = lastName.trim();
    addMember({
      name: `${first} ${last}`.trim(),
      firstName: first,
      lastName: last,
      phone: phone.trim(),
      location: location.trim(),
      address: address.trim(),
      isEmployee,
      occupation: isEmployee ? occupation.trim() : "",
      workplace: isEmployee ? workplace.trim() : "",
      gender,
      notes: notes.trim(),
      email: email.trim().toLowerCase(),
      password,
      role,
    });
    router.push("/admin/members");
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (step === 1) goNextFromProfile();
    else if (step === 2) createMember();
  }

  const inputError = "aria-invalid:border-red-500 aria-invalid:ring-red-400/30";

  return (
    <form
      onSubmit={onSubmit}
      className="flex h-full min-h-0 flex-1 flex-col bg-page"
      noValidate
    >
      <header className="shrink-0 border-b border-forest/10 bg-ivory px-5 py-5 sm:px-8 lg:px-10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] text-gold uppercase">
              {t.admin.members}
            </p>
            <h1 className="font-heading mt-1 text-3xl text-forest sm:text-4xl">
              {t.admin.addMember}
            </h1>
          </div>
          <p className="text-sm font-semibold text-gold">
            {t.admin.stepOf.replace("{current}", String(step)).replace("{total}", "3")}
          </p>
        </div>

        <ol className="mt-6 grid grid-cols-3 gap-3 sm:gap-6">
          {STEPS.map((value, index) => {
            const done = step > value;
            const current = step === value;
            return (
              <li key={value}>
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold sm:size-10",
                      done || current ? "bg-forest text-ivory" : "bg-beige text-muted",
                    )}
                  >
                    {done ? <Check className="size-4" aria-hidden /> : value}
                  </span>
                  <span
                    className={cn(
                      "hidden font-medium sm:block",
                      current ? "text-forest" : "text-muted",
                    )}
                  >
                    {stepLabels[index]}
                  </span>
                </div>
                <div
                  className={cn(
                    "mt-3 h-1.5 rounded-full",
                    done || current ? "bg-gold" : "bg-beige",
                  )}
                />
              </li>
            );
          })}
        </ol>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-6 sm:px-8 lg:px-10">
        {step === 1 ? (
          <div className="mx-auto grid w-full max-w-7xl gap-5 lg:grid-cols-2 lg:items-start">
            <div className="flex flex-col gap-5">
              <section className="rounded-3xl border border-forest/10 bg-ivory p-5 shadow-sm sm:p-6">
                <h2 className="font-heading text-xl text-forest">
                  {t.admin.profilePersonal}
                </h2>
                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor={fieldId("first")}>{t.admin.firstName}</Label>
                    <Input
                      id={fieldId("first")}
                      autoComplete="given-name"
                      value={firstName}
                      onChange={(event) => setFirstName(event.target.value)}
                      aria-invalid={Boolean(errors.first)}
                      className={cn("h-12", inputError)}
                    />
                    <FieldError message={errors.first} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={fieldId("last")}>{t.admin.lastName}</Label>
                    <Input
                      id={fieldId("last")}
                      autoComplete="family-name"
                      value={lastName}
                      onChange={(event) => setLastName(event.target.value)}
                      aria-invalid={Boolean(errors.last)}
                      className={cn("h-12", inputError)}
                    />
                    <FieldError message={errors.last} />
                  </div>
                  <fieldset className="sm:col-span-2">
                    <legend className="mb-2 text-sm font-medium text-forest-deep">
                      {t.admin.gender}
                    </legend>
                    <div id={fieldId("gender")} className="grid gap-2 sm:grid-cols-2">
                      {genders.map((item) => {
                        const selected = gender === item.value;
                        return (
                          <label
                            key={item.value}
                            className={cn(
                              "flex h-12 cursor-pointer items-center justify-center rounded-xl border px-3 text-sm font-medium transition-colors",
                              selected
                                ? "border-gold bg-gold/10 text-forest-deep ring-1 ring-gold"
                                : "border-forest/10 bg-page text-muted hover:border-gold/50",
                              errors.gender && !gender && "border-red-500",
                            )}
                          >
                            <input
                              type="radio"
                              name="gender"
                              value={item.value}
                              checked={selected}
                              onChange={() => {
                                setGender(item.value);
                                setErrors((current) => ({ ...current, gender: undefined }));
                              }}
                              className="sr-only"
                            />
                            {item.label}
                          </label>
                        );
                      })}
                    </div>
                    <FieldError message={errors.gender} />
                  </fieldset>
                </div>
              </section>

              <section className="rounded-3xl border border-forest/10 bg-ivory p-5 shadow-sm sm:p-6">
                <h2 className="font-heading text-xl text-forest">
                  {t.admin.profileContact}
                </h2>
                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor={fieldId("phone")}>{t.admin.phone}</Label>
                    <Input
                      id={fieldId("phone")}
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      value={phone}
                      onChange={(event) => setPhone(event.target.value)}
                      aria-invalid={Boolean(errors.phone)}
                      className={cn("h-12", inputError)}
                    />
                    <FieldError message={errors.phone} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={fieldId("location")}>{t.admin.location}</Label>
                    <Input
                      id={fieldId("location")}
                      autoComplete="address-level2"
                      value={location}
                      onChange={(event) => setLocation(event.target.value)}
                      aria-invalid={Boolean(errors.location)}
                      className={cn("h-12", inputError)}
                    />
                    <FieldError message={errors.location} />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor={`${formId}-address`}>{t.admin.address}</Label>
                    <Input
                      id={`${formId}-address`}
                      autoComplete="street-address"
                      value={address}
                      onChange={(event) => setAddress(event.target.value)}
                      className="h-12"
                    />
                  </div>
                </div>
              </section>
            </div>

            <div className="flex flex-col gap-5">
              <section className="rounded-3xl border border-forest/10 bg-ivory p-5 shadow-sm sm:p-6">
                <h2 className="font-heading text-xl text-forest">
                  {t.admin.profileWork}
                </h2>
                <fieldset className="mt-5">
                  <legend className="mb-3 text-sm font-medium text-forest-deep">
                    {t.admin.employee}
                  </legend>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label
                      className={cn(
                        "flex cursor-pointer items-center gap-3 rounded-2xl border p-4 transition-colors",
                        isEmployee
                          ? "border-gold bg-gold/10 ring-1 ring-gold"
                          : "border-forest/10 bg-page hover:border-gold/50",
                      )}
                    >
                      <input
                        type="radio"
                        name="employee"
                        checked={isEmployee}
                        onChange={() => setIsEmployee(true)}
                        className="sr-only"
                      />
                      <span
                        className={cn(
                          "inline-flex size-10 items-center justify-center rounded-xl",
                          isEmployee ? "bg-gold text-forest-deep" : "bg-beige text-forest",
                        )}
                      >
                        <Briefcase className="size-4" aria-hidden />
                      </span>
                      <span className="font-medium text-forest">{t.admin.employeeYes}</span>
                    </label>
                    <label
                      className={cn(
                        "flex cursor-pointer items-center gap-3 rounded-2xl border p-4 transition-colors",
                        !isEmployee
                          ? "border-gold bg-gold/10 ring-1 ring-gold"
                          : "border-forest/10 bg-page hover:border-gold/50",
                      )}
                    >
                      <input
                        type="radio"
                        name="employee"
                        checked={!isEmployee}
                        onChange={() => setIsEmployee(false)}
                        className="sr-only"
                      />
                      <span
                        className={cn(
                          "inline-flex size-10 items-center justify-center rounded-xl",
                          !isEmployee ? "bg-gold text-forest-deep" : "bg-beige text-forest",
                        )}
                      >
                        <UserRound className="size-4" aria-hidden />
                      </span>
                      <span className="font-medium text-forest">{t.admin.employeeNo}</span>
                    </label>
                  </div>
                </fieldset>
                {isEmployee ? (
                  <div className="mt-5 grid gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor={fieldId("job")}>{t.admin.occupation}</Label>
                      <Input
                        id={fieldId("job")}
                        autoComplete="organization-title"
                        value={occupation}
                        onChange={(event) => setOccupation(event.target.value)}
                        aria-invalid={Boolean(errors.job)}
                        className={cn("h-12", inputError)}
                      />
                      <FieldError message={errors.job} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`${formId}-work`}>{t.admin.workplace}</Label>
                      <Input
                        id={`${formId}-work`}
                        autoComplete="organization"
                        value={workplace}
                        onChange={(event) => setWorkplace(event.target.value)}
                        className="h-12"
                      />
                    </div>
                  </div>
                ) : null}
              </section>

              <section className="rounded-3xl border border-forest/10 bg-ivory p-5 shadow-sm sm:p-6">
                <h2 className="font-heading text-xl text-forest">
                  {t.admin.profileAccess}
                </h2>
                <fieldset className="mt-5">
                  <legend className="mb-3 text-sm font-medium text-forest-deep">
                    {t.admin.role}
                  </legend>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {roles.map((value) => {
                      const Icon = roleIcons[value];
                      const selected = role === value;
                      return (
                        <label
                          key={value}
                          className={cn(
                            "flex min-h-28 cursor-pointer flex-col gap-2 rounded-2xl border p-4 transition-colors",
                            selected
                              ? "border-gold bg-gold/10 ring-1 ring-gold"
                              : "border-forest/10 bg-page hover:border-gold/50",
                          )}
                        >
                          <input
                            type="radio"
                            name="role"
                            value={value}
                            checked={selected}
                            onChange={() => setRole(value)}
                            className="sr-only"
                          />
                          <span
                            className={cn(
                              "flex size-10 items-center justify-center rounded-2xl",
                              selected ? "bg-gold text-forest-deep" : "bg-beige text-forest",
                            )}
                          >
                            <Icon className="size-5" aria-hidden />
                          </span>
                          <span className="font-heading text-lg text-forest">
                            {t.roles[value]}
                          </span>
                          <span className="text-sm leading-relaxed text-muted">
                            {t.roles[roleHints[value]]}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </fieldset>
                <div className="mt-5 space-y-2">
                  <Label htmlFor={`${formId}-notes`}>{t.admin.notes}</Label>
                  <Textarea
                    id={`${formId}-notes`}
                    value={notes}
                    onChange={(event) => setNotes(event.target.value)}
                    className="min-h-24"
                  />
                </div>
              </section>
            </div>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="mx-auto grid w-full max-w-5xl gap-6 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor={fieldId("email")}>{t.admin.email}</Label>
              <Input
                id={fieldId("email")}
                type="email"
                autoComplete="off"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                aria-invalid={Boolean(errors.email)}
                className={cn("h-14 text-lg", inputError)}
              />
              <FieldError message={errors.email} />
            </div>
            <div className="space-y-2">
              <Label htmlFor={fieldId("password")}>{t.admin.password}</Label>
              <div className="relative">
                <Input
                  id={fieldId("password")}
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className={cn("h-14 pe-12 text-lg", inputError)}
                  aria-invalid={Boolean(errors.password)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute inset-y-0 end-0 flex w-12 items-center justify-center text-muted hover:text-forest focus-visible:outline-none"
                  aria-label={
                    showPassword ? t.login.hidePassword : t.login.showPassword
                  }
                >
                  {showPassword ? (
                    <EyeOff className="size-5" aria-hidden />
                  ) : (
                    <Eye className="size-5" aria-hidden />
                  )}
                </button>
              </div>
              <FieldError message={errors.password} />
            </div>
            <div className="space-y-2">
              <Label htmlFor={fieldId("confirm")}>{t.admin.confirmPassword}</Label>
              <Input
                id={fieldId("confirm")}
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className={cn("h-14 text-lg", inputError)}
                aria-invalid={Boolean(errors.confirm)}
              />
              <FieldError message={errors.confirm} />
            </div>
          </div>
        ) : null}
      </div>

      <footer className="shrink-0 border-t border-forest/10 bg-page px-5 py-4 sm:px-8 lg:px-10">
        <div className="mx-auto flex w-full max-w-7xl justify-end gap-3">
          {step === 2 ? (
            <Button type="button" variant="secondary" size="lg" onClick={() => setStep(1)}>
              {t.admin.back}
            </Button>
          ) : null}
          <Button type="submit" variant="primary" size="lg">
            {t.admin.next}
          </Button>
        </div>
      </footer>
    </form>
  );
}
