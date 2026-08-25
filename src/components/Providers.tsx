"use client";

import type { ReactNode } from "react";
import { LanguageProvider } from "@/lib/i18n/language-provider";

export function Providers({ children }: { children: ReactNode }) {
  return <LanguageProvider>{children}</LanguageProvider>;
}
