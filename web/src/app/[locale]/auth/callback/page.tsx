'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AuthCallbackPage() {
  const router = useRouter()
  const processed = useRef(false)

  useEffect(() => {
    if (processed.current) return
    processed.current = true

    const supabase = createClient()
    const url = new URL(window.location.href)
    const code = url.searchParams.get('code')
    const next = url.searchParams.get('next') ?? '/'
    const locale = url.pathname.split('/')[1] || 'en'

    // PKCE flow: exchange code for session
    if (code) {
      supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
        if (!error) {
          router.replace(`/${locale}${next}`)
        } else {
          router.replace(`/${locale}/auth/login?error=auth_callback_failed`)
        }
      })
      return
    }

    // Implicit flow: tokens in the URL hash fragment.
    // createBrowserClient auto-detects #access_token=... and calls setSession
    // internally. We listen for the SIGNED_IN event, then redirect.
    const hashParams = new URLSearchParams(url.hash.substring(1))
    const type = hashParams.get('type')
    const hasTokens = hashParams.has('access_token')

    if (hasTokens) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (event) => {
          if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
            subscription.unsubscribe()
            if (type === 'recovery') {
              router.replace(`/${locale}/auth/reset-password`)
            } else {
              router.replace(`/${locale}${next}`)
            }
          }
        }
      )

      // Timeout fallback in case auto-detection already fired before we subscribed
      setTimeout(async () => {
        const { data: { session } } = await supabase.auth.getSession()
        if (session) {
          subscription.unsubscribe()
          if (type === 'recovery') {
            router.replace(`/${locale}/auth/reset-password`)
          } else {
            router.replace(`/${locale}${next}`)
          }
        }
      }, 1000)

      return
    }

    // No code or tokens
    router.replace(`/${locale}/auth/login?error=auth_callback_failed`)
  }, [router])

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <span className="loading loading-spinner loading-lg text-primary" />
    </div>
  )
}
