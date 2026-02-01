import { NextResponse } from "next/server"
import { hasSuperAdmin, createSuperAdmin, findUserByEmail } from "@/lib/db-helpers"
import { hashPassword } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ success: false, error: "Email and password required" }, { status: 400 })
    }

    // Check if super admin already exists
    const exists = await hasSuperAdmin()
    if (exists) {
      return NextResponse.json({ success: false, error: "Super admin already exists" }, { status: 400 })
    }

    // Check if email is already taken
    const existingUser = await findUserByEmail(email)
    if (existingUser) {
      return NextResponse.json({ success: false, error: "Email already registered" }, { status: 400 })
    }

    // Hash password and create super admin
    const hashedPassword = await hashPassword(password)
    await createSuperAdmin({
      email,
      password: hashedPassword,
      name: "Super Admin",
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Setup super admin error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
