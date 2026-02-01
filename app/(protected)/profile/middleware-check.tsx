"use client"

import type React from "react"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export function ProfileCompletionGuard({
  children,
  profileCompleted,
  isSuperAdmin,
}: {
  children: React.ReactNode
  profileCompleted: boolean
  isSuperAdmin: boolean
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [shouldRender, setShouldRender] = useState(false)
  const [hasRedirected, setHasRedirected] = useState(false)

  useEffect(() => {
    console.log("[v0] ProfileCompletionGuard check:", {
      pathname,
      profileCompleted,
      isSuperAdmin,
      hasRedirected
    })

    // Super Admin doesn't need profile completion
    if (isSuperAdmin) {
      setShouldRender(true)
      return
    }

    // If already on profile page, allow rendering
    if (pathname === "/profile") {
      setShouldRender(true)
      return
    }

    // If profile is not completed and we haven't redirected yet
    if (!profileCompleted && !hasRedirected) {
      console.log("[v0] Redirecting to /profile for profile completion")
      setHasRedirected(true)
      router.push("/profile")
      return
    }

    // Profile is completed, allow rendering
    if (profileCompleted) {
      setShouldRender(true)
    }
  }, [profileCompleted, pathname, router, isSuperAdmin, hasRedirected])

  if (!shouldRender) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return <>{children}</>
}
