import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans, IBM_Plex_Serif } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { PiedDePage } from "@/components/PiedDePage";
import { SITE_URL } from "@/lib/entreprise";
import { meta } from "@/lib/meta";
import "./globals.css";

const serif = IBM_Plex_Serif({
  weight: ["600"],
  subsets: ["latin"],
  variable: "--font-plex-serif",
  display: "swap",
});

const sans = IBM_Plex_Sans({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-plex-sans",
  display: "swap",
});

const mono = IBM_Plex_Mono({
  weight: ["500"],
  subsets: ["latin"],
  variable: "--font-plex-mono",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  ...meta({ chemin: "/" }),
};

export const viewport: Viewport = {
  themeColor: "#f7f5f0",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={`${serif.variable} ${sans.variable} ${mono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <div className="flex-1">{children}</div>
        <PiedDePage />
        <Analytics />
      </body>
    </html>
  );
}
