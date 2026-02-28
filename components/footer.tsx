import Link from "next/link"
import { Heart, Mail } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border/50 bg-card/40 backdrop-blur-xl">
      <div className="container mx-auto px-4 py-16 md:py-24">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/15 text-primary">
                <Heart className="w-5 h-5" />
              </div>
              <span className="font-bold text-xl">Mindora</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed font-light">
              Enterprise-grade emotional intelligence analytics. Transform growth with AI-powered insights and advanced analytics.
            </p>
          </div>

          {/* Product */}
          <div className="space-y-6">
            <h3 className="font-semibold text-sm tracking-wide uppercase text-foreground">Product</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/pricing" className="text-muted-foreground hover:text-primary transition-colors duration-300 font-medium">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/features" className="text-muted-foreground hover:text-primary transition-colors duration-300 font-medium">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-muted-foreground hover:text-primary transition-colors duration-300 font-medium">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/(protected)/analytics" className="text-muted-foreground hover:text-primary transition-colors duration-300 font-medium">
                  Analytics
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-6">
            <h3 className="font-semibold text-sm tracking-wide uppercase text-foreground">Company</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors duration-300 font-medium">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-muted-foreground hover:text-primary transition-colors duration-300 font-medium">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-muted-foreground hover:text-primary transition-colors duration-300 font-medium">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors duration-300 font-medium">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Support */}
          <div className="space-y-6">
            <h3 className="font-semibold text-sm tracking-wide uppercase text-foreground">Legal & Support</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors duration-300 font-medium">
                  Privacy & Security
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors duration-300 font-medium">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-muted-foreground hover:text-primary transition-colors duration-300 font-medium">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-muted-foreground hover:text-primary transition-colors duration-300 font-medium">
                  Support Center
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-border/50 pt-12 flex flex-col sm:flex-row items-center justify-between gap-6 text-sm">
          <p className="text-muted-foreground font-light">
            © {currentYear} Mindora Technologies. All rights reserved. Your data remains your privacy.
          </p>
          <div className="flex items-center gap-6">
            <a href="mailto:contact@mindora.app" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-300 font-medium">
              <Mail className="w-4 h-4" />
              <span>contact@mindora.app</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
