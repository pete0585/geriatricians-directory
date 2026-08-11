import Link from 'next/link'
import { MapPin, Phone, Globe, CheckCircle, Star, UserCheck, Video } from 'lucide-react'
import type { Listing } from '@/lib/types'
import { formatCredentials, getSubspecialtyLabel, truncate } from '@/lib/utils'

interface ListingCardProps {
  listing: Listing
}

export default function ListingCard({ listing }: ListingCardProps) {
  const isFeatured = listing.listing_tier === 'featured'
  const isVerified = listing.listing_tier === 'verified' || isFeatured
  const isClaimed = !!listing.claimed_at

  return (
    <Link
      href={`/listings/${listing.slug}`}
      className={`card block hover:shadow-card-hover transition-shadow duration-200 overflow-hidden ${isFeatured ? 'ring-2 ring-gold' : ''}`}
    >
      {isFeatured && (
        <div className="bg-gold text-white text-xs font-bold px-4 py-1.5 flex items-center gap-1.5">
          <Star className="w-3 h-3" aria-label="featured" />
          Featured Geriatrician
        </div>
      )}

      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-display font-semibold text-navy text-base leading-tight truncate">
              {formatCredentials(listing.full_name, listing.credentials)}
            </h3>
            {listing.practice_name && (
              <p className="text-sm text-navy-400 mt-0.5 truncate">{listing.practice_name}</p>
            )}
          </div>
          {listing.photo_url && (
            <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-navy-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={listing.photo_url} alt={listing.full_name} className="w-full h-full object-cover" />
            </div>
          )}
        </div>

        <div className="flex items-center gap-1.5 text-sm text-navy-500 mb-3">
          <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-navy-400" aria-label="location" />
          <span>{listing.city}, {listing.state}</span>
        </div>

        {/* Badges row */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {listing.is_abim_certified && (
            <span className="badge-abim">
              <CheckCircle className="w-3 h-3" aria-label="certified" />
              ABIM Certified
            </span>
          )}
          {isVerified && (
            <span className="badge-verified">
              <CheckCircle className="w-3 h-3" aria-label="verified" />
              {isFeatured ? 'Featured' : 'Verified'}
            </span>
          )}
          {listing.is_accepting_new_patients === true && (
            <span className="badge-accepting">
              <UserCheck className="w-3 h-3" aria-label="accepting patients" />
              Accepting Patients
            </span>
          )}
          {listing.offers_telehealth && (
            <span className="badge-telehealth">
              <Video className="w-3 h-3" aria-label="telehealth" />
              Telehealth
            </span>
          )}
        </div>

        {/* Subspecialties */}
        {listing.subspecialties?.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {listing.subspecialties.slice(0, 3).map((s) => (
              <span key={s} className="inline-block px-2 py-0.5 bg-navy-50 text-navy-600 text-xs rounded-full">
                {getSubspecialtyLabel(s)}
              </span>
            ))}
          </div>
        )}

        {listing.bio && isClaimed && (
          <p className="text-sm text-navy-400 leading-relaxed mb-3">
            {truncate(listing.bio, 100)}
          </p>
        )}

        {/* Contact row — only shown for paid listings */}
        <div className="flex items-center gap-4 pt-3 border-t border-navy-100 text-xs text-navy-400">
          {isClaimed && listing.phone && (
            <span className="flex items-center gap-1">
              <Phone className="w-3 h-3" aria-label="phone" />
              {isVerified ? listing.phone : 'Claim to view'}
            </span>
          )}
          {isClaimed && listing.website && isVerified && (
            <span className="flex items-center gap-1">
              <Globe className="w-3 h-3" aria-label="website" />
              Website
            </span>
          )}
          {!isClaimed && (
            <span className="text-navy-300 italic">Unclaimed listing</span>
          )}
        </div>
      </div>
    </Link>
  )
}
