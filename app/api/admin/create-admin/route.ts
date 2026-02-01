import { NextResponse } from "next/server"
import { getCurrentUser, hashPassword } from "@/lib/auth"
import { findUserById, findUserByEmail, createAdmin } from "@/lib/db-helpers"

export async function POST(request: Request) {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const userData = await findUserById(user.userId)
  // Only Super Admin can create admin accounts
  if (!userData?.isSuperAdmin) {
    return NextResponse.json({ error: "Forbidden - Super Admin access required" }, { status: 403 })
  }

  const { name, email, password } = await request.json()

  if (!name || !email || !password) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  // Check if email already exists
  const existingUser = await findUserByEmail(email)
  if (existingUser) {
    return NextResponse.json({ error: "Email already in use" }, { status: 400 })
  }

  const hashedPassword = await hashPassword(password)
  const adminId = await createAdmin({
    name,
    email,
    password: hashedPassword,
  })

  return NextResponse.json({ success: true, adminId })
}
