import { ar } from "./ar";
import { en } from "./en";
import { so } from "./so";
import type { Dictionary, Locale } from "./types";

export const dictionaries: Record<Locale, Dictionary> = {
  so,
  en,
  ar,
};

export { ar, en, so };
export type { Dictionary, Locale } from "./types";
export {
  defaultLocale,
  localeMeta,
  locales,
  STORAGE_KEY,
} from "./types";
