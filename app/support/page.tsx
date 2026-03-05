import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, HelpCircle, MessageSquare, FileText, ArrowRight } from "lucide-react"
import Link from "next/link"
import { NavHeaderPublic } from "@/components/nav-header-public"
import { Footer } from "@/components/footer"

export const metadata = {
  title: "Support Center - Mindora Help",
  description: "Get help with Mindora. Find answers, submit tickets, and access support resources",
}

const categories = [
  {
    title: "Getting Started",
    desc: "Learn the basics of Mindora and set up your account",
    icon: "🚀",
    count: 8,
  },
  {
    title: "Mood Tracking",
    desc: "Tips and guides for effective mood tracking",
    icon: "📊",
    count: 12,
  },
  {
    title: "Analytics & Insights",
    desc: "Understanding your emotional data and insights",
    icon: "📈",
    count: 10,
  },
  {
    title: "Privacy & Security",
    desc: "Your data security and privacy questions",
    icon: "🔒",
    count: 6,
  },
  {
    title: "Account & Billing",
    desc: "Account settings, subscriptions, and payments",
    icon: "💳",
    count: 9,
  },
  {
    title: "Technical Issues",
    desc: "Troubleshooting and technical problems",
    icon: "🔧",
    count: 14,
  },
]

const popularArticles = [
  {
    title: "How to Track Your Mood Effectively",
    reads: "2.3k",
  },
  {
    title: "Understanding Your Emotional Growth Score",
    reads: "1.8k",
  },
  {
    title: "Guide to Using Analytics Dashboard",
    reads: "1.5k",
  },
  {
    title: "Data Privacy and Security Measures",
    reads: "1.2k",
  },
]

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <NavHeaderPublic />
      {/* Header */}
      <section className="py-20 md:py-32 border-b border-border/50">
        <div className="container mx-auto px-4 max-w-3xl space-y-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-balance">
            Support Center
          </h1>
          <p className="text-xl text-muted-foreground font-light mb-8">
            Find answers, get help, and learn how to get the most from Mindora
          </p>

          {/* Search */}
          <div className="relative max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="Search articles, FAQs, and guides..."
              className="w-full px-6 py-4 rounded-lg border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary/50 pl-12"
            />
            <Search className="absolute left-4 top-4 w-5 h-5 text-muted-foreground" />
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-16 md:py-20 border-b border-border/50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <QuickAction
              icon={<MessageSquare className="w-6 h-6" />}
              title="Contact Support"
              desc="Chat with our support team"
              href="/contact"
            />
            <QuickAction
              icon={<FileText className="w-6 h-6" />}
              title="Browse Articles"
              desc="Browse help articles"
              href="#articles"
            />
            <QuickAction
              icon={<HelpCircle className="w-6 h-6" />}
              title="Community"
              desc="Ask the community"
              href="#"
            />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12">Help Categories</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl">
            {categories.map((cat) => (
              <Card
                key={cat.title}
                className="border-border/50 shadow-premium-sm hover:shadow-premium-md card-hover cursor-pointer"
              >
                <CardContent className="pt-8">
                  <div className="text-4xl mb-3">{cat.icon}</div>
                  <h3 className="font-semibold text-lg mb-2">{cat.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{cat.desc}</p>
                  <p className="text-xs text-muted-foreground">{cat.count} articles</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Articles */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-primary/5 to-transparent border-y border-border/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12">Popular Articles</h2>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl">
            {popularArticles.map((article) => (
              <Card key={article.title} className="border-border/50 shadow-premium-sm hover:shadow-premium-md card-hover">
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-3 leading-snug">{article.title}</h3>
                  <p className="text-sm text-muted-foreground">{article.reads} reads</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12">Frequently Asked Questions</h2>

          <div className="max-w-3xl space-y-4">
            <FAQItem
              q="How secure is my emotional data?"
              a="Your data is protected with end-to-end encryption and stored securely. We comply with GDPR and have enterprise-grade security measures in place."
            />
            <FAQItem
              q="Can I export my data?"
              a="Yes! You can download your emotional data and analytics reports anytime from your account settings with user consent."
            />
            <FAQItem
              q="How do I change my subscription?"
              a="You can upgrade or downgrade your plan anytime from the Account > Billing section. Changes take effect immediately."
            />
            <FAQItem
              q="What if I forgot my password?"
              a="Click 'Forgot Password' on the login page. You'll receive a secure link to reset your password via email."
            />
            <FAQItem
              q="Is Mindora available on mobile?"
              a="Currently, Mindora is available via web browser on all devices. A native mobile app is coming soon!"
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-primary/8 to-transparent border-t border-border/50">
        <div className="container mx-auto px-4 text-center space-y-8 max-w-2xl mx-auto">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-balance">Didn't find what you need?</h2>
            <p className="text-lg text-muted-foreground">Our support team is here to help</p>
          </div>
          <Button asChild size="lg" className="h-12 px-8">
            <Link href="/contact" className="flex items-center gap-2">
              Contact Support <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  )
}

function QuickAction({ icon, title, desc, href }: { icon: React.ReactNode; title: string; desc: string; href: string }) {
  return (
    <Link
      href={href}
      className="p-6 rounded-lg border border-border bg-card hover:border-primary/50 hover:bg-primary/5 transition-all card-hover group"
    >
      <div className="p-3 rounded-lg bg-primary/10 text-primary w-fit mb-4 group-hover:bg-primary/20 transition-colors">
        {icon}
      </div>
      <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">{title}</h3>
      <p className="text-sm text-muted-foreground">{desc}</p>
    </Link>
  )
}

function FAQItem({ q, a }: { q: string; a: string }) {
  return (
    <Card className="border-border/50">
      <CardContent className="pt-6">
        <h3 className="font-semibold mb-2">{q}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{a}</p>
      </CardContent>
    </Card>
  )
}
