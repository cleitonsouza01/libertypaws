import { setRequestLocale } from 'next-intl/server'
import { CartPageContent } from './cart-page-content'

export default async function CartPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  return <CartPageContent />
}
