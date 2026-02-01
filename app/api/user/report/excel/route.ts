import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { getMoodEntries, getJournalEntries, findUserById } from "@/lib/db-helpers"

export async function GET(req: Request) {
  const user = await getCurrentUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const range = searchParams.get("range") || "month"
  const includePersonal = searchParams.get("includePersonal") === "true"

  const userId = user.userId

  // Fetch user profile data
  const userData = await findUserById(userId)
  const profile = userData?.profile || {}

  // Fetch mood and journal data
  const moods = await getMoodEntries(userId, 200)
  const journals = await getJournalEntries(userId, 200)

  // Filter by range
  const filtered = filterByRange(moods, range)
  const filteredJournals = filterByRange(journals, range)

  // Calculate statistics
  const avgMood =
    filtered.length > 0 ? (filtered.reduce((sum, m) => sum + m.mood, 0) / filtered.length).toFixed(1) : "N/A"

  const moodDistribution = {
    excellent: filtered.filter((m) => m.mood >= 4.5).length,
    good: filtered.filter((m) => m.mood >= 3.5 && m.mood < 4.5).length,
    neutral: filtered.filter((m) => m.mood >= 2.5 && m.mood < 3.5).length,
    low: filtered.filter((m) => m.mood >= 1.5 && m.mood < 2.5).length,
    poor: filtered.filter((m) => m.mood < 1.5).length,
  }

  // Generate CSV content
  const csv = generateCSV(
    userData,
    profile,
    range,
    avgMood,
    filtered,
    filteredJournals,
    moodDistribution,
    includePersonal,
  )

  const userIdShort = userId.toString().slice(-4)
  const periodText = range === "day" ? "Daily" : range === "week" ? "Weekly" : "Monthly"

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="MH-USER-${userIdShort}_${periodText}_Summary.csv"`,
    },
  })
}

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

function escapeCSV(value: string): string {
  if (value === null || value === undefined) return ""
  const stringValue = String(value)
  if (stringValue.includes(",") || stringValue.includes('"') || stringValue.includes("\n")) {
    return `"${stringValue.replace(/"/g, '""')}"`
  }
  return stringValue
}

function generateCSV(
  userData: any,
  profile: any,
  range: string,
  avgMood: string,
  moods: any[],
  journals: any[],
  moodDistribution: any,
  includePersonal: boolean,
) {
  const periodText = range === "day" ? "Daily" : range === "week" ? "Weekly" : "Monthly"
  const reportDate = new Date().toLocaleDateString()
  const totalPercentage = moods.length || 1
  const userIdShort = userData?._id?.toString().slice(-4) || "XXXX"

  let csv = ""

  csv += `Personal Wellness Summary - ${periodText}\n`
  csv += `Generated on: ${reportDate}\n`
  csv += `User ID: MH-USER-${userIdShort}\n`
  csv += `For Personal/Trained Professional Review\n`
  csv += `SELF-REPORTED WELLNESS DATA\n`
  csv += `\n`

  if (includePersonal) {
    csv += `USER PROFILE SUMMARY\n`
    csv += `Full Name,${escapeCSV(userData?.name || "Not provided")}\n`
    csv += `Email,${escapeCSV(userData?.email || "Not provided")}\n`
    csv += `Phone,${escapeCSV(profile.phone || "Not provided")}\n`
    csv += `Date of Birth,${escapeCSV(profile.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString() : "Not provided")}\n`
    csv += `Gender,${escapeCSV(profile.gender || "Not provided")}\n`
    csv += `Address,${escapeCSV(profile.address || "Not provided")}\n`
    csv += `Emergency Contact,${escapeCSV(profile.emergencyContact || "Not provided")}\n`
    csv += `Therapist Name,${escapeCSV(profile.therapistName || "Not assigned")}\n`
    csv += `Therapist Contact,${escapeCSV(profile.therapistContact || "Not provided")}\n`
    csv += `Medical History,${escapeCSV(profile.medicalHistory || "Not provided")}\n`
  } else {
    csv += `PRIVACY PROTECTED\n`
    csv += `Personal identifying information excluded from this report\n`
    csv += `User ID: MH-USER-${userIdShort}\n`
  }
  csv += `\n`

  // Summary Statistics
  csv += `SUMMARY STATISTICS\n`
  csv += `Metric,Value\n`
  csv += `Average Mood,${avgMood}\n`
  csv += `Total Mood Entries,${moods.length}\n`
  csv += `Total Journal Entries,${journals.length}\n`
  csv += `\n`

  csv += `PATTERN SUMMARY - MOOD DISTRIBUTION\n`
  csv += `Mood Rating,Count,Percentage\n`
  csv += `Excellent (5),${moodDistribution.excellent},${((moodDistribution.excellent / totalPercentage) * 100).toFixed(1)}%\n`
  csv += `Good (4),${moodDistribution.good},${((moodDistribution.good / totalPercentage) * 100).toFixed(1)}%\n`
  csv += `Neutral (3),${moodDistribution.neutral},${((moodDistribution.neutral / totalPercentage) * 100).toFixed(1)}%\n`
  csv += `Low (2),${moodDistribution.low},${((moodDistribution.low / totalPercentage) * 100).toFixed(1)}%\n`
  csv += `Poor (1),${moodDistribution.poor},${((moodDistribution.poor / totalPercentage) * 100).toFixed(1)}%\n`
  csv += `\n`

  // Detailed Mood Log
  csv += `DETAILED MOOD LOG\n`
  csv += `Date,Time,Mood Rating,Notes\n`
  if (moods.length > 0) {
    moods.forEach((mood) => {
      const date = new Date(mood.date)
      csv += `${date.toLocaleDateString()},${date.toLocaleTimeString()},${mood.mood.toFixed(1)},${escapeCSV(mood.notes || "No notes")}\n`
    })
  } else {
    csv += `No mood entries recorded for this period\n`
  }
  csv += `\n`

  // Journal Entries
  if (journals.length > 0) {
    csv += `JOURNAL ENTRIES\n`
    csv += `Date,Title,Content\n`
    journals.forEach((journal) => {
      const date = new Date(journal.date)
      csv += `${date.toLocaleDateString()},${escapeCSV(journal.title || "Untitled")},${escapeCSV(journal.content || "No content")}\n`
    })
    csv += `\n`
  }

  csv += `IMPORTANT DISCLAIMER\n`
  csv += `"This is self-reported data for personal reflection and professional discussion only. Not a medical diagnosis or diagnostic instrument. The information presented reflects personal wellness tracking and should not be used as a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare professional for clinical advice. This data belongs to the user and is provided for personal use or to share with trained professionals at the user's discretion."\n`
  csv += `\n`

  // Footer
  csv += `Generated by Mindora Wellness Platform\n`
  csv += `Report Period: ${periodText}\n`
  csv += `Generated: ${new Date().toLocaleString()}\n`
  csv += `This is self-reported data for personal reflection and professional discussion only. Not a medical diagnosis. Consult qualified professional for clinical advice.\n`

  return csv
}
