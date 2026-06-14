import type { Metadata } from 'next'
import Link from 'next/link'
import { Heart, ShieldCheck, Search, Star, ArrowRight, Video, Home, CheckCircle } from 'lucide-react'
import SearchBar from '@/components/SearchBar'
import ListingCard from '@/components/ListingCard'
import { getFeaturedListings, getTotalListingCount } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Find a Geriatrician Near You | GeriatricianDirectory.com',
  description:
    'Find a board-certified geriatrician near you. Search by city, insurance, or specialty. Expert care for older adults.',
}

const TOP_CITIES = [
  { name: 'New York', state: 'NY', slug: 'new-york-ny' },
  { name: 'Los Angeles', state: 'CA', slug: 'los-angeles-ca' },
  { name: 'Chicago', state: 'IL', slug: 'chicago-il' },
  { name: 'Houston', state: 'TX', slug: 'houston-tx' },
  { name: 'Phoenix', state: 'AZ', slug: 'phoenix-az' },
  { name: 'Philadelphia', state: 'PA', slug: 'philadelphia-pa' },
  { name: 'San Antonio', state: 'TX', slug: 'san-antonio-tx' },
  { name: 'San Diego', state: 'CA', slug: 'san-diego-ca' },
  { name: 'Dallas', state: 'TX', slug: 'dallas-tx' },
  { name: 'Jacksonville', state: 'FL', slug: 'jacksonville-fl' },
  { name: 'Austin', state: 'TX', slug: 'austin-tx' },
  { name: 'Fort Worth', state: 'TX', slug: 'fort-worth-tx' },
]

const SPECIALTY_HIGHLIGHTS = [
  { label: 'Memory Care', href: '/listings?specialty=Memory+Care', emoji: '🧠' },
  { label: 'Dementia & Alzheimer's', href: '/listings?specialty=Dementia+%26+Alzheimer%27s', emoji: '💙' },
  { label: 'Fall Prevention', href: '/listings?specialty=Fall+Prevention', emoji: '🦺' },
  { label: 'Polypharmacy', href: '/listings?specialty=Polypharmacy+Management', emoji: '💊' },
  { label: 'Hospice & Palliative', href: '/listings?specialty=Hospice+%26+Palliative+Care', emoji: '🕊️' },
  { label: 'Telehealth Available', href: '/listings?telehealth=true', emoji: '💻' },
]

export default async function HomePage() {
  const [featured, listingCount] = await Promise.all([
    getFeaturedListings(6).catch(() => []),
    getTotalListingCount().catch(() => 0),
  ])

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-ivory pt-16 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-sage-50 border border-sage-100 px-4 py-2 text-sm text-sage-600 mb-6">
            <Heart className="h-4 w-4 fill-sage-300 text-sage-300" />
            <span>{listingCount > 0 ? `${listingCount.toLocaleString()} geriatricians` : 'Expert geriatricians'} across the US</span>
          </div>

          <h1 className="font-serif text-4xl font-bold text-charcoal-800 leading-tight sm:text-5xl md:text-6xl text-balance">
            Find expert care for{' '}
            <span className="text-sage-500">aging adults</span>
          </h1>

          <p className="mt-5 text-lg text-charcoal-500 max-w-2xl mx-auto leading-relaxed">
            Geriatricians specialize in the unique health needs of older adults. Find one who accepts
            Medicare, offers telehealth, and specializes in what matters most to your family.
          </p>

          <div className="mt-8 flex justify-center">
            <SearchBar size="large" />
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-charcoal-400">
            <span className="flex items-center gap-1.5">
              <Video className="h-4 w-4 text-sage-400" />
              Telehealth available
            </span>
            <span className="flex items-center gap-1.5">
              <Home className="h-4 w-4 text-sage-400" />
              Home visits
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="h-4 w-4 text-sage-400" />
              Medicare accepted
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-rose-400" />
              Board certified
            </span>
          </div>
        </div>
      </section>

      {/* What makes a geriatrician different */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="text-center p-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sage-100 mx-auto mb-4">
                <ShieldCheck className="h-7 w-7 text-sage-500" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-charcoal-700 mb-2">
                Specialized Training
              </h3>
              <p className="text-sm text-charcoal-500 leading-relaxed">
                Geriatricians complete additional fellowship training in aging medicine — beyond
                internal medicine or family medicine — to understand how diseases present differently
                in older adults.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 mx-auto mb-4">
                <Heart className="h-7 w-7 text-rose-400 fill-rose-200" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-charcoal-700 mb-2">
                Whole-Person Care
              </h3>
              <p className="text-sm text-charcoal-500 leading-relaxed">
                They address physical, cognitive, and functional health together — managing complex
                medication lists, preventing falls, and helping families navigate difficult decisions.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-ivory-200 mx-auto mb-4">
                <Search className="h-7 w-7 text-charcoal-400" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-charcoal-700 mb-2">
                Free to Search
              </h3>
              <p className="text-sm text-charcoal-500 leading-relaxed">
                No sign-up required. Search by Medicare acceptance, specialty, and location. Find
                a geriatrician who fits your family's needs — for free.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Browse by specialty */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-ivory-50">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-10">
            <h2 className="section-heading">What are you looking for?</h2>
            <p className="section-subheading">
              Find a geriatrician who specializes in your loved one's specific needs.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {SPECIALTY_HIGHLIGHTS.map((s) => (
              <Link
                key={s.label}
                href={s.href}
                className="flex flex-col items-center gap-2 rounded-2xl bg-white p-4 text-center shadow-soft hover:shadow-card transition-shadow group"
              >
                <span className="text-2xl">{s.emoji}</span>
                <span className="text-xs font-semibold text-charcoal-600 group-hover:text-sage-500 transition-colors leading-tight">
                  {s.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured listings */}
      {featured.length > 0 && (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="section-heading">Featured Geriatricians</h2>
                <p className="section-subheading">Verified, experienced, and accepting new patients.</p>
              </div>
              <Link
                href="/listings"
                className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-sage-500 hover:text-sage-600"
              >
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((listing) => (
                <ListingCard key={listing.id} listing={listing} featured />
              ))}
            </div>

            <div className="mt-6 text-center sm:hidden">
              <Link href="/listings" className="btn-secondary">
                View all Geriatricians <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Browse by city */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-ivory-50">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-10">
            <h2 className="section-heading">Search by City</h2>
            <p className="section-subheading">Geriatricians serving older adults across the country.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {TOP_CITIES.map((city) => (
              <Link
                key={city.slug}
                href={`/find/${city.state.toLowerCase()}/${city.slug}`}
                className="rounded-xl bg-white px-3 py-3 text-center shadow-soft hover:shadow-card transition-shadow group"
              >
                <p className="text-sm font-semibold text-charcoal-700 group-hover:text-sage-500 transition-colors">
                  {city.name}
                </p>
                <p className="text-xs text-charcoal-400 mt-0.5">{city.state}</p>
              </Link>
            ))}
          </div>

          <div className="mt-8 flex items-center justify-center gap-3">
            <Link href="/listings" className="btn-secondary">
              Browse all geriatricians <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* For Geriatricians CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-sage-500">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-serif text-3xl font-bold text-white mb-4">
            Are you a geriatrician or geriatric care specialist?
          </h2>
          <p className="text-sage-100 text-lg mb-8 leading-relaxed">
            Get a free listing on the only nationwide directory built for geriatric medicine specialists.
            Pro listings start at $79/year — one new Medicare patient pays for it many times over.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/submit"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-base font-semibold text-sage-600 hover:bg-ivory-100 transition-colors"
            >
              Get Listed Free
            </Link>
            <Link
              href="/submit#pricing"
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-white/50 px-8 py-4 text-base font-semibold text-white hover:border-white transition-colors"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="py-10 px-4 bg-white border-t border-ivory-200">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-charcoal-400">
            <span className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-sage-400" />
              Free to search, always
            </span>
            <span className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-rose-400" />
              Board-certified specialists
            </span>
            <span className="flex items-center gap-2">
              <Star className="h-4 w-4 text-sage-400" />
              Medicare accepted
            </span>
          </div>
        </div>
      </section>
    </div>
  )
}
