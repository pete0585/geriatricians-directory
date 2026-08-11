import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
})

export async function createCheckoutSession(params: {
  listingId: string
  listingSlug: string
  tier: 'verified' | 'featured'
  email?: string
}): Promise<Stripe.Checkout.Session> {
  const priceId =
    params.tier === 'featured'
      ? process.env.STRIPE_FEATURED_PRICE_ID!
      : process.env.STRIPE_VERIFIED_PRICE_ID!

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://geriatriciandirectory.com'

  return stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    metadata: {
      listing_id: params.listingId,
      tier: params.tier,
    },
    customer_email: params.email || undefined,
    success_url: `${siteUrl}/listings/${params.listingSlug}?upgraded=true`,
    cancel_url: `${siteUrl}/listings/${params.listingSlug}`,
  })
}
