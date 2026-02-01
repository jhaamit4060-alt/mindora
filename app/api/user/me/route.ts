import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { findUserById } from "@/lib/db-helpers"

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userData = await findUserById(user.userId)
    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      id: userData._id,
      email: userData.email,
      name: userData.name,
      onboardingComplete: userData.onboardingComplete,
      preferences: userData.preferences,
    })
  } catch (error) {
    console.error("[v0] User fetch error:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
