import { createClient, createStaticClient, createServiceClient } from '@/lib/supabase/server'
import type { Listing, SearchFilters } from '@/lib/types'

const TABLE = 'geriatrician_listings'
const PAGE_SIZE = 24

export async function getListings(
  filters: SearchFilters = {}
): Promise<{ listings: Listing[]; total: number }> {
  const supabase = await createClient()
  const { q, state, city, subspecialty, accepting_new_patients, telehealth, tier, page = 1 } = filters
  const offset = (page - 1) * PAGE_SIZE

  let query = supabase
    .from(TABLE)
    .select('*', { count: 'exact' })
    .eq('is_active', true)
    .eq('is_approved', true)
    .order('listing_tier_rank', { ascending: false })
    .order('is_abim_certified', { ascending: false })
    .order('full_name', { ascending: true })
    .range(offset, offset + PAGE_SIZE - 1)

  if (q) {
    query = query.or(`full_name.ilike.%${q}%,practice_name.ilike.%${q}%,city.ilike.%${q}%,state.ilike.%${q}%`)
  }
  if (state) query = query.eq('state', state.toUpperCase())
  if (city) query = query.ilike('city', city)
  if (subspecialty) query = query.contains('subspecialties', [subspecialty])
  if (accepting_new_patients === 'yes') query = query.eq('is_accepting_new_patients', true)
  if (telehealth === 'yes') query = query.eq('offers_telehealth', true)
  if (tier) query = query.eq('listing_tier', tier)

  const { data, count, error } = await query
  if (error) throw error
  return { listings: (data as Listing[]) ?? [], total: count ?? 0 }
}

export async function getListingBySlug(slug: string): Promise<Listing | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (error) return null
  return data as Listing
}

export async function getListingById(id: string): Promise<Listing | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('id', id)
    .single()

  if (error) return null
  return data as Listing
}

export async function getFeaturedListings(limit = 6): Promise<Listing[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('listing_tier', 'featured')
    .eq('is_active', true)
    .eq('is_approved', true)
    .order('full_name', { ascending: true })
    .limit(limit)

  if (error) return []
  return (data as Listing[]) ?? []
}

export async function getRecentListings(limit = 8): Promise<Listing[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('is_active', true)
    .eq('is_approved', true)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) return []
  return (data as Listing[]) ?? []
}

export async function getListingsBySubspecialty(subspecialty: string, limit = 50): Promise<Listing[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .contains('subspecialties', [subspecialty])
    .eq('is_active', true)
    .eq('is_approved', true)
    .order('listing_tier_rank', { ascending: false })
    .order('full_name', { ascending: true })
    .limit(limit)

  if (error) return []
  return (data as Listing[]) ?? []
}

export async function getListingsByState(state: string, limit = 50): Promise<Listing[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('state', state.toUpperCase())
    .eq('is_active', true)
    .eq('is_approved', true)
    .order('listing_tier_rank', { ascending: false })
    .order('full_name', { ascending: true })
    .limit(limit)

  if (error) return []
  return (data as Listing[]) ?? []
}

export async function getListingsByCity(city: string, state: string, limit = 30): Promise<Listing[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .ilike('city', city)
    .eq('state', state.toUpperCase())
    .eq('is_active', true)
    .eq('is_approved', true)
    .order('listing_tier_rank', { ascending: false })
    .order('full_name', { ascending: true })
    .limit(limit)

  if (error) return []
  return (data as Listing[]) ?? []
}

export async function getTotalCount(): Promise<number> {
  const supabase = await createClient()
  const { count, error } = await supabase
    .from(TABLE)
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true)
    .eq('is_approved', true)

  if (error) return 0
  return count ?? 0
}

export async function getStateCounts(): Promise<{ state: string; count: number }[]> {
  const supabase = createStaticClient()
  const { data, error } = await supabase
    .from(TABLE)
    .select('state')
    .eq('is_active', true)
    .eq('is_approved', true)

  if (error || !data) return []

  const counts: Record<string, number> = {}
  for (const row of data) {
    counts[row.state] = (counts[row.state] ?? 0) + 1
  }

  return Object.entries(counts)
    .map(([state, count]) => ({ state, count }))
    .sort((a, b) => b.count - a.count)
}

export async function getAllSlugs(): Promise<string[]> {
  const supabase = createStaticClient()
  const { data, error } = await supabase
    .from(TABLE)
    .select('slug')
    .eq('is_active', true)
    .eq('is_approved', true)

  if (error) return []
  return data?.map((r) => r.slug) ?? []
}

export async function getPendingListings(): Promise<Listing[]> {
  const supabase = await createServiceClient()
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('is_approved', false)
    .order('created_at', { ascending: false })

  if (error) return []
  return (data as Listing[]) ?? []
}

export async function getAllListingsAdmin(): Promise<Listing[]> {
  const supabase = await createServiceClient()
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .order('created_at', { ascending: false })
    .limit(200)

  if (error) return []
  return (data as Listing[]) ?? []
}
