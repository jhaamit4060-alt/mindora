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
    default: "Mental Wellness Companion - Break Free from Stress",
    template: "%s | Mental Wellness Companion",
  },
  description:
    "Your private space to overcome stress, track mood, journal thoughts, and practice evidence-based calming exercises. Designed for exam aspirants and IT professionals.",
  keywords: [
    "mental wellness",
    "stress relief",
    "mood tracking",
    "journaling",
    "mindfulness",
    "breathing exercises",
    "exam stress",
    "work stress",
    "self-help",
    "mental health",
  ],
  authors: [{ name: "Mental Wellness Team" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Mental Wellness Companion - Break Free from Stress",
    description: "Your private space to track mood, journal, and practice calming exercises.",
    siteName: "Mental Wellness Companion",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mental Wellness Companion",
    description: "Break free from stress with mood tracking, journaling, and calming exercises.",
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
