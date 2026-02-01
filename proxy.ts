import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyToken } from "./lib/auth"

const publicPaths = ["/", "/login", "/signup", "/forgot-password", "/reset-password"]
const authPaths = ["/login", "/signup", "/forgot-password", "/reset-password"]

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname
  const token = request.cookies.get("auth-token")?.value

  // Check if user is authenticated
  const isAuthenticated = token ? await verifyToken(token) : null

  // Redirect authenticated users away from auth pages
  if (isAuthenticated && authPaths.includes(path)) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // Redirect unauthenticated users to login
  if (!isAuthenticated && !publicPaths.includes(path)) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|icon.*|apple-icon.png).*)"],
}
