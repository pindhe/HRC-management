"use client";

import { useEffect, useMemo, useState } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  checkInOnDate,
  getAttendanceOnDate,
  getMembers,
  localDateKey,
  type ClubMember,
} from "@/lib/club-store";
import { useI18n } from "@/lib/i18n/language-provider";
import { cn } from "@/lib/utils";

type Filter = "all" | "present" | "absent";

function csvCell(value: string) {
  const safe = value.replaceAll('"', '""');
  return `"${safe}"`;
}

export function CashierAttendance() {
  const { t } = useI18n();
  const [members, setMembers] = useState<ClubMember[]>([]);
  const [present, setPresent] = useState<Set<string>>(new Set());
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [day, setDay] = useState(localDateKey);

  function refresh(date = day) {
    setMembers(getMembers());
    setPresent(new Set(getAttendanceOnDate(date).map((item) => item.email)));
  }

  useEffect(() => {
    refresh(day);
  }, [day]);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return members.filter((member) => {
      const isPresent = present.has(member.email);
      if (filter === "present" && !isPresent) return false;
      if (filter === "absent" && isPresent) return false;
      if (!needle) return true;
      return [member.name, member.email, member.phone]
        .join(" ")
        .toLowerCase()
        .includes(needle);
    });
  }, [members, present, query, filter]);

  const filters: Filter[] = ["all", "present", "absent"];
  const filterLabel =
    filter === "present"
      ? t.cashier.filterPresent
      : filter === "absent"
        ? t.cashier.filterAbsent
        : t.cashier.filterAll;

  function downloadList() {
    const header = [
      t.admin.name,
      t.admin.email,
      t.admin.phone,
      t.cashier.status,
      t.cashier.selectDay,
    ];
    const rows = visible.map((member) => [
      member.name,
      member.email,
      member.phone,
      present.has(member.email) ? t.cashier.present : t.cashier.absent,
      day,
    ]);
    const csv = [header, ...rows]
      .map((row) => row.map((cell) => csvCell(cell)).join(","))
      .join("\n");
    const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `attendance-${day}-${filter}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <h1 className="font-heading text-3xl text-forest sm:text-4xl">
        {t.cashier.attendance}
      </h1>
      <p className="mt-2 text-muted">{t.cashier.goAttendance}</p>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end">
        <div className="space-y-2">
          <Label htmlFor="attendance-day">{t.cashier.selectDay}</Label>
          <Input
            id="attendance-day"
            type="date"
            value={day}
            onChange={(event) => setDay(event.target.value || localDateKey())}
            className="w-full sm:w-auto"
          />
        </div>
        <Input
          className="max-w-md"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t.cashier.search}
        />
        <Button
          type="button"
          variant="secondary"
          onClick={downloadList}
          disabled={visible.length === 0}
        >
          <Download aria-hidden />
          {t.cashier.download}
        </Button>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {filters.map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setFilter(value)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-sm font-medium",
              filter === value
                ? "border-gold bg-gold/15 text-forest"
                : "border-forest/15 text-muted hover:border-gold/50",
            )}
          >
            {value === "all"
              ? t.cashier.filterAll
              : value === "present"
                ? t.cashier.filterPresent
                : t.cashier.filterAbsent}
          </button>
        ))}
      </div>

      <p className="mt-3 text-sm text-muted">
        {day} · {filterLabel} · {visible.length}
      </p>

      <div className="mt-4 overflow-hidden rounded-3xl border border-forest/10 bg-ivory shadow-sm">
        {visible.length === 0 ? (
          <p className="p-6 text-sm text-muted">{t.cashier.membersEmpty}</p>
        ) : (
          <ul className="divide-y divide-forest/10">
            {visible.map((member) => {
              const isPresent = present.has(member.email);
              return (
                <li
                  key={member.id}
                  className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-forest-deep">{member.name}</p>
                    <p className="truncate text-sm text-muted">{member.email}</p>
                  </div>
                  {isPresent ? (
                    <span className="rounded-full bg-gold/15 px-3 py-1 text-[11px] font-semibold text-forest uppercase">
                      {t.cashier.present}
                    </span>
                  ) : (
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => {
                        checkInOnDate(member.email, day);
                        refresh(day);
                      }}
                    >
                      {t.cashier.markPresent}
                    </Button>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
