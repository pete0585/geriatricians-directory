import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ClaimFlow from './ClaimFlow'
import { getListingById, getListingBySlug } from '@/lib/data'
import { formatCredentials } from '@/lib/utils'

interface PageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

async function getListing(id: string) {
  return UUID_PATTERN.test(id) ? getListingById(id) : getListingBySlug(id)
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const listing = await getListing(id)
  if (!listing) return {}
  return {
    title: `Claim Your Listing — ${formatCredentials(listing.full_name, listing.credentials)} | GeriatricianDirectory.com`,
    description: 'Verify your identity and claim your free geriatrician listing.',
  }
}

export default async function ClaimPage({ params, searchParams }: PageProps) {
  const [{ id }, sp] = await Promise.all([params, searchParams])

  const listing = await getListing(id)
  if (!listing) notFound()

  const token = Array.isArray(sp.token) ? sp.token[0] : sp.token || ''

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <ClaimFlow listing={listing} token={token} />
    </div>
  )
}
