import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import type { User } from '@supabase/supabase-js'

export async function updateSession(request: NextRequest): Promise<{ response: NextResponse; user: User | null }> {
  const response = NextResponse.next({ request })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Skip Supabase session refresh when credentials are not configured
  if (!supabaseUrl || !supabaseAnonKey) {
    return { response, user: null }
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          request.cookies.set(name, value)
          response.cookies.set(name, value, options)
        })
      },
    },
  })

  // Refresh the auth token by calling getUser().
  // IMPORTANT: Use getUser() instead of getSession() for server-side validation.
  // getSession() only reads from the cookie and does not validate the JWT.
  const { data: { user } } = await supabase.auth.getUser()

  return { response, user }
}
