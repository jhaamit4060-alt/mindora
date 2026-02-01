import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { findUserById, updateUser, updateUserProfile, markProfileCompleted } from "@/lib/db-helpers"

export async function GET() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userData = await findUserById(user.userId)

    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      name: userData.name,
      email: userData.email,
      profileCompleted: userData.profileCompleted || false,
      profile: userData.profile || {},
    })
  } catch (error) {
    console.error("Error fetching profile:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const {
      name,
      phone,
      dateOfBirth,
      gender,
      address,
      emergencyContactName,
      emergencyContactRelation,
      emergencyContactPhone,
      medicalHistory,
      therapistName,
      therapistContact,
    } = body

    if (
      !phone ||
      !dateOfBirth ||
      !gender ||
      !medicalHistory ||
      !emergencyContactName ||
      !emergencyContactRelation ||
      !emergencyContactPhone
    ) {
      return NextResponse.json(
        { error: "All required fields must be filled to complete your profile" },
        { status: 400 },
      )
    }

    // Validate date of birth is not in future
    const dob = new Date(dateOfBirth)
    if (dob > new Date()) {
      return NextResponse.json({ error: "Date of birth cannot be in the future" }, { status: 400 })
    }

    // Update name if changed
    if (name) {
      await updateUser(user.userId, { name })
    }

    await updateUserProfile(user.userId, {
      phone,
      dateOfBirth,
      gender,
      address: address || "",
      emergencyContact: {
        name: emergencyContactName,
        relation: emergencyContactRelation,
        phone: emergencyContactPhone,
      },
      medicalHistory,
      therapistName: therapistName || "",
      therapistContact: therapistContact || "",
    })

    await markProfileCompleted(user.userId)

    return NextResponse.json({ success: true, profileCompleted: true })
  } catch (error) {
    console.error("Error updating profile:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
