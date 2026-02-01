import { NextResponse } from "next/server"
import { findPasswordResetToken, updateUserPassword, markPasswordResetTokenAsUsed } from "@/lib/db-helpers"
import { hashPassword } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const { token, newPassword } = await request.json()

    if (!token || !newPassword) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters long" }, { status: 400 })
    }

    // Verify token
    const resetToken = await findPasswordResetToken(token)

    if (!resetToken) {
      return NextResponse.json({ error: "Invalid or expired reset token" }, { status: 400 })
    }

    // Update password
    const hashedPassword = await hashPassword(newPassword)
    await updateUserPassword(resetToken.userId, hashedPassword)

    // Mark token as used
    await markPasswordResetTokenAsUsed(resetToken._id)

    return NextResponse.json({ success: true, message: "Password reset successfully" })
  } catch (error) {
    console.error("[v0] Reset password error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
