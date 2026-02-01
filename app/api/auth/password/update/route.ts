import { NextResponse } from "next/server"
import { getCurrentUser, hashPassword, verifyPassword } from "@/lib/auth"
import { findUserById, updateUserPassword } from "@/lib/db-helpers"

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { currentPassword, newPassword } = await request.json()

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const userData = await findUserById(user.userId)
    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const isValid = await verifyPassword(currentPassword, userData.password)
    if (!isValid) {
      return NextResponse.json({ error: "Invalid current password" }, { status: 400 })
    }

    const hashedPassword = await hashPassword(newPassword)
    await updateUserPassword(user.userId, hashedPassword)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Password update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
