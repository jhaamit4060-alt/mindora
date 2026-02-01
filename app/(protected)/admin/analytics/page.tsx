import { getCurrentUser } from "@/lib/auth"
import {
  findUserById,
  getAllUsers,
  getAllMoodEntries,
  getAllJournalEntries,
  getAllExerciseSessions,
} from "@/lib/db-helpers"
import { redirect } from "next/navigation"
import { AnalyticsCharts } from "@/components/analytics-charts"
import { ExportDataButton } from "@/components/export-data-button"
import { TrendingUp, Shield, UserCog } from "lucide-react"

export const metadata = {
  title: "Platform Analytics - Admin",
  description: "View detailed platform analytics and export data",
}

export default async function AdminAnalyticsPage() {
  const user = await getCurrentUser()
  if (!user) redirect("/login")

  const userData = await findUserById(user.userId)
  if (!userData?.isSuperAdmin && !userData?.isAdmin) redirect("/dashboard")

  const allUsers = await getAllUsers()
  const allMoods = await getAllMoodEntries()
  const allJournals = await getAllJournalEntries()
  const allExercises = await getAllExerciseSessions()

  const isSuperAdmin = userData.isSuperAdmin === true

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="w-full px-4 md:px-6 lg:px-12 xl:px-16 py-8 md:py-12 space-y-8">
        {/* Admin Analytics Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-secondary via-primary/80 to-accent p-10 md:p-16 text-white shadow-xl">
          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/20 backdrop-blur-sm text-sm font-medium">
              {isSuperAdmin ? (
                <>
                  <Shield className="w-4 h-4" />
                  <span>Super Admin</span>
                </>
              ) : (
                <>
                  <UserCog className="w-4 h-4" />
                  <span>Admin</span>
                </>
              )}
            </div>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div>
                <h1 className="text-4xl md:text-6xl font-bold flex items-center gap-4 mb-3">
                  <TrendingUp className="w-12 h-12" />
                  Platform Analytics
                </h1>
                <p className="text-lg md:text-xl text-white/90 max-w-3xl leading-relaxed">
                  {isSuperAdmin
                    ? "Comprehensive platform insights and data export for all users"
                    : "View platform insights and user statistics"}
                </p>
              </div>
              {isSuperAdmin && <ExportDataButton />}
            </div>
          </div>
          <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-accent/30 rounded-full blur-3xl" />
        </div>

        <AnalyticsCharts users={allUsers} moods={allMoods} journals={allJournals} exercises={allExercises} />
      </div>
    </div>
  )
}
