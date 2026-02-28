import { getCurrentUser } from "@/lib/auth"
import { connectToDatabase } from "@/lib/mongodb"
import { NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { type, metadata } = body

    if (!type) {
      return NextResponse.json({ error: "Missing consent type" }, { status: 400 })
    }

    const db = await connectToDatabase()
    
    // Create consent record
    const consentRecord = {
      userId: new ObjectId(user.userId),
      type,
      timestamp: new Date(),
      metadata: metadata || {},
      userAgent: request.headers.get("user-agent"),
      ipAddress: request.headers.get("x-forwarded-for") || "unknown",
    }

    // Insert into consents collection
    const result = await db.collection("consents").insertOne(consentRecord)

    // Also update user's consent preferences
    await db.collection("users").updateOne(
      { _id: new ObjectId(user.userId) },
      {
        $push: {
          consents: {
            type,
            timestamp: new Date(),
          },
        },
        $set: {
          lastConsentDate: new Date(),
        },
      }
    )

    console.log("[v0] Consent recorded for user:", user.userId, "type:", type)

    return NextResponse.json(
      {
        success: true,
        message: "Consent recorded successfully",
        consentId: result.insertedId,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("[v0] Error recording consent:", error)
    return NextResponse.json({ error: "Failed to record consent" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const db = await connectToDatabase()

    // Get all consent records for the user
    const consents = await db
      .collection("consents")
      .find({ userId: new ObjectId(user.userId) })
      .sort({ timestamp: -1 })
      .toArray()

    return NextResponse.json({
      success: true,
      consents,
      count: consents.length,
    })
  } catch (error) {
    console.error("[v0] Error fetching consents:", error)
    return NextResponse.json({ error: "Failed to fetch consents" }, { status: 500 })
  }
}
