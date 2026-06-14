import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createServiceClient } from '@/lib/supabase/server'
import { generateListingSlug } from '@/lib/utils'

const schema = z.object({
  name: z.string().min(2),
  credentials: z.string().min(1),
  city: z.string().min(1),
  state: z.string().length(2),
  zip: z.string().optional(),
  phone: z.string().optional(),
  website: z.string().url().optional().or(z.literal('')),
  email: z.string().email(),
  telehealth: z.boolean().default(false),
  accepting_new_clients: z.boolean().default(true),
  visit_types: z.array(z.string()).optional(),
  insurance_accepted: z.array(z.string()).optional(),
  specialties: z.array(z.string()).optional(),
  bio: z.string().max(2000).optional(),
  languages: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = schema.parse(body)

    const supabase = await createServiceClient()

    const baseSlug = generateListingSlug(data.name, data.city, data.state)
    let slug = baseSlug
    let counter = 1

    while (true) {
      const { data: existing } = await supabase
        .from('geriatricians_listings')
        .select('id')
        .eq('slug', slug)
        .maybeSingle()
      if (!existing) break
      slug = `${baseSlug}-${counter++}`
    }

    const credentialsArray = data.credentials.split(',').map((c) => c.trim()).filter(Boolean)
    const languagesArray = data.languages ? data.languages.split(',').map((l) => l.trim()).filter(Boolean) : []

    const { error } = await supabase.from('geriatricians_listings').insert({
      slug,
      name: data.name,
      credentials: credentialsArray,
      bio: data.bio ?? null,
      phone: data.phone ?? null,
      email: data.email,
      website: data.website || null,
      city: data.city,
      state: data.state.toUpperCase(),
      zip: data.zip ?? null,
      telehealth: data.telehealth,
      accepting_new_clients: data.accepting_new_clients,
      visit_types: data.visit_types ?? [],
      insurance_accepted: data.insurance_accepted ?? [],
      specialties: data.specialties ?? [],
      languages: languagesArray,
      plan_tier: 'free',
      status: 'pending',
      claimed: false,
    })

    if (error) {
      console.error('Insert error:', error)
      return NextResponse.json({ error: 'Failed to save listing' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data', details: err.errors }, { status: 400 })
    }
    console.error('Submit error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
