import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { createExerciseSession } from "@/lib/db-helpers"

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { exerciseId, completedAt } = body

    if (!exerciseId) {
      return NextResponse.json({ error: "Exercise ID is required" }, { status: 400 })
    }

    const sessionId = await createExerciseSession({
      userId: user.userId,
      exerciseId,
      completedAt: completedAt ? new Date(completedAt) : new Date(),
    })

    return NextResponse.json({ success: true, sessionId }, { status: 201 })
  } catch (error) {
    console.error("[v0] Exercise session error:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
