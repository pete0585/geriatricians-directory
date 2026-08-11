import Link from 'next/link'
import { MapPin, Phone, Globe, Mail, CheckCircle, Star, UserCheck, Video, ArrowLeft, Award, Shield } from 'lucide-react'
import type { Listing } from '@/lib/types'
import { formatCredentials, formatStateName, getSubspecialtyLabel } from '@/lib/utils'

interface ListingDetailProps {
  listing: Listing
}

export default function ListingDetail({ listing }: ListingDetailProps) {
  const isFeatured = listing.listing_tier === 'featured'
  const isVerified = listing.listing_tier === 'verified' || isFeatured
  const isClaimed = !!listing.claimed_at
  const showContact = isVerified && isClaimed

  return (
    <div className="max-w-4xl mx-auto">
      <Link href="/listings" className="inline-flex items-center gap-1.5 text-sm text-navy-500 hover:text-navy mb-6">
        <ArrowLeft className="w-4 h-4" aria-label="back" />
        Back to listings
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6">
            {isFeatured && (
              <div className="flex items-center gap-1.5 text-gold text-sm font-semibold mb-4">
                <Star className="w-4 h-4" aria-label="featured" />
                Featured Geriatrician
              </div>
            )}

            <div className="flex items-start gap-4 mb-4">
              {listing.photo_url ? (
                <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0 bg-navy-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={listing.photo_url} alt={listing.full_name} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-20 h-20 rounded-full bg-navy-100 flex-shrink-0 flex items-center justify-center">
                  <span className="text-navy text-2xl font-bold">
                    {listing.full_name.charAt(0)}
                  </span>
                </div>
              )}
              <div>
                <h1 className="font-display font-bold text-navy text-2xl leading-tight">
                  {formatCredentials(listing.full_name, listing.credentials)}
                </h1>
                {listing.practice_name && (
                  <p className="text-navy-500 mt-1">{listing.practice_name}</p>
                )}
                <div className="flex items-center gap-1.5 text-sm text-navy-500 mt-1.5">
                  <MapPin className="w-4 h-4 flex-shrink-0 text-navy-400" aria-label="location" />
                  <span>{listing.city}, {formatStateName(listing.state)}</span>
                </div>
              </div>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              {listing.is_abim_certified && (
                <span className="badge-abim">
                  <Award className="w-3.5 h-3.5" aria-label="ABIM" />
                  Board-Certified by ABIM
                </span>
              )}
              {listing.is_ags_member && (
                <span className="badge bg-purple-50 text-purple-700">
                  <Shield className="w-3.5 h-3.5" aria-label="AGS" />
                  AGS Member
                </span>
              )}
              {isVerified && (
                <span className="badge-verified">
                  <CheckCircle className="w-3.5 h-3.5" aria-label="verified" />
                  {isFeatured ? 'Featured' : 'Verified'} Listing
                </span>
              )}
              {listing.is_accepting_new_patients === true && (
                <span className="badge-accepting">
                  <UserCheck className="w-3.5 h-3.5" aria-label="accepting" />
                  Accepting New Patients
                </span>
              )}
              {listing.is_accepting_new_patients === false && (
                <span className="badge bg-red-50 text-red-600">
                  Not Accepting New Patients
                </span>
              )}
              {listing.offers_telehealth && (
                <span className="badge-telehealth">
                  <Video className="w-3.5 h-3.5" aria-label="telehealth" />
                  Telehealth Available
                </span>
              )}
            </div>

            {/* Bio */}
            {listing.bio && isClaimed && (
              <div>
                <h2 className="font-display font-semibold text-navy text-base mb-2">About</h2>
                <p className="text-sm text-navy-600 leading-relaxed">{listing.bio}</p>
              </div>
            )}
          </div>

          {/* Specialties */}
          {listing.subspecialties?.length > 0 && (
            <div className="card p-6">
              <h2 className="font-display font-semibold text-navy text-base mb-3">Specialty Areas</h2>
              <div className="flex flex-wrap gap-2">
                {listing.subspecialties.map((s) => (
                  <span key={s} className="inline-block px-3 py-1.5 bg-navy-50 text-navy-700 text-sm rounded-full font-medium">
                    {getSubspecialtyLabel(s)}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Conditions treated */}
          {listing.conditions_treated?.length > 0 && (
            <div className="card p-6">
              <h2 className="font-display font-semibold text-navy text-base mb-3">Conditions Treated</h2>
              <div className="flex flex-wrap gap-2">
                {listing.conditions_treated.map((c) => (
                  <span key={c} className="inline-block px-3 py-1.5 bg-sage-50 text-sage-700 text-sm rounded-full">
                    {c.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Insurance */}
          {listing.insurance_accepted?.length > 0 && isClaimed && (
            <div className="card p-6">
              <h2 className="font-display font-semibold text-navy text-base mb-3">Insurance Accepted</h2>
              <div className="flex flex-wrap gap-2">
                {listing.insurance_accepted.map((ins) => (
                  <span key={ins} className="inline-block px-3 py-1.5 bg-gray-50 text-gray-700 text-sm rounded-full border border-gray-200">
                    {ins.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Contact card */}
          <div className="card p-5">
            <h2 className="font-display font-semibold text-navy text-base mb-4">Contact Information</h2>
            {showContact ? (
              <div className="space-y-3">
                {listing.address_line1 && (
                  <div className="flex items-start gap-2 text-sm text-navy-600">
                    <MapPin className="w-4 h-4 flex-shrink-0 text-navy-400 mt-0.5" aria-label="address" />
                    <span>
                      {listing.address_line1}<br />
                      {listing.city}, {listing.state} {listing.zip}
                    </span>
                  </div>
                )}
                {listing.phone && (
                  <a href={`tel:${listing.phone}`} className="flex items-center gap-2 text-sm text-navy hover:text-navy-700">
                    <Phone className="w-4 h-4 text-navy-400" aria-label="phone" />
                    {listing.phone}
                  </a>
                )}
                {listing.email && (
                  <a href={`mailto:${listing.email}`} className="flex items-center gap-2 text-sm text-navy hover:text-navy-700 break-all">
                    <Mail className="w-4 h-4 text-navy-400 flex-shrink-0" aria-label="email" />
                    {listing.email}
                  </a>
                )}
                {listing.website && (
                  <a href={listing.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-navy hover:text-navy-700">
                    <Globe className="w-4 h-4 text-navy-400" aria-label="website" />
                    Visit Website
                  </a>
                )}
              </div>
            ) : (
              <div className="text-center">
                <p className="text-sm text-navy-400 mb-3">
                  {isClaimed
                    ? 'Upgrade to Verified to display full contact information.'
                    : 'This listing has not been claimed yet. Are you this geriatrician?'}
                </p>
                {!isClaimed && (
                  <Link href={`/claim/${listing.id}`} className="btn-primary w-full justify-center text-xs">
                    Claim This Listing — Free
                  </Link>
                )}
                {isClaimed && !isVerified && (
                  <Link href={`/listings/${listing.slug}#upgrade`} className="btn-gold w-full justify-center text-xs">
                    Upgrade to Verified ($99/yr)
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Upgrade CTA for unclaimed */}
          {!isClaimed && (
            <div className="card p-5 bg-navy-50 border-navy-200">
              <h3 className="font-display font-semibold text-navy text-sm mb-2">Is this your listing?</h3>
              <p className="text-xs text-navy-500 mb-3 leading-relaxed">
                7,000 geriatricians for 58 million seniors. Claim your free profile and be found by families searching for care right now.
              </p>
              <Link href={`/claim/${listing.id}`} className="btn-primary w-full justify-center text-xs">
                Claim Free — Takes 2 Minutes
              </Link>
            </div>
          )}

          {/* NPI info */}
          {listing.npi && (
            <div className="card p-5">
              <h3 className="font-display font-semibold text-navy text-sm mb-2">Provider Information</h3>
              <div className="text-xs text-navy-500 space-y-1">
                <div className="flex justify-between">
                  <span>NPI Number</span>
                  <span className="font-mono text-navy">{listing.npi}</span>
                </div>
                {listing.credentials && (
                  <div className="flex justify-between">
                    <span>Credentials</span>
                    <span className="font-semibold text-navy">{listing.credentials}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Specialty</span>
                  <span className="text-navy">Geriatric Medicine</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Upgrade section for claimed but free */}
      {isClaimed && !isVerified && (
        <div id="upgrade" className="card p-8 mt-8 bg-gradient-hero border-navy-200 text-center">
          <h2 className="font-display font-bold text-navy text-xl mb-2">Upgrade Your Listing</h2>
          <p className="text-navy-500 text-sm mb-6 max-w-xl mx-auto">
            One new patient from a geriatric specialty visit delivers 5–25× the cost of a Verified listing in year one alone.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
            <div className="card p-5 text-left">
              <div className="font-display font-bold text-navy text-lg mb-1">Verified <span className="text-sm font-normal text-navy-400">$99/yr</span></div>
              <ul className="text-xs text-navy-500 space-y-1 mb-4">
                <li>✓ Full profile with photo & bio</li>
                <li>✓ Subspecialty tags visible</li>
                <li>✓ Contact info displayed</li>
                <li>✓ Board-Certified badge</li>
                <li>✓ Priority placement</li>
              </ul>
              <form action={`/api/checkout`} method="POST">
                <input type="hidden" name="listingId" value={listing.id} />
                <input type="hidden" name="tier" value="verified" />
                <button type="submit" className="btn-primary w-full justify-center text-xs">
                  Get Verified
                </button>
              </form>
            </div>
            <div className="card p-5 text-left ring-2 ring-gold">
              <div className="text-gold text-xs font-bold mb-1">BEST VALUE</div>
              <div className="font-display font-bold text-navy text-lg mb-1">Featured <span className="text-sm font-normal text-navy-400">$199/yr</span></div>
              <ul className="text-xs text-navy-500 space-y-1 mb-4">
                <li>✓ Everything in Verified</li>
                <li>✓ Pinned first in city search</li>
                <li>✓ Featured badge on cards</li>
                <li>✓ Dedicated SEO landing page</li>
                <li>✓ Monthly inquiry summary</li>
              </ul>
              <form action={`/api/checkout`} method="POST">
                <input type="hidden" name="listingId" value={listing.id} />
                <input type="hidden" name="tier" value="featured" />
                <button type="submit" className="btn-gold w-full justify-center text-xs">
                  Get Featured
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
