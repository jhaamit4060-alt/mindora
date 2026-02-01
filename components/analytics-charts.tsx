"use client"

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Activity, Users, TrendingUp, Calendar } from "lucide-react"
import type {
  User,
  MoodEntry,
  JournalEntry,
  ExerciseSession,
} from "@/lib/types"

/* ================= PROPS ================= */

interface AnalyticsChartsProps {
  users: User[]
  moods: MoodEntry[]
  journals: JournalEntry[]
  exercises: ExerciseSession[]
}

/* ================= COMPONENT ================= */

export function AnalyticsCharts({
  users,
  moods,
  journals,
  exercises,
}: AnalyticsChartsProps) {
  /* ---------- DATE HELPERS ---------- */

  const lastNDays = (n: number) =>
    Array.from({ length: n }, (_, i) => {
      const d = new Date()
      d.setDate(d.getDate() - (n - 1 - i))
      return d.toISOString().split("T")[0]
    })

  /* ---------- USER GROWTH (30 DAYS) ---------- */

  const userGrowthData = lastNDays(30).map((date) => ({
    date: new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    users: users.filter(
      (u) => new Date(u.createdAt).toISOString().split("T")[0] <= date
    ).length,
  }))

  /* ---------- DAILY ACTIVITY (14 DAYS) ---------- */

  const activityData = lastNDays(14).map((date) => ({
    date: new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    moods: moods.filter(
      (m) => new Date(m.date).toISOString().split("T")[0] === date
    ).length,
    journals: journals.filter(
      (j) => new Date(j.date).toISOString().split("T")[0] === date
    ).length,
    exercises: exercises.filter(
      (e) =>
        new Date(e.completedAt).toISOString().split("T")[0] === date
    ).length,
  }))

  /* ---------- MOOD TREND (14 DAYS) ---------- */

  const moodTrendData = lastNDays(14).map((date) => {
    const dayMoods = moods.filter(
      (m) => new Date(m.date).toISOString().split("T")[0] === date
    )
    const avg =
      dayMoods.length > 0
        ? dayMoods.reduce((s, m) => s + m.mood, 0) / dayMoods.length
        : 0

    return {
      date: new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      mood: Number(avg.toFixed(1)),
    }
  })

  /* ================= UI ================= */

  return (
    <div className="space-y-6">
      {/* ===== OVERVIEW CARDS ===== */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Platform Activity"
          value={moods.length + journals.length + exercises.length}
          icon={<Activity />}
        />
        <StatCard
          title="Avg. Mood Score"
          value={
            moods.length
              ? (
                moods.reduce((s, m) => s + m.mood, 0) / moods.length
              ).toFixed(1)
              : "N/A"
          }
          icon={<TrendingUp />}
        />
        <StatCard
          title="Active Users (7d)"
          value={
            new Set([
              ...moods.map((m) => m.userId),
              ...journals.map((j) => j.userId),
              ...exercises.map((e) => e.userId),
            ]).size
          }
          icon={<Users />}
        />
        <StatCard
          title="Engagement Rate"
          value={
            users.length
              ? Math.round(
                ((moods.length + journals.length + exercises.length) /
                  users.length) *
                10
              ) / 10
              : 0
          }
          icon={<Calendar />}
        />
      </div>

      {/* ===== CHARTS ===== */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* User Growth */}
        <ChartCard
          title="User Growth (30 Days)"
          description="Total registered users"
          data={userGrowthData}
          config={{
            users: { label: "Users", color: "hsl(var(--primary))" },
          }}
        >
          <Line dataKey="users" stroke="hsl(var(--primary))" strokeWidth={2} />
        </ChartCard>

        {/* Daily Activity */}
        <ChartCard
          title="Daily Activity (14 Days)"
          description="Mood, journal & exercises"
          data={activityData}
          config={{
            moods: { label: "Mood", color: "hsl(var(--primary))" },
            journals: { label: "Journal", color: "hsl(var(--secondary))" },
            exercises: { label: "Exercise", color: "hsl(var(--accent))" },
          }}
          bar
        >
          <Bar dataKey="moods" fill="hsl(var(--primary))" />
          <Bar dataKey="journals" fill="hsl(var(--secondary))" />
          <Bar dataKey="exercises" fill="hsl(var(--accent))" />
        </ChartCard>
      </div>

      {/* Mood Trend */}
      <ChartCard
        title="Average Mood Trend (14 Days)"
        description="Platform-wide mood score"
        data={moodTrendData}
        config={{
          mood: { label: "Mood", color: "hsl(var(--primary))" },
        }}
      >
        <Line dataKey="mood" stroke="hsl(var(--primary))" strokeWidth={3} />
      </ChartCard>
    </div>
  )
}

/* ================= SMALL HELPERS ================= */

function StatCard({
  title,
  value,
  icon,
}: {
  title: string
  value: any
  icon: React.ReactNode
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
      </CardContent>
    </Card>
  )
}

function ChartCard({
  title,
  description,
  data,
  config,
  bar,
  children,
}: any) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            {bar ? (
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                {children}
              </BarChart>
            ) : (
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 5]} />
                <ChartTooltip content={<ChartTooltipContent />} />
                {children}
              </LineChart>
            )}
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
