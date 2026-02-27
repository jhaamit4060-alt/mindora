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
      {/* Premium Hero Section */}
      <section className="relative pt-24 pb-28 md:pt-40 md:pb-48">
        <div className="absolute inset-0 overflow-hidden -z-10">
          <div className="absolute -top-32 right-1/4 w-96 h-96 bg-primary/8 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-secondary/8 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 right-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 flex flex-col items-center text-center space-y-10">
          <div className="space-y-8 max-w-5xl stagger-child">
            <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary w-fit mx-auto">
              <Sparkles className="w-4 h-4" />
              <span>Emotional Intelligence Analytics</span>
            </div>
            
            <h1 className="text-7xl md:text-8xl font-bold tracking-tight text-balance leading-tight">
              Understand Your{" "}
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Emotional Self
              </span>
            </h1>
            
            <p className="text-2xl md:text-3xl text-muted-foreground leading-relaxed max-w-3xl mx-auto font-light">
              Advanced analytics for emotional growth. Track patterns, identify triggers, and unlock clarity with AI-powered insights.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-2 stagger-child">
            <Button asChild size="lg" className="h-14 px-10 text-base font-semibold shadow-premium-lg hover:shadow-premium-xl card-hover">
              <Link href="/signup" className="flex items-center gap-3">
                Start Free <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-14 px-10 text-base font-semibold border-border/50 card-hover">
              <Link href="#analytics-demo" className="flex items-center gap-2">
                View Demo <BarChart3 className="w-5 h-5" />
              </Link>
            </Button>
          </div>

          <p className="text-sm text-muted-foreground/80 pt-8 stagger-child">
            <span className="font-medium">Free to start</span> • No credit card required • Privacy first
          </p>
        </div>
      </section>

      {/* Emotional Intelligence Analytics Section */}
      <section className="py-24 md:py-40 border-t border-border/50 bg-gradient-to-b from-transparent via-primary/2 to-transparent">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20 space-y-6">
            <h2 className="text-5xl md:text-6xl font-bold text-balance leading-tight">
              Enterprise-Grade Analytics
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-light">
              Professional insights designed to help you master your emotional patterns and unlock personal growth
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 stagger-child">
            <AnalyticsCard
              icon={<TrendingUp className="w-7 h-7" />}
              title="Emotional Volatility Score"
              desc="Measure emotional stability over time and identify your peak stress periods with precision"
            />
            <AnalyticsCard
              icon={<BarChart3 className="w-7 h-7" />}
              title="Burnout Risk Indicator"
              desc="Real-time assessment of your stress levels with predictive alerts and recommendations"
            />
            <AnalyticsCard
              icon={<Sparkles className="w-7 h-7" />}
              title="Growth Tracking"
              desc="Monitor emotional growth milestones and celebrate progress with detailed metrics"
            />
          </div>
        </div>
      </section>

      {/* AI Insights Section */}
      <section className="py-24 md:py-40 bg-gradient-to-b from-primary/3 via-transparent to-secondary/2">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 stagger-child">
              <div className="space-y-4">
                <h2 className="text-5xl md:text-6xl font-bold text-balance leading-tight">
                  AI-Powered Emotional Intelligence
                </h2>
                <p className="text-xl text-muted-foreground leading-relaxed font-light">
                  Advanced machine learning discovers hidden patterns in your emotional data, delivering actionable insights you can trust.
                </p>
              </div>

              <ul className="space-y-4 pt-4">
                <InsightItem text="Smart weekly emotional summaries" />
                <InsightItem text="Predictive mood trend forecasting" />
                <InsightItem text="Intelligent trigger identification" />
                <InsightItem text="Personalized wellness recommendations" />
              </ul>
            </div>

            <div className="relative stagger-child">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-secondary/10 to-accent/20 rounded-2xl blur-2xl"></div>
              <div className="relative bg-gradient-to-br from-primary/15 via-secondary/8 to-accent/12 rounded-2xl p-10 border border-border/50 card-hover shadow-premium-lg">
                <div className="aspect-square bg-gradient-to-br from-primary/25 to-secondary/15 rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-32 h-32 text-primary/30" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy & Security Section */}
      <section className="py-24 md:py-40 border-t border-border/50 bg-gradient-to-b from-transparent via-accent/2 to-transparent">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="relative stagger-child order-2 md:order-1">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-primary/10 to-secondary/15 rounded-2xl blur-2xl"></div>
              <div className="relative bg-gradient-to-br from-accent/15 via-primary/8 to-secondary/12 rounded-2xl p-10 border border-border/50 card-hover shadow-premium-lg">
                <div className="aspect-square bg-gradient-to-br from-accent/25 to-primary/15 rounded-xl flex items-center justify-center">
                  <Shield className="w-32 h-32 text-accent/30" />
                </div>
              </div>
            </div>

            <div className="space-y-8 stagger-child order-1 md:order-2">
              <div className="space-y-4">
                <h2 className="text-5xl md:text-6xl font-bold text-balance leading-tight">
                  Privacy & Security, Always
                </h2>
                <p className="text-xl text-muted-foreground leading-relaxed font-light">
                  Your emotional data is sacred. Enterprise-grade encryption protects every insight, and we never share your information with third parties.
                </p>
              </div>

              <ul className="space-y-4 pt-4">
                <InsightItem text="End-to-end encryption standard" />
                <InsightItem text="Zero third-party data sharing" />
                <InsightItem text="GDPR & privacy compliant" />
                <InsightItem text="Download or delete data anytime" />
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Premium CTA Section */}
      <section className="py-28 md:py-44 bg-gradient-to-br from-primary/8 via-secondary/5 to-accent/6 border-t border-border/50 relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 text-center space-y-10">
          <div className="space-y-6 max-w-3xl mx-auto stagger-child">
            <h2 className="text-6xl md:text-7xl font-bold text-balance leading-tight">
              Begin Your Transformation
            </h2>
            <p className="text-2xl text-muted-foreground font-light">
              Join thousands of people gaining clarity on their emotions and building lasting resilience.
            </p>
          </div>

          <Button asChild size="lg" className="h-14 px-12 text-base font-semibold shadow-premium-lg hover:shadow-premium-xl card-hover stagger-child">
            <Link href="/signup" className="flex items-center gap-3 mx-auto w-fit">
              Get Started Free <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>

          <p className="text-sm text-muted-foreground/70 pt-8 max-w-2xl mx-auto stagger-child">
            Mindora is a self-care platform, not medical advice. Always consult healthcare professionals for clinical mental health concerns.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  )
}

function AnalyticsCard({ icon, title, desc }: any) {
  return (
    <div className="group p-8 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 hover:bg-card shadow-premium-sm hover:shadow-premium-md transition-all duration-300 card-hover">
      <div className="p-3 w-fit mb-5 rounded-lg bg-gradient-to-br from-primary/15 to-primary/5 text-primary group-hover:from-primary/25 group-hover:to-primary/10 transition-all duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3 text-foreground">{title}</h3>
      <p className="text-muted-foreground leading-relaxed text-sm">{desc}</p>
    </div>
  )
}

function InsightItem({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-4 group">
      <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-300" />
      <span className="text-muted-foreground font-medium group-hover:text-foreground transition-colors duration-300">{text}</span>
    </div>
  )
}
