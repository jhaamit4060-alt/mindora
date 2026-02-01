import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import * as XLSX from "xlsx"
import { getMoodEntries, getJournalEntries, findUserById } from "@/lib/db-helpers"

export async function GET(req: Request) {
  // ✅ Custom auth (NO next-auth)
  const user = await getCurrentUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const range = searchParams.get("range") || "week"

  const userId = user.userId

  const userProfile = await findUserById(userId)

  // 1️⃣ Fetch data
  const moods = await getMoodEntries(userId, 500)
  const journals = await getJournalEntries(userId, 500)

  // 2️⃣ Filter
  const filtered = filterByRange(moods, range)

  const avgMood =
    filtered.length > 0 ? (filtered.reduce((sum, m) => sum + m.mood, 0) / filtered.length).toFixed(1) : "N/A"

  const maxMood = filtered.length > 0 ? Math.max(...filtered.map((m) => m.mood)) : "N/A"
  const minMood = filtered.length > 0 ? Math.min(...filtered.map((m) => m.mood)) : "N/A"
  const moodVariance = filtered.length > 0 ? calculateVariance(filtered.map((m) => m.mood)).toFixed(2) : "N/A"

  // Count moods by category
  const moodDistribution = {
    excellent: filtered.filter((m) => m.mood === 5).length,
    good: filtered.filter((m) => m.mood === 4).length,
    okay: filtered.filter((m) => m.mood === 3).length,
    poor: filtered.filter((m) => m.mood === 2).length,
    veryPoor: filtered.filter((m) => m.mood === 1).length,
  }

  const age = userProfile?.profile?.dateOfBirth
    ? Math.floor(
        (new Date().getTime() - new Date(userProfile.profile.dateOfBirth).getTime()) / (365.25 * 24 * 60 * 60 * 1000),
      )
    : "N/A"

  /* -------- Sheet 1: Professional Summary with Complete Patient Info -------- */
  const summarySheet = [
    ["MENTAL WELLNESS REPORT - CONFIDENTIAL"],
    ["FOR CLINICAL USE ONLY"],
    [""],
    ["═══════════════════════════════════════════════════════════════"],
    ["PATIENT INFORMATION"],
    ["═══════════════════════════════════════════════════════════════"],
    ["Full Name:", userProfile?.name ?? "N/A"],
    ["Email Address:", userProfile?.email ?? "N/A"],
    ["Phone Number:", userProfile?.profile?.phone ?? "N/A"],
    ["Date of Birth:", userProfile?.profile?.dateOfBirth ?? "N/A"],
    ["Age:", age + " years"],
    ["Gender:", userProfile?.profile?.gender ?? "N/A"],
    ["Address:", userProfile?.profile?.address ?? "N/A"],
    [""],
    ["Emergency Contact:", userProfile?.profile?.emergencyContact ?? "N/A"],
    [""],
    ["Medical History:", userProfile?.profile?.medicalHistory ?? "N/A"],
    [""],
    ["Current Therapist:", userProfile?.profile?.therapistName ?? "N/A"],
    ["Therapist Contact:", userProfile?.profile?.therapistContact ?? "N/A"],
    [""],
    ["═══════════════════════════════════════════════════════════════"],
    ["REPORT DETAILS"],
    ["═══════════════════════════════════════════════════════════════"],
    ["Time Period Analyzed:", range.toUpperCase()],
    ["Report Generated:", new Date().toLocaleDateString() + " at " + new Date().toLocaleTimeString()],
    ["Total Days in Period:", getDaysInRange(range)],
    [""],
    ["═══════════════════════════════════════════════════════════════"],
    ["MOOD STATISTICS SUMMARY"],
    ["═══════════════════════════════════════════════════════════════"],
    ["Total Mood Check-ins:", filtered.length],
    ["Average Mood Score:", avgMood + " / 5.0"],
    ["Highest Mood Recorded:", maxMood + " / 5.0"],
    ["Lowest Mood Recorded:", minMood + " / 5.0"],
    ["Mood Score Variance:", moodVariance],
    [
      "Tracking Consistency:",
      filtered.length > 0 ? ((filtered.length / getDaysInRange(range)) * 100).toFixed(1) + "%" : "N/A",
    ],
    [""],
    ["═══════════════════════════════════════════════════════════════"],
    ["MOOD DISTRIBUTION ANALYSIS"],
    ["═══════════════════════════════════════════════════════════════"],
    [
      "Score 5 (Excellent):",
      moodDistribution.excellent + " entries (" + getPercentage(moodDistribution.excellent, filtered.length) + "%)",
    ],
    [
      "Score 4 (Good):",
      moodDistribution.good + " entries (" + getPercentage(moodDistribution.good, filtered.length) + "%)",
    ],
    [
      "Score 3 (Okay):",
      moodDistribution.okay + " entries (" + getPercentage(moodDistribution.okay, filtered.length) + "%)",
    ],
    [
      "Score 2 (Poor):",
      moodDistribution.poor + " entries (" + getPercentage(moodDistribution.poor, filtered.length) + "%)",
    ],
    [
      "Score 1 (Very Poor):",
      moodDistribution.veryPoor + " entries (" + getPercentage(moodDistribution.veryPoor, filtered.length) + "%)",
    ],
    [""],
    ["═══════════════════════════════════════════════════════════════"],
    ["ADDITIONAL WELLNESS METRICS"],
    ["═══════════════════════════════════════════════════════════════"],
    ["Total Journal Entries:", journals.length],
    ["Days with Recorded Activity:", new Set(filtered.map((m) => new Date(m.date).toDateString())).size],
    [
      "Average Check-ins per Day:",
      filtered.length > 0
        ? (filtered.length / new Set(filtered.map((m) => new Date(m.date).toDateString())).size).toFixed(1)
        : "N/A",
    ],
    [""],
    ["═══════════════════════════════════════════════════════════════"],
    ["CLINICAL NOTES"],
    ["═══════════════════════════════════════════════════════════════"],
    ["• This report is intended for sharing with qualified healthcare providers"],
    ["• All data is self-reported by the patient through the wellness application"],
    ["• Mood scores are on a 1-5 scale: 1=Very Poor, 2=Poor, 3=Okay, 4=Good, 5=Excellent"],
    ["• This report should be used as supplementary information in clinical assessment"],
    ["• Not intended as a diagnostic tool - professional evaluation required"],
    [""],
    ["Report ID:", `WR-${userId.slice(0, 8).toUpperCase()}-${Date.now()}`],
  ]

  /* -------- Sheet 2: Detailed Mood Logs (Tabular Format) -------- */
  const dataSheet = filtered.map((m) => ({
    Date: new Date(m.date).toLocaleDateString(),
    Time: new Date(m.date).toLocaleTimeString(),
    "Mood Score": m.mood,
    "Score (out of 5)": m.mood + " / 5",
    "Mood Category": getMoodCategory(m.mood),
    "Patient Notes": m.note ?? "(No note provided)",
    Triggers: m.triggers?.join(", ") ?? "None recorded",
  }))

  /* -------- Sheet 3: Mood Distribution Chart Data -------- */
  const chartDataSheet = [
    ["MOOD DISTRIBUTION CHART DATA"],
    [""],
    ["Mood Category", "Count", "Percentage"],
    ["Excellent (5)", moodDistribution.excellent, getPercentage(moodDistribution.excellent, filtered.length) + "%"],
    ["Good (4)", moodDistribution.good, getPercentage(moodDistribution.good, filtered.length) + "%"],
    ["Okay (3)", moodDistribution.okay, getPercentage(moodDistribution.okay, filtered.length) + "%"],
    ["Poor (2)", moodDistribution.poor, getPercentage(moodDistribution.poor, filtered.length) + "%"],
    ["Very Poor (1)", moodDistribution.veryPoor, getPercentage(moodDistribution.veryPoor, filtered.length) + "%"],
    [""],
    ["═══════════════════════════════════════════════════════════"],
    ["TREND ANALYSIS DATA (Daily Averages)"],
    ["═══════════════════════════════════════════════════════════"],
    ["Date", "Average Mood", "Check-ins"],
  ]

  // Add daily trend data
  const dailyData = getDailyAverages(filtered)
  dailyData.forEach((day) => {
    chartDataSheet.push([day.date, day.avgMood, day.count])
  })

  /* -------- Sheet 4: Journal Entries -------- */
  const journalSheet = journals.map((j) => ({
    Date: new Date(j.date).toLocaleDateString(),
    Time: new Date(j.date).toLocaleTimeString(),
    "Associated Mood": j.mood ? getMoodCategory(j.mood) : "N/A",
    "Entry Content": j.content || "(No content)",
  }))

  /* -------- Sheet 5: Insights & Recommendations -------- */
  const insights = generateReportInsights(filtered, avgMood, moodDistribution)
  const insightsSheet = [
    ["PROFESSIONAL WELLNESS INSIGHTS & CLINICAL RECOMMENDATIONS"],
    [""],
    ["Generated for: " + (userProfile?.name ?? "Patient")],
    ["Period: " + range.toUpperCase()],
    [""],
    ...insights.map((i) => [i]),
  ]

  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(summarySheet), "Patient Summary")
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(dataSheet), "Mood Log (Tabular)")
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(chartDataSheet), "Chart Data")

  if (journals.length > 0) {
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(journalSheet), "Journal Entries")
  }

  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(insightsSheet), "Clinical Insights")

  const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" })

  const fileName = `Wellness_Report_${userProfile?.name?.replace(/\s+/g, "_") ?? "Patient"}_${range}_${new Date().toISOString().split("T")[0]}.xlsx`

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${fileName}"`,
    },
  })
}

/* ---------- HELPER FUNCTIONS ---------- */
function filterByRange(data: any[], range: string) {
  const now = new Date()

  return data.filter((item) => {
    const d = new Date(item.date)

    if (range === "day") {
      return d.toDateString() === now.toDateString()
    }

    if (range === "week") {
      const diff = (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24)
      return diff <= 7
    }

    if (range === "month") {
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    }

    return true
  })
}

function calculateVariance(numbers: number[]): number {
  if (numbers.length === 0) return 0
  const mean = numbers.reduce((sum, n) => sum + n, 0) / numbers.length
  const squaredDiffs = numbers.map((n) => Math.pow(n - mean, 2))
  return squaredDiffs.reduce((sum, n) => sum + n, 0) / numbers.length
}

function getMoodCategory(mood: number): string {
  if (mood === 5) return "Excellent"
  if (mood === 4) return "Good"
  if (mood === 3) return "Okay"
  if (mood === 2) return "Poor"
  return "Very Poor"
}

function getPercentage(count: number, total: number): string {
  if (total === 0) return "0.0"
  return ((count / total) * 100).toFixed(1)
}

function getDaysInRange(range: string): number {
  if (range === "day") return 1
  if (range === "week") return 7
  if (range === "month") return 30
  return 30
}

function getDailyAverages(moods: any[]): { date: string; avgMood: string; count: number }[] {
  const dailyMap = new Map<string, number[]>()

  moods.forEach((m) => {
    const dateStr = new Date(m.date).toLocaleDateString()
    if (!dailyMap.has(dateStr)) {
      dailyMap.set(dateStr, [])
    }
    dailyMap.get(dateStr)!.push(m.mood)
  })

  return Array.from(dailyMap.entries())
    .map(([date, moodScores]) => ({
      date,
      avgMood: (moodScores.reduce((sum, m) => sum + m, 0) / moodScores.length).toFixed(2),
      count: moodScores.length,
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
}

function generateReportInsights(filtered: any[], avgMood: string, distribution: any): string[] {
  const insights: string[] = []

  insights.push("════════════════════���══════════════════════════════════════")
  insights.push("CLINICAL OBSERVATIONS")
  insights.push("═══════════════════════════════════════════════════════════")
  insights.push("")

  // Overall assessment
  const avg = Number.parseFloat(avgMood)
  if (!isNaN(avg)) {
    if (avg >= 4) {
      insights.push("✓ Patient reports consistently positive mood states during this period.")
      insights.push("  Average score indicates good emotional well-being.")
    } else if (avg >= 3) {
      insights.push("• Patient reports moderate mood states with room for improvement.")
      insights.push("  Consider exploring factors contributing to neutral emotional state.")
    } else {
      insights.push("⚠ Patient reports concerning mood patterns requiring attention.")
      insights.push("  Recommend additional support, intervention, or therapy adjustment.")
    }
  }

  insights.push("")

  // Data quality
  if (filtered.length >= 14) {
    insights.push("✓ Excellent data quality with consistent daily tracking.")
    insights.push("  High compliance provides reliable trend analysis.")
  } else if (filtered.length >= 7) {
    insights.push("• Good data collection observed.")
    insights.push("  Encourage more frequent check-ins for enhanced pattern recognition.")
  } else {
    insights.push("⚠ Limited data points noted.")
    insights.push("  Recommend encouraging more regular mood tracking for comprehensive assessment.")
  }

  insights.push("")

  // Mood stability and patterns
  if (distribution.excellent > 0 || distribution.good > 0) {
    insights.push("✓ Patient demonstrates capacity for positive emotional states.")
    const positivePercentage = ((distribution.excellent + distribution.good) / filtered.length) * 100
    insights.push(`  ${positivePercentage.toFixed(1)}% of entries show good or excellent mood.`)
  }

  insights.push("")

  if (distribution.veryPoor > 2 || distribution.poor > 3) {
    insights.push("⚠ Notable instances of low mood detected.")
    insights.push("  Recommend discussing:")
    insights.push("  - Specific triggers and circumstances")
    insights.push("  - Current coping strategies effectiveness")
    insights.push("  - Need for additional support systems")
  }

  insights.push("")
  insights.push("═══════════════════════════════════════════════════════════")
  insights.push("CLINICAL RECOMMENDATIONS")
  insights.push("═══════════════════════���═══════════════════════════════════")
  insights.push("")
  insights.push("1. Continue regular mood tracking to establish and monitor baseline patterns")
  insights.push("")
  insights.push("2. Work with patient to identify specific triggers associated with mood changes")
  insights.push("")
  insights.push("3. Review and discuss patterns during therapy sessions")
  insights.push("")
  insights.push("4. Consider integrating additional wellness activities:")
  insights.push("   - Mindfulness exercises")
  insights.push("   - Physical activity")
  insights.push("   - Sleep hygiene improvements")
  insights.push("")
  insights.push("5. Review journal entries for qualitative insights and deeper understanding")
  insights.push("")
  insights.push("6. Assess need for treatment plan adjustments based on observed trends")
  insights.push("")
  insights.push("═══════════════════════════════════════════════════════════")
  insights.push("DISCLAIMER")
  insights.push("═══════════════════════════════════════════════════════════")
  insights.push("")
  insights.push("This report is generated from patient self-reported data and should be used")
  insights.push("as a supplementary tool in clinical assessment. It is not intended to serve")
  insights.push("as a diagnostic instrument and should not replace professional clinical judgment.")
  insights.push("")
  insights.push("All information is confidential and protected under HIPAA regulations.")
  insights.push("Sharing of this report should follow appropriate clinical and legal protocols.")

  return insights
}
