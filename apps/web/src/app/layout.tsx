import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";

import { Toaster } from "sonner";

import { AuthProvider } from "@/lib/auth-context";
import "@supporthub/ui/globals.css";
import { Providers } from "@/components/providers";

const fontSans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const fontMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "SupportHub | AI-Powered Customer Support Ticketing System",
    template: "%s | SupportHub",
  },
  description:
    "SupportHub is an AI-powered customer support ticketing system that connects with Gmail and Outlook. Convert inbound support emails into structured tickets automatically, route them to the right agents, and resolve customer issues in real-time.",
  keywords: [
    "customer support",
    "helpdesk",
    "ticketing system",
    "AI customer service",
    "Gmail support integration",
    "Outlook ticketing",
    "multi-tenant workspace",
    "shared inbox",
  ],
  authors: [{ name: "SupportHub team" }],
  metadataBase: new URL("https://supporthub.bond"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "SupportHub | AI-Powered Customer Support Ticketing System",
    description:
      "Convert inbound support emails into structured tickets automatically, route them to the right agents, and resolve customer issues in real-time.",
    url: "https://supporthub.bond",
    siteName: "SupportHub",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SupportHub | AI-Powered Customer Support Ticketing System",
    description:
      "Convert inbound support emails into structured tickets automatically, route them to the right agents, and resolve customer issues in real-time.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <Providers>
          <AuthProvider>
            {children}
            <Toaster position="top-center" richColors />
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
