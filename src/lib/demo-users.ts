import { getMembers } from "@/lib/club-store";
import type { Role } from "@/lib/roles";

export type DemoUser = {
  email: string;
  password: string;
  role: Role;
  name: string;
};

export const demoUsers: DemoUser[] = [
  {
    email: "hage@gmaiil.com",
    password: "hage123@",
    role: "admin",
    name: "Admin",
  },
  {
    email: "member@hagereadingclub.org",
    password: "Member@123",
    role: "member",
    name: "Member",
  },
  {
    email: "cashier@hagereadingclub.org",
    password: "Cashier@123",
    role: "cashier",
    name: "Cashier",
  },
];

export function findDemoUser(email: string, password: string): DemoUser | null {
  const normalized = email.trim().toLowerCase();
  const demo = demoUsers.find(
    (user) => user.email === normalized && user.password === password,
  );
  if (demo) {
    const profile = getMembers().find((item) => item.email === normalized);
    return profile ? { ...demo, name: profile.name } : demo;
  }

  const member = getMembers().find(
    (item) => item.email === normalized && item.password === password,
  );
  if (!member?.password) return null;
  return {
    email: member.email,
    password: member.password,
    role: member.role,
    name: member.name,
  };
}

export function isReservedEmail(email: string) {
  const normalized = email.trim().toLowerCase();
  return demoUsers.some((user) => user.email === normalized);
}

export function resolveMemberName(email: string) {
  const normalized = email.trim().toLowerCase();
  const profile = getMembers().find((item) => item.email === normalized);
  if (profile?.name) return profile.name;
  const demo = demoUsers.find((user) => user.email === normalized);
  if (demo?.name) return demo.name;
  return normalized.split("@")[0] || "Member";
}

export function verifyPassword(email: string, password: string) {
  const normalized = email.trim().toLowerCase();
  const demo = demoUsers.find((user) => user.email === normalized);
  if (demo?.password === password) return true;
  const member = getMembers().find((item) => item.email === normalized);
  return Boolean(member?.password && member.password === password);
}
