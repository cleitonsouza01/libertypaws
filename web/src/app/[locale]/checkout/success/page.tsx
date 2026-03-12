import { setRequestLocale } from 'next-intl/server'
import { CheckoutSuccess } from './checkout-success'

export default async function SuccessPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  return <CheckoutSuccess />
}
