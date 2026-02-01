import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { createJournalEntry, getJournalEntries } from "@/lib/db-helpers"

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { content, date } = body

    if (!content || content.trim() === "") {
      return NextResponse.json({ error: "Content is required" }, { status: 400 })
    }

    const entryId = await createJournalEntry({
      userId: user.userId,
      content: content.trim(),
      date: date ? new Date(date) : new Date(),
    })

    return NextResponse.json({ success: true, id: entryId }, { status: 201 })
  } catch (error) {
    console.error("[v0] Journal entry error:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const entries = await getJournalEntries(user.userId, 50)

    return NextResponse.json({ entries })
  } catch (error) {
    console.error("[v0] Journal fetch error:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
