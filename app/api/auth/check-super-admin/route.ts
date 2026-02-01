import { NextResponse } from "next/server"
import { hasSuperAdmin } from "@/lib/db-helpers"

export async function GET() {
  try {
    const exists = await hasSuperAdmin()
    return NextResponse.json({ exists })
  } catch (error) {
    console.error("[v0] Check super admin error:", error)
    return NextResponse.json({ exists: false, error: "Failed to check" }, { status: 500 })
  }
}
