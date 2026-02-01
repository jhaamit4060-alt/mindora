import { type NextRequest, NextResponse } from "next/server"
import { findUserByEmail } from "@/lib/db-helpers"
import { verifyPassword, createToken, setAuthCookie } from "@/lib/auth"
import { validateEmail } from "@/lib/validators"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Validate email format
    const emailValidation = validateEmail(email)
    if (!emailValidation.valid) {
      return NextResponse.json({ error: emailValidation.error }, { status: 400 })
    }

    if (!password) {
      return NextResponse.json({ error: "Password is required" }, { status: 400 })
    }

    // Find user
    const user = await findUserByEmail(email.toLowerCase())
    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password)
    if (!isValidPassword) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    // Create token and set cookie
    const token = await createToken({ userId: user._id, email: user.email })
    await setAuthCookie(token)

    return NextResponse.json({
      success: true,
      user: { id: user._id, email: user.email, name: user.name },
    })
  } catch (error) {
    console.error("[v0] Login error:", error)
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 })
  }
}
