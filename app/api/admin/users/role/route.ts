import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { findUserById, updateUserRole } from "@/lib/db-helpers"

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userData = await findUserById(user.userId)
    // Only Super Admin can change roles
    if (!userData?.isSuperAdmin) {
      return NextResponse.json({ error: "Forbidden - Super Admin access required" }, { status: 403 })
    }

    const { userId, isAdmin, reason } = await request.json()

    if (!userId || typeof isAdmin === "undefined" || !reason) {
      return NextResponse.json(
        { error: "Missing required fields: userId, isAdmin, and reason are mandatory" },
        { status: 400 },
      )
    }

    // Prevent changing Super Admin role
    const targetUser = await findUserById(userId)
    if (targetUser?.isSuperAdmin) {
      return NextResponse.json({ error: "Cannot change Super Admin role" }, { status: 403 })
    }

    await updateUserRole(userId, isAdmin, reason, user.userId, userData.name)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Role update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
