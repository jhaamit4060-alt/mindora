import { getDatabase } from "./mongodb"
import { ObjectId } from "mongodb"
import type { User, MoodEntry, JournalEntry, ExerciseSession, AuditLog, PasswordResetToken } from "./types"

export async function createUser(
  userData: Omit<User, "_id" | "createdAt" | "onboardingComplete" | "profileCompleted">,
) {
  const db = await getDatabase()
  const result = await db.collection("users").insertOne({
    ...userData,
    createdAt: new Date(),
    onboardingComplete: false,
    profileCompleted: false, // Initialize profileCompleted as false
  })
  return result.insertedId.toString()
}

export async function findUserByEmail(email: string): Promise<User | null> {
  const db = await getDatabase()
  const user = await db.collection("users").findOne({ email })
  if (!user) return null
  return { ...user, _id: user._id.toString() } as User
}

export async function findUserById(userId: string): Promise<User | null> {
  const db = await getDatabase()
  try {
    const user = await db.collection("users").findOne({ _id: new ObjectId(userId) })
    if (!user) return null
    return { ...user, _id: user._id.toString() } as User
  } catch (error) {
    return null
  }
}

export async function updateUser(userId: string, updates: Partial<User>) {
  const db = await getDatabase()
  await db.collection("users").updateOne({ _id: new ObjectId(userId) }, { $set: updates })
}

export async function updateUserProfile(userId: string, profile: User["profile"]) {
  const db = await getDatabase()
  await db.collection("users").updateOne({ _id: new ObjectId(userId) }, { $set: { profile } })
}

export async function updateUserPassword(userId: string, hashedPassword: string) {
  const db = await getDatabase()
  await db.collection("users").updateOne({ _id: new ObjectId(userId) }, { $set: { password: hashedPassword } })
}

export async function createMoodEntry(moodData: Omit<MoodEntry, "_id" | "createdAt">) {
  const db = await getDatabase()
  const result = await db.collection("mood_entries").insertOne({
    ...moodData,
    createdAt: new Date(),
  })
  return result.insertedId.toString()
}

export async function getMoodEntries(userId: string, limit = 30): Promise<MoodEntry[]> {
  const db = await getDatabase()
  const entries = await db.collection("mood_entries").find({ userId }).sort({ date: -1 }).limit(limit).toArray()

  return entries.map((entry) => ({ ...entry, _id: entry._id.toString() })) as MoodEntry[]
}

export async function createJournalEntry(journalData: Omit<JournalEntry, "_id" | "createdAt" | "updatedAt">) {
  const db = await getDatabase()
  const now = new Date()
  const result = await db.collection("journal_entries").insertOne({
    ...journalData,
    createdAt: now,
    updatedAt: now,
  })
  return result.insertedId.toString()
}

export async function getJournalEntries(userId: string, limit = 20): Promise<JournalEntry[]> {
  const db = await getDatabase()
  const entries = await db.collection("journal_entries").find({ userId }).sort({ date: -1 }).limit(limit).toArray()

  return entries.map((entry) => ({ ...entry, _id: entry._id.toString() })) as JournalEntry[]
}

export async function updateJournalEntry(entryId: string, userId: string, updates: Partial<JournalEntry>) {
  const db = await getDatabase()
  await db
    .collection("journal_entries")
    .updateOne({ _id: new ObjectId(entryId), userId }, { $set: { ...updates, updatedAt: new Date() } })
}

export async function deleteJournalEntry(entryId: string, userId: string) {
  const db = await getDatabase()
  await db.collection("journal_entries").deleteOne({
    _id: new ObjectId(entryId),
    userId,
  })
}

export async function createExerciseSession(sessionData: Omit<ExerciseSession, "_id">) {
  const db = await getDatabase()
  const result = await db.collection("exercise_sessions").insertOne(sessionData)
  return result.insertedId.toString()
}

export async function getExerciseSessions(userId: string, limit = 50): Promise<ExerciseSession[]> {
  const db = await getDatabase()
  const sessions = await db
    .collection("exercise_sessions")
    .find({ userId })
    .sort({ completedAt: -1 })
    .limit(limit)
    .toArray()

  return sessions.map((session) => ({ ...session, _id: session._id.toString() })) as ExerciseSession[]
}

export async function createAdmin(userData: {
  email: string
  password: string
  name: string
}): Promise<string> {
  const db = await getDatabase()
  const result = await db.collection("users").insertOne({
    ...userData,
    createdAt: new Date(),
    onboardingComplete: true,
    profileCompleted: false, // Admins must also complete profile on first login
    isAdmin: true,
    isSuperAdmin: false,
  })
  return result.insertedId.toString()
}

export async function markProfileCompleted(userId: string) {
  const db = await getDatabase()
  await db.collection("users").updateOne({ _id: new ObjectId(userId) }, { $set: { profileCompleted: true } })
}

export async function updateUserRole(
  userId: string,
  isAdmin: boolean,
  reason: string,
  performedBy: string,
  performedByName: string,
) {
  const db = await getDatabase()

  // Update the user's role
  await db.collection("users").updateOne({ _id: new ObjectId(userId) }, { $set: { isAdmin } })

  // Get target user info for audit log
  const targetUser = await findUserById(userId)

  // Create audit log entry
  if (targetUser) {
    await db.collection("audit_logs").insertOne({
      performedBy,
      performedByName,
      action: "role_change",
      targetUserId: userId,
      targetUserEmail: targetUser.email,
      reason,
      details: { newRole: isAdmin ? "Admin" : "User" },
      timestamp: new Date(),
    })
  }
}

export async function createSuperAdmin(userData: {
  email: string
  password: string
  name: string
}): Promise<string> {
  const db = await getDatabase()
  const result = await db.collection("users").insertOne({
    ...userData,
    createdAt: new Date(),
    onboardingComplete: true,
    profileCompleted: true, // Super Admin doesn't need profile completion
    isSuperAdmin: true,
    isAdmin: false,
  })
  return result.insertedId.toString()
}

export async function updateUserPasswordWithAudit(
  userId: string,
  hashedPassword: string,
  reason: string,
  performedBy: string,
  performedByName: string,
) {
  const db = await getDatabase()

  // Update password
  await db.collection("users").updateOne({ _id: new ObjectId(userId) }, { $set: { password: hashedPassword } })

  // Get target user info
  const targetUser = await findUserById(userId)

  // Create audit log
  if (targetUser) {
    await db.collection("audit_logs").insertOne({
      performedBy,
      performedByName,
      action: "password_change",
      targetUserId: userId,
      targetUserEmail: targetUser.email,
      reason,
      timestamp: new Date(),
    })
  }
}

export async function createPasswordResetToken(userId: string, token: string): Promise<string> {
  const db = await getDatabase()
  const expiresAt = new Date()
  expiresAt.setHours(expiresAt.getHours() + 1) // Token expires in 1 hour

  const result = await db.collection("password_reset_tokens").insertOne({
    userId,
    token,
    expiresAt,
    createdAt: new Date(),
    used: false,
  })

  return result.insertedId.toString()
}

export async function findPasswordResetToken(token: string): Promise<PasswordResetToken | null> {
  const db = await getDatabase()
  const resetToken = await db.collection("password_reset_tokens").findOne({
    token,
    used: false,
    expiresAt: { $gt: new Date() },
  })

  if (!resetToken) return null
  return { ...resetToken, _id: resetToken._id.toString() } as PasswordResetToken
}

export async function markPasswordResetTokenAsUsed(tokenId: string) {
  const db = await getDatabase()
  await db.collection("password_reset_tokens").updateOne({ _id: new ObjectId(tokenId) }, { $set: { used: true } })
}

export async function getAuditLogs(limit = 100): Promise<AuditLog[]> {
  const db = await getDatabase()
  const logs = await db.collection("audit_logs").find({}).sort({ timestamp: -1 }).limit(limit).toArray()
  return logs.map((log) => ({ ...log, _id: log._id.toString() })) as AuditLog[]
}

export async function getAuditLogsByUser(userId: string, limit = 50): Promise<AuditLog[]> {
  const db = await getDatabase()
  const logs = await db
    .collection("audit_logs")
    .find({ targetUserId: userId })
    .sort({ timestamp: -1 })
    .limit(limit)
    .toArray()
  return logs.map((log) => ({ ...log, _id: log._id.toString() })) as AuditLog[]
}

export async function createAuditLog(log: Omit<AuditLog, "_id" | "timestamp">) {
  const db = await getDatabase()
  const result = await db.collection("audit_logs").insertOne({
    ...log,
    timestamp: new Date(),
  })
  return result.insertedId.toString()
}

export async function toggleUserStatus(userId: string, isDisabled: boolean, performerId: string, reason: string) {
  const db = await getDatabase()
  await db.collection("users").updateOne({ _id: new ObjectId(userId) }, { $set: { isDisabled } })

  await createAuditLog({
    action: isDisabled ? "user_disable" : "user_enable",
    performerId,
    targetUserId: userId,
    reason,
  })
}

export async function deleteUser(userId: string) {
  const db = await getDatabase()
  await db.collection("users").deleteOne({ _id: new ObjectId(userId) })
  await db.collection("mood_entries").deleteMany({ userId })
  await db.collection("journal_entries").deleteMany({ userId })
  await db.collection("exercise_sessions").deleteMany({ userId })
}

export async function getUserWithStats(userId: string) {
  const db = await getDatabase()
  const user = await findUserById(userId)
  if (!user) return null

  const moodCount = await db.collection("mood_entries").countDocuments({ userId })
  const journalCount = await db.collection("journal_entries").countDocuments({ userId })
  const exerciseCount = await db.collection("exercise_sessions").countDocuments({ userId })

  return {
    ...user,
    stats: {
      moodEntries: moodCount,
      journalEntries: journalCount,
      exerciseSessions: exerciseCount,
    },
  }
}

export async function getAllUsers(): Promise<User[]> {
  const db = await getDatabase()
  const users = await db.collection("users").find({}).sort({ createdAt: -1 }).toArray()
  return users.map((user) => ({ ...user, _id: user._id.toString() })) as User[]
}

export async function getAllMoodEntries(): Promise<MoodEntry[]> {
  const db = await getDatabase()
  const entries = await db.collection("mood_entries").find({}).sort({ date: -1 }).toArray()
  return entries.map((entry) => ({ ...entry, _id: entry._id.toString() })) as MoodEntry[]
}

export async function getAllJournalEntries(): Promise<JournalEntry[]> {
  const db = await getDatabase()
  const entries = await db.collection("journal_entries").find({}).sort({ date: -1 }).toArray()
  return entries.map((entry) => ({ ...entry, _id: entry._id.toString() })) as JournalEntry[]
}

export async function getAllExerciseSessions(): Promise<ExerciseSession[]> {
  const db = await getDatabase()
  const sessions = await db.collection("exercise_sessions").find({}).sort({ completedAt: -1 }).toArray()
  return sessions.map((session) => ({ ...session, _id: session._id.toString() })) as ExerciseSession[]
}

export async function hasSuperAdmin(): Promise<boolean> {
  const db = await getDatabase()
  const count = await db.collection("users").countDocuments({ isSuperAdmin: true })
  return count > 0
}
