import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "Mindora - Emotional Intelligence Analytics Platform",
    template: "%s | Mindora",
  },
  description:
    "Transform your emotional growth with AI-powered insights and analytics. Track mood patterns, journal privately, and unlock emotional intelligence with Mindora.",
  keywords: [
    "emotional intelligence",
    "mood tracking",
    "analytics",
    "journaling",
    "mental wellness",
    "stress management",
    "AI insights",
    "emotional growth",
    "private journaling",
    "mental health",
  ],
  authors: [{ name: "Mindora Team" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Mindora - Emotional Intelligence Analytics",
    description: "AI-powered emotional intelligence platform for tracking mood, journaling, and personal growth.",
    siteName: "Mindora",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mindora",
    description: "Transform your emotional growth with AI-powered insights and analytics.",
  },
  robots: {
    index: true,
    follow: true,
  },
  generator: "v0.app",
  icons: {
    icon: "/favicon.png",
    apple: "/mindora-logo.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem storageKey="wellness-theme">
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
