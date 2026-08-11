import type { MetadataRoute } from 'next'
import { CATEGORIES } from '@/lib/types'

export const dynamic = 'force-dynamic'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://geriatriciandirectory.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let listings: { slug: string; updated_at: string }[] = []

  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const { createStaticClient } = await import('@/lib/supabase/server')
    const supabase = createStaticClient()
    const { data } = await supabase
      .from('geriatrician_listings')
      .select('slug, updated_at')
      .eq('is_active', true)
      .eq('is_approved', true)
      .order('updated_at', { ascending: false })
      .limit(5000)
    listings = data ?? []
  }

  const listingUrls: MetadataRoute.Sitemap = (listings ?? []).map((l) => ({
    url: `${BASE_URL}/listings/${l.slug}`,
    lastModified: new Date(l.updated_at),
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  const categoryUrls: MetadataRoute.Sitemap = CATEGORIES.map((cat) => ({
    url: `${BASE_URL}/categories/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.8,
  }))

  const staticUrls: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${BASE_URL}/listings`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/submit`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ]

  return [...staticUrls, ...categoryUrls, ...listingUrls]
}
