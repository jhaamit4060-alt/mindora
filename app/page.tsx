import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Footer } from "@/components/footer"
import {
  TrendingUp,
  BarChart3,
  Lock,
  Zap,
  CheckCircle2,
  ArrowRight,
  Activity,
  Shield,
  Sparkles,
} from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background dark:bg-background text-foreground overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-20 pb-24 md:pt-32 md:pb-40">
        <div className="absolute inset-0 overflow-hidden -z-10">
          <div className="absolute top-40 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-32 left-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 flex flex-col items-center text-center space-y-8">
          <div className="space-y-6 max-w-4xl">
            <h1 className="text-6xl md:text-7xl font-bold tracking-tight text-balance leading-tight">
              Emotional Intelligence,{" "}
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Amplified
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Analytics-driven emotional growth. Track your patterns, understand your triggers, and unlock clarity with AI-powered insights.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button asChild size="lg" className="h-12 px-8 text-base font-semibold">
              <Link href="/signup" className="flex items-center gap-2">
                Start Tracking <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-12 px-8 text-base font-semibold">
              <Link href="#analytics-demo">View Analytics Demo</Link>
            </Button>
          </div>

          <p className="text-sm text-muted-foreground pt-6">
            Free to start • No credit card required • Privacy first
          </p>
        </div>
      </section>

      {/* Emotional Intelligence Analytics Section */}
      <section className="py-20 md:py-32 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-balance">
              Your Emotional Intelligence Dashboard
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Professional-grade analytics designed to help you understand your emotional patterns
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <AnalyticsCard
              icon={<TrendingUp className="w-6 h-6" />}
              title="Emotional Volatility Score"
              desc="Measure emotional stability over time and identify your peak stress periods"
            />
            <AnalyticsCard
              icon={<BarChart3 className="w-6 h-6" />}
              title="Burnout Risk Indicator"
              desc="Real-time assessment of your stress levels with low, moderate, or high ratings"
            />
            <AnalyticsCard
              icon={<Sparkles className="w-6 h-6" />}
              title="Growth Tracking"
              desc="Monitor your emotional growth milestones and celebrate progress over weeks"
            />
          </div>
        </div>
      </section>

      {/* AI Insights Section */}
      <section className="py-20 md:py-32 bg-muted/40">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
                  AI-Powered Insights
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Get personalized emotional insights powered by advanced analytics. Discover patterns you didn't know existed.
                </p>
              </div>

              <ul className="space-y-4">
                <InsightItem text="Weekly emotional summary cards" />
                <InsightItem text="Predictive mood trend alerts" />
                <InsightItem text="Smart trigger identification" />
                <InsightItem text="Personalized wellness suggestions" />
              </ul>
            </div>

            <div className="bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 rounded-2xl p-8 border border-border/50">
              <div className="aspect-square bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-24 h-24 text-primary/40" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy & Security Section */}
      <section className="py-20 md:py-32 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="bg-gradient-to-br from-accent/10 via-primary/5 to-secondary/10 rounded-2xl p-8 border border-border/50 order-2 md:order-1">
              <div className="aspect-square bg-gradient-to-br from-accent/20 to-primary/20 rounded-lg flex items-center justify-center">
                <Shield className="w-24 h-24 text-accent/40" />
              </div>
            </div>

            <div className="space-y-8 order-1 md:order-2">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                  Privacy & Security First
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Your emotional data is deeply personal. We encrypt everything end-to-end and never share your insights with third parties.
                </p>
              </div>

              <ul className="space-y-4">
                <InsightItem text="End-to-end encryption" />
                <InsightItem text="Zero third-party sharing" />
                <InsightItem text="GDPR compliant" />
                <InsightItem text="Download your data anytime" />
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 border-t border-border">
        <div className="container mx-auto px-4 text-center space-y-8">
          <div className="space-y-4 max-w-2xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-balance">
              Start Your Emotional Intelligence Journey
            </h2>
            <p className="text-lg text-muted-foreground">
              Join thousands of people gaining clarity on their emotions and building resilience.
            </p>
          </div>

          <Button asChild size="lg" className="h-12 px-8 text-base font-semibold">
            <Link href="/signup" className="flex items-center gap-2 mx-auto w-fit">
              Get Started Free <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>

          <p className="text-sm text-muted-foreground pt-4">
            Mindora is a self-care tool, not medical advice. Always consult healthcare professionals for mental health concerns.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  )
}

function AnalyticsCard({ icon, title, desc }: any) {
  return (
    <div className="group p-8 rounded-xl border border-border/50 bg-card hover:border-primary/50 hover:bg-primary/5 transition-all">
      <div className="p-3 w-fit mb-4 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{desc}</p>
    </div>
  )
}

function InsightItem({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3">
      <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
      <span className="text-muted-foreground">{text}</span>
    </div>
  )
}
