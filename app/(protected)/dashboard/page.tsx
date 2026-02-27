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
      <div className="w-full px-4 md:px-6 lg:px-12 xl:px-16 py-8 md:py-12 space-y-8">
        {/* ================= GREETING ================= */}
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold">Welcome back, {userData?.name}</h1>
          <p className="text-muted-foreground">
            {hasLoggedMoodToday
              ? "You've logged your mood today. Great work maintaining your routine."
              : "Take a moment to check in with yourself and log your mood today."}
          </p>
        </div>

        {/* ================= EMOTIONAL GROWTH SCORE ================= */}
        <div className="bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 border border-primary/20 rounded-2xl p-8 md:p-10">
          <div className="flex items-start justify-between gap-6">
            <div className="space-y-4 flex-1">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-secondary" />
                <span className="text-sm font-semibold text-secondary">Emotional Growth Score</span>
              </div>
              <div className="space-y-2">
                <div className="text-5xl font-bold">{emotionalGrowthScore}</div>
                <p className="text-muted-foreground">
                  Your emotional stability and growth have improved this week.
                </p>
              </div>
            </div>
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center flex-shrink-0">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{emotionalGrowthScore}</div>
                <div className="text-xs text-muted-foreground mt-1">of 100</div>
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
            subtitle="Logged consecutively"
            icon={<BarChart3 className="w-5 h-5" />}
            trend="stable"
          />
          <AnalyticsStatCard
            title="Burnout Risk"
            value="Moderate"
            subtitle="Recommend recovery time"
            icon={<Zap className="w-5 h-5" />}
            trend="down"
          />
          <AnalyticsStatCard
            title="Growth Tracking"
            value={`+${Math.round(emotionalGrowthScore / 20)}%`}
            subtitle="Compared to last month"
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
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
          <div className={`${trendColor}`}>{icon}</div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="text-3xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
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
      className="group p-6 rounded-xl border border-border bg-card hover:border-primary/50 hover:bg-primary/5 transition-all"
    >
      <div className="space-y-4">
        <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary/20 transition-colors">
          {icon}
        </div>
        <div className="space-y-1">
          <h3 className="font-semibold group-hover:text-primary transition-colors">{title}</h3>
          <p className="text-sm text-muted-foreground">{desc}</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-primary opacity-0 group-hover:opacity-100 transition-opacity">
          Get started <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    </Link>
  )
}
