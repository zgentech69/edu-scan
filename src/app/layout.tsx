import type { Metadata } from "next";
import { Fraunces, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

const fraunces = Fraunces({ subsets: ["latin"], variable: '--font-fraunces' });
const ibmPlexSans = IBM_Plex_Sans({ subsets: ["latin"], weight: ["400", "500", "600"], variable: '--font-ibm-sans' });
const ibmPlexMono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: '--font-ibm-mono' });

export const metadata: Metadata = {
  title: "Campus QR Subject Portal",
  description: "Access your division's subjects and study materials instantly.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${fraunces.variable} ${ibmPlexSans.variable} ${ibmPlexMono.variable} font-sans bg-paper text-ink min-h-screen flex flex-col selection:bg-brass selection:text-paper`}>
        <Breadcrumbs />
        <div className="flex-1 flex flex-col">
          {children}
        </div>
        <footer className="w-full py-6 mt-auto border-t border-ink/10 print:hidden bg-paper">
          <div className="text-center text-sm text-ink/60 font-medium">
            Made by <a href="https://zgentech.vercel.app" target="_blank" rel="noopener noreferrer" className="text-ink font-bold hover:underline transition-all">ZGenTech Team</a>
          </div>
        </footer>
      </body>
    </html>
  );
}
