import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { createCheckoutSession } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  try {
    const { listingId, tier } = await request.json()

    if (!listingId || !['pro', 'verified'].includes(tier)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    const supabase = await createServiceClient()

    const { data: listing, error } = await supabase
      .from('geriatricians_listings')
      .select('id, name, email, claimed')
      .eq('id', listingId)
      .single()

    if (error || !listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://geriatriciandirectory.com'

    const session = await createCheckoutSession({
      listingId,
      planTier: tier,
      customerEmail: listing.email ?? undefined,
      successUrl: `${siteUrl}/claim/${listingId}?upgraded=true&tier=${tier}`,
      cancelUrl: `${siteUrl}/claim/${listingId}`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('Upgrade error:', err)
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}
