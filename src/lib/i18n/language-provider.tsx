"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { ar } from "./ar";
import { en } from "./en";
import { so } from "./so";
import { LOCALE_COOKIE, writeClientCookie } from "@/lib/prefs";
import {
  defaultLocale,
  localeMeta,
  locales,
  STORAGE_KEY,
  type Dictionary,
  type Locale,
} from "./types";

const dictionaries: Record<Locale, Dictionary> = { so, en, ar };

type LanguageContextValue = {
  locale: Locale;
  dir: "ltr" | "rtl";
  t: Dictionary;
  setLocale: (locale: Locale) => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);
const listeners = new Set<() => void>();

function isLocale(value: string | null): value is Locale {
  return value !== null && (locales as readonly string[]).includes(value);
}

function applyDocumentLocale(locale: Locale) {
  const meta = localeMeta[locale];
  document.documentElement.lang = meta.htmlLang;
  document.documentElement.dir = meta.dir;
}

function getStoredLocale(): Locale {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return isLocale(stored) ? stored : defaultLocale;
  } catch {
    return defaultLocale;
  }
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function emit() {
  listeners.forEach((listener) => listener());
}

export function LanguageProvider({
  children,
  initialLocale = defaultLocale,
}: {
  children: ReactNode;
  initialLocale?: Locale;
}) {
  const locale = useSyncExternalStore(subscribe, getStoredLocale, () => initialLocale);

  useEffect(() => {
    const stored = getStoredLocale();
    writeClientCookie(LOCALE_COOKIE, stored);
    applyDocumentLocale(stored);
  }, []);

  const setLocale = useCallback((next: Locale) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore quota / private mode */
    }
    writeClientCookie(LOCALE_COOKIE, next);
    applyDocumentLocale(next);
    emit();
  }, []);

  const value = useMemo<LanguageContextValue>(
    () => ({
      locale,
      dir: localeMeta[locale].dir,
      t: dictionaries[locale],
      setLocale,
    }),
    [locale, setLocale],
  );

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useI18n must be used within LanguageProvider");
  }
  return context;
}
