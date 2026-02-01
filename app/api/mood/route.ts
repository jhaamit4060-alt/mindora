import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { createMoodEntry, getMoodEntries } from "@/lib/db-helpers"

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { mood, note, date } = body

    if (!mood || mood < 1 || mood > 5) {
      return NextResponse.json({ error: "Invalid mood value" }, { status: 400 })
    }

    const entryId = await createMoodEntry({
      userId: user.userId,
      mood,
      note,
      date: date ? new Date(date) : new Date(),
    })

    return NextResponse.json({ success: true, id: entryId }, { status: 201 })
  } catch (error) {
    console.error("[v0] Mood entry error:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const moods = await getMoodEntries(user.userId, 30)

    return NextResponse.json({ moods })
  } catch (error) {
    console.error("[v0] Mood fetch error:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
