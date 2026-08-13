import type { Metadata } from "next";
import { Fraunces, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

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
      <body className={`${fraunces.variable} ${ibmPlexSans.variable} ${ibmPlexMono.variable} font-sans bg-paper text-ink min-h-screen selection:bg-brass selection:text-paper`}>
        {children}
      </body>
    </html>
  );
}
