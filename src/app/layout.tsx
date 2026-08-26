import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import {
  Noto_Naskh_Arabic,
  Noto_Sans_Arabic,
  Playfair_Display,
  Poppins,
} from "next/font/google";
import { Providers } from "@/components/Providers";
import { defaultLocale, localeMeta, locales, type Locale } from "@/lib/i18n/types";
import { LOCALE_COOKIE, THEME_COOKIE } from "@/lib/prefs";
import type { Theme } from "@/lib/theme";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin", "latin-ext"],
  variable: "--font-playfair",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const naskh = Noto_Naskh_Arabic({
  subsets: ["arabic"],
  variable: "--font-naskh",
  display: "swap",
});

const arabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  variable: "--font-arabic",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://hagereadingclub.org"),
  title: {
    default: "Hage Reading Club | Read, Learn, Share & Grow",
    template: "%s | Hage Reading Club",
  },
  description:
    "Hage Reading Club is a community that encourages reading, knowledge sharing, meaningful discussions, and personal growth.",
  keywords: [
    "Hage Reading Club",
    "reading community",
    "book club",
    "Somali reading club",
    "knowledge sharing",
  ],
  authors: [{ name: "Hage Reading Club" }],
  openGraph: {
    type: "website",
    locale: "so_SO",
    alternateLocale: ["en_US", "ar_SO"],
    url: "https://hagereadingclub.org",
    siteName: "Hage Reading Club",
    title: "Hage Reading Club | Read, Learn, Share & Grow",
    description:
      "Hage Reading Club is a community that encourages reading, knowledge sharing, meaningful discussions, and personal growth.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hage Reading Club | Read, Learn, Share & Grow",
    description:
      "Hage Reading Club is a community that encourages reading, knowledge sharing, meaningful discussions, and personal growth.",
  },
  icons: {
    icon: [{ url: "/logo.png", type: "image/png" }],
    apple: "/logo.png",
    shortcut: "/logo.png",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#1B4332",
  width: "device-width",
  initialScale: 1,
};

function isLocale(value: string | undefined): value is Locale {
  return value !== undefined && (locales as readonly string[]).includes(value);
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const jar = await cookies();
  const localeCookie = jar.get(LOCALE_COOKIE)?.value;
  const locale = isLocale(localeCookie) ? localeCookie : defaultLocale;
  const theme: Theme = jar.get(THEME_COOKIE)?.value === "dark" ? "dark" : "light";
  const meta = localeMeta[locale];

  return (
    <html
      lang={meta.htmlLang}
      dir={meta.dir}
      suppressHydrationWarning
      className={`${playfair.variable} ${poppins.variable} ${naskh.variable} ${arabic.variable} h-full antialiased${theme === "dark" ? " dark" : ""}`}
    >
      <body className="flex min-h-full flex-col bg-page text-charcoal dark:text-[#f4ede1]">
        <Providers initialTheme={theme} initialLocale={locale}>
          {children}
        </Providers>
      </body>
    </html>
  );
}
