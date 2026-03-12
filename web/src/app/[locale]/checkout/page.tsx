import { setRequestLocale } from 'next-intl/server'
import { CheckoutRedirect } from './checkout-redirect'

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  return <CheckoutRedirect locale={locale} />
}
