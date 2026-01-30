import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Liberty Paws International',
  description: 'Professional Service Dog & ESA Registration',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
