"use client";

import {
  useEffect,
  useId,
  useMemo,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import Link from "next/link";
import {
  Eye,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  deleteMember,
  getMembers,
  memberEmailTaken,
  updateMember,
  type ClubMember,
  type MemberGender,
} from "@/lib/club-store";
import { isReservedEmail } from "@/lib/demo-users";
import { useI18n } from "@/lib/i18n/language-provider";
import { roles, type Role } from "@/lib/roles";
import { cn } from "@/lib/utils";

type RoleFilter = "all" | Role;
type WorkFilter = "all" | "yes" | "no";
type Dialog =
  | { type: "view"; member: ClubMember }
  | { type: "edit"; member: ClubMember }
  | { type: "delete"; member: ClubMember }
  | null;

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidPhone(value: string) {
  const digits = value.replace(/\D/g, "");
  return digits.length >= 7 && /^\+?[0-9][0-9\s\-()]{6,}$/.test(value.trim());
}

function matchesSearch(member: ClubMember, query: string) {
  if (!query) return true;
  const haystack = [
    member.name,
    member.firstName,
    member.lastName,
    member.email,
    member.phone,
    member.location,
    member.address,
    member.occupation,
    member.workplace,
  ]
    .join(" ")
    .toLowerCase();
  return haystack.includes(query);
}

function DialogFrame({
  title,
  onClose,
  children,
  footer,
  wide = false,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  wide?: boolean;
}) {
  const { t } = useI18n();

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
      <button
        type="button"
        aria-label={t.admin.close}
        className="absolute inset-0 bg-forest-deep/55 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="member-dialog-title"
        className={cn(
          "relative z-10 flex max-h-[92svh] w-full flex-col rounded-t-3xl border border-forest/10 bg-ivory shadow-2xl sm:rounded-3xl",
          wide ? "sm:max-w-3xl" : "sm:max-w-lg",
        )}
      >
        <div className="flex items-center justify-between gap-3 border-b border-forest/10 px-5 py-4">
          <h2 id="member-dialog-title" className="font-heading text-xl text-forest">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex size-9 items-center justify-center rounded-lg text-muted hover:bg-beige hover:text-forest"
            aria-label={t.admin.close}
          >
            <X className="size-4" />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">{children}</div>
        {footer ? (
          <div className="flex justify-end gap-3 border-t border-forest/10 px-5 py-4">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="text-[11px] font-semibold tracking-[0.14em] text-muted uppercase">
        {label}
      </p>
      <p className="mt-1 break-words text-sm text-forest-deep">{value || "—"}</p>
    </div>
  );
}

export function AdminMembers() {
  const { t, locale } = useI18n();
  const searchId = useId();
  const [members, setMembers] = useState<ClubMember[]>([]);
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const [workFilter, setWorkFilter] = useState<WorkFilter>("all");
  const [dialog, setDialog] = useState<Dialog>(null);

  function refresh() {
    setMembers(getMembers());
  }

  useEffect(() => {
    refresh();
  }, []);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return members.filter((member) => {
      if (!matchesSearch(member, needle)) return false;
      if (roleFilter !== "all" && member.role !== roleFilter) return false;
      if (workFilter === "yes" && !member.isEmployee) return false;
      if (workFilter === "no" && member.isEmployee) return false;
      return true;
    });
  }, [members, query, roleFilter, workFilter]);

  const filtersOn = query.trim() !== "" || roleFilter !== "all" || workFilter !== "all";

  function closeDialog() {
    setDialog(null);
  }

  function confirmDelete() {
    if (dialog?.type !== "delete") return;
    deleteMember(dialog.member.id);
    refresh();
    closeDialog();
  }

  const selectClass =
    "h-11 rounded-xl border border-forest/15 bg-ivory px-3 text-sm text-forest-deep focus-visible:border-forest focus-visible:ring-2 focus-visible:ring-gold/40 focus-visible:outline-none";

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-heading text-3xl text-forest sm:text-4xl">
            {t.admin.members}
          </h1>
          <p className="mt-2 text-muted">
            {t.admin.resultsCount.replace("{count}", String(filtered.length))}
          </p>
        </div>
        <Button asChild size="sm">
          <Link href="/admin/members/add">
            <Plus aria-hidden />
            {t.admin.memberAdd}
          </Link>
        </Button>
      </div>

      <div className="mt-6 flex flex-col gap-3 lg:flex-row">
        <div className="relative min-w-0 flex-1">
          <Search
            className="pointer-events-none absolute top-1/2 start-3 size-4 -translate-y-1/2 text-muted"
            aria-hidden
          />
          <Input
            id={searchId}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t.admin.searchPlaceholder}
            aria-label={t.admin.search}
            className="h-11 ps-10"
          />
        </div>
        <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
          <label className="sr-only" htmlFor={`${searchId}-role`}>
            {t.admin.filterRole}
          </label>
          <select
            id={`${searchId}-role`}
            value={roleFilter}
            onChange={(event) => setRoleFilter(event.target.value as RoleFilter)}
            className={selectClass}
          >
            <option value="all">
              {t.admin.filterAll} · {t.admin.filterRole}
            </option>
            {roles.map((role) => (
              <option key={role} value={role}>
                {t.roles[role]}
              </option>
            ))}
          </select>
          <label className="sr-only" htmlFor={`${searchId}-work`}>
            {t.admin.filterEmployment}
          </label>
          <select
            id={`${searchId}-work`}
            value={workFilter}
            onChange={(event) => setWorkFilter(event.target.value as WorkFilter)}
            className={selectClass}
          >
            <option value="all">
              {t.admin.filterAll} · {t.admin.filterEmployment}
            </option>
            <option value="yes">{t.admin.employeeYes}</option>
            <option value="no">{t.admin.employeeNo}</option>
          </select>
          {filtersOn ? (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="col-span-2 h-11 sm:col-span-1"
              onClick={() => {
                setQuery("");
                setRoleFilter("all");
                setWorkFilter("all");
              }}
            >
              {t.admin.clearFilters}
            </Button>
          ) : null}
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-3xl border border-forest/10 bg-ivory shadow-sm">
        {members.length === 0 ? (
          <p className="p-6 text-sm text-muted">{t.admin.empty}</p>
        ) : filtered.length === 0 ? (
          <p className="p-6 text-sm text-muted">{t.admin.noResults}</p>
        ) : (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[52rem] text-start text-sm">
                <thead className="border-b border-forest/10 bg-beige/40 text-[11px] font-semibold tracking-[0.14em] text-muted uppercase">
                  <tr>
                    <th className="px-5 py-3 font-semibold">{t.admin.name}</th>
                    <th className="px-5 py-3 font-semibold">{t.admin.email}</th>
                    <th className="px-5 py-3 font-semibold">{t.admin.phone}</th>
                    <th className="px-5 py-3 font-semibold">{t.admin.location}</th>
                    <th className="px-5 py-3 font-semibold">{t.admin.employee}</th>
                    <th className="px-5 py-3 font-semibold">{t.admin.role}</th>
                    <th className="px-5 py-3 text-end font-semibold">{t.admin.actions}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-forest/10">
                  {filtered.map((member) => (
                    <tr key={member.id} className="hover:bg-beige/25">
                      <td className="px-5 py-3.5">
                        <p className="font-medium text-forest-deep">{member.name}</p>
                      </td>
                      <td className="px-5 py-3.5 text-muted">{member.email}</td>
                      <td className="px-5 py-3.5 text-muted">{member.phone || "—"}</td>
                      <td className="px-5 py-3.5 text-muted">{member.location || "—"}</td>
                      <td className="px-5 py-3.5 text-muted">
                        {member.isEmployee ? t.admin.employeeYes : t.admin.employeeNo}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="rounded-full bg-beige px-2.5 py-1 text-[11px] font-semibold tracking-wide text-forest uppercase">
                          {t.roles[member.role]}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <ActionButtons
                          member={member}
                          onView={() => setDialog({ type: "view", member })}
                          onEdit={() => setDialog({ type: "edit", member })}
                          onDelete={() => setDialog({ type: "delete", member })}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <ul className="divide-y divide-forest/10 md:hidden">
              {filtered.map((member) => (
                <li key={member.id} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-medium text-forest-deep">{member.name}</p>
                      <p className="truncate text-sm text-muted">{member.email}</p>
                      <p className="mt-1 text-xs text-muted">
                        {[
                          member.phone,
                          member.location,
                          member.isEmployee ? t.admin.employeeYes : t.admin.employeeNo,
                        ]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full bg-beige px-2.5 py-1 text-[11px] font-semibold tracking-wide text-forest uppercase">
                      {t.roles[member.role]}
                    </span>
                  </div>
                  <div className="mt-3">
                    <ActionButtons
                      member={member}
                      onView={() => setDialog({ type: "view", member })}
                      onEdit={() => setDialog({ type: "edit", member })}
                      onDelete={() => setDialog({ type: "delete", member })}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      {dialog?.type === "view" ? (
        <DialogFrame title={t.admin.viewMember} onClose={closeDialog} wide>
          <MemberView member={dialog.member} locale={locale} />
        </DialogFrame>
      ) : null}

      {dialog?.type === "edit" ? (
        <MemberEditDialog
          member={dialog.member}
          onClose={closeDialog}
          onSaved={() => {
            refresh();
            closeDialog();
          }}
        />
      ) : null}

      {dialog?.type === "delete" ? (
        <DialogFrame
          title={t.admin.confirmDelete}
          onClose={closeDialog}
          footer={
            <>
              <Button type="button" variant="secondary" onClick={closeDialog}>
                {t.admin.cancel}
              </Button>
              <Button
                type="button"
                onClick={confirmDelete}
                className="bg-red-700 text-white hover:bg-red-800"
              >
                {t.admin.deleteMember}
              </Button>
            </>
          }
        >
          <p className="text-sm leading-relaxed text-muted">
            {t.admin.confirmDeleteText.replace("{name}", dialog.member.name)}
          </p>
        </DialogFrame>
      ) : null}
    </div>
  );
}

function ActionButtons({
  member,
  onView,
  onEdit,
  onDelete,
}: {
  member: ClubMember;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const { t } = useI18n();
  const btn =
    "inline-flex size-9 items-center justify-center rounded-lg text-forest transition-colors hover:bg-beige focus-visible:ring-2 focus-visible:ring-gold focus-visible:outline-none";

  return (
    <div className="flex justify-end gap-1">
      <button type="button" className={btn} onClick={onView} aria-label={`${t.admin.viewMember}: ${member.name}`}>
        <Eye className="size-4" />
      </button>
      <button type="button" className={btn} onClick={onEdit} aria-label={`${t.admin.editMember}: ${member.name}`}>
        <Pencil className="size-4" />
      </button>
      <button
        type="button"
        className={cn(btn, "text-red-700 hover:bg-red-50 dark:hover:bg-red-950/40")}
        onClick={onDelete}
        aria-label={`${t.admin.deleteMember}: ${member.name}`}
      >
        <Trash2 className="size-4" />
      </button>
    </div>
  );
}

function MemberView({ member, locale }: { member: ClubMember; locale: string }) {
  const { t } = useI18n();
  const joined = new Date(member.createdAt).toLocaleDateString(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  const genderLabel =
    member.gender === "male"
      ? t.admin.genderMale
      : member.gender === "female"
        ? t.admin.genderFemale
        : "—";

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <DetailItem label={t.admin.firstName} value={member.firstName} />
      <DetailItem label={t.admin.lastName} value={member.lastName} />
      <DetailItem label={t.admin.gender} value={genderLabel} />
      <DetailItem label={t.admin.role} value={t.roles[member.role]} />
      <DetailItem label={t.admin.email} value={member.email} />
      <DetailItem label={t.admin.phone} value={member.phone} />
      <DetailItem label={t.admin.location} value={member.location} />
      <DetailItem label={t.admin.address} value={member.address} />
      <DetailItem
        label={t.admin.employee}
        value={member.isEmployee ? t.admin.employeeYes : t.admin.employeeNo}
      />
      <DetailItem label={t.admin.occupation} value={member.occupation} />
      <DetailItem label={t.admin.workplace} value={member.workplace} />
      <DetailItem label={t.admin.joined} value={joined} />
      {member.notes ? (
        <div className="sm:col-span-2">
          <DetailItem label={t.admin.notes} value={member.notes} />
        </div>
      ) : null}
    </div>
  );
}

function MemberEditDialog({
  member,
  onClose,
  onSaved,
}: {
  member: ClubMember;
  onClose: () => void;
  onSaved: () => void;
}) {
  const { t } = useI18n();
  const formId = useId();
  const [firstName, setFirstName] = useState(member.firstName);
  const [lastName, setLastName] = useState(member.lastName);
  const [gender, setGender] = useState<MemberGender | "">(member.gender);
  const [phone, setPhone] = useState(member.phone);
  const [location, setLocation] = useState(member.location);
  const [address, setAddress] = useState(member.address);
  const [isEmployee, setIsEmployee] = useState(member.isEmployee);
  const [occupation, setOccupation] = useState(member.occupation);
  const [workplace, setWorkplace] = useState(member.workplace);
  const [notes, setNotes] = useState(member.notes);
  const [role, setRole] = useState<Role>(member.role);
  const [email, setEmail] = useState(member.email);
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next: Record<string, string> = {};
    if (!firstName.trim()) next.firstName = t.admin.firstNameError;
    if (!lastName.trim()) next.lastName = t.admin.lastNameError;
    if (gender !== "male" && gender !== "female") next.gender = t.admin.genderError;
    if (!isValidPhone(phone)) next.phone = t.admin.phoneError;
    if (!location.trim()) next.location = t.admin.locationError;
    if (isEmployee && !occupation.trim()) next.occupation = t.admin.occupationError;
    if (!isValidEmail(email.trim())) next.email = t.admin.emailError;
    if (
      !next.email &&
      (memberEmailTaken(email, member.id) ||
        (email.trim().toLowerCase() !== member.email && isReservedEmail(email)))
    ) {
      next.email = t.admin.duplicateEmail;
    }
    if (password && password.length < 8) next.password = t.admin.passwordError;
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    updateMember(member.id, {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      gender,
      phone: phone.trim(),
      location: location.trim(),
      address: address.trim(),
      isEmployee,
      occupation: isEmployee ? occupation.trim() : "",
      workplace: isEmployee ? workplace.trim() : "",
      notes: notes.trim(),
      role,
      email: email.trim().toLowerCase(),
      password,
    });
    onSaved();
  }

  return (
    <DialogFrame
      title={t.admin.editMember}
      onClose={onClose}
      wide
      footer={
        <>
          <Button type="button" variant="secondary" onClick={onClose}>
            {t.admin.cancel}
          </Button>
          <Button type="submit" form={`${formId}-edit`}>
            {t.admin.saveChanges}
          </Button>
        </>
      }
    >
      <form id={`${formId}-edit`} onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2" noValidate>
        <div className="space-y-2">
          <Label htmlFor={`${formId}-first`}>{t.admin.firstName}</Label>
          <Input id={`${formId}-first`} value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          {errors.firstName ? <p className="text-xs text-red-700">{errors.firstName}</p> : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${formId}-last`}>{t.admin.lastName}</Label>
          <Input id={`${formId}-last`} value={lastName} onChange={(e) => setLastName(e.target.value)} />
          {errors.lastName ? <p className="text-xs text-red-700">{errors.lastName}</p> : null}
        </div>
        <fieldset className="sm:col-span-2">
          <legend className="mb-2 text-sm font-medium text-forest-deep">{t.admin.gender}</legend>
          <div className="grid grid-cols-2 gap-2">
            {(["male", "female"] as const).map((value) => (
              <label
                key={value}
                className={cn(
                  "flex h-11 cursor-pointer items-center justify-center rounded-xl border text-sm font-medium",
                  gender === value
                    ? "border-gold bg-gold/10 ring-1 ring-gold"
                    : "border-forest/10",
                )}
              >
                <input
                  type="radio"
                  name="gender"
                  className="sr-only"
                  checked={gender === value}
                  onChange={() => setGender(value)}
                />
                {value === "male" ? t.admin.genderMale : t.admin.genderFemale}
              </label>
            ))}
          </div>
          {errors.gender ? <p className="mt-1 text-xs text-red-700">{errors.gender}</p> : null}
        </fieldset>
        <div className="space-y-2">
          <Label htmlFor={`${formId}-phone`}>{t.admin.phone}</Label>
          <Input id={`${formId}-phone`} value={phone} onChange={(e) => setPhone(e.target.value)} />
          {errors.phone ? <p className="text-xs text-red-700">{errors.phone}</p> : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${formId}-location`}>{t.admin.location}</Label>
          <Input id={`${formId}-location`} value={location} onChange={(e) => setLocation(e.target.value)} />
          {errors.location ? <p className="text-xs text-red-700">{errors.location}</p> : null}
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor={`${formId}-address`}>{t.admin.address}</Label>
          <Input id={`${formId}-address`} value={address} onChange={(e) => setAddress(e.target.value)} />
        </div>
        <fieldset className="sm:col-span-2">
          <legend className="mb-2 text-sm font-medium text-forest-deep">{t.admin.employee}</legend>
          <div className="grid grid-cols-2 gap-2">
            <label
              className={cn(
                "flex h-11 cursor-pointer items-center justify-center rounded-xl border text-sm font-medium",
                isEmployee ? "border-gold bg-gold/10 ring-1 ring-gold" : "border-forest/10",
              )}
            >
              <input type="radio" name="emp" className="sr-only" checked={isEmployee} onChange={() => setIsEmployee(true)} />
              {t.admin.employeeYes}
            </label>
            <label
              className={cn(
                "flex h-11 cursor-pointer items-center justify-center rounded-xl border text-sm font-medium",
                !isEmployee ? "border-gold bg-gold/10 ring-1 ring-gold" : "border-forest/10",
              )}
            >
              <input type="radio" name="emp" className="sr-only" checked={!isEmployee} onChange={() => setIsEmployee(false)} />
              {t.admin.employeeNo}
            </label>
          </div>
        </fieldset>
        {isEmployee ? (
          <>
            <div className="space-y-2">
              <Label htmlFor={`${formId}-job`}>{t.admin.occupation}</Label>
              <Input id={`${formId}-job`} value={occupation} onChange={(e) => setOccupation(e.target.value)} />
              {errors.occupation ? <p className="text-xs text-red-700">{errors.occupation}</p> : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${formId}-work`}>{t.admin.workplace}</Label>
              <Input id={`${formId}-work`} value={workplace} onChange={(e) => setWorkplace(e.target.value)} />
            </div>
          </>
        ) : null}
        <div className="space-y-2">
          <Label htmlFor={`${formId}-email`}>{t.admin.email}</Label>
          <Input id={`${formId}-email`} type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          {errors.email ? <p className="text-xs text-red-700">{errors.email}</p> : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${formId}-role`}>{t.admin.role}</Label>
          <select
            id={`${formId}-role`}
            value={role}
            onChange={(e) => setRole(e.target.value as Role)}
            className="h-12 w-full rounded-xl border border-forest/15 bg-ivory px-4 text-base"
          >
            {roles.map((value) => (
              <option key={value} value={value}>
                {t.roles[value]}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor={`${formId}-password`}>{t.admin.password}</Label>
          <Input
            id={`${formId}-password`}
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <p className="text-xs text-muted">{t.admin.keepPassword}</p>
          {errors.password ? <p className="text-xs text-red-700">{errors.password}</p> : null}
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor={`${formId}-notes`}>{t.admin.notes}</Label>
          <Textarea id={`${formId}-notes`} value={notes} onChange={(e) => setNotes(e.target.value)} className="min-h-24" />
        </div>
      </form>
    </DialogFrame>
  );
}
