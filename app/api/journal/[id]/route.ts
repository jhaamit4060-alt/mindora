import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { updateJournalEntry, deleteJournalEntry } from "@/lib/db-helpers"

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { content } = body

    if (!content || content.trim() === "") {
      return NextResponse.json({ error: "Content is required" }, { status: 400 })
    }

    await updateJournalEntry(id, user.userId, { content: content.trim() })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Journal update error:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    await deleteJournalEntry(id, user.userId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Journal delete error:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
