import { type NextRequest, NextResponse } from "next/server"
import { createUser, findUserByEmail } from "@/lib/db-helpers"
import { hashPassword, createToken, setAuthCookie } from "@/lib/auth"
import { validateEmail, validatePassword, validateName } from "@/lib/validators"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, name } = body

    // Validate inputs
    const emailValidation = validateEmail(email)
    if (!emailValidation.valid) {
      return NextResponse.json({ error: emailValidation.error }, { status: 400 })
    }

    const passwordValidation = validatePassword(password)
    if (!passwordValidation.valid) {
      return NextResponse.json({ error: passwordValidation.error }, { status: 400 })
    }

    const nameValidation = validateName(name)
    if (!nameValidation.valid) {
      return NextResponse.json({ error: nameValidation.error }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await findUserByEmail(email.toLowerCase())
    if (existingUser) {
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 400 })
    }

    // Hash password and create user
    const hashedPassword = await hashPassword(password)
    const userId = await createUser({
      email: email.toLowerCase(),
      password: hashedPassword,
      name: name.trim(),
    })

    // Create token and set cookie
    const token = await createToken({ userId, email: email.toLowerCase() })
    await setAuthCookie(token)

    return NextResponse.json(
      {
        success: true,
        user: { id: userId, email: email.toLowerCase(), name: name.trim() },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("[v0] Signup error:", error)
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 })
  }
}
