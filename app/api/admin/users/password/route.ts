import { NextResponse } from "next/server"
import { getCurrentUser, hashPassword } from "@/lib/auth"
import { findUserById, updateUserPasswordWithAudit } from "@/lib/db-helpers"

export async function POST(request: Request) {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const userData = await findUserById(user.userId)
  // Only Super Admin can change passwords
  if (!userData?.isSuperAdmin) {
    return NextResponse.json({ error: "Forbidden - Super Admin access required" }, { status: 403 })
  }

  const { userId, newPassword, reason } = await request.json()

  if (!userId || !newPassword || !reason) {
    return NextResponse.json({ error: "Missing required fields (userId, newPassword, and reason)" }, { status: 400 })
  }

  // Prevent changing Super Admin password
  const targetUser = await findUserById(userId)
  if (targetUser?.isSuperAdmin) {
    return NextResponse.json({ error: "Cannot change Super Admin password" }, { status: 403 })
  }

  const hashedPassword = await hashPassword(newPassword)
  await updateUserPasswordWithAudit(userId, hashedPassword, reason, user.userId, userData.name)

  return NextResponse.json({ success: true })
}
