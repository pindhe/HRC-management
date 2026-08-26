export const THEME_COOKIE = "hage-theme";
export const LOCALE_COOKIE = "hage-locale";
export const SESSION_COOKIE = "hage-session";

export function writeClientCookie(name: string, value: string) {
  document.cookie = `${name}=${value}; path=/; max-age=31536000; SameSite=Lax`;
}
