import { NextResponse, type NextRequest } from 'next/server'
import createMiddleware from 'next-intl/middleware'
import { routing } from '@/i18n/routing'
import { updateSession } from '@/lib/supabase/middleware'

const intlMiddleware = createMiddleware(routing)

export async function middleware(request: NextRequest) {
  // 1. Refresh Supabase auth session cookies
  const { response: supabaseResponse, user } = await updateSession(request)

  // 2. Protect admin routes — redirect non-admins to home
  const pathname = request.nextUrl.pathname
  const adminRouteMatch = pathname.match(/^\/(en|es|pt)\/admin/)
  if (adminRouteMatch) {
    const isAdmin = user?.app_metadata?.role === 'admin'
    if (!isAdmin) {
      const locale = adminRouteMatch[1]
      const url = request.nextUrl.clone()
      url.pathname = `/${locale}`
      return NextResponse.redirect(url)
    }
  }

  // 3. Run next-intl locale routing
  const intlResponse = intlMiddleware(request)

  // 4. Copy Supabase auth cookies onto the intl response
  supabaseResponse.cookies.getAll().forEach((cookie) => {
    intlResponse.cookies.set(cookie.name, cookie.value, cookie)
  })

  return intlResponse
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
