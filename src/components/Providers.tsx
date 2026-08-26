"use client";

import type { ReactNode } from "react";
import { LanguageProvider } from "@/lib/i18n/language-provider";
import type { Locale } from "@/lib/i18n/types";
import { ThemeProvider, type Theme } from "@/lib/theme";

export function Providers({
  children,
  initialTheme = "light",
  initialLocale = "so",
}: {
  children: ReactNode;
  initialTheme?: Theme;
  initialLocale?: Locale;
}) {
  return (
    <ThemeProvider initialTheme={initialTheme}>
      <LanguageProvider initialLocale={initialLocale}>{children}</LanguageProvider>
    </ThemeProvider>
  );
}
