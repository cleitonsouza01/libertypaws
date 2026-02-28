import type { Metadata } from 'next'
import { SITE_URL } from '@/lib/seo'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Liberty Paws International',
    template: '%s | Liberty Paws International',
  },
  description: 'Professional Service Dog & ESA Registration',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
