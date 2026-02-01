import { getCurrentUser } from "@/lib/auth"
import {
  findUserById,
  getAllUsers,
  getAllMoodEntries,
  getAllJournalEntries,
  getAllExerciseSessions,
} from "@/lib/db-helpers"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Activity, BookOpen, Brain, TrendingUp, Shield, UserCog } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export const metadata = {
  title: "Admin Dashboard - User Management & Analytics",
  description: "Manage users and view platform analytics",
}

export default async function AdminDashboardPage() {
  const user = await getCurrentUser()
  if (!user) redirect("/login")

  const userData = await findUserById(user.userId)
  if (!userData?.isSuperAdmin && !userData?.isAdmin) redirect("/dashboard")

  const allUsers = await getAllUsers()
  const allMoods = await getAllMoodEntries()
  const allJournals = await getAllJournalEntries()
  const allExercises = await getAllExerciseSessions()

  const activeUsers = allUsers.filter((u) => {
    const lastActive = new Date(u.createdAt)
    const daysSince = (Date.now() - lastActive.getTime()) / (1000 * 60 * 60 * 24)
    return daysSince <= 30
  }).length

  const isSuperAdmin = userData.isSuperAdmin === true

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <div className="w-full px-4 md:px-6 lg:px-12 xl:px-16 py-8 md:py-12 space-y-8">
        {/* Admin Hero */}
        <div className="bg-blue-600 dark:bg-blue-700 rounded-lg p-10 md:p-16 text-white">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold">
              {isSuperAdmin ? "Platform Management" : "Platform Analytics"}
            </h1>
            <p className="text-lg text-blue-100">
              {isSuperAdmin
                ? "Manage users, view analytics, and export reports"
                : "View platform statistics and user insights"}
            </p>
          </div>
        </div>

        {/* Platform Stats */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm font-semibold text-gray-600 dark:text-gray-400">Total Users</CardTitle>
              <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-gray-900 dark:text-white mb-1">{allUsers.length}</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{activeUsers} active last 30 days</p>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm font-semibold text-gray-600 dark:text-gray-400">Mood Entries</CardTitle>
              <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-gray-900 dark:text-white mb-1">{allMoods.length}</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">From all users</p>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm font-semibold text-gray-600 dark:text-gray-400">Journal Entries</CardTitle>
              <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-gray-900 dark:text-white mb-1">{allJournals.length}</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Private reflections</p>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm font-semibold text-gray-600 dark:text-gray-400">Exercise Sessions</CardTitle>
              <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Brain className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-gray-900 dark:text-white mb-1">{allExercises.length}</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Calming practices</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-lg">
                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                User Management
              </CardTitle>
              <CardDescription className="mt-2">
                {isSuperAdmin ? "Manage all user accounts" : "View user information"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/admin/users">
                <Button className="w-full h-10 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white">
                  {isSuperAdmin ? "Manage Users" : "View Users"}
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-lg">
                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                Analytics
              </CardTitle>
              <CardDescription className="mt-2">
                {isSuperAdmin ? "View detailed analytics and reports" : "View platform insights"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/admin/analytics">
                <Button variant="outline" className="w-full h-10 text-sm font-semibold bg-transparent">
                  View Analytics
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Recent Users Table */}
        <Card className="border border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Recent Users</CardTitle>
            <CardDescription>Latest user registrations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {allUsers.slice(0, 10).map((u) => (
                <div
                  key={u._id}
                  className="flex items-center justify-between py-4 first:pt-0 last:pb-0 hover:bg-gray-50 dark:hover:bg-slate-800/50 px-4 -mx-4 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-semibold">
                      {u.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-gray-900 dark:text-white">{u.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{u.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </p>
                    {u.isSuperAdmin && (
                      <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded">
                        Super Admin
                      </span>
                    )}
                    {u.isAdmin && !u.isSuperAdmin && (
                      <span className="text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 px-2 py-1 rounded">
                        Admin
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
