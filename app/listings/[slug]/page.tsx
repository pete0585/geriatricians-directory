import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getListingBySlug, getAllSlugs } from '@/lib/data'
import ListingDetail from '@/components/ListingDetail'
import { getAbsoluteUrl, formatCredentials, formatStateName } from '@/lib/utils'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const listing = await getListingBySlug(slug)
  if (!listing) return {}

  const name = formatCredentials(listing.full_name, listing.credentials)
  const title = `${name} — Geriatrician in ${listing.city}, ${listing.state}`
  const description = [
    `${name} is a board-certified geriatrician in ${listing.city}, ${formatStateName(listing.state)}.`,
    listing.is_accepting_new_patients ? 'Currently accepting new patients.' : '',
    listing.offers_telehealth ? 'Telehealth available.' : '',
    listing.subspecialties?.length
      ? `Specializes in: ${listing.subspecialties.slice(0, 3).join(', ')}.`
      : '',
  ].filter(Boolean).join(' ')

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'profile',
      url: getAbsoluteUrl(`/listings/${slug}`),
    },
    alternates: {
      canonical: getAbsoluteUrl(`/listings/${slug}`),
    },
  }
}

export async function generateStaticParams() {
  const slugs = await getAllSlugs().catch(() => [] as string[])
  return slugs.slice(0, 1000).map((slug) => ({ slug }))
}

export default async function ListingPage({ params }: PageProps) {
  const { slug } = await params
  const listing = await getListingBySlug(slug)
  if (!listing) notFound()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Physician',
    name: formatCredentials(listing.full_name, listing.credentials),
    medicalSpecialty: 'Geriatric Medicine',
    description: listing.bio || `Board-certified geriatrician in ${listing.city}, ${listing.state}.`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: listing.address_line1,
      addressLocality: listing.city,
      addressRegion: listing.state,
      postalCode: listing.zip,
      addressCountry: 'US',
    },
    telephone: listing.listing_tier !== 'free' ? listing.phone : undefined,
    url: listing.listing_tier !== 'free' ? listing.website : undefined,
    hasCredential: listing.is_abim_certified
      ? [{
          '@type': 'EducationalOccupationalCredential',
          credentialCategory: 'Board Certification',
          recognizedBy: {
            '@type': 'Organization',
            name: 'American Board of Internal Medicine (ABIM)',
          },
        }]
      : undefined,
  }

  return (
    <div className="bg-cream min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ListingDetail listing={listing} />
    </div>
  )
}
