"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarCheck, Check, ChevronLeft, ChevronRight, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { readClientEmail } from "@/lib/auth";
import {
  checkInToday,
  getAttendance,
  hasCheckedInToday,
  localDateKey,
  type AttendanceRecord,
} from "@/lib/club-store";
import { localeMeta } from "@/lib/i18n/types";
import { useI18n } from "@/lib/i18n/language-provider";
import { cn } from "@/lib/utils";

function weekdayLabels(htmlLang: string) {
  return Array.from({ length: 7 }, (_, index) => {
    const day = new Date(Date.UTC(2021, 7, 2 + index));
    return day.toLocaleDateString(htmlLang, { weekday: "short" });
  });
}

function monthCells(year: number, month: number) {
  const first = new Date(year, month, 1);
  const leading = (first.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: Array<{ key: string; day: number } | null> = [];
  for (let i = 0; i < leading; i += 1) cells.push(null);
  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push({
      key: localDateKey(new Date(year, month, day)),
      day,
    });
  }
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

function currentStreak(dates: Set<string>) {
  const cursor = new Date();
  if (!dates.has(localDateKey(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
  }
  let count = 0;
  while (dates.has(localDateKey(cursor))) {
    count += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return count;
}

export function MemberAttendance() {
  const { t, locale } = useI18n();
  const htmlLang = localeMeta[locale].htmlLang;
  const [email, setEmail] = useState("");
  const [present, setPresent] = useState(false);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [cursor, setCursor] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });

  function refresh(nextEmail: string) {
    setPresent(hasCheckedInToday(nextEmail));
    setRecords(getAttendance(nextEmail));
  }

  useEffect(() => {
    const value = readClientEmail();
    setEmail(value);
    refresh(value);
  }, []);

  function checkIn() {
    checkInToday(email);
    refresh(email);
  }

  const today = localDateKey();
  const presentDays = useMemo(
    () => new Set(records.map((item) => item.date)),
    [records],
  );
  const todayRecord = records.find((item) => item.date === today);
  const monthPresent = records.filter((item) => {
    const date = new Date(`${item.date}T12:00:00`);
    return date.getFullYear() === cursor.year && date.getMonth() === cursor.month;
  }).length;
  const streak = currentStreak(presentDays);
  const cells = monthCells(cursor.year, cursor.month);
  const weekdays = weekdayLabels(htmlLang);
  const monthTitle = new Date(cursor.year, cursor.month, 1).toLocaleDateString(htmlLang, {
    month: "long",
    year: "numeric",
  });
  const todayLabel = new Date().toLocaleDateString(htmlLang, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const checkInTime = todayRecord
    ? new Date(todayRecord.createdAt).toLocaleTimeString(htmlLang, {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-heading text-3xl text-forest sm:text-4xl">
        {t.member.attendance}
      </h1>
      <p className="mt-2 text-muted">{t.member.attendanceHint}</p>

      <section className="mt-8 rounded-3xl border border-forest/10 bg-ivory p-6 text-center shadow-sm sm:p-8">
        <p className="text-xs font-semibold tracking-[0.18em] text-gold uppercase">
          {t.member.attendanceToday}
        </p>
        <p className="font-heading mt-2 text-2xl text-forest capitalize sm:text-3xl">
          {todayLabel}
        </p>
        {present ? (
          <div className="mt-6">
            <span className="inline-flex size-16 items-center justify-center rounded-full bg-gold/20 text-forest">
              <Check className="size-8" aria-hidden />
            </span>
            <p className="font-heading mt-4 text-2xl text-forest">
              {t.member.checkedIn}
            </p>
            {checkInTime ? (
              <p className="mt-1 text-sm text-muted">
                {t.member.checkedInAt.replace("{time}", checkInTime)}
              </p>
            ) : null}
          </div>
        ) : (
          <Button type="button" size="lg" className="mt-6" onClick={checkIn} disabled={!email}>
            <CalendarCheck aria-hidden />
            {t.member.checkIn}
          </Button>
        )}
      </section>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-forest/10 bg-ivory px-4 py-4 shadow-sm">
          <p className="text-xs font-semibold tracking-[0.14em] text-muted uppercase">
            {t.member.attendanceStreak}
          </p>
          <p className="mt-2 flex items-center gap-2 text-2xl font-semibold text-forest">
            <Flame className="size-5 text-gold" aria-hidden />
            {streak}
          </p>
        </div>
        <div className="rounded-2xl border border-forest/10 bg-ivory px-4 py-4 shadow-sm">
          <p className="text-xs font-semibold tracking-[0.14em] text-muted uppercase">
            {t.member.attendanceThisMonth}
          </p>
          <p className="mt-2 text-2xl font-semibold text-forest">{monthPresent}</p>
        </div>
        <div className="rounded-2xl border border-forest/10 bg-ivory px-4 py-4 shadow-sm">
          <p className="text-xs font-semibold tracking-[0.14em] text-muted uppercase">
            {t.member.attendanceTotal}
          </p>
          <p className="mt-2 text-2xl font-semibold text-forest">{records.length}</p>
        </div>
      </div>

      <section className="mt-6 rounded-3xl border border-forest/10 bg-ivory p-5 shadow-sm sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() =>
              setCursor((current) => {
                const date = new Date(current.year, current.month - 1, 1);
                return { year: date.getFullYear(), month: date.getMonth() };
              })
            }
            className="inline-flex size-10 items-center justify-center rounded-full text-forest hover:bg-beige"
            aria-label={monthTitle}
          >
            <ChevronLeft className="size-5 rtl:rotate-180" aria-hidden />
          </button>
          <h2 className="font-heading text-lg capitalize text-forest">{monthTitle}</h2>
          <button
            type="button"
            onClick={() =>
              setCursor((current) => {
                const date = new Date(current.year, current.month + 1, 1);
                return { year: date.getFullYear(), month: date.getMonth() };
              })
            }
            className="inline-flex size-10 items-center justify-center rounded-full text-forest hover:bg-beige"
            aria-label={monthTitle}
          >
            <ChevronRight className="size-5 rtl:rotate-180" aria-hidden />
          </button>
        </div>

        <div dir="ltr" className="mt-4 grid grid-cols-7 gap-1 text-center">
          {weekdays.map((label) => (
            <div
              key={label}
              className="py-1 text-[11px] font-semibold tracking-wide text-muted uppercase"
            >
              {label}
            </div>
          ))}
          {cells.map((cell, index) => {
            if (!cell) {
              return <div key={`empty-${index}`} className="aspect-square" />;
            }
            const isToday = cell.key === today;
            const isPresent = presentDays.has(cell.key);
            return (
              <button
                key={cell.key}
                type="button"
                onClick={() => {
                  if (cell.key === today && !present) checkIn();
                }}
                disabled={cell.key !== today || present}
                className={cn(
                  "aspect-square rounded-xl text-sm font-medium",
                  isPresent
                    ? "bg-forest text-ivory"
                    : isToday
                      ? "ring-2 ring-gold text-forest"
                      : "text-forest-deep",
                  cell.key === today && !present ? "hover:bg-gold/15" : "",
                )}
              >
                {cell.day}
              </button>
            );
          })}
        </div>
      </section>

      <h2 className="font-heading mt-10 text-xl text-forest">
        {t.member.attendanceHistory}
      </h2>
      {records.length === 0 ? (
        <p className="mt-3 text-sm text-muted">{t.member.attendanceEmpty}</p>
      ) : (
        <ul className="mt-4 divide-y divide-forest/10 rounded-3xl border border-forest/10 bg-ivory">
          {records.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between gap-3 px-5 py-3"
            >
              <span className="text-sm text-forest-deep">
                {new Date(`${item.date}T12:00:00`).toLocaleDateString(htmlLang, {
                  weekday: "long",
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
              <span className="rounded-full bg-gold/15 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-forest uppercase">
                {t.member.present}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
