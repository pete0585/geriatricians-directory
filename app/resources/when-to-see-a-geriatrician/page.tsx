import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'When Should You See a Geriatrician? | GeriatricianDirectory.com',
  description: 'Not sure if you or a loved one needs a geriatrician? Here are the key signs it's time to make an appointment with a geriatric specialist.',
}

export default function WhenToSeeGeriatricianPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <nav className="mb-8 text-sm text-charcoal-400">
        <Link href="/" className="hover:text-charcoal-700">Home</Link>
        <span className="mx-2">/</span>
        <span>When to See a Geriatrician</span>
      </nav>

      <article>
        <h1 className="font-serif text-4xl font-bold text-charcoal-800 mb-4">When Should You See a Geriatrician?</h1>
        <p className="text-lg text-charcoal-500 mb-8 leading-relaxed">
          A geriatrician is a physician who specializes in the complex health needs of older adults.
          Here are the signs it may be time to make an appointment.
        </p>

        <div className="space-y-8">
          {[
            { title: 'You're managing 5+ medications', body: 'Older adults are at high risk for dangerous drug interactions. Geriatricians are experts at medication review and deprescribing — safely reducing medications that may be causing more harm than good.' },
            { title: 'Recent falls or balance problems', body: 'Falls are the leading cause of serious injury in adults over 65. Geriatricians perform comprehensive fall assessments and create individualized prevention plans.' },
            { title: 'Memory concerns or confusion', body: 'Whether it's your own memory or a parent's, a geriatrician can distinguish normal aging from early dementia, guide diagnosis, and connect you with the right resources.' },
            { title: 'Multiple specialists, no coordinator', body: 'If you're seeing a cardiologist, neurologist, orthopedist, and endocrinologist — but no one is looking at the whole picture — a geriatrician can serve as the integrating physician.' },
            { title: 'Planning for the future', body: 'Advance directives, hospice conversations, care transitions — geriatricians help patients and families make informed, values-aligned decisions about care goals.' },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl bg-white border border-ivory-300 p-6 shadow-soft">
              <h2 className="font-serif text-xl font-semibold text-charcoal-800 mb-2">{item.title}</h2>
              <p className="text-charcoal-600 leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-2xl bg-sage-50 border border-sage-200 p-6 text-center">
          <h3 className="font-serif text-xl font-bold text-charcoal-800 mb-2">Find a geriatrician near you</h3>
          <Link href="/listings" className="btn-primary mt-2 inline-flex">Search the Directory</Link>
        </div>
      </article>
    </div>
  )
}
