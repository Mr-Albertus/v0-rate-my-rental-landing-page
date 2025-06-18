import { type NextRequest, NextResponse } from "next/server"
import { decrypt } from "@/lib/session"

const protectedRoutes = ["/dashboard", "/profile"]
const publicRoutes = ["/login", "/signup", "/"]

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.includes(path)
  const isPublicRoute = publicRoutes.includes(path)

  const cookie = request.cookies.get("session")?.value
  const session = await decrypt(cookie)

  if (isProtectedRoute && !session?.userId) {
    return NextResponse.redirect(new URL("/login", request.nextUrl))
  }

  if (isPublicRoute && session?.userId && path === "/login") {
    return NextResponse.redirect(new URL("/dashboard", request.nextUrl))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
}
