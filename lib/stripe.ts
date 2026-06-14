import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
})

export const PLAN_PRICE_IDS = {
  pro: process.env.STRIPE_FEATURED_PRICE_ID!,
  verified: process.env.STRIPE_VERIFIED_PRICE_ID!,
}

export async function createCheckoutSession({
  listingId,
  planTier,
  customerEmail,
  successUrl,
  cancelUrl,
}: {
  listingId: string
  planTier: 'pro' | 'verified'
  customerEmail?: string
  successUrl: string
  cancelUrl: string
}) {
  const priceId = PLAN_PRICE_IDS[planTier]

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [{ price: priceId, quantity: 1 }],
    allow_promotion_codes: true,
    customer_email: customerEmail,
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      listing_id: listingId,
      plan_tier: planTier,
    },
    subscription_data: {
      metadata: {
        listing_id: listingId,
        plan_tier: planTier,
      },
    },
  })

  return session
}
