import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Dementia & Alzheimer's | GeriatricianDirectory.com',
  description: 'Geriatricians with dementia expertise help families navigate diagnosis, treatment options, behavioral symptoms, and long-term care planning for loved ones with Alzheimer's or other dementias.',
}

export default function DementiaSpecialtyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <nav className="mb-8 text-sm text-charcoal-400">
        <Link href="/" className="hover:text-charcoal-700">Home</Link>
        <span className="mx-2">/</span>
        <span>Dementia & Alzheimer's</span>
      </nav>

      <div className="mb-10">
        <h1 className="font-serif text-4xl font-bold text-charcoal-800 mb-4">
          Dementia Specialists
        </h1>
        <p className="text-lg text-charcoal-500 leading-relaxed max-w-2xl">
          Geriatricians with dementia expertise help families navigate diagnosis, treatment options, behavioral symptoms, and long-term care planning for loved ones with Alzheimer's or other dementias.
        </p>
      </div>

      <div className="rounded-2xl bg-sage-50 border border-sage-200 p-8 text-center mb-12">
        <h2 className="font-serif text-2xl font-bold text-charcoal-800 mb-3">
          Find a Dementia & Alzheimer's Specialist Near You
        </h2>
        <p className="text-charcoal-600 mb-6">
          Search our directory of geriatricians who specialize in dementia & alzheimer's.
        </p>
        <Link href="/listings?specialty=Dementia+%26+Alzheimer%27s" className="btn-primary">
          Search Dementia & Alzheimer's Specialists <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  )
}
