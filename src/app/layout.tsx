
import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Belleza, Literata } from "next/font/google";
import { AppProviders } from "./providers";
import { CookieConsentBanner } from "@/components/layout/CookieConsentBanner";

const belleza = Belleza({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-belleza",
  weight: "400",
});

const literata = Literata({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-literata",
});


export const metadata: Metadata = {
  title: "Gift Inn",
  description: "Experience tranquility and luxury at Gift Inn, your home away from home.",
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🏨</text></svg>'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background antialiased",
          belleza.variable,
          literata.variable
        )}
      >
        <AppProviders>
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster />
          <CookieConsentBanner />
        </AppProviders>
      </body>
    </html>
  );
}
