import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { getListings, getListingCountByState } from '@/lib/data'
import ListingCard from '@/components/ListingCard'
import { stateAbbreviationToName } from '@/lib/utils'

interface Props {
  params: Promise<{ state: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state } = await params
  const stateUpper = state.toUpperCase()
  const stateName = stateAbbreviationToName(stateUpper)
  return {
    title: `Geriatricians in ${stateName}`,
    description: `Find board-certified geriatricians in ${stateName}. Search by city, specialty, and insurance.`,
  }
}

export default async function StatePage({ params }: Props) {
  const { state } = await params
  const stateUpper = state.toUpperCase()
  const stateName = stateAbbreviationToName(stateUpper)

  const { listings, total } = await getListings({ state: stateUpper, pageSize: 20 })

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <nav className="mb-6 flex items-center gap-2 text-sm text-charcoal-400">
        <Link href="/" className="hover:text-charcoal-700">Home</Link>
        <span>/</span>
        <Link href="/listings" className="hover:text-charcoal-700">Find a Geriatrician</Link>
        <span>/</span>
        <span className="text-charcoal-600">{stateName}</span>
      </nav>

      <div className="mb-8">
        <h1 className="section-heading">Geriatricians in {stateName}</h1>
        <p className="section-subheading">
          {total > 0 ? `${total.toLocaleString()} geriatrician${total !== 1 ? 's' : ''} in ${stateName}.` : `Browse geriatricians in ${stateName}.`}
        </p>
      </div>

      {listings.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-8">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
          {total > 20 && (
            <div className="text-center">
              <Link href={`/listings?state=${stateUpper}`} className="btn-secondary">
                View all {total} geriatricians in {stateName} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </>
      ) : (
        <div className="card p-12 text-center">
          <p className="text-charcoal-500 mb-4">No geriatricians found in {stateName} yet.</p>
          <Link href="/listings" className="btn-secondary">Browse all geriatricians</Link>
        </div>
      )}
    </div>
  )
}
