"use client";

import { Moon, Sun } from "lucide-react";
import { useI18n } from "@/lib/i18n/language-provider";
import { useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";

export function ThemeToggle({
  light = false,
  className,
}: {
  light?: boolean;
  className?: string;
}) {
  const { theme, toggleTheme } = useTheme();
  const { t } = useI18n();
  const dark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={dark ? t.nav.themeToLight : t.nav.themeToDark}
      aria-pressed={dark}
      className={cn(
        "inline-flex size-11 items-center justify-center rounded-full border backdrop-blur transition-colors focus-visible:ring-2 focus-visible:ring-gold focus-visible:outline-none",
        light
          ? "border-ivory/30 bg-ivory/10 text-ivory hover:bg-ivory/20"
          : "border-forest/15 bg-ivory/80 text-forest hover:bg-beige/70",
        className,
      )}
    >
      {dark ? <Sun className="size-4" aria-hidden /> : <Moon className="size-4" aria-hidden />}
    </button>
  );
}
