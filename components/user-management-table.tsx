"use client"

import { useState } from "react"
import type { User } from "@/lib/types"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trash2, Search, Shield, UserCog, KeyRound, UserPlus } from "lucide-react"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function UserManagementTable({
  users,
  currentUserId,
  isSuperAdmin,
}: {
  users: User[]
  currentUserId: string
  isSuperAdmin: boolean
}) {
  const [search, setSearch] = useState("")
  const [showPasswordDialog, setShowPasswordDialog] = useState(false)
  const [showRoleDialog, setShowRoleDialog] = useState(false)
  const [showCreateAdminDialog, setShowCreateAdminDialog] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [newPassword, setNewPassword] = useState("")
  const [roleReason, setRoleReason] = useState("")
  const [passwordReason, setPasswordReason] = useState("")
  const [newRoleIsAdmin, setNewRoleIsAdmin] = useState(false)
  const [adminForm, setAdminForm] = useState({ name: "", email: "", password: "" })
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.profile?.phone?.includes(search),
  )

  const handleDelete = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user? This will delete all their data.")) return

    const res = await fetch("/api/admin/users", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    })

    if (res.ok) {
      router.refresh()
    }
  }

  const handleChangePassword = async () => {
    if (!selectedUser || !newPassword || !passwordReason) return

    setLoading(true)
    const res = await fetch("/api/admin/users/password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: selectedUser._id, newPassword, reason: passwordReason }),
    })

    if (res.ok) {
      setShowPasswordDialog(false)
      setNewPassword("")
      setPasswordReason("")
      setSelectedUser(null)
      alert("Password changed successfully and logged!")
    } else {
      const data = await res.json()
      alert(data.error || "Failed to change password")
    }
    setLoading(false)
  }

  const handleChangeRole = async () => {
    if (!selectedUser || !roleReason) return

    setLoading(true)
    const res = await fetch("/api/admin/users/role", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: selectedUser._id, isAdmin: newRoleIsAdmin, reason: roleReason }),
    })

    if (res.ok) {
      setShowRoleDialog(false)
      setRoleReason("")
      setSelectedUser(null)
      router.refresh()
    } else {
      const data = await res.json()
      alert(data.error || "Failed to update role")
    }
    setLoading(false)
  }

  const handleCreateAdmin = async () => {
    if (!adminForm.name || !adminForm.email || !adminForm.password) return

    setLoading(true)
    const res = await fetch("/api/admin/users/createAdmin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: adminForm.name, email: adminForm.email, password: adminForm.password }),
    })

    if (res.ok) {
      setShowCreateAdminDialog(false)
      setAdminForm({ name: "", email: "", password: "" })
      router.refresh()
    } else {
      const data = await res.json()
      alert(data.error || "Failed to create admin account")
    }
    setLoading(false)
  }

  const getUserRole = (user: User) => {
    if (user.isSuperAdmin) return "Super Admin"
    if (user.isAdmin) return "Admin"
    return "User"
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2 flex-1 max-w-sm">
          <Search className="w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search users by name, email, or mobile..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {isSuperAdmin && (
          <Button onClick={() => setShowCreateAdminDialog(true)} className="gap-2">
            <UserPlus className="w-4 h-4" />
            Create Admin Account
          </Button>
        )}
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Mobile</TableHead>
              <TableHead>Gender / DOB</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Role</TableHead>
              {isSuperAdmin && <TableHead className="text-right">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user._id}>
                <TableCell className="font-medium">
                  {user.name}
                  {user.isDisabled && (
                    <Badge variant="destructive" className="ml-2">
                      Disabled
                    </Badge>
                  )}
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.profile?.phone || "—"}</TableCell>
                <TableCell>
                  <div className="text-xs space-y-1">
                    <p>
                      <span className="text-muted-foreground uppercase font-semibold">Gender:</span>{" "}
                      {user.profile?.gender || "—"}
                    </p>
                    <p>
                      <span className="text-muted-foreground uppercase font-semibold">DOB:</span>{" "}
                      {user.profile?.dateOfBirth || "—"}
                    </p>
                  </div>
                </TableCell>
                <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {user.isSuperAdmin ? (
                      <Badge variant="secondary" className="gap-1">
                        <Shield className="w-3 h-3" />
                        Super Admin
                      </Badge>
                    ) : user.isAdmin ? (
                      <Badge variant="outline" className="gap-1 bg-primary/5 text-primary border-primary/20">
                        <UserCog className="w-3 h-3" />
                        Admin
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-muted-foreground">
                        User
                      </Badge>
                    )}
                    {isSuperAdmin && !user.isSuperAdmin && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => {
                          setSelectedUser(user)
                          setNewRoleIsAdmin(!user.isAdmin)
                          setShowRoleDialog(true)
                        }}
                      >
                        <UserCog className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </TableCell>
                {isSuperAdmin && (
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      {!user.isSuperAdmin && (
                        <>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => {
                                    setSelectedUser(user)
                                    setShowPasswordDialog(true)
                                  }}
                                  className="text-primary hover:bg-primary/10 h-8 w-8"
                                >
                                  <KeyRound className="w-4 h-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Change Password</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(user._id)}
                            className="text-destructive hover:bg-destructive/10 h-8 w-8"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="text-sm text-muted-foreground">
        Showing {filteredUsers.length} of {users.length} users
      </div>

      {/* Role Change Dialog */}
      <Dialog open={showRoleDialog} onOpenChange={setShowRoleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change User Role</DialogTitle>
            <DialogDescription>
              Update role for {selectedUser?.name} to {newRoleIsAdmin ? "Admin" : "User"}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="roleReason">
                Reason for Role Change <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="roleReason"
                value={roleReason}
                onChange={(e) => setRoleReason(e.target.value)}
                placeholder="Explain why you are changing this user's role (mandatory for audit logs)"
                className="min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRoleDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleChangeRole} disabled={loading || !roleReason}>
              {loading ? "Updating..." : "Update Role"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Password Change Dialog with Reason */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Administrative Password Change</DialogTitle>
            <DialogDescription>
              Forcing a new password for {selectedUser?.name}. This action is logged.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="adminNewPassword">
                New Password <span className="text-destructive">*</span>
              </Label>
              <Input
                id="adminNewPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new secure password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="passwordReason">
                Reason for Password Reset <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="passwordReason"
                value={passwordReason}
                onChange={(e) => setPasswordReason(e.target.value)}
                placeholder="Explain why you are resetting this password (e.g., User request, Security breach)"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPasswordDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleChangePassword} disabled={loading || !newPassword || !passwordReason}>
              {loading ? "Updating..." : "Change Password"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Admin Dialog */}
      <Dialog open={showCreateAdminDialog} onOpenChange={setShowCreateAdminDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Admin Account</DialogTitle>
            <DialogDescription>Create a new admin account with read-only access to user data.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="adminName">Name</Label>
              <Input
                id="adminName"
                value={adminForm.name}
                onChange={(e) => setAdminForm({ ...adminForm, name: e.target.value })}
                placeholder="Admin name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="adminEmail">Email</Label>
              <Input
                id="adminEmail"
                type="email"
                value={adminForm.email}
                onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })}
                placeholder="admin@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="adminPassword">Password</Label>
              <Input
                id="adminPassword"
                type="password"
                value={adminForm.password}
                onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
                placeholder="Secure password"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowCreateAdminDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateAdmin} disabled={loading}>
                {loading ? "Creating..." : "Create Admin"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
