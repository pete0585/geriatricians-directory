import type { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'
import { Users, MapPin, Star, CheckCircle, ArrowRight, Search } from 'lucide-react'
import SearchBar from '@/components/SearchBar'
import ListingCard from '@/components/ListingCard'
import { getFeaturedListings, getRecentListings, getTotalCount } from '@/lib/data'
import { CATEGORIES } from '@/lib/types'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Find a Board-Certified Geriatrician Near You | GeriatricianDirectory.com',
  description:
    'Search the most complete directory of board-certified geriatricians in the US. Filter by city, state, specialty, telehealth, and whether they\'re accepting new patients.',
}

const STATS = [
  { icon: Users, value: '7,000+', label: 'US Geriatricians Listed' },
  { icon: MapPin, value: '50', label: 'States Covered' },
  { icon: Search, value: '5,400', label: 'Monthly "Near Me" Searches' },
  { icon: Star, value: '$99/yr', label: 'Verified Listing' },
]

async function HomepageContent() {
  const [featured, recent, total] = await Promise.all([
    getFeaturedListings(3),
    getRecentListings(8),
    getTotalCount(),
  ])

  return (
    <>
      {/* Stats */}
      {total > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {STATS.map(({ icon: Icon, value, label }, i) => (
            <div key={i} className="card p-5 text-center">
              <Icon className="w-5 h-5 text-navy mx-auto mb-2" aria-label={label} />
              <div className="font-display font-bold text-navy text-xl">{i === 0 ? `${total.toLocaleString()}+` : value}</div>
              <div className="text-xs text-navy-400 mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Featured listings */}
      {featured.length > 0 && (
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display font-bold text-navy text-2xl">Featured Geriatricians</h2>
            <Link href="/listings?tier=featured" className="text-sm text-navy hover:text-navy-700 flex items-center gap-1">
              View all <ArrowRight className="w-4 h-4" aria-label="arrow" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {featured.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </section>
      )}

      {/* Specialty categories */}
      <section className="mb-16">
        <h2 className="font-display font-bold text-navy text-2xl mb-6">Browse by Specialty</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/categories/${cat.slug}`}
              className="card p-5 hover:shadow-card-hover transition-shadow group"
            >
              <h3 className="font-display font-semibold text-navy group-hover:text-navy-700 text-sm mb-1">{cat.label}</h3>
              <p className="text-xs text-navy-400">Find specialists →</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent listings */}
      {recent.length > 0 && (
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display font-bold text-navy text-2xl">Recently Added</h2>
            <Link href="/listings" className="text-sm text-navy hover:text-navy-700 flex items-center gap-1">
              Browse all <ArrowRight className="w-4 h-4" aria-label="arrow" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {recent.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </section>
      )}
    </>
  )
}

export default function HomePage() {
  return (
    <div className="bg-gradient-hero">
      {/* Hero */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-navy-50 text-navy text-xs font-semibold px-4 py-1.5 rounded-full mb-5 border border-navy-100">
            <CheckCircle className="w-3.5 h-3.5 text-sage" aria-label="verified" />
            The most complete geriatrician directory in the US
          </div>
          <h1 className="font-display font-extrabold text-navy text-4xl sm:text-5xl lg:text-6xl leading-tight mb-5">
            Find a Geriatrician Who<br />
            <span className="text-sage">Specializes in Aging</span>
          </h1>
          <p className="text-navy-500 text-lg max-w-2xl mx-auto mb-3">
            Fewer than 7,000 board-certified geriatricians serve 58 million Americans over 65.
            We make every one of them findable — by city, specialty, and whether they&apos;re accepting new patients.
          </p>
          <p className="text-navy-400 text-sm max-w-lg mx-auto mb-10">
            Used by families navigating a parent&apos;s dementia diagnosis, fall risk, or polypharmacy concerns.
          </p>

          <div className="max-w-3xl mx-auto">
            <Suspense>
              <SearchBar placeholder="Search by doctor name, city, or state..." />
            </Suspense>
          </div>

          <div className="flex flex-wrap justify-center gap-3 mt-6 text-sm">
            <Link href="/listings?accepting_new_patients=yes" className="inline-flex items-center gap-1.5 text-navy hover:text-navy-700 font-medium">
              <span className="w-2 h-2 rounded-full bg-sage inline-block" />
              Accepting New Patients
            </Link>
            <Link href="/listings?telehealth=yes" className="inline-flex items-center gap-1.5 text-navy hover:text-navy-700 font-medium">
              <span className="w-2 h-2 rounded-full bg-navy-300 inline-block" />
              Telehealth Available
            </Link>
            <Link href="/categories/memory-care" className="inline-flex items-center gap-1.5 text-navy hover:text-navy-700 font-medium">
              <span className="w-2 h-2 rounded-full bg-gold inline-block" />
              Memory Care
            </Link>
            <Link href="/categories/palliative-care" className="inline-flex items-center gap-1.5 text-navy hover:text-navy-700 font-medium">
              <span className="w-2 h-2 rounded-full bg-navy-200 inline-block" />
              Palliative Care
            </Link>
          </div>
        </div>

        <Suspense fallback={<div className="h-48 animate-pulse bg-navy-50 rounded-xl" />}>
          <HomepageContent />
        </Suspense>
      </div>

      {/* Physician CTA strip */}
      <div className="bg-navy text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display font-bold text-2xl mb-3">Are you a geriatrician?</h2>
          <p className="text-navy-200 mb-6 max-w-xl mx-auto text-sm">
            Your listing may already be here from the NPI registry. Claim it free — takes 2 minutes.
            7,000 geriatricians for 58 million seniors means every patient who finds you is already looking.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/listings" className="btn-secondary bg-transparent border-white text-white hover:bg-white hover:text-navy">
              Find My Listing
            </Link>
            <Link href="/submit" className="btn-gold">
              Add My Practice
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
