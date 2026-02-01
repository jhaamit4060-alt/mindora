import { getCurrentUser } from "@/lib/auth"
import { findUserById } from "@/lib/db-helpers"
import { redirect } from "next/navigation"
import UserAnalyticsContent from "@/components/user-analytics-content"
import { TrendingUp } from "lucide-react"

export const metadata = {
  title: "My Analytics - Track Your Wellness Progress",
  description: "View your mood trends, activity patterns, and download detailed reports",
}

export default async function UserAnalyticsPage() {
  const user = await getCurrentUser()
  if (!user) redirect("/login")

  const userData = await findUserById(user.userId)
  if (!userData) redirect("/login")

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="w-full px-4 md:px-6 lg:px-12 xl:px-16 py-8 md:py-12 space-y-8">
        {/* Page Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-accent via-primary/80 to-secondary p-10 md:p-16 text-white shadow-xl">
          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/20 backdrop-blur-sm text-sm font-medium">
              <TrendingUp className="w-4 h-4" />
              <span>Personal Insights</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold">Your Analytics</h1>
            <p className="text-lg md:text-xl text-white/90 max-w-3xl leading-relaxed">
              Track your wellness journey with detailed mood trends, activity patterns, and comprehensive reports
            </p>
          </div>
          <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-primary/30 rounded-full blur-3xl" />
        </div>

        {/* Analytics Content */}
        <UserAnalyticsContent />
      </div>
    </div>
  )
}
