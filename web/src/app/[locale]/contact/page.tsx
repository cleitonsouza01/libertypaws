import type { Metadata } from 'next'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { type Locale } from '@/i18n/config'
import { buildMetadata } from '@/lib/seo'
import ContactPageClient from './contact-page-client'

interface ContactPageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({
  params,
}: ContactPageProps): Promise<Metadata> {
  const { locale } = await params
  const messages = await getMessages()
  const meta = (messages.metadata as Record<string, unknown>)?.contact as
    | Record<string, string>
    | undefined

  return buildMetadata({
    locale: locale as Locale,
    path: '/contact',
    title: meta?.title || 'Contact Us',
    description:
      meta?.description ||
      'Get in touch with Liberty Paws International.',
  })
}

export default async function ContactPage({ params }: ContactPageProps) {
  const { locale } = await params
  setRequestLocale(locale)

  return <ContactPageClient />
}
