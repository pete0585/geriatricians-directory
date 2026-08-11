import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { createCheckoutSession } from '@/lib/stripe'

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => {
    return null
  })

  // Handle both JSON and form submissions
  let listingId: string, tier: string
  if (body) {
    listingId = body.listingId
    tier = body.tier
  } else {
    const form = await req.formData().catch(() => null)
    if (!form) return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    listingId = form.get('listingId') as string
    tier = form.get('tier') as string
  }

  if (!listingId || !tier) {
    return NextResponse.json({ error: 'listingId and tier are required' }, { status: 400 })
  }

  if (tier !== 'verified' && tier !== 'featured') {
    return NextResponse.json({ error: 'Invalid tier' }, { status: 400 })
  }

  const supabase = await createServiceClient()
  const { data: listing } = await supabase
    .from('geriatrician_listings')
    .select('id, slug, email')
    .eq('id', listingId)
    .single()

  if (!listing) {
    return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
  }

  const session = await createCheckoutSession({
    listingId,
    listingSlug: listing.slug,
    tier: tier as 'verified' | 'featured',
    email: listing.email || undefined,
  })

  return NextResponse.redirect(session.url!, { status: 303 })
}
