"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ThemeToggle } from "@/components/theme-toggle"
import Image from "next/image"
import {
  Menu,
  LayoutDashboard,
  Activity,
  BookOpen,
  Brain,
  GraduationCap,
  BarChart3,
  TrendingUp,
  UserCircle,
  Shield,
} from "lucide-react"

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/mood", label: "Mood", icon: Activity },
  { href: "/journal", label: "Journal", icon: BookOpen },
  { href: "/exercises", label: "Exercises", icon: Brain },
  { href: "/analytics", label: "Analytics", icon: TrendingUp },
  { href: "/learn", label: "Learn", icon: GraduationCap },
  { href: "/profile", label: "Profile", icon: UserCircle },
]

const ADMIN_NAV_ITEMS = [
  { href: "/admin", label: "Admin Dashboard", icon: LayoutDashboard },
  { href: "/admin/analytics", label: "Platform Analytics", icon: BarChart3 },
  { href: "/admin/users", label: "User Management", icon: Shield },
]

export function NavHeader({
  userName,
  isAdmin,
  isSuperAdmin,
}: {
  userName?: string
  isAdmin?: boolean
  isSuperAdmin?: boolean
}) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/login")
    router.refresh()
  }

  const navItems = isAdmin ? [...NAV_ITEMS, ...ADMIN_NAV_ITEMS] : NAV_ITEMS

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-card/95 backdrop-blur-xl supports-[backdrop-filter]:bg-card/90 shadow-sm">
      <div className="w-full flex h-16 items-center justify-between px-4 md:px-6 lg:px-12 xl:px-16">
        <div className="flex items-center gap-6 lg:gap-10">
          <Link
            href={isAdmin ? "/admin" : "/dashboard"}
            className="flex items-center gap-2.5 text-xl font-bold hover:opacity-80 transition-opacity"
          >
            <div className="relative w-10 h-10 overflow-hidden">
              <Image src="/images/image.png" alt="Mindora Logo" fill className="object-contain" priority />
            </div>
            <span className="hidden sm:inline bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent font-bold">
              Mindora
            </span>
          </Link>
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 text-sm rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-primary text-primary-foreground font-semibold shadow-md"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/70"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />

          {/* Mobile menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <DropdownMenuItem key={item.href} asChild>
                    <Link href={item.href} className="flex items-center gap-3 py-2.5">
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </Link>
                  </DropdownMenuItem>
                )
              })}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="hidden md:flex items-center gap-3">
            {userName && (
              <div className="px-4 py-2 rounded-xl bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 text-foreground text-sm font-medium border border-primary/20 shadow-sm">
                {userName}
                {isSuperAdmin && (
                  <span className="ml-2 text-xs text-primary font-semibold inline-flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    Super Admin
                  </span>
                )}
                {isAdmin && !isSuperAdmin && (
                  <span className="ml-2 text-xs text-secondary font-semibold inline-flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    Admin
                  </span>
                )}
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="hover:bg-destructive/10 hover:text-destructive transition-colors"
            >
              Log out
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
