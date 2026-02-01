import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { getMoodEntries, getJournalEntries } from "@/lib/db-helpers"

export async function GET(req: Request) {
  // ✅ Custom auth (NO next-auth)
  const user = await getCurrentUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const range = searchParams.get("range") || "week"

  const userId = user.userId

  // 1️⃣ Fetch data
  const moods = await getMoodEntries(userId, 200)
  const journals = await getJournalEntries(userId, 200)

  // 2️⃣ Filter by range
  const filtered = filterByRange(moods, range)

  const previousFiltered = getPreviousPeriodData(moods, range)

  // 3️⃣ Analytics
  const avgMood =
    filtered.length > 0 ? (filtered.reduce((sum, m) => sum + m.mood, 0) / filtered.length).toFixed(1) : "N/A"

  const prevAvgMood =
    previousFiltered.length > 0
      ? (previousFiltered.reduce((sum, m) => sum + m.mood, 0) / previousFiltered.length).toFixed(1)
      : null

  const moodComparison = calculateComparison(
    Number.parseFloat(avgMood),
    prevAvgMood ? Number.parseFloat(prevAvgMood) : null,
    range,
    "mood",
  )
  const moodTrend = calculateTrend(Number.parseFloat(avgMood), prevAvgMood ? Number.parseFloat(prevAvgMood) : null)

  const entriesComparison = calculateComparison(filtered.length, previousFiltered.length, range, "entries")
  const entriesTrend = calculateTrend(filtered.length, previousFiltered.length)

  const prevJournalCount = filterByRange(journals, range, true).length
  const journalsComparison = calculateComparison(journals.length, prevJournalCount, range, "journals")
  const journalsTrend = calculateTrend(journals.length, prevJournalCount)

  const insights = generateInsights(filtered, previousFiltered, journals, range)

  return NextResponse.json({
    range,
    avgMood,
    totalEntries: filtered.length,
    journals: journals.length,
    chart: filtered.map((m) => ({
      date: m.date,
      value: m.mood,
    })),
    moodComparison,
    moodTrend,
    entriesComparison,
    entriesTrend,
    journalsComparison,
    journalsTrend,
    insights,
  })
}

/* ---------- RANGE FILTER ---------- */
function filterByRange(data: any[], range: string, isPrevious = false) {
  const now = new Date()

  return data.filter((item) => {
    const d = new Date(item.date)

    if (range === "day") {
      const targetDate = new Date(now)
      if (isPrevious) targetDate.setDate(targetDate.getDate() - 1)
      return d.toDateString() === targetDate.toDateString()
    }

    if (range === "week") {
      const daysToSubtract = isPrevious ? 14 : 7
      const diff = (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24)
      return isPrevious ? diff > 7 && diff <= 14 : diff <= 7
    }

    if (range === "month") {
      const targetMonth = isPrevious ? now.getMonth() - 1 : now.getMonth()
      const targetYear = targetMonth < 0 ? now.getFullYear() - 1 : now.getFullYear()
      const adjustedMonth = targetMonth < 0 ? 11 : targetMonth
      return d.getMonth() === adjustedMonth && d.getFullYear() === targetYear
    }

    return true
  })
}

function getPreviousPeriodData(data: any[], range: string) {
  return filterByRange(data, range, true)
}

function calculateComparison(current: number, previous: number | null, range: string, type: string): string {
  if (previous === null || previous === 0) return ""

  const diff = current - previous
  const percentChange = Math.abs((diff / previous) * 100).toFixed(0)

  const periodText = range === "day" ? "yesterday" : range === "week" ? "last week" : "last month"

  if (type === "mood") {
    if (diff > 0.5) return `${Math.abs(diff).toFixed(1)} points higher than ${periodText}`
    if (diff < -0.5) return `${Math.abs(diff).toFixed(1)} points lower than ${periodText}`
    return `Similar to ${periodText}`
  }

  if (diff > 0) return `${percentChange}% more than ${periodText}`
  if (diff < 0) return `${percentChange}% less than ${periodText}`
  return `Same as ${periodText}`
}

function calculateTrend(current: number, previous: number | null): "up" | "down" | "stable" {
  if (previous === null) return "stable"
  const diff = current - previous
  if (Math.abs(diff) < 0.3) return "stable"
  return diff > 0 ? "up" : "down"
}

function generateInsights(current: any[], previous: any[], journals: any[], range: string) {
  const insights: Array<{ type: string; message: string; sentiment: "positive" | "neutral" | "caution" }> = []

  // Insight 1: Overall mood trend
  if (current.length > 0) {
    const avgCurrent = current.reduce((sum, m) => sum + m.mood, 0) / current.length
    const avgPrev = previous.length > 0 ? previous.reduce((sum, m) => sum + m.mood, 0) / previous.length : null

    if (avgPrev !== null) {
      const diff = avgCurrent - avgPrev
      if (diff > 0.5) {
        insights.push({
          type: "Positive Trend",
          message: `Your mood has improved significantly this ${range}! You're averaging ${avgCurrent.toFixed(1)}/5, which is ${diff.toFixed(1)} points higher than ${range === "day" ? "yesterday" : range === "week" ? "last week" : "last month"}. Keep up the great work!`,
          sentiment: "positive",
        })
      } else if (diff < -0.5) {
        insights.push({
          type: "Check-in Reminder",
          message: `Your mood has dipped this ${range}. Consider reaching out to your support network or scheduling time for self-care activities. Remember, it's okay to have difficult periods.`,
          sentiment: "caution",
        })
      } else {
        insights.push({
          type: "Steady Progress",
          message: `Your mood has remained relatively stable this ${range}, averaging around ${avgCurrent.toFixed(1)}/5. Consistency is a positive sign of emotional balance.`,
          sentiment: "neutral",
        })
      }
    }
  }

  // Insight 2: Check-in consistency
  if (current.length >= 5) {
    insights.push({
      type: "Great Consistency",
      message: `You've logged ${current.length} mood check-ins this ${range}! Regular tracking helps identify patterns and supports your wellness journey.`,
      sentiment: "positive",
    })
  } else if (current.length > 0 && current.length < 3) {
    insights.push({
      type: "Track More Often",
      message: `You've logged ${current.length} mood ${current.length === 1 ? "entry" : "entries"} this ${range}. Try checking in more frequently to gain better insights into your emotional patterns.`,
      sentiment: "neutral",
    })
  }

  // Insight 3: Journal writing
  if (journals.length >= 3) {
    insights.push({
      type: "Reflective Practice",
      message: `You've written ${journals.length} journal entries! Journaling is proven to reduce stress and improve self-awareness. Your commitment to reflection is admirable.`,
      sentiment: "positive",
    })
  }

  // Insight 4: Mood variance
  if (current.length >= 3) {
    const moods = current.map((m) => m.mood)
    const variance = calculateVariance(moods)

    if (variance < 0.5) {
      insights.push({
        type: "Emotional Stability",
        message:
          "Your moods have been quite stable this period, with minimal fluctuation. This suggests good emotional regulation.",
        sentiment: "positive",
      })
    } else if (variance > 1.5) {
      insights.push({
        type: "Variable Emotions",
        message:
          "You've experienced a wide range of emotions this period. Consider identifying triggers and discussing patterns with a mental health professional if needed.",
        sentiment: "neutral",
      })
    }
  }

  return insights
}

function calculateVariance(numbers: number[]): number {
  if (numbers.length === 0) return 0
  const mean = numbers.reduce((sum, n) => sum + n, 0) / numbers.length
  const squaredDiffs = numbers.map((n) => Math.pow(n - mean, 2))
  return squaredDiffs.reduce((sum, n) => sum + n, 0) / numbers.length
}
