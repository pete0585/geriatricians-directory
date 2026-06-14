import Link from 'next/link'
import Image from 'next/image'
import {
  MapPin, Phone, Globe, Video, Home, Building2, ShieldCheck,
  Star, CheckCircle, Languages, Heart,
} from 'lucide-react'
import type { Listing } from '@/types'
import { formatPhone, stateAbbreviationToName } from '@/lib/utils'

interface ListingDetailProps {
  listing: Listing
}

export default function ListingDetail({ listing }: ListingDetailProps) {
  const isVerified = listing.plan_tier === 'verified'
  const isPro = listing.plan_tier === 'pro' || isVerified

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-charcoal-400">
        <Link href="/" className="hover:text-charcoal-700">Home</Link>
        <span>/</span>
        <Link href="/listings" className="hover:text-charcoal-700">Find a Geriatrician</Link>
        <span>/</span>
        <Link
          href={`/find/${listing.state.toLowerCase()}/${listing.city.toLowerCase().replace(/\s+/g, '-')}-${listing.state.toLowerCase()}`}
          className="hover:text-charcoal-700"
        >
          {listing.city}, {listing.state}
        </Link>
        <span>/</span>
        <span className="text-charcoal-600 truncate max-w-[160px]">{listing.name}</span>
      </nav>

      <div className="card p-6 sm:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="shrink-0">
            {listing.photo_url ? (
              <div className="relative h-28 w-28 rounded-2xl overflow-hidden bg-ivory-200 shadow-soft">
                <Image src={listing.photo_url} alt={listing.name} fill className="object-cover" sizes="112px" priority />
              </div>
            ) : (
              <div className="flex h-28 w-28 items-center justify-center rounded-2xl bg-sage-100 text-4xl font-serif font-bold text-sage-400 shadow-soft">
                {listing.name.charAt(0)}
              </div>
            )}
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap items-start gap-3">
              <div>
                <h1 className="font-serif text-2xl font-bold text-charcoal-800 sm:text-3xl">
                  {listing.name}
                </h1>
                <p className="mt-1 text-sm font-medium text-charcoal-400">
                  {(listing.credentials ?? []).join(', ')}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {isVerified && (
                  <span className="badge-verified text-sm px-3 py-1">
                    <ShieldCheck className="h-4 w-4" />
                    Verified
                  </span>
                )}
                {!isVerified && isPro && (
                  <span className="badge-pro text-sm px-3 py-1">
                    <Star className="h-4 w-4" />
                    Pro Listing
                  </span>
                )}
                {listing.accepting_new_clients && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    Accepting new patients
                  </span>
                )}
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-charcoal-500">
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-rose-400" />
                {listing.city}, {stateAbbreviationToName(listing.state)}
                {listing.zip && ` ${listing.zip}`}
              </span>
              {listing.phone && (
                <a href={`tel:${listing.phone}`} className="flex items-center gap-1.5 hover:text-sage-500 transition-colors">
                  <Phone className="h-4 w-4 text-sage-400" />
                  {formatPhone(listing.phone)}
                </a>
              )}
              {listing.website && (
                <a
                  href={listing.website.startsWith('http') ? listing.website : `https://${listing.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 hover:text-sage-500 transition-colors"
                >
                  <Globe className="h-4 w-4 text-sage-400" />
                  Website
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Quick info chips */}
        <div className="mt-6 flex flex-wrap gap-2">
          {listing.telehealth && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-sage-50 border border-sage-200 px-3 py-1.5 text-sm text-sage-700">
              <Video className="h-4 w-4" />
              Telehealth available
            </span>
          )}
          {(listing.visit_types ?? []).includes('home') && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-ivory-100 border border-ivory-300 px-3 py-1.5 text-sm text-charcoal-600">
              <Home className="h-4 w-4" />
              Home visits
            </span>
          )}
          {(listing.visit_types ?? []).includes('office') && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-ivory-100 border border-ivory-300 px-3 py-1.5 text-sm text-charcoal-600">
              <Building2 className="h-4 w-4" />
              In-office
            </span>
          )}
          {(listing.languages ?? []).length > 0 && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-ivory-100 border border-ivory-300 px-3 py-1.5 text-sm text-charcoal-600">
              <Languages className="h-4 w-4" />
              {(listing.languages ?? []).join(', ')}
            </span>
          )}
        </div>

        {/* Bio */}
        {listing.bio && (
          <div className="mt-8">
            <h2 className="font-serif text-xl font-semibold text-charcoal-700 mb-3">About</h2>
            <p className="text-sm leading-relaxed text-charcoal-600 whitespace-pre-line">{listing.bio}</p>
          </div>
        )}

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {(listing.specialties ?? []).length > 0 && (
            <div>
              <h2 className="font-serif text-lg font-semibold text-charcoal-700 mb-3">Specialties</h2>
              <div className="flex flex-wrap gap-2">
                {(listing.specialties ?? []).map((s) => (
                  <span key={s} className="rounded-full bg-rose-50 border border-rose-100 px-3 py-1 text-sm text-rose-600">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {(listing.insurance_accepted ?? []).length > 0 && (
            <div>
              <h2 className="font-serif text-lg font-semibold text-charcoal-700 mb-3">Insurance Accepted</h2>
              <ul className="space-y-1.5">
                {(listing.insurance_accepted ?? []).map((ins) => (
                  <li key={ins} className="flex items-center gap-2 text-sm text-charcoal-600">
                    <CheckCircle className="h-4 w-4 text-sage-400 shrink-0" />
                    {ins}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {isPro && (
          <div className="mt-8 rounded-2xl bg-ivory-100 border border-ivory-300 p-6">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sage-100 shrink-0">
                <Heart className="h-5 w-5 text-sage-500" />
              </div>
              <div className="flex-1">
                <h3 className="font-serif text-base font-semibold text-charcoal-700">
                  Ready to connect?
                </h3>
                <p className="mt-1 text-sm text-charcoal-500">
                  Visit {listing.name.split(' ')[0]}&apos;s website to schedule an appointment or learn more.
                </p>
                {listing.website && (
                  <a
                    href={listing.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary mt-3 inline-flex text-sm py-2.5"
                  >
                    Visit Website
                  </a>
                )}
              </div>
            </div>
          </div>
        )}

        {!listing.claimed && (
          <div className="mt-6 rounded-xl border border-dashed border-charcoal-200 bg-ivory-50 p-4">
            <p className="text-sm text-charcoal-400">
              Is this your practice?{' '}
              <Link href={`/claim/${listing.id}`} className="text-sage-500 font-semibold hover:text-sage-600">
                Claim this listing
              </Link>{' '}
              to add your photo, bio, and contact info for free.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
