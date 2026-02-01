import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import {
  findUserById,
  getAllUsers,
  getAllMoodEntries,
  getAllJournalEntries,
  getAllExerciseSessions,
} from "@/lib/db-helpers"
import ExcelJS from "exceljs"

export async function GET() {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const userData = await findUserById(user.userId)
  if (!userData?.isSuperAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const allUsers = await getAllUsers()
  const allMoods = await getAllMoodEntries()
  const allJournals = await getAllJournalEntries()
  const allExercises = await getAllExerciseSessions()

  // Create workbook
  const workbook = new ExcelJS.Workbook()
  workbook.creator = "Mental Wellness Admin"
  workbook.created = new Date()

  // Users sheet
  const usersSheet = workbook.addWorksheet("Users")
  usersSheet.columns = [
    { header: "User ID", key: "id", width: 30 },
    { header: "Name", key: "name", width: 25 },
    { header: "Email", key: "email", width: 30 },
    { header: "Created At", key: "createdAt", width: 20 },
    { header: "Is Admin", key: "isAdmin", width: 15 },
  ]
  allUsers.forEach((u) => {
    usersSheet.addRow({
      id: u._id,
      name: u.name,
      email: u.email,
      createdAt: new Date(u.createdAt).toLocaleString(),
      isAdmin: u.isSuperAdmin ? "Yes" : "No",
    })
  })

  // Mood Entries sheet
  const moodsSheet = workbook.addWorksheet("Mood Entries")
  moodsSheet.columns = [
    { header: "Entry ID", key: "id", width: 30 },
    { header: "User ID", key: "userId", width: 30 },
    { header: "Mood Score", key: "mood", width: 15 },
    { header: "Notes", key: "notes", width: 50 },
    { header: "Date", key: "date", width: 20 },
  ]
  allMoods.forEach((m) => {
    moodsSheet.addRow({
      id: m._id,
      userId: m.userId,
      mood: m.mood,
      notes: m.notes || "",
      date: new Date(m.date).toLocaleString(),
    })
  })

  // Journal Entries sheet
  const journalsSheet = workbook.addWorksheet("Journal Entries")
  journalsSheet.columns = [
    { header: "Entry ID", key: "id", width: 30 },
    { header: "User ID", key: "userId", width: 30 },
    { header: "Title", key: "title", width: 30 },
    { header: "Content", key: "content", width: 60 },
    { header: "Date", key: "date", width: 20 },
  ]
  allJournals.forEach((j) => {
    journalsSheet.addRow({
      id: j._id,
      userId: j.userId,
      title: j.title || "",
      content: j.content,
      date: new Date(j.date).toLocaleString(),
    })
  })

  // Exercise Sessions sheet
  const exercisesSheet = workbook.addWorksheet("Exercise Sessions")
  exercisesSheet.columns = [
    { header: "Session ID", key: "id", width: 30 },
    { header: "User ID", key: "userId", width: 30 },
    { header: "Exercise Name", key: "name", width: 30 },
    { header: "Duration (min)", key: "duration", width: 20 },
    { header: "Completed At", key: "completedAt", width: 20 },
  ]
  allExercises.forEach((e) => {
    exercisesSheet.addRow({
      id: e._id,
      userId: e.userId,
      name: e.exerciseName,
      duration: e.duration || "N/A",
      completedAt: new Date(e.completedAt).toLocaleString(),
    })
  })

  // Style headers
  const sheets = [usersSheet, moodsSheet, journalsSheet, exercisesSheet]
  sheets.forEach((sheet) => {
    sheet.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } }
    sheet.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF6366F1" },
    }
    sheet.getRow(1).alignment = { vertical: "middle", horizontal: "center" }
  })

  // Generate buffer
  const buffer = await workbook.xlsx.writeBuffer()

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="wellness-data-${new Date().toISOString().split("T")[0]}.xlsx"`,
    },
  })
}
