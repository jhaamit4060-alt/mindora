import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart3,
  Brain,
  Lock,
  Zap,
  TrendingUp,
  BookOpen,
  Bell,
  Download,
  Users,
  Smartphone,
  ArrowRight,
} from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: "Features - Mindora Emotional Intelligence Analytics",
  description: "Explore powerful features designed to help you master your emotions and unlock personal growth",
}

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="py-20 md:py-32 border-b border-border/50">
        <div className="container mx-auto px-4 text-center space-y-6 max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-balance">
            Powerful Features for Emotional Intelligence
          </h1>
          <p className="text-xl text-muted-foreground font-light">
            Advanced analytics, AI insights, and tools to master your emotional growth
          </p>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <FeatureCard
              icon={<BarChart3 className="w-8 h-8" />}
              title="Advanced Analytics Dashboard"
              desc="Professional-grade metrics to track emotional volatility, burnout risk, and growth patterns with real-time insights"
            />
            <FeatureCard
              icon={<Brain className="w-8 h-8" />}
              title="AI-Powered Insights"
              desc="Machine learning discovers hidden patterns in your emotional data and provides personalized recommendations"
            />
            <FeatureCard
              icon={<TrendingUp className="w-8 h-8" />}
              title="Mood Tracking"
              desc="1-10 scale tracking with detailed mood patterns, triggers, and comprehensive weekly emotional summaries"
            />
            <FeatureCard
              icon={<BookOpen className="w-8 h-8" />}
              title="Private Journaling"
              desc="Safe, encrypted space to express thoughts freely with full-text search and journal organization"
            />
            <FeatureCard
              icon={<Bell className="w-8 h-8" />}
              title="Smart Alerts"
              desc="Predictive mood trend alerts, burnout risk notifications, and personalized wellness suggestions"
            />
            <FeatureCard
              icon={<Download className="w-8 h-8" />}
              title="Data Export"
              desc="Download your emotional analytics and insights as detailed PDF reports anytime with user consent"
            />
          </div>
        </div>
      </section>

      {/* Premium Features */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-primary/5 to-transparent border-y border-border/50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto mb-12 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Premium Features</h2>
            <p className="text-lg text-muted-foreground">Unlock deeper insights with advanced functionality</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <FeatureCard
              icon={<Users className="w-8 h-8" />}
              title="Therapist Integration"
              desc="Share selected insights with your therapist or counselor for better-informed sessions"
            />
            <FeatureCard
              icon={<Smartphone className="w-8 h-8" />}
              title="Mobile App"
              desc="Full-featured mobile application for mood tracking and quick journaling on the go"
            />
            <FeatureCard
              icon={<Zap className="w-8 h-8" />}
              title="Smart Recommendations"
              desc="AI-driven wellness suggestions based on your unique emotional patterns and triggers"
            />
            <FeatureCard
              icon={<Lock className="w-8 h-8" />}
              title="Advanced Privacy"
              desc="Additional security layers, data anonymization options, and granular privacy controls"
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4 text-center space-y-8 max-w-2xl mx-auto">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-balance">Ready to Transform Your Emotions?</h2>
            <p className="text-lg text-muted-foreground">Start tracking with Mindora today, free forever</p>
          </div>
          <Button asChild size="lg" className="h-12 px-8">
            <Link href="/signup" className="flex items-center gap-2">
              Get Started Free <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <Card className="border-border/50 shadow-premium-sm hover:shadow-premium-md card-hover">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="p-3 rounded-lg bg-primary/10 text-primary">{icon}</div>
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground leading-relaxed">{desc}</p>
      </CardContent>
    </Card>
  )
}
