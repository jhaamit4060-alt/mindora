import type React from "react"
import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { findUserById } from "@/lib/db-helpers"
import { NavHeader } from "@/components/nav-header"
import { ProfileCompletionGuard } from "./profile/middleware-check"
import { Chatbot } from "@/components/chatbot"

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  const userData = await findUserById(user.userId)

  if (!userData?.onboardingComplete) {
    redirect("/onboarding")
  }

  const isAdmin = userData.isSuperAdmin === true || userData.isAdmin === true
  const isSuperAdmin = userData.isSuperAdmin === true

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-background to-blue-50 dark:from-slate-900 dark:via-background dark:to-slate-800">
      <NavHeader userName={userData.name} isAdmin={isAdmin} isSuperAdmin={isSuperAdmin} />
      <ProfileCompletionGuard profileCompleted={userData.profileCompleted || false} isSuperAdmin={isSuperAdmin}>
        <main className="flex-1">{children}</main>
      </ProfileCompletionGuard>
      <Chatbot userId={user.userId} />
    </div>
  )
}
