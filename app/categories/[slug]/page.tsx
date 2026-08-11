import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getListingsBySubspecialty } from '@/lib/data'
import ListingCard from '@/components/ListingCard'
import { CATEGORIES } from '@/lib/types'
import { getAbsoluteUrl } from '@/lib/utils'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const category = CATEGORIES.find((c) => c.slug === slug)
  if (!category) return {}

  const title = `${category.label} Geriatricians — Find Board-Certified Specialists`
  const description = `Browse board-certified geriatricians specializing in ${category.label.toLowerCase()}. Find specialists accepting new patients near you.`

  return {
    title,
    description,
    openGraph: { title, description, type: 'website', url: getAbsoluteUrl(`/categories/${slug}`) },
    alternates: { canonical: getAbsoluteUrl(`/categories/${slug}`) },
  }
}

export async function generateStaticParams() {
  return CATEGORIES.map((c) => ({ slug: c.slug }))
}

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  'memory-care': 'Memory care geriatricians specialize in diagnosing and managing Alzheimer\'s disease, dementia, and other cognitive disorders in older adults. They provide comprehensive assessments, medication management, and care planning for patients and families.',
  'fall-prevention': 'Fall prevention specialists assess and address the complex factors that increase fall risk in older adults — including medication side effects, balance disorders, vision problems, and environmental hazards. A single fall can change an elderly person\'s life trajectory.',
  'palliative-care': 'Palliative care geriatricians focus on improving quality of life for seniors with serious illness through symptom management, pain control, and advance care planning. They work alongside your other specialists, not instead of them.',
  'polypharmacy': 'Polypharmacy management specialists review and optimize medication regimens for seniors taking multiple drugs. The average Medicare patient takes 4–5 prescription medications — a geriatrician\'s systematic review often eliminates dangerous interactions and simplifies care.',
  'care-coordination': 'Care coordination specialists help families navigate complex, multi-provider medical situations. They act as the quarterback for your loved one\'s care — communicating with specialists, managing transitions between care settings, and ensuring nothing falls through the cracks.',
  'post-acute-care': 'Post-acute care specialists oversee recovery after hospitalization, surgery, or acute illness. They coordinate skilled nursing facility care, rehab, and the critical transition back home — the period when complications most commonly occur.',
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params
  const category = CATEGORIES.find((c) => c.slug === slug)
  if (!category) notFound()

  const listings = await getListingsBySubspecialty(category.subspecialty, 50)
  const description = CATEGORY_DESCRIPTIONS[slug] || `Find geriatricians specializing in ${category.label.toLowerCase()}.`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'MedicalSpecialty',
    name: `${category.label} — Geriatric Medicine`,
    description,
    url: getAbsoluteUrl(`/categories/${slug}`),
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb */}
      <nav className="text-sm text-navy-400 mb-6" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-navy">Home</Link>
        <span className="mx-2">›</span>
        <Link href="/listings" className="hover:text-navy">Geriatricians</Link>
        <span className="mx-2">›</span>
        <span className="text-navy font-medium">{category.label}</span>
      </nav>

      {/* Header */}
      <div className="mb-10 max-w-3xl">
        <h1 className="font-display font-bold text-navy text-3xl sm:text-4xl mb-4">
          {category.label} Geriatricians
        </h1>
        <p className="text-navy-500 text-base leading-relaxed">{description}</p>
      </div>

      {/* Listings */}
      {listings.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-navy-400 text-base mb-4">No {category.label.toLowerCase()} specialists listed yet.</p>
          <Link href="/submit" className="btn-primary inline-flex">Add Your Practice</Link>
        </div>
      ) : (
        <>
          <p className="text-sm text-navy-400 mb-6">{listings.length} specialist{listings.length !== 1 ? 's' : ''} listed</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </>
      )}

      {/* Other categories */}
      <div className="mt-16">
        <h2 className="font-display font-bold text-navy text-xl mb-5">Other Specialty Areas</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {CATEGORIES.filter((c) => c.slug !== slug).map((cat) => (
            <Link
              key={cat.slug}
              href={`/categories/${cat.slug}`}
              className="card p-4 hover:shadow-card-hover transition-shadow group"
            >
              <div className="font-medium text-navy group-hover:text-navy-700 text-sm">{cat.label}</div>
              <div className="text-xs text-navy-400 mt-0.5">Find specialists →</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
