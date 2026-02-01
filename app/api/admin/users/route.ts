import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { findUserById, deleteUser, getAllUsers } from "@/lib/db-helpers"

export async function GET() {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const userData = await findUserById(user.userId)
  if (!userData?.isSuperAdmin && !userData?.isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const allUsers = await getAllUsers()
  return NextResponse.json({ users: allUsers })
}

export async function DELETE(request: Request) {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const userData = await findUserById(user.userId)
  if (!userData?.isSuperAdmin) {
    return NextResponse.json({ error: "Forbidden - Super Admin only" }, { status: 403 })
  }

  const { userId } = await request.json()

  await deleteUser(userId)

  return NextResponse.json({ success: true })
}
