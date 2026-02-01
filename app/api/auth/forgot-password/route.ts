import { NextResponse } from "next/server"
import { findUserByEmail, createPasswordResetToken } from "@/lib/db-helpers"
import crypto from "crypto"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const user = await findUserByEmail(email)

    // Always return success to prevent email enumeration
    if (!user) {
      return NextResponse.json({
        success: true,
        message: "If an account with that email exists, a password reset link has been sent.",
      })
    }

    // Generate secure token
    const token = crypto.randomBytes(32).toString("hex")

    // Store token in database
    await createPasswordResetToken(user._id, token)

    // In production, send email here
    // For now, we'll return the token (in production, this would be sent via email)
    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/reset-password?token=${token}`

    console.log("[v0] Password reset link:", resetLink)

    // In production, send email with resetLink
    // await sendPasswordResetEmail(email, resetLink)

    return NextResponse.json({
      success: true,
      message: "If an account with that email exists, a password reset link has been sent.",
      // Remove this in production - only for development
      ...(process.env.NODE_ENV === "development" && { resetLink }),
    })
  } catch (error) {
    console.error("[v0] Forgot password error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
