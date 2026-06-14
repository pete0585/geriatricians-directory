import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getListingBySlug } from '@/lib/data'
import ListingDetail from '@/components/ListingDetail'
import { stateAbbreviationToName } from '@/lib/utils'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const listing = await getListingBySlug(slug)

  if (!listing) {
    return { title: 'Geriatrician Not Found' }
  }

  const title = `${listing.name} — Geriatrician in ${listing.city}, ${listing.state}`
  const description = listing.bio
    ? `${listing.bio.slice(0, 155).trim()}…`
    : `Find ${listing.name} in ${listing.city}, ${stateAbbreviationToName(listing.state)}. ${listing.telehealth ? 'Telehealth available. ' : ''}${listing.accepting_new_clients ? 'Accepting new patients.' : ''}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'profile',
      images: listing.photo_url ? [{ url: listing.photo_url, alt: listing.name }] : undefined,
    },
  }
}

export default async function GeriatricianPage({ params }: Props) {
  const { slug } = await params
  const listing = await getListingBySlug(slug)

  if (!listing) notFound()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'Physician'],
    name: listing.name,
    description: listing.bio ?? undefined,
    image: listing.photo_url ?? undefined,
    telephone: listing.phone ?? undefined,
    url: listing.website ?? undefined,
    address: {
      '@type': 'PostalAddress',
      addressLocality: listing.city,
      addressRegion: listing.state,
      postalCode: listing.zip ?? undefined,
      addressCountry: 'US',
    },
    ...(listing.lat && listing.lng ? {
      geo: { '@type': 'GeoCoordinates', latitude: listing.lat, longitude: listing.lng },
    } : {}),
    medicalSpecialty: 'Geriatrics',
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: process.env.NEXT_PUBLIC_SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Find a Geriatrician', item: `${process.env.NEXT_PUBLIC_SITE_URL}/listings` },
        { '@type': 'ListItem', position: 3, name: listing.name, item: `${process.env.NEXT_PUBLIC_SITE_URL}/geriatrician/${listing.slug}` },
      ],
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ListingDetail listing={listing} />
    </>
  )
}
