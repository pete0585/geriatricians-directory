import { createClient } from './supabase/server'
import type { Listing } from '@/types'

export async function getListingBySlug(slug: string): Promise<Listing | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('geriatricians_listings')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'active')
    .single()
  return data
}

export async function getListings({
  state,
  city,
  specialty,
  insurance,
  visitType,
  telehealth,
  acceptingNew,
  search,
  tier,
  page = 1,
  pageSize = 20,
}: {
  state?: string
  city?: string
  specialty?: string
  insurance?: string
  visitType?: string
  telehealth?: boolean
  acceptingNew?: boolean
  search?: string
  tier?: string
  page?: number
  pageSize?: number
}): Promise<{ listings: Listing[]; total: number }> {
  const supabase = await createClient()
  let query = supabase
    .from('geriatricians_listings')
    .select('*', { count: 'exact' })
    .eq('status', 'active')
    .order('plan_tier_rank', { ascending: true })
    .order('name', { ascending: true })

  if (state) query = query.ilike('state', state)
  if (city) query = query.ilike('city', city)
  if (specialty) query = query.contains('specialties', [specialty])
  if (insurance) query = query.contains('insurance_accepted', [insurance])
  if (visitType) query = query.contains('visit_types', [visitType])
  if (telehealth === true) query = query.eq('telehealth', true)
  if (acceptingNew === true) query = query.eq('accepting_new_clients', true)
  if (search) query = query.textSearch('search_vector', search, { type: 'websearch' })
  if (tier) query = query.eq('plan_tier', tier)

  const from = (page - 1) * pageSize
  const to = from + pageSize - 1
  query = query.range(from, to)

  const { data, count } = await query
  return { listings: data ?? [], total: count ?? 0 }
}

export async function getFeaturedListings(limit = 6): Promise<Listing[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('geriatricians_listings')
    .select('*')
    .eq('status', 'active')
    .in('plan_tier', ['verified', 'pro'])
    .order('plan_tier_rank', { ascending: true })
    .limit(limit)
  return data ?? []
}

export async function getListingsByCity(city: string, state: string, limit = 20): Promise<Listing[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('geriatricians_listings')
    .select('*')
    .ilike('city', city)
    .ilike('state', state)
    .eq('status', 'active')
    .order('plan_tier_rank', { ascending: true })
    .limit(limit)
  return data ?? []
}

export async function getTotalListingCount(): Promise<number> {
  const supabase = await createClient()
  const { count } = await supabase
    .from('geriatricians_listings')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active')
  return count ?? 0
}

export async function getActiveStates(): Promise<string[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('geriatricians_listings')
    .select('state')
    .eq('status', 'active')
  const states = Array.from(new Set((data ?? []).map((r: { state: string }) => r.state))).sort()
  return states
}

export async function getListingCountByState(state: string): Promise<number> {
  const supabase = await createClient()
  const { count } = await supabase
    .from('geriatricians_listings')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active')
    .ilike('state', state)
  return count ?? 0
}
