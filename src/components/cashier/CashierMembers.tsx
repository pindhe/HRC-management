"use client";

import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { getMembers, type ClubMember } from "@/lib/club-store";
import { useI18n } from "@/lib/i18n/language-provider";

export function CashierMembers() {
  const { t } = useI18n();
  const [members, setMembers] = useState<ClubMember[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    setMembers(getMembers());
  }, []);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return members;
    return members.filter((member) =>
      [member.name, member.email, member.phone, member.location]
        .join(" ")
        .toLowerCase()
        .includes(needle),
    );
  }, [members, query]);

  return (
    <div>
      <h1 className="font-heading text-3xl text-forest sm:text-4xl">
        {t.cashier.list}
      </h1>
      <p className="mt-2 text-muted">{t.cashier.goList}</p>

      <Input
        className="mt-6 max-w-md"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={t.cashier.search}
      />

      <div className="mt-6 overflow-hidden rounded-3xl border border-forest/10 bg-ivory shadow-sm">
        {visible.length === 0 ? (
          <p className="p-6 text-sm text-muted">{t.cashier.membersEmpty}</p>
        ) : (
          <ul className="divide-y divide-forest/10">
            {visible.map((member) => (
              <li key={member.id} className="px-5 py-4">
                <p className="font-medium text-forest-deep">{member.name}</p>
                <p className="mt-1 text-sm text-muted">
                  {member.email}
                  {member.phone ? ` · ${member.phone}` : ""}
                  {member.location ? ` · ${member.location}` : ""}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
