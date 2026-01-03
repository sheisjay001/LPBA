import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const isAuth = !!req.auth
  const isAuthPage = req.nextUrl.pathname.startsWith("/login")
  const isAdminPage = req.nextUrl.pathname.startsWith("/admin")

  if (isAuthPage) {
    if (isAuth) {
      const user = req.auth?.user as any;
      if (user?.role === 'ADMIN') {
        return NextResponse.redirect(new URL("/admin", req.nextUrl))
      }
      return NextResponse.redirect(new URL("/dashboard", req.nextUrl))
    }
    return null
  }

  if (isAdminPage) {
    if (!isAuth) {
      return NextResponse.redirect(new URL("/login", req.nextUrl))
    }
    const user = req.auth?.user as any;
    if (user?.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/dashboard", req.nextUrl))
    }
  }

  return null
})

export const config = {
  matcher: ["/admin/:path*", "/login", "/dashboard/:path*"],
}
