import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { buildListingSlug, slugify } from '@/lib/utils'

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })

  const { full_name, credentials, practice_name, email, phone, website,
          address_line1, city, state, zip, bio, npi,
          is_accepting_new_patients, offers_telehealth } = body

  if (!full_name || !email || !city || !state) {
    return NextResponse.json({ error: 'full_name, email, city, and state are required' }, { status: 400 })
  }

  const supabase = await createServiceClient()

  // Check for duplicate NPI
  if (npi) {
    const { data: existing } = await supabase
      .from('geriatrician_listings')
      .select('id')
      .eq('npi', npi)
      .single()
    if (existing) {
      return NextResponse.json({ error: 'A listing with this NPI number already exists' }, { status: 409 })
    }
  }

  // Generate unique slug
  let slug = buildListingSlug(full_name, city, state)
  const { data: existing } = await supabase
    .from('geriatrician_listings')
    .select('id')
    .eq('slug', slug)
  if (existing && existing.length > 0) {
    slug = `${slug}-${Date.now().toString(36)}`
  }

  const { error } = await supabase.from('geriatrician_listings').insert({
    slug,
    full_name: full_name.trim(),
    credentials: credentials?.trim() || null,
    practice_name: practice_name?.trim() || null,
    email: email.trim().toLowerCase(),
    phone: phone?.trim() || null,
    website: website?.trim() || null,
    address_line1: address_line1?.trim() || null,
    city: city.trim(),
    state: state.toUpperCase(),
    zip: zip?.trim() || null,
    bio: bio?.trim() || null,
    npi: npi?.trim() || null,
    is_accepting_new_patients: is_accepting_new_patients ?? null,
    offers_telehealth: offers_telehealth ?? false,
    listing_tier: 'free',
    listing_tier_rank: 0,
    source: 'self_submit',
    is_active: true,
    is_approved: false,
  })

  if (error) {
    console.error('Submit error:', error)
    return NextResponse.json({ error: 'Failed to submit listing' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
