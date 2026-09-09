import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import { LocaleProvider } from "@/components/i18n/locale-provider";
import { ThemeProvider } from "@/components/theme-provider";
import {
  isLocale,
  localeToHtmlLang,
  LOCALE_COOKIE,
} from "@/lib/i18n/locale";
import { isTheme, THEME_COOKIE } from "@/lib/theme";
import { cn } from "@/lib/cn";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "WorkRR",
  description: "WorkRR connects customers with nearby professionals.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "WorkRR",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F8FAFC" },
    { media: "(prefers-color-scheme: dark)", color: "#0F172A" },
  ],
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const cookieStore = await cookies();
  const stored = cookieStore.get(THEME_COOKIE)?.value;
  const theme = isTheme(stored) ? stored : "light";
  const storedLocale = cookieStore.get(LOCALE_COOKIE)?.value;
  const locale = isLocale(storedLocale) ? storedLocale : "en";

  return (
    <html
      lang={localeToHtmlLang(locale)}
      suppressHydrationWarning
      className={cn(
        inter.variable,
        inter.className,
        "h-full antialiased",
        theme === "dark" && "dark",
      )}
      style={{ colorScheme: theme }}
    >
      <body className="min-h-dvh bg-chrome font-sans text-foreground">
        <ThemeProvider initialTheme={theme}>
          <LocaleProvider initialLocale={locale}>{children}</LocaleProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
