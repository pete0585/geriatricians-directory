import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token')

  if (!token) {
    return NextResponse.redirect(new URL('/?error=invalid-token', request.url))
  }

  const supabase = await createServiceClient()

  const { data: claim, error } = await supabase
    .from('geriatricians_claims')
    .select('*')
    .eq('token', token)
    .eq('verified', false)
    .single()

  if (error || !claim) {
    return NextResponse.redirect(new URL('/?error=invalid-or-expired-token', request.url))
  }

  if (new Date(claim.expires_at) < new Date()) {
    return NextResponse.redirect(new URL('/?error=expired-token', request.url))
  }

  await Promise.all([
    supabase
      .from('geriatricians_claims')
      .update({ verified: true, verified_at: new Date().toISOString() })
      .eq('id', claim.id),
    supabase
      .from('geriatricians_listings')
      .update({ claimed: true, claimed_at: new Date().toISOString(), plan_tier: 'free', status: 'active' })
      .eq('id', claim.listing_id),
  ])

  return NextResponse.redirect(new URL(`/claim/${claim.listing_id}?verified=true`, request.url))
}
