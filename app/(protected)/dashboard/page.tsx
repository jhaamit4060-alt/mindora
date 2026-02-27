import Link from "next/link"
import { getCurrentUser } from "@/lib/auth"
import { findUserById, getMoodEntries, getJournalEntries, getExerciseSessions } from "@/lib/db-helpers"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Activity,
  BookOpen,
  Brain,
  TrendingUp,
  Heart,
  Sparkles,
  Target,
  BarChart3,
  ArrowRight,
  Zap,
  CheckCircle2,
} from "lucide-react"
import { Button } from "@/components/ui/button"

export const metadata = {
  title: "Dashboard - Emotional Intelligence Analytics",
  description: "Track your emotional growth with advanced analytics and AI insights",
}

export default async function DashboardPage() {
  const user = await getCurrentUser()
  if (!user) return null

  const userData = await findUserById(user.userId)
  const recentMoods = await getMoodEntries(user.userId, 7)
  const recentJournals = await getJournalEntries(user.userId, 5)
  const recentExercises = await getExerciseSessions(user.userId, 10)

  const today = new Date().toDateString()
  const hasLoggedMoodToday = recentMoods.some((entry) => new Date(entry.date).toDateString() === today)

  const avgMood =
    recentMoods.length > 0
      ? (recentMoods.reduce((sum, entry) => sum + entry.mood, 0) / recentMoods.length).toFixed(1)
      : "N/A"

  // Calculate emotional growth score (example)
  const emotionalGrowthScore = recentMoods.length > 0 ? Math.round(Math.random() * 40 + 60) : 0

  return (
    <div className="min-h-screen bg-background dark:bg-background">
      <div className="w-full px-4 md:px-6 lg:px-12 xl:px-16 py-8 md:py-12 space-y-10">
        {/* ================= GREETING ================= */}
        <div className="space-y-3">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Welcome back, {userData?.name}</h1>
          <p className="text-lg text-muted-foreground font-light">
            {hasLoggedMoodToday
              ? "You've logged your mood today. Excellent work maintaining your routine."
              : "Take a moment to check in with yourself and track your emotional state."}
          </p>
        </div>

        {/* ================= EMOTIONAL GROWTH SCORE ================= */}
        <div className="bg-gradient-to-br from-primary/12 via-secondary/6 to-accent/8 border border-primary/25 rounded-2xl p-10 md:p-12 shadow-premium-lg card-hover">
          <div className="flex items-start justify-between gap-8">
            <div className="space-y-6 flex-1">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-secondary/20 text-secondary">
                  <Sparkles className="w-5 h-5" />
                </div>
                <span className="text-sm font-semibold text-secondary tracking-wide">Emotional Growth Score</span>
              </div>
              <div className="space-y-3">
                <div className="text-6xl font-bold tracking-tight">{emotionalGrowthScore}</div>
                <p className="text-muted-foreground text-lg font-light">
                  Your emotional resilience and stability have improved significantly this week.
                </p>
              </div>
            </div>
            <div className="w-40 h-40 rounded-full bg-gradient-to-br from-primary/20 via-secondary/15 to-accent/10 flex items-center justify-center flex-shrink-0 shadow-premium-md">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary">{emotionalGrowthScore}</div>
                <div className="text-sm text-muted-foreground mt-2 font-medium">out of 100</div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= ANALYTICS CARDS ================= */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <AnalyticsStatCard
            title="Emotional Volatility"
            value="Low"
            subtitle="More stable this week"
            icon={<TrendingUp className="w-5 h-5" />}
            trend="up"
          />
          <AnalyticsStatCard
            title="Consistency Index"
            value={`${recentMoods.length} days`}
            subtitle="Tracked consecutively"
            icon={<BarChart3 className="w-5 h-5" />}
            trend="stable"
          />
          <AnalyticsStatCard
            title="Burnout Risk"
            value="Moderate"
            subtitle="Recovery time recommended"
            icon={<Zap className="w-5 h-5" />}
            trend="down"
          />
          <AnalyticsStatCard
            title="Growth Tracking"
            value={`+${Math.round(emotionalGrowthScore / 20)}%`}
            subtitle="vs last month"
            icon={<CheckCircle2 className="w-5 h-5" />}
            trend="up"
          />
        </div>

        {/* ================= QUICK ACTIONS ================= */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <QuickActionCard
            href="/mood"
            title="Log Your Mood"
            desc="1-10 scale + emotional check-in"
            icon={<Heart className="w-6 h-6" />}
          />
          <QuickActionCard
            href="/journal"
            title="Write in Journal"
            desc="Private reflections & insights"
            icon={<BookOpen className="w-6 h-6" />}
          />
          <QuickActionCard
            href="/exercises"
            title="Calming Exercise"
            desc="Breathing & mindfulness guides"
            icon={<Brain className="w-6 h-6" />}
          />
        </div>

        {/* ================= AI INSIGHTS ================= */}
        <Card className="border border-primary/20 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-secondary/20 text-secondary">
                  <Sparkles className="w-5 h-5" />
                </div>
                <CardTitle>Weekly Insights</CardTitle>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/analytics">View More</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <p className="text-sm font-medium flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-accent" />
                Your mood consistency improved by 23% this week
              </p>
              <p className="text-sm font-medium flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-accent" />
                Tuesday appears to be your most stressful day - consider planning relaxation activities
              </p>
              <p className="text-sm font-medium flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-accent" />
                Journaling has shown the highest impact on your mood recovery
              </p>
            </div>
          </CardContent>
        </Card>

        {/* ================= RECENT ACTIVITY ================= */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Activity className="text-primary w-5 h-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentMoods.length === 0 && recentJournals.length === 0 && recentExercises.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">Start tracking to build your emotional intelligence baseline</p>
                <Button asChild>
                  <Link href="/mood">Log Your First Mood</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {recentMoods.slice(0, 5).map((m) => (
                  <div
                    key={m._id}
                    className="flex justify-between items-center p-4 rounded-lg bg-muted/40 hover:bg-muted/60 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Heart className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium">Mood logged</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(m.date).toLocaleDateString()}
                      </span>
                    </div>
                    <span className="font-bold text-primary text-lg">{m.mood}/10</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

/* ================= HELPER COMPONENTS ================= */

function AnalyticsStatCard({
  title,
  value,
  subtitle,
  icon,
  trend,
}: {
  title: string
  value: string | number
  subtitle: string
  icon: React.ReactNode
  trend: "up" | "down" | "stable"
}) {
  const trendColor =
    trend === "up" ? "text-accent" : trend === "down" ? "text-orange-500" : "text-muted-foreground"

  return (
    <Card className="border-border/50 shadow-premium-sm hover:shadow-premium-md card-hover bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold text-muted-foreground tracking-wide">{title}</CardTitle>
          <div className={`p-2 rounded-lg bg-${trendColor === "text-accent" ? "accent" : "orange"}/10 ${trendColor}`}>
            {icon}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-3xl font-bold tracking-tight">{value}</div>
        <p className="text-sm text-muted-foreground font-medium">{subtitle}</p>
      </CardContent>
    </Card>
  )
}

function QuickActionCard({
  href,
  title,
  desc,
  icon,
}: {
  href: string
  title: string
  desc: string
  icon: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className="group p-8 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 hover:bg-primary/5 shadow-premium-sm hover:shadow-premium-md transition-all duration-300 card-hover"
    >
      <div className="space-y-5">
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 text-primary flex items-center justify-center group-hover:from-primary/30 group-hover:to-primary/10 transition-all duration-300">
          {icon}
        </div>
        <div className="space-y-2">
          <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors duration-300">{title}</h3>
          <p className="text-sm text-muted-foreground font-medium">{desc}</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-primary font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
          Get started <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    </Link>
  )
}
