'use client'

import Script from 'next/script'
import { useEffect } from 'react'
import { useLocale } from 'next-intl'
import { useAuth } from '@/contexts/auth-context'
import { clarityTag, clarityIdentify } from '@/lib/clarity'

const CLARITY_ID = process.env.NEXT_PUBLIC_MICROSOFT_CLARITY_PROJECT_ID

export function ClarityScript() {
  const locale = useLocale()
  const { user } = useAuth()

  useEffect(() => {
    if (!CLARITY_ID) return
    clarityTag('locale', locale)
  }, [locale])

  useEffect(() => {
    if (!CLARITY_ID || !user) return
    clarityIdentify(user.id, user.role)
  }, [user])

  if (!CLARITY_ID) return null

  return (
    <Script
      id="microsoft-clarity"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window,document,"clarity","script","${CLARITY_ID}");
        `,
      }}
    />
  )
}
