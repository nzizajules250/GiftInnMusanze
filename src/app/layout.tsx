
import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Belleza, Literata } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";

const belleza = Belleza({
  subsets: ["latin"],
  display: "swap",
  weight: "400",
  variable: "--font-belleza",
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
    icon: 'data:;base64,iVBORw0KGgo='
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
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
