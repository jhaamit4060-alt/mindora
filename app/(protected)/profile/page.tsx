"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, Shield, Phone, Calendar, MapPin, AlertCircle, Stethoscope, UserCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useRouter } from "next/navigation"

interface ProfileData {
  name: string
  email: string
  phone: string
  dateOfBirth: string
  gender: string
  address: string
  emergencyContactName: string
  emergencyContactRelation: string
  emergencyContactPhone: string
  medicalHistory: string
  therapistName: string
  therapistContact: string
  profileCompleted: boolean
}

export default function ProfilePage() {
  const router = useRouter()
  const [profile, setProfile] = useState<ProfileData>({
    name: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    address: "",
    emergencyContactName: "",
    emergencyContactRelation: "",
    emergencyContactPhone: "",
    medicalHistory: "",
    therapistName: "",
    therapistContact: "",
    profileCompleted: false,
  })
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/user/profile")
      if (response.ok) {
        const data = await response.json()
        setProfile({
          name: data.name || "",
          email: data.email || "",
          phone: data.profile?.phone || "",
          dateOfBirth: data.profile?.dateOfBirth || "",
          gender: data.profile?.gender || "",
          address: data.profile?.address || "",
          emergencyContactName: data.profile?.emergencyContact?.name || "",
          emergencyContactRelation: data.profile?.emergencyContact?.relation || "",
          emergencyContactPhone: data.profile?.emergencyContact?.phone || "",
          medicalHistory: data.profile?.medicalHistory || "",
          therapistName: data.profile?.therapistName || "",
          therapistContact: data.profile?.therapistContact || "",
          profileCompleted: data.profileCompleted || false,
        })
      }
    } catch (error) {
      console.error("[v0] Error fetching profile:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)

    // Validate required fields
    if (
      !profile.phone ||
      !profile.dateOfBirth ||
      !profile.gender ||
      !profile.emergencyContactName ||
      !profile.emergencyContactRelation ||
      !profile.emergencyContactPhone ||
      !profile.medicalHistory
    ) {
      setMessage({ type: "error", text: "Please fill in all required fields marked with *" })
      setSaving(false)
      return
    }

    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({ type: "success", text: "Profile updated successfully!" })
        if (data.profileCompleted && !profile.profileCompleted) {
          // Profile was just completed, redirect to dashboard
          setTimeout(() => {
            router.push("/dashboard")
          }, 1500)
        }
        setProfile({ ...profile, profileCompleted: true })
      } else {
        setMessage({ type: "error", text: data.error || "Failed to update profile. Please try again." })
      }
    } catch (error) {
      console.error("[v0] Error updating profile:", error)
      setMessage({ type: "error", text: "An error occurred. Please try again." })
    } finally {
      setSaving(false)
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (passwords.new !== passwords.confirm) {
      setMessage({ type: "error", text: "New passwords do not match" })
      return
    }

    if (passwords.new.length < 6) {
      setMessage({ type: "error", text: "Password must be at least 6 characters long" })
      return
    }

    setPasswordLoading(true)
    setMessage(null)

    try {
      const response = await fetch("/api/auth/password/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwords.current,
          newPassword: passwords.new,
        }),
      })

      if (response.ok) {
        setMessage({ type: "success", text: "Password updated successfully!" })
        setPasswords({ current: "", new: "", confirm: "" })
      } else {
        const data = await response.json()
        setMessage({ type: "error", text: data.error || "Failed to update password" })
      }
    } catch (error) {
      setMessage({ type: "error", text: "An error occurred while updating password" })
    } finally {
      setPasswordLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-background via-background to-muted/20">
      <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-16 py-8 lg:py-12">
        {/* Hero Section */}
        <div className="mb-8 lg:mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/30">
              <UserCircle className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-foreground">Your Profile</h1>
              <p className="text-muted-foreground text-lg mt-1">
                {!profile.profileCompleted
                  ? "Please complete your profile to continue using Mindora"
                  : "Manage your personal information and settings"}
              </p>
            </div>
          </div>

          {!profile.profileCompleted && (
            <Alert className="border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/30">
              <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <AlertDescription className="text-blue-900 dark:text-blue-100">
                To ensure your safety and personalize your experience, we need you to complete your profile with
                emergency contact and medical information. All data is encrypted and securely stored.
              </AlertDescription>
            </Alert>
          )}
        </div>

        {message && (
          <Alert
            className={`mb-6 ${
              message.type === "success"
                ? "border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/30"
                : "border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/30"
            }`}
          >
            <AlertCircle
              className={`h-5 w-5 ${
                message.type === "success" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
              }`}
            />
            <AlertDescription
              className={
                message.type === "success" ? "text-green-900 dark:text-green-100" : "text-red-900 dark:text-red-100"
              }
            >
              {message.text}
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card className="p-6 lg:p-8 border-border/50 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <User className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold text-foreground">Basic Information</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-base font-medium">
                  Full Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  required
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-base font-medium">
                  Email Address <span className="text-destructive">*</span>
                </Label>
                <Input id="email" type="email" value={profile.email} disabled className="h-11 bg-muted/50" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-base font-medium">
                  Mobile Number <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    required
                    className="h-11 pl-10"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth" className="text-base font-medium">
                  Date of Birth <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={profile.dateOfBirth}
                    onChange={(e) => setProfile({ ...profile, dateOfBirth: e.target.value })}
                    required
                    max={new Date().toISOString().split("T")[0]}
                    className="h-11 pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender" className="text-base font-medium">
                  Gender <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={profile.gender}
                  onValueChange={(value) => setProfile({ ...profile, gender: value })}
                  required
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="non-binary">Non-binary</SelectItem>
                    <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address" className="text-base font-medium">
                  Address
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Textarea
                    id="address"
                    value={profile.address}
                    onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                    className="pl-10 min-h-[80px]"
                    placeholder="Street address, city, state, zip code"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Emergency Contact */}
          <Card className="p-6 lg:p-8 border-orange-200 dark:border-orange-800 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-orange-500" />
              <h2 className="text-2xl font-bold text-foreground">Emergency Contact</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              This information is for safety reference only and will be used in case of emergency situations.
            </p>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="emergencyName" className="text-base font-medium">
                  Contact Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="emergencyName"
                  value={profile.emergencyContactName}
                  onChange={(e) => setProfile({ ...profile, emergencyContactName: e.target.value })}
                  required
                  className="h-11"
                  placeholder="Full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergencyRelation" className="text-base font-medium">
                  Relationship <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="emergencyRelation"
                  value={profile.emergencyContactRelation}
                  onChange={(e) => setProfile({ ...profile, emergencyContactRelation: e.target.value })}
                  required
                  className="h-11"
                  placeholder="e.g., Parent, Spouse, Friend"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergencyPhone" className="text-base font-medium">
                  Mobile Number <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="emergencyPhone"
                  type="tel"
                  value={profile.emergencyContactPhone}
                  onChange={(e) => setProfile({ ...profile, emergencyContactPhone: e.target.value })}
                  required
                  className="h-11"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>
          </Card>

          {/* Medical Information */}
          <Card className="p-6 lg:p-8 border-border/50 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <Stethoscope className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold text-foreground">Medical History (Self-Reported)</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              This information is self-reported and used only for safety awareness. This is NOT a medical diagnosis or
              treatment.
            </p>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="medicalHistory" className="text-base font-medium">
                  Medical History <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="medicalHistory"
                  value={profile.medicalHistory}
                  onChange={(e) => setProfile({ ...profile, medicalHistory: e.target.value })}
                  required
                  className="min-h-[120px]"
                  placeholder="Relevant medical conditions, medications, allergies, etc."
                />
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="therapistName" className="text-base font-medium">
                    Therapist/Counselor Name
                  </Label>
                  <Input
                    id="therapistName"
                    value={profile.therapistName}
                    onChange={(e) => setProfile({ ...profile, therapistName: e.target.value })}
                    className="h-11"
                    placeholder="Dr. Jane Smith (optional)"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="therapistContact" className="text-base font-medium">
                    Therapist Contact
                  </Label>
                  <Input
                    id="therapistContact"
                    value={profile.therapistContact}
                    onChange={(e) => setProfile({ ...profile, therapistContact: e.target.value })}
                    className="h-11"
                    placeholder="Phone or email (optional)"
                  />
                </div>
              </div>
            </div>
          </Card>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => fetchProfile()}
              disabled={saving || passwordLoading}
              size="lg"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={saving || passwordLoading}
              size="lg"
              className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity min-w-[150px]"
            >
              {saving ? "Saving..." : profile.profileCompleted ? "Update Profile" : "Complete Profile"}
            </Button>
          </div>
        </form>

        {/* Update Password */}
        {profile.profileCompleted && (
          <Card className="mt-8 p-6 lg:p-8 border-border/50 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold text-foreground">Update Password</h2>
            </div>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={passwords.current}
                    onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                    required
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={passwords.new}
                    onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                    required
                    minLength={6}
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={passwords.confirm}
                    onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                    required
                    minLength={6}
                    className="h-11"
                  />
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <Button type="submit" disabled={passwordLoading} size="lg">
                  {passwordLoading ? "Updating..." : "Update Password"}
                </Button>
              </div>
            </form>
          </Card>
        )}
      </div>
    </div>
  )
}
