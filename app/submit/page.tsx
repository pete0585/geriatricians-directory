import type { Metadata } from 'next'
import SubmitForm from '@/components/SubmitForm'
import { CheckCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Add Your Geriatric Medicine Practice | GeriatricianDirectory.com',
  description:
    'List your geriatric medicine practice on the most complete geriatrician directory in the US. Free listing, $99/yr for Verified, $199/yr for Featured placement.',
}

const BENEFITS = [
  'Free base listing — no credit card required',
  'Claim in 2 minutes via email verification',
  'Add photo, bio, and subspecialty tags',
  'Verified listing ($99/yr) shows contact info and gets priority placement',
  'Featured listing ($199/yr) pins you first in city search results',
  'One new Medicare patient = 5–25× your annual listing cost',
]

export default function SubmitPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div>
          <h1 className="font-display font-bold text-navy text-3xl mb-4">
            Add Your Practice to GeriatricianDirectory.com
          </h1>
          <p className="text-navy-500 mb-6 leading-relaxed">
            Fewer than 7,000 geriatricians serve 58 million Americans over 65. Families searching for you
            right now will find you here — or they won&apos;t find you at all. Your listing may already exist
            from the NPI registry. If it does, claim it. If not, add it below.
          </p>

          <ul className="space-y-3 mb-8">
            {BENEFITS.map((b, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-navy-600">
                <CheckCircle className="w-4 h-4 text-sage flex-shrink-0 mt-0.5" aria-label="check" />
                {b}
              </li>
            ))}
          </ul>

          <div id="verified" className="card p-5 bg-navy-50 border-navy-200 mb-4">
            <div className="font-display font-bold text-navy mb-1">Verified — $99/yr</div>
            <p className="text-xs text-navy-500">Full profile with photo, bio, subspecialty tags, contact info visible, priority placement, Board-Certified badge.</p>
          </div>
          <div id="featured" className="card p-5 bg-gold-50 border-gold-200">
            <div className="font-display font-bold text-navy mb-1">Featured — $199/yr</div>
            <p className="text-xs text-navy-500">Everything in Verified plus: pinned first in city results, Featured badge, dedicated SEO landing page, monthly inquiry report.</p>
          </div>
        </div>

        <div>
          <SubmitForm />
        </div>
      </div>
    </div>
  )
}
