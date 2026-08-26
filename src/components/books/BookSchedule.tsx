"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n/language-provider";
import { localeMeta } from "@/lib/i18n/types";
import { formatDateTime, formatRemaining, remainingMs } from "@/lib/book-dates";
import { cn } from "@/lib/utils";

export function BookSchedule({
  startDate,
  endDate,
  className,
}: {
  startDate: string;
  endDate: string;
  className?: string;
}) {
  const { t, locale } = useI18n();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 30_000);
    return () => window.clearInterval(id);
  }, []);

  if (!startDate && !endDate) return null;

  const left = remainingMs(endDate, now);
  const ended = left !== null && left <= 0;
  const htmlLang = localeMeta[locale].htmlLang;

  return (
    <span className={cn("block space-y-0.5 text-xs", className)}>
      {startDate ? (
        <span className="block text-muted">
          {t.member.dateStart}: {formatDateTime(startDate, htmlLang)}
        </span>
      ) : null}
      {endDate ? (
        <span className="block text-muted">
          {t.member.dateEnd}: {formatDateTime(endDate, htmlLang)}
        </span>
      ) : null}
      {left !== null ? (
        <span className={cn("block font-medium", ended ? "text-red-600" : "text-forest")}>
          {ended
            ? t.member.timeEnded
            : `${t.member.timeLeft}: ${formatRemaining(left)}`}
        </span>
      ) : null}
    </span>
  );
}
