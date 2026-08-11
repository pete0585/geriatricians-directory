import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const token = searchParams.get('token')
  const id = searchParams.get('id')

  if (!token || !id) {
    return NextResponse.json({ error: 'Missing token or listing id' }, { status: 400 })
  }

  const supabase = await createServiceClient()
  const now = new Date().toISOString()

  // Find matching unverified claim that hasn't expired
  const { data: claim, error: claimError } = await supabase
    .from('geriatrician_claims')
    .select('id, listing_id, email')
    .eq('token', token)
    .eq('listing_id', id)
    .eq('verified', false)
    .gt('expires_at', now)
    .single()

  if (claimError || !claim) {
    return NextResponse.json({ error: 'Invalid or expired verification link' }, { status: 400 })
  }

  // Mark claim as verified
  const verifiedAt = new Date().toISOString()
  const { error: updateClaimError } = await supabase
    .from('geriatrician_claims')
    .update({ verified: true, verified_at: verifiedAt })
    .eq('id', claim.id)

  if (updateClaimError) {
    return NextResponse.json({ error: 'Failed to verify claim' }, { status: 500 })
  }

  // Update listing as claimed
  const { error: updateListingError } = await supabase
    .from('geriatrician_listings')
    .update({
      claimed_at: verifiedAt,
      claimed_by: claim.email,
    })
    .eq('id', claim.listing_id)

  if (updateListingError) {
    return NextResponse.json({ error: 'Failed to update listing' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
