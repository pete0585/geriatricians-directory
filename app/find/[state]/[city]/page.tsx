import type { Metadata } from 'next'
import Link from 'next/link'
import { getListingsByCity } from '@/lib/data'
import ListingCard from '@/components/ListingCard'
import SearchBar from '@/components/SearchBar'
import { stateAbbreviationToName } from '@/lib/utils'

interface Props {
  params: Promise<{ state: string; city: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state, city } = await params
  const stateUpper = state.toUpperCase()
  const cityName = city.replace(new RegExp(`-${state}$`), '').replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
  const stateName = stateAbbreviationToName(stateUpper)
  return {
    title: `Geriatricians in ${cityName}, ${stateUpper}`,
    description: `Find board-certified geriatricians in ${cityName}, ${stateName}. Medicare accepted, telehealth available.`,
  }
}

export default async function CityPage({ params }: Props) {
  const { state, city } = await params
  const stateUpper = state.toUpperCase()
  const cityName = city.replace(new RegExp(`-${state}$`), '').replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
  const stateName = stateAbbreviationToName(stateUpper)

  const listings = await getListingsByCity(cityName, stateUpper, 20)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: process.env.NEXT_PUBLIC_SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Find a Geriatrician', item: `${process.env.NEXT_PUBLIC_SITE_URL}/listings` },
      { '@type': 'ListItem', position: 3, name: stateName, item: `${process.env.NEXT_PUBLIC_SITE_URL}/find/${state}` },
      { '@type': 'ListItem', position: 4, name: `${cityName}, ${stateUpper}`, item: `${process.env.NEXT_PUBLIC_SITE_URL}/find/${state}/${city}` },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <nav className="mb-6 flex items-center gap-2 text-sm text-charcoal-400">
          <Link href="/" className="hover:text-charcoal-700">Home</Link>
          <span>/</span>
          <Link href="/listings" className="hover:text-charcoal-700">Find a Geriatrician</Link>
          <span>/</span>
          <Link href={`/find/${state}`} className="hover:text-charcoal-700">{stateUpper}</Link>
          <span>/</span>
          <span className="text-charcoal-600">{cityName}</span>
        </nav>

        <div className="mb-8">
          <h1 className="section-heading">Geriatricians in {cityName}, {stateUpper}</h1>
          <p className="section-subheading">
            {listings.length > 0
              ? `${listings.length} geriatrician${listings.length !== 1 ? 's' : ''} serving ${cityName}, ${stateName}.`
              : `Browse geriatricians near ${cityName}, ${stateName}.`}
          </p>
        </div>

        <div className="mb-8">
          <SearchBar defaultLocation={`${cityName}, ${stateUpper}`} />
        </div>

        {listings.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {listings.map((listing) => <ListingCard key={listing.id} listing={listing} />)}
          </div>
        ) : (
          <div className="card p-12 text-center">
            <p className="text-charcoal-500 mb-4">No geriatricians found in {cityName} yet.</p>
            <Link href={`/listings?state=${stateUpper}`} className="btn-secondary">
              Browse geriatricians in {stateUpper}
            </Link>
          </div>
        )}
      </div>
    </>
  )
}
