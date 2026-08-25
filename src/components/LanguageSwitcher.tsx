"use client";

import { useI18n } from "@/lib/i18n/language-provider";
import { locales, type Locale } from "@/lib/i18n/types";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ className }: { className?: string }) {
  const { locale, setLocale } = useI18n();

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border border-forest/15 bg-ivory/70 p-1 text-xs font-semibold tracking-wide backdrop-blur-md",
        className,
      )}
      role="group"
      aria-label="Language"
    >
      {locales.map((code, index) => {
        const selected = locale === code;
        return (
          <span key={code} className="flex items-center">
            {index > 0 ? (
              <span className="px-0.5 text-forest/25" aria-hidden>
                |
              </span>
            ) : null}
            <button
              type="button"
              onClick={() => setLocale(code as Locale)}
              aria-pressed={selected}
              className={cn(
                "rounded-full px-2.5 py-1 transition-colors focus-visible:ring-2 focus-visible:ring-gold focus-visible:outline-none",
                selected
                  ? "bg-forest text-ivory"
                  : "text-forest/70 hover:text-forest",
              )}
            >
              {code.toUpperCase()}
            </button>
          </span>
        );
      })}
    </div>
  );
}
