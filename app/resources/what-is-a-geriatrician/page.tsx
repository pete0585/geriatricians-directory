import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'What Is a Geriatrician? | GeriatricianDirectory.com',
  description: 'Learn what a geriatrician does, how they differ from primary care physicians, and when you should see one for yourself or a loved one.',
}

export default function WhatIsAGeriatricianPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <nav className="mb-8 text-sm text-charcoal-400">
        <Link href="/" className="hover:text-charcoal-700">Home</Link>
        <span className="mx-2">/</span>
        <span>What Is a Geriatrician?</span>
      </nav>

      <article className="prose prose-charcoal max-w-none">
        <h1 className="font-serif text-4xl font-bold text-charcoal-800 mb-4">What Is a Geriatrician?</h1>
        <p className="text-lg text-charcoal-500 mb-8 leading-relaxed">
          A geriatrician is a physician who specializes in the health and care of older adults.
          While any doctor can treat older patients, geriatricians complete additional fellowship training
          specifically focused on how aging affects the body, how diseases manifest differently in seniors,
          and how to manage the complex interplay of multiple conditions and medications.
        </p>

        <h2 className="font-serif text-2xl font-bold text-charcoal-800 mt-10 mb-4">What Makes Geriatricians Different?</h2>
        <p className="text-charcoal-600 mb-4 leading-relaxed">
          Primary care physicians treat patients across all ages. Geriatricians focus exclusively on
          patients typically 65 and older — and they approach care differently:
        </p>
        <ul className="space-y-3 text-charcoal-600 mb-8">
          <li><strong>Polypharmacy management:</strong> Older adults often take 5–15+ medications. Geriatricians are trained to identify dangerous drug interactions and safely deprescribe unnecessary medications.</li>
          <li><strong>Comprehensive geriatric assessment:</strong> They evaluate physical health, cognitive function, emotional wellbeing, social support, and functional ability — all in one visit.</li>
          <li><strong>Falls and mobility:</strong> They assess fall risk and create prevention plans, reducing one of the leading causes of senior injury.</li>
          <li><strong>Cognitive concerns:</strong> From mild memory loss to Alzheimer's diagnosis, geriatricians are trained to evaluate and manage cognitive decline.</li>
          <li><strong>Goals-of-care conversations:</strong> They guide families through difficult decisions about treatment intensity, hospice, and quality of life.</li>
        </ul>

        <h2 className="font-serif text-2xl font-bold text-charcoal-800 mt-10 mb-4">When Should You See a Geriatrician?</h2>
        <p className="text-charcoal-600 mb-4 leading-relaxed">
          Consider a geriatrician if you or a loved one:
        </p>
        <ul className="space-y-2 text-charcoal-600 mb-8">
          <li>• Is 75 or older, especially with multiple chronic conditions</li>
          <li>• Takes many medications and has concerns about interactions</li>
          <li>• Has experienced recent falls or mobility problems</li>
          <li>• Has memory concerns or a recent dementia diagnosis</li>
          <li>• Needs help coordinating care across many specialists</li>
          <li>• Is navigating end-of-life planning decisions</li>
        </ul>

        <div className="mt-12 rounded-2xl bg-sage-50 border border-sage-200 p-6">
          <h3 className="font-serif text-xl font-bold text-charcoal-800 mb-2">Ready to find a geriatrician?</h3>
          <p className="text-charcoal-600 mb-4">Search our directory to find board-certified geriatricians near you.</p>
          <Link href="/listings" className="btn-primary">Find a Geriatrician Near Me</Link>
        </div>
      </article>
    </div>
  )
}
