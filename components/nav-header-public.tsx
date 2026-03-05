"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import Image from "next/image"
import { Menu, X } from "lucide-react"
import { useState } from "react"

const PUBLIC_NAV_ITEMS = [
  { href: "/features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
]

export function NavHeaderPublic() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-card/95 backdrop-blur-xl supports-[backdrop-filter]:bg-card/90 shadow-sm">
      <div className="w-full flex h-16 items-center justify-between px-4 md:px-6 lg:px-12 xl:px-16">
        <Link
          href="/"
          className="flex items-center gap-2.5 text-xl font-bold hover:opacity-80 transition-opacity"
        >
          <div className="relative w-10 h-10 overflow-hidden">
            <Image src="/images/image.png" alt="Mindora Logo" fill className="object-contain" priority />
          </div>
          <span className="hidden sm:inline bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent font-bold">
            Mindora
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {PUBLIC_NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors rounded-md hover:bg-primary/10"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center gap-4">
          <ThemeToggle />

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Button asChild variant="ghost" size="sm">
              <Link href="/login">Sign In</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-primary/10 rounded-lg"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border/40">
          <nav className="flex flex-col p-4 gap-2">
            {PUBLIC_NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors rounded-md hover:bg-primary/10"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="flex gap-2 pt-2 border-t border-border/40 mt-2">
              <Button asChild variant="ghost" size="sm" className="flex-1">
                <Link href="/login">Sign In</Link>
              </Button>
              <Button asChild size="sm" className="flex-1">
                <Link href="/signup">Get Started</Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
