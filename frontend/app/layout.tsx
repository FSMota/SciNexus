import type { Metadata } from "next";
import { DM_Sans, Space_Grotesk } from "next/font/google";
import "../styles.css";
import { Toaster } from "@/components/ui/sonner";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "SciNexus",
  description: "The repository for collaborative scientific discovery.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${dmSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <div className="flex-1">{children}
          <Toaster richColors position="top-right" />
        </div>
        <footer className="border-t border-border/70 bg-background px-4 py-8 text-center text-sm text-muted-foreground sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            © 2026 SciNexus · Plataforma de eventos científicos
          </div>
        </footer>
      </body>
    </html>
  );
}
