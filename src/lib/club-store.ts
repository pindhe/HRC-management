import type { Role } from "@/lib/roles";

const MEMBERS_KEY = "hage-members";
const PAYMENTS_KEY = "hage-payments";
const ATTENDANCE_KEY = "hage-attendance";

export type MemberGender = "male" | "female";

export type ClubMember = {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  phone: string;
  location: string;
  address: string;
  isEmployee: boolean;
  occupation: string;
  workplace: string;
  gender: MemberGender | "";
  notes: string;
  email: string;
  password?: string;
  role: Role;
  createdAt: string;
};

export const FINE_TYPES = ["book", "absence"] as const;
export type FineType = (typeof FINE_TYPES)[number];

export type Payment = {
  id: string;
  memberName: string;
  memberEmail?: string;
  amount: number;
  method: "cash" | "transfer" | "mobile";
  fineType?: FineType;
  fineDate?: string;
  createdAt: string;
};

export function isFineType(value: string): value is FineType {
  return value === "book" || value === "absence";
}

function readList<T>(key: string): T[] {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

function writeList<T>(key: string, value: T[]) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

function splitName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { firstName: "", lastName: "" };
  if (parts.length === 1) return { firstName: parts[0], lastName: "" };
  return { firstName: parts[0], lastName: parts.slice(1).join(" ") };
}

function normalizeMember(raw: ClubMember): ClubMember {
  const names = splitName(raw.name ?? "");
  return {
    ...raw,
    firstName: raw.firstName ?? names.firstName,
    lastName: raw.lastName ?? names.lastName,
    phone: raw.phone ?? "",
    location: raw.location ?? "",
    address: raw.address ?? "",
    isEmployee: Boolean(raw.isEmployee),
    occupation: raw.occupation ?? "",
    workplace: raw.workplace ?? "",
    gender: raw.gender === "male" || raw.gender === "female" ? raw.gender : "",
    notes: raw.notes ?? "",
  };
}

export function getMembers(): ClubMember[] {
  return readList<ClubMember>(MEMBERS_KEY).map(normalizeMember);
}

export function memberEmailTaken(email: string, excludeId?: string) {
  const normalized = email.trim().toLowerCase();
  return getMembers().some(
    (member) => member.email === normalized && member.id !== excludeId,
  );
}

export function getMemberByEmail(email: string): ClubMember | null {
  const normalized = email.trim().toLowerCase();
  return getMembers().find((member) => member.email === normalized) ?? null;
}

export function saveSelfProfile(
  email: string,
  patch: {
    firstName: string;
    lastName: string;
    phone: string;
    location: string;
    address: string;
    occupation: string;
    workplace: string;
    gender: MemberGender | "";
    password?: string;
  },
): ClubMember {
  const existing = getMemberByEmail(email);
  if (existing) {
    return updateMember(existing.id, patch) ?? existing;
  }
  return addMember({
    firstName: patch.firstName,
    lastName: patch.lastName,
    name: `${patch.firstName} ${patch.lastName}`.trim(),
    phone: patch.phone,
    location: patch.location,
    address: patch.address,
    isEmployee: Boolean(patch.occupation || patch.workplace),
    occupation: patch.occupation,
    workplace: patch.workplace,
    gender: patch.gender,
    notes: "",
    email: email.trim().toLowerCase(),
    password: patch.password,
    role: "member",
  });
}

export function addMember(input: Omit<ClubMember, "id" | "createdAt">): ClubMember {
  const member: ClubMember = {
    ...normalizeMember({
      ...input,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    }),
  };
  writeList(MEMBERS_KEY, [member, ...getMembers()]);
  return member;
}

export function updateMember(
  id: string,
  patch: Partial<Omit<ClubMember, "id" | "createdAt">>,
): ClubMember | null {
  const members = getMembers();
  const index = members.findIndex((member) => member.id === id);
  if (index < 0) return null;

  const current = members[index];
  const firstName = patch.firstName ?? current.firstName;
  const lastName = patch.lastName ?? current.lastName;
  const updated = normalizeMember({
    ...current,
    ...patch,
    name: `${firstName} ${lastName}`.trim() || current.name,
    password:
      patch.password === undefined || patch.password === ""
        ? current.password
        : patch.password,
    id: current.id,
    createdAt: current.createdAt,
  });

  const next = [...members];
  next[index] = updated;
  writeList(MEMBERS_KEY, next);
  return updated;
}

export function deleteMember(id: string) {
  writeList(
    MEMBERS_KEY,
    getMembers().filter((member) => member.id !== id),
  );
}

export function getPayments(): Payment[] {
  return readList<Payment>(PAYMENTS_KEY);
}

export function addPayment(input: Omit<Payment, "id" | "createdAt">): Payment {
  const payment: Payment = {
    ...input,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  writeList(PAYMENTS_KEY, [payment, ...getPayments()]);
  return payment;
}

export function deletePayment(id: string) {
  writeList(
    PAYMENTS_KEY,
    getPayments().filter((payment) => payment.id !== id),
  );
}

export function localDateKey(day = new Date()) {
  const month = String(day.getMonth() + 1).padStart(2, "0");
  const date = String(day.getDate()).padStart(2, "0");
  return `${day.getFullYear()}-${month}-${date}`;
}

export type AttendanceRecord = {
  id: string;
  email: string;
  date: string;
  createdAt: string;
};

export function getAttendance(email: string): AttendanceRecord[] {
  const normalized = email.trim().toLowerCase();
  return readList<AttendanceRecord>(ATTENDANCE_KEY)
    .filter((item) => item.email === normalized)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function hasCheckedInOnDate(email: string, date: string) {
  const normalized = email.trim().toLowerCase();
  return getAttendanceOnDate(date).some((item) => item.email === normalized);
}

export function hasCheckedInToday(email: string) {
  return hasCheckedInOnDate(email, localDateKey());
}

export function checkInOnDate(email: string, date: string): AttendanceRecord | null {
  const normalized = email.trim().toLowerCase();
  if (!normalized || !date || hasCheckedInOnDate(normalized, date)) return null;
  const record: AttendanceRecord = {
    id: crypto.randomUUID(),
    email: normalized,
    date,
    createdAt: new Date().toISOString(),
  };
  writeList(ATTENDANCE_KEY, [record, ...readList<AttendanceRecord>(ATTENDANCE_KEY)]);
  return record;
}

export function checkInToday(email: string): AttendanceRecord | null {
  return checkInOnDate(email, localDateKey());
}

export function getAllAttendance(): AttendanceRecord[] {
  return readList<AttendanceRecord>(ATTENDANCE_KEY).sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );
}

export function getAttendanceOnDate(date = localDateKey()): AttendanceRecord[] {
  return getAllAttendance().filter((item) => item.date === date);
}

const READING_KEY = "hage-reading-done";

export type ReadingDone = {
  id: string;
  email: string;
  bookId: string;
  bookTitle: string;
  createdAt: string;
};

export function getReadingDone(bookId?: string): ReadingDone[] {
  const rows = readList<ReadingDone>(READING_KEY);
  const filtered = bookId ? rows.filter((item) => item.bookId === bookId) : rows;
  return filtered.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function hasFinishedBook(email: string, bookId: string) {
  const normalized = email.trim().toLowerCase();
  return getReadingDone(bookId).some((item) => item.email === normalized);
}

export function markBookDone(email: string, bookId: string, bookTitle: string) {
  const normalized = email.trim().toLowerCase();
  if (!normalized || !bookId || hasFinishedBook(normalized, bookId)) return null;
  const record: ReadingDone = {
    id: crypto.randomUUID(),
    email: normalized,
    bookId,
    bookTitle,
    createdAt: new Date().toISOString(),
  };
  writeList(READING_KEY, [record, ...readList<ReadingDone>(READING_KEY)]);
  return record;
}
