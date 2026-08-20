import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { createCheckoutSession } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  let listingId: string | undefined
  let tier: string | undefined

  try {
    const body = await request.json()
    listingId = body?.listingId
    tier = body?.tier
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  if (!listingId || !(tier === 'verified' || tier === 'featured')) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  try {
    const supabase = await createServiceClient()

    const { data: listing, error } = await supabase
      .from('geriatrician_listings')
      .select('id, full_name, email, slug')
      .eq('id', listingId)
      .single()

    if (error || !listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
    }

    const session = await createCheckoutSession({
      listingId,
      listingSlug: listing.slug,
      tier: tier as 'verified' | 'featured',
      email: listing.email ?? undefined,
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('Upgrade error:', err)
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}
