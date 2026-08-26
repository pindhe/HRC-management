"use client";

import { FormEvent, useEffect, useId, useState } from "react";
import { Eye, EyeOff, LogOut } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { clearSession, readClientEmail } from "@/lib/auth";
import { getMemberByEmail, saveSelfProfile, type MemberGender } from "@/lib/club-store";
import { resolveMemberName, verifyPassword } from "@/lib/demo-users";
import { useI18n } from "@/lib/i18n/language-provider";
import { useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";

function isValidPhone(value: string) {
  if (!value.trim()) return true;
  const digits = value.replace(/\D/g, "");
  return digits.length >= 7 && /^\+?[0-9][0-9\s\-()]{6,}$/.test(value.trim());
}

export function MemberProfile() {
  const { t } = useI18n();
  const { theme } = useTheme();
  const formId = useId();
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [address, setAddress] = useState("");
  const [occupation, setOccupation] = useState("");
  const [workplace, setWorkplace] = useState("");
  const [gender, setGender] = useState<MemberGender | "">("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [infoMessage, setInfoMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [infoError, setInfoError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    const nextEmail = readClientEmail();
    setEmail(nextEmail);
    const member = getMemberByEmail(nextEmail);
    if (member) {
      setFirstName(member.firstName);
      setLastName(member.lastName);
      setPhone(member.phone);
      setLocation(member.location);
      setAddress(member.address);
      setOccupation(member.occupation);
      setWorkplace(member.workplace);
      setGender(member.gender);
      return;
    }
    const name = resolveMemberName(nextEmail);
    const parts = name.trim().split(/\s+/);
    setFirstName(parts[0] ?? "");
    setLastName(parts.slice(1).join(" "));
  }, []);

  function saveInfo(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setInfoMessage("");
    if (!firstName.trim()) {
      setInfoError(t.admin.firstNameError);
      return;
    }
    if (!lastName.trim()) {
      setInfoError(t.admin.lastNameError);
      return;
    }
    if (!isValidPhone(phone)) {
      setInfoError(t.admin.phoneError);
      return;
    }
    setInfoError("");
    saveSelfProfile(email, {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: phone.trim(),
      location: location.trim(),
      address: address.trim(),
      occupation: occupation.trim(),
      workplace: workplace.trim(),
      gender,
    });
    setInfoMessage(t.member.profileSaved);
  }

  function savePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPasswordMessage("");
    if (!verifyPassword(email, currentPassword)) {
      setPasswordError(t.member.currentPasswordError);
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError(t.admin.passwordError);
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError(t.admin.confirmError);
      return;
    }
    setPasswordError("");
    saveSelfProfile(email, {
      firstName: firstName.trim() || "Member",
      lastName: lastName.trim(),
      phone: phone.trim(),
      location: location.trim(),
      address: address.trim(),
      occupation: occupation.trim(),
      workplace: workplace.trim(),
      gender,
      password: newPassword,
    });
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordMessage(t.member.passwordChanged);
  }

  function logout() {
    clearSession();
    window.location.assign("/");
  }

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="font-heading text-3xl text-forest sm:text-4xl">
        {t.member.profile}
      </h1>
      <p className="mt-2 text-muted">{t.member.profileHint}</p>

      <form onSubmit={saveInfo} className="mt-8 space-y-4 rounded-3xl border border-forest/10 bg-ivory p-5 shadow-sm sm:p-6">
        <h2 className="font-heading text-xl text-forest">{t.admin.profilePersonal}</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor={`${formId}-first`}>{t.admin.firstName}</Label>
            <Input
              id={`${formId}-first`}
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${formId}-last`}>{t.admin.lastName}</Label>
            <Input
              id={`${formId}-last`}
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${formId}-email`}>{t.admin.email}</Label>
          <Input id={`${formId}-email`} value={email} readOnly className="opacity-80" />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${formId}-phone`}>{t.admin.phone}</Label>
          <Input
            id={`${formId}-phone`}
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${formId}-location`}>{t.admin.location}</Label>
          <Input
            id={`${formId}-location`}
            value={location}
            onChange={(event) => setLocation(event.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${formId}-address`}>{t.admin.address}</Label>
          <Input
            id={`${formId}-address`}
            value={address}
            onChange={(event) => setAddress(event.target.value)}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor={`${formId}-job`}>{t.admin.occupation}</Label>
            <Input
              id={`${formId}-job`}
              value={occupation}
              onChange={(event) => setOccupation(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${formId}-work`}>{t.admin.workplace}</Label>
            <Input
              id={`${formId}-work`}
              value={workplace}
              onChange={(event) => setWorkplace(event.target.value)}
            />
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-sm font-medium text-forest-deep">{t.admin.gender}</p>
          <div className="grid grid-cols-2 gap-2">
            {(
              [
                ["male", t.admin.genderMale],
                ["female", t.admin.genderFemale],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setGender(value)}
                className={cn(
                  "h-11 rounded-xl border text-sm font-medium",
                  gender === value
                    ? "border-gold bg-gold/15 text-forest"
                    : "border-forest/15 text-muted hover:border-gold/50",
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        {infoError ? <p className="text-sm text-red-700">{infoError}</p> : null}
        {infoMessage ? <p className="text-sm text-forest">{infoMessage}</p> : null}
        <Button type="submit">{t.member.saveProfile}</Button>
      </form>

      <form
        onSubmit={savePassword}
        className="mt-6 space-y-4 rounded-3xl border border-forest/10 bg-ivory p-5 shadow-sm sm:p-6"
      >
        <h2 className="font-heading text-xl text-forest">{t.member.changePassword}</h2>
        <div className="space-y-2">
          <Label htmlFor={`${formId}-current`}>{t.member.currentPassword}</Label>
          <div className="relative">
            <Input
              id={`${formId}-current`}
              type={showCurrent ? "text" : "password"}
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              className="pe-12"
            />
            <button
              type="button"
              onClick={() => setShowCurrent((value) => !value)}
              className="absolute inset-y-0 end-0 flex w-12 items-center justify-center text-muted"
              aria-label={showCurrent ? t.login.hidePassword : t.login.showPassword}
            >
              {showCurrent ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${formId}-new`}>{t.member.newPassword}</Label>
          <div className="relative">
            <Input
              id={`${formId}-new`}
              type={showNew ? "text" : "password"}
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              className="pe-12"
            />
            <button
              type="button"
              onClick={() => setShowNew((value) => !value)}
              className="absolute inset-y-0 end-0 flex w-12 items-center justify-center text-muted"
              aria-label={showNew ? t.login.hidePassword : t.login.showPassword}
            >
              {showNew ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${formId}-confirm`}>{t.member.confirmPassword}</Label>
          <Input
            id={`${formId}-confirm`}
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
          />
        </div>
        {passwordError ? <p className="text-sm text-red-700">{passwordError}</p> : null}
        {passwordMessage ? <p className="text-sm text-forest">{passwordMessage}</p> : null}
        <Button type="submit">{t.member.changePassword}</Button>
      </form>

      <section className="mt-6 flex items-center justify-between gap-4 rounded-3xl border border-forest/10 bg-ivory p-5 shadow-sm sm:p-6">
        <div>
          <h2 className="font-heading text-xl text-forest">{t.member.appearance}</h2>
          <p className="mt-1 text-sm text-muted">
            {theme === "dark" ? t.member.darkMode : t.member.lightMode}
          </p>
        </div>
        <ThemeToggle />
      </section>

      <Button
        type="button"
        variant="secondary"
        className="mt-6 w-full text-red-700 hover:border-red-200 hover:bg-red-50"
        onClick={logout}
      >
        <LogOut aria-hidden />
        {t.nav.logout}
      </Button>
    </div>
  );
}
