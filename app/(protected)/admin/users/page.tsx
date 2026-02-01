import { getCurrentUser } from "@/lib/auth"
import { findUserById, getAllUsers } from "@/lib/db-helpers"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UserManagementTable } from "@/components/user-management-table"

export const metadata = {
  title: "User Management - Admin",
  description: "Manage all user accounts",
}

export default async function AdminUsersPage() {
  const user = await getCurrentUser()
  if (!user) redirect("/login")

  const userData = await findUserById(user.userId)
  if (!userData?.isSuperAdmin && !userData?.isAdmin) redirect("/dashboard")

  const allUsers = await getAllUsers()

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="w-full max-w-[1600px] mx-auto py-6 md:py-10 px-4 md:px-6 lg:px-8 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">User Management</CardTitle>
            <CardDescription>
              {userData?.isSuperAdmin
                ? "View and manage all user accounts, create admins, and change passwords"
                : "View all user accounts"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UserManagementTable
              users={allUsers}
              currentUserId={user.userId}
              isSuperAdmin={userData?.isSuperAdmin || false}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
