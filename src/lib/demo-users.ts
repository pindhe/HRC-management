import type { Role } from "@/lib/roles";

export type DemoUser = {
  email: string;
  password: string;
  role: Role;
};

export const demoUsers: DemoUser[] = [
  {
    email: "admin@hagereadingclub.org",
    password: "Admin@123",
    role: "admin",
  },
  {
    email: "member@hagereadingclub.org",
    password: "Member@123",
    role: "member",
  },
  {
    email: "cashier@hagereadingclub.org",
    password: "Cashier@123",
    role: "cashier",
  },
];

export function findDemoUser(email: string, password: string): DemoUser | null {
  const normalized = email.trim().toLowerCase();
  return (
    demoUsers.find(
      (user) => user.email === normalized && user.password === password,
    ) ?? null
  );
}
