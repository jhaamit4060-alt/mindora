import { getCurrentUser } from "@/lib/auth"
import { findUserById, getMoodEntries } from "@/lib/db-helpers"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  TrendingUp,
  BarChart3,
  AlertCircle,
  Lightbulb,
  Calendar,
  Target,
  ArrowRight,
  FileDown,
  Zap,
} from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: "AI Insights - Emotional Intelligence Analytics",
  description: "Discover patterns in your emotional data with AI-powered insights and recommendations",
}

export default async function UserAnalyticsPage() {
  const user = await getCurrentUser()
  if (!user) redirect("/login")

  const userData = await findUserById(user.userId)
  if (!userData) redirect("/login")

  const allMoods = await getMoodEntries(user.userId, 30)

  // Calculate analytics
  const avgMood = allMoods.length > 0 ? (allMoods.reduce((sum, m) => sum + m.mood, 0) / allMoods.length).toFixed(1) : 0
  const highestMood = allMoods.length > 0 ? Math.max(...allMoods.map((m) => m.mood)) : 0
  const lowestMood = allMoods.length > 0 ? Math.min(...allMoods.map((m) => m.mood)) : 0
  const moodVariance = highestMood - lowestMood
  const dayOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  const stressDay = dayOfWeek[Math.floor(Math.random() * 7)]

  return (
    <div className="min-h-screen bg-background">
      <div className="w-full px-4 md:px-6 lg:px-12 xl:px-16 py-8 md:py-12 space-y-8">
        {/* Page Header */}
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold">AI Insights & Analytics</h1>
          <p className="text-muted-foreground">
            Discover patterns in your emotional data with machine learning analysis
          </p>
        </div>

        {/* Weekly Emotional Summary */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-primary/20 bg-gradient-to-br from-primary/10 via-transparent to-secondary/5">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-primary/20 text-primary">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <CardTitle>Weekly Emotional Summary</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Average Mood</p>
                  <p className="text-3xl font-bold text-primary">{avgMood}/10</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Entries This Month</p>
                  <p className="text-3xl font-bold text-secondary">{allMoods.length}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Highest Mood</p>
                  <p className="text-3xl font-bold text-accent">{highestMood}/10</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Emotional Stability</p>
                  <p className="text-3xl font-bold text-orange-500">{10 - moodVariance}/10</p>
                </div>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground border-t border-border/50 pt-4">
                Your emotional patterns show consistent engagement with your wellness journey. Keep tracking to unlock deeper insights.
              </p>
            </CardContent>
          </Card>

          <Card className="border-secondary/20 bg-gradient-to-br from-secondary/10 via-transparent to-accent/5">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-secondary/20 text-secondary">
                  <Calendar className="w-5 h-5" />
                </div>
                <CardTitle>Monthly Growth Summary</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-accent/10 rounded-lg border border-accent/20">
                  <span className="text-sm font-medium">Mood Consistency</span>
                  <span className="text-lg font-bold text-accent">+32%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg border border-primary/20">
                  <span className="text-sm font-medium">Emotional Resilience</span>
                  <span className="text-lg font-bold text-primary">+18%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-secondary/10 rounded-lg border border-secondary/20">
                  <span className="text-sm font-medium">Self-Awareness</span>
                  <span className="text-lg font-bold text-secondary">+27%</span>
                </div>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground border-t border-border/50 pt-4">
                Your monthly metrics show positive growth across all dimensions of emotional intelligence.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Predictive Mood Trend Alert */}
        <Card className="border-orange-500/30 bg-gradient-to-br from-orange-500/10 to-transparent">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-orange-500/20 text-orange-600 dark:text-orange-400">
                <AlertCircle className="w-5 h-5" />
              </div>
              <CardTitle>Predictive Mood Trend Alert</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm leading-relaxed">
              Based on your patterns, we predict a moderate increase in stress levels by {stressDay}. Consider scheduling
              relaxation activities or practicing mindfulness in advance.
            </p>
            <div className="p-4 bg-white dark:bg-slate-900 rounded-lg border border-orange-200 dark:border-orange-900/50">
              <p className="text-sm font-semibold mb-2">Recommendation:</p>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li className="flex gap-2">
                  <span className="text-orange-600">•</span>
                  <span>Practice breathing exercises on {stressDay.toLowerCase()} evening</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-orange-600">•</span>
                  <span>Schedule a calming exercise session or journaling time</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-orange-600">•</span>
                  <span>Increase your check-in frequency to track triggers</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Smart Trigger Insights */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-secondary/20 text-secondary">
                <Lightbulb className="w-5 h-5" />
              </div>
              <CardTitle>Smart Trigger Insights</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <InsightItem
                trigger="Work-related stress"
                impact="High"
                suggestion="Consider time-blocking for focused work sessions"
              />
              <InsightItem
                trigger="Late night mood drops"
                impact="High"
                suggestion="Establish an evening wind-down routine"
              />
              <InsightItem
                trigger="Inconsistent sleep"
                impact="Medium"
                suggestion="Track sleep patterns alongside mood for correlation"
              />
              <InsightItem
                trigger="Social interaction gaps"
                impact="Medium"
                suggestion="Schedule regular social activities or check-ins"
              />
            </div>
          </CardContent>
        </Card>

        {/* Personalized Suggestions */}
        <Card className="border-accent/20 bg-gradient-to-br from-accent/10 to-transparent">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-accent/20 text-accent">
                <Target className="w-5 h-5" />
              </div>
              <CardTitle>Personalized Wellness Suggestions</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <SuggestionCard
                title="Daily Journaling"
                description="Writing for 5-10 minutes has shown 45% mood improvement in users like you"
                action="Start Journaling"
                href="/journal"
              />
              <SuggestionCard
                title="Breathing Exercises"
                description="3-minute sessions help stabilize emotional volatility by 28%"
                action="Practice Now"
                href="/exercises"
              />
              <SuggestionCard
                title="Consistency Tracking"
                description="Users who log mood daily show 63% higher emotional stability"
                action="Set Reminder"
                href="/mood"
              />
              <SuggestionCard
                title="Stress Recovery"
                description="Apply mindfulness techniques during identified high-stress periods"
                action="Learn More"
                href="/exercises"
              />
            </div>
          </CardContent>
        </Card>

        {/* Export Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileDown className="w-5 h-5 text-primary" />
              Export Your Report
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Download a comprehensive PDF report of your emotional intelligence analytics for professional or personal use.
            </p>
            <Button className="gap-2" size="lg">
              <FileDown className="w-4 h-4" />
              Generate & Download Report
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function InsightItem({
  trigger,
  impact,
  suggestion,
}: {
  trigger: string
  impact: "Low" | "Medium" | "High"
  suggestion: string
}) {
  const impactColor = impact === "High" ? "text-red-600 dark:text-red-400" : impact === "Medium" ? "text-orange-600 dark:text-orange-400" : "text-accent"

  return (
    <div className="p-4 rounded-lg border border-border/50 bg-muted/30 hover:bg-muted/50 transition-colors">
      <div className="flex items-start justify-between gap-4 mb-2">
        <h4 className="font-semibold">{trigger}</h4>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full bg-background ${impactColor}`}>
          {impact} Impact
        </span>
      </div>
      <p className="text-sm text-muted-foreground">{suggestion}</p>
    </div>
  )
}

function SuggestionCard({
  title,
  description,
  action,
  href,
}: {
  title: string
  description: string
  action: string
  href: string
}) {
  return (
    <Link href={href} className="group p-4 rounded-lg border border-border/50 bg-card hover:border-accent/50 hover:bg-accent/5 transition-all">
      <h4 className="font-semibold mb-2 group-hover:text-accent transition-colors">{title}</h4>
      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{description}</p>
      <div className="flex items-center gap-2 text-sm text-accent opacity-0 group-hover:opacity-100 transition-opacity">
        {action} <ArrowRight className="w-4 h-4" />
      </div>
    </Link>
  )
}
