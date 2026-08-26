import type { Role } from "@/lib/roles";

const MEMBERS_KEY = "hage-members";
const PAYMENTS_KEY = "hage-payments";

export type ClubMember = {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
};

export type Payment = {
  id: string;
  memberName: string;
  amount: number;
  method: "cash" | "transfer" | "mobile";
  createdAt: string;
};

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

export function getMembers(): ClubMember[] {
  return readList<ClubMember>(MEMBERS_KEY);
}

export function addMember(input: Omit<ClubMember, "id" | "createdAt">): ClubMember {
  const member: ClubMember = {
    ...input,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  writeList(MEMBERS_KEY, [member, ...getMembers()]);
  return member;
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
