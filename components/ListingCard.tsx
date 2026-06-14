import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Video, Home, ShieldCheck, Star, CheckCircle } from 'lucide-react'
import type { Listing } from '@/types'
import { truncate } from '@/lib/utils'

interface ListingCardProps {
  listing: Listing
  featured?: boolean
}

export default function ListingCard({ listing, featured = false }: ListingCardProps) {
  const isVerified = listing.plan_tier === 'verified'
  const isPro = listing.plan_tier === 'pro' || isVerified

  return (
    <Link
      href={`/geriatrician/${listing.slug}`}
      className={`card block p-5 group ${featured ? 'border-2 border-sage-200' : ''}`}
    >
      <div className="flex gap-4">
        <div className="shrink-0">
          {listing.photo_url ? (
            <div className="relative h-16 w-16 rounded-2xl overflow-hidden bg-ivory-200">
              <Image src={listing.photo_url} alt={listing.name} fill className="object-cover" sizes="64px" />
            </div>
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-sage-100 text-sage-400 text-xl font-serif font-bold">
              {listing.name.charAt(0)}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-serif font-semibold text-charcoal-700 group-hover:text-sage-500 transition-colors truncate">
                {listing.name}
              </h3>
              <p className="text-xs text-charcoal-400 mt-0.5">
                {(listing.credentials ?? []).join(', ')}
              </p>
            </div>
            <div className="shrink-0">
              {isVerified && (
                <span className="badge-verified">
                  <ShieldCheck className="h-3 w-3" />
                  Verified
                </span>
              )}
              {!isVerified && isPro && (
                <span className="badge-pro">
                  <Star className="h-3 w-3" />
                  Pro
                </span>
              )}
            </div>
          </div>

          <div className="mt-2 flex items-center gap-1 text-xs text-charcoal-400">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-rose-400" />
            <span>{listing.city}, {listing.state}</span>
          </div>

          {listing.bio && (
            <p className="mt-2 text-xs text-charcoal-500 leading-relaxed line-clamp-2">
              {truncate(listing.bio, 120)}
            </p>
          )}

          <div className="mt-3 flex flex-wrap items-center gap-2">
            {listing.telehealth && (
              <span className="inline-flex items-center gap-1 rounded-full bg-sage-50 px-2 py-0.5 text-xs text-sage-600">
                <Video className="h-3 w-3" />
                Telehealth
              </span>
            )}
            {(listing.visit_types ?? []).includes('home') && (
              <span className="inline-flex items-center gap-1 rounded-full bg-ivory-200 px-2 py-0.5 text-xs text-charcoal-500">
                <Home className="h-3 w-3" />
                Home visits
              </span>
            )}
            {listing.accepting_new_clients && (
              <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-xs text-green-600">
                <CheckCircle className="h-3 w-3" />
                Accepting patients
              </span>
            )}
            {(listing.insurance_accepted ?? []).includes('Medicare') && (
              <span className="inline-flex items-center gap-1 rounded-full bg-ivory-200 px-2 py-0.5 text-xs text-charcoal-500">
                Medicare
              </span>
            )}
          </div>

          {(listing.specialties ?? []).length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {(listing.specialties ?? []).slice(0, 3).map((s) => (
                <span key={s} className="rounded-full bg-rose-50 px-2 py-0.5 text-xs text-rose-500">
                  {s}
                </span>
              ))}
              {(listing.specialties ?? []).length > 3 && (
                <span className="rounded-full bg-ivory-200 px-2 py-0.5 text-xs text-charcoal-400">
                  +{(listing.specialties ?? []).length - 3} more
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
