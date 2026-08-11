import type { Metadata } from 'next'
import { Suspense } from 'react'
import { getListings } from '@/lib/data'
import ListingCard from '@/components/ListingCard'
import FilterSidebar from '@/components/FilterSidebar'
import SearchBar from '@/components/SearchBar'
import { formatStateName } from '@/lib/utils'

export const dynamic = 'force-dynamic'

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

function getParam(params: Record<string, string | string[] | undefined>, key: string): string {
  const val = params[key]
  return Array.isArray(val) ? val[0] : val || ''
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const params = await searchParams
  const state = getParam(params, 'state')
  const city = getParam(params, 'city')
  const subspecialty = getParam(params, 'subspecialty')

  let title = 'Browse Geriatricians — Board-Certified Geriatric Medicine Specialists'
  let description = 'Search the complete directory of US board-certified geriatricians. Filter by state, city, specialty, telehealth, and accepting new patients.'

  if (state && city) {
    title = `Geriatricians in ${city}, ${formatStateName(state)} — Find a Geriatric Medicine Specialist`
    description = `Find board-certified geriatricians in ${city}, ${formatStateName(state)}. Compare specialists by subspecialty, telehealth options, and new patient availability.`
  } else if (state) {
    title = `Find a Geriatrician in ${formatStateName(state)} — Board-Certified Specialists`
    description = `Browse all board-certified geriatricians in ${formatStateName(state)}. Filter by city, subspecialty, and whether they accept new patients.`
  } else if (subspecialty) {
    title = `${subspecialty.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())} Geriatricians — GeriatricianDirectory.com`
  }

  return { title, description }
}

async function ListingsContent({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  const filters = {
    q: getParam(searchParams, 'q') || undefined,
    state: getParam(searchParams, 'state') || undefined,
    city: getParam(searchParams, 'city') || undefined,
    subspecialty: getParam(searchParams, 'subspecialty') || undefined,
    accepting_new_patients: getParam(searchParams, 'accepting_new_patients') || undefined,
    telehealth: getParam(searchParams, 'telehealth') || undefined,
    tier: getParam(searchParams, 'tier') || undefined,
    page: parseInt(getParam(searchParams, 'page') || '1', 10),
  }

  const { listings, total } = await getListings(filters)
  const page = filters.page || 1
  const pageSize = 24
  const totalPages = Math.ceil(total / pageSize)

  const stateLabel = filters.state ? formatStateName(filters.state) : ''
  const heading = filters.state
    ? `Geriatricians in ${filters.city ? `${filters.city}, ` : ''}${stateLabel}`
    : 'Browse All Geriatricians'

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-bold text-navy text-2xl">{heading}</h1>
          <p className="text-sm text-navy-400 mt-1">{total.toLocaleString()} geriatrician{total !== 1 ? 's' : ''} found</p>
        </div>
      </div>

      {listings.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-navy-400 text-base mb-2">No geriatricians found for these filters.</p>
          <p className="text-navy-300 text-sm">Try broadening your search or removing some filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-10">
          {Array.from({ length: Math.min(totalPages, 8) }, (_, i) => i + 1).map((p) => {
            const params = new URLSearchParams(searchParams as Record<string, string>)
            params.set('page', String(p))
            return (
              <a
                key={p}
                href={`/listings?${params.toString()}`}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  p === page
                    ? 'bg-navy text-white'
                    : 'bg-white text-navy border border-navy-200 hover:bg-navy-50'
                }`}
              >
                {p}
              </a>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default async function ListingsPage({ searchParams }: PageProps) {
  const params = await searchParams

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Suspense>
          <SearchBar />
        </Suspense>
      </div>
      <div className="flex flex-col lg:flex-row gap-8">
        <Suspense>
          <FilterSidebar />
        </Suspense>
        <div className="flex-1 min-w-0">
          <Suspense fallback={<div className="h-48 animate-pulse bg-navy-50 rounded-xl" />}>
            <ListingsContent searchParams={params} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
