'use server'

import { stripe } from '@/lib/stripe'
import type { CartItem } from '@/contexts/cart-context'

export async function createCheckoutSession(items: CartItem[], locale: string) {
  if (!items.length) {
    return { error: 'Cart is empty' }
  }

  const origin = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3050'

  const lineItems = items.map((item) => ({
    price_data: {
      currency: 'usd',
      product_data: {
        name: item.name,
        ...(item.variantName && { description: item.variantName }),
        ...(item.image && {
          images: [item.image.startsWith('http') ? item.image : `${origin}${item.image}`],
        }),
      },
      unit_amount: Math.round(item.price * 100), // Stripe uses cents
    },
    quantity: item.quantity,
  }))

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      success_url: `${origin}/${locale}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/${locale}/cart`,
      locale: locale === 'pt' ? 'pt-BR' : locale === 'es' ? 'es' : 'en',
      billing_address_collection: 'required',
      customer_creation: 'if_required',
      payment_method_types: ['card'],
    })

    return { url: session.url }
  } catch (err) {
    console.error('Stripe checkout error:', err)
    return { error: 'Failed to create checkout session' }
  }
}
