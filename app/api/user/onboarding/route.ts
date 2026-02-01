import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { updateUser } from "@/lib/db-helpers"

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { completed } = body

    if (completed) {
      await updateUser(user.userId, { onboardingComplete: true })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Onboarding update error:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
