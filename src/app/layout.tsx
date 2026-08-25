import type { Metadata, Viewport } from "next";
import {
  Noto_Naskh_Arabic,
  Noto_Sans_Arabic,
  Playfair_Display,
  Poppins,
} from "next/font/google";
import { Providers } from "@/components/Providers";
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
    icon: [{ url: "/logo.jpg", type: "image/jpeg" }],
    apple: "/logo.jpg",
    shortcut: "/logo.jpg",
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

const localeBootstrap = `
try {
  var l = localStorage.getItem("hage-locale");
  var html = document.documentElement;
  if (l === "ar") { html.lang = "ar"; html.dir = "rtl"; }
  else if (l === "en") { html.lang = "en"; html.dir = "ltr"; }
  else { html.lang = "so"; html.dir = "ltr"; }
} catch (e) {}
`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="so"
      dir="ltr"
      className={`${playfair.variable} ${poppins.variable} ${naskh.variable} ${arabic.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: localeBootstrap }} />
      </head>
      <body className="flex min-h-full flex-col bg-ivory text-charcoal">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
