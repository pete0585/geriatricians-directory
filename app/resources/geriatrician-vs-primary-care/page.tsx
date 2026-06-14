import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Geriatrician vs. Primary Care Doctor | GeriatricianDirectory.com',
  description: 'What's the difference between a geriatrician and a primary care physician? Learn when you need each type of doctor for your aging loved one.',
}

export default function GeriatricianVsPCPPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <nav className="mb-8 text-sm text-charcoal-400">
        <Link href="/" className="hover:text-charcoal-700">Home</Link>
        <span className="mx-2">/</span>
        <span>Geriatrician vs. Primary Care</span>
      </nav>

      <article>
        <h1 className="font-serif text-4xl font-bold text-charcoal-800 mb-4">Geriatrician vs. Primary Care Doctor: What's the Difference?</h1>
        <p className="text-lg text-charcoal-500 mb-8 leading-relaxed">
          Both can treat older adults — but geriatricians bring specialized training that makes a difference
          for patients with complex, age-related health challenges.
        </p>

        <div className="overflow-x-auto mb-10">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-sage-50">
                <th className="border border-ivory-300 px-4 py-3 text-left font-semibold text-charcoal-700"></th>
                <th className="border border-ivory-300 px-4 py-3 text-left font-semibold text-charcoal-700">Primary Care Physician</th>
                <th className="border border-ivory-300 px-4 py-3 text-left font-semibold text-charcoal-700">Geriatrician</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Patient age focus', 'All ages', 'Adults 65+ (especially 75+)'],
                ['Additional training', 'Standard residency', 'Geriatric fellowship (1-2 years)'],
                ['Medication management', 'Prescribes as needed', 'Specializes in deprescribing & safety'],
                ['Cognitive assessment', 'Basic screening', 'Comprehensive evaluation & management'],
                ['Fall prevention', 'General advice', 'Detailed risk assessment & plan'],
                ['Goals-of-care', 'As needed', 'Core part of every visit'],
                ['Medicare acceptance', 'Varies', 'High acceptance rate'],
              ].map(([feature, pcp, geri]) => (
                <tr key={feature} className="border-b border-ivory-200">
                  <td className="border border-ivory-300 px-4 py-3 font-medium text-charcoal-700">{feature}</td>
                  <td className="border border-ivory-300 px-4 py-3 text-charcoal-600">{pcp}</td>
                  <td className="border border-ivory-300 px-4 py-3 text-charcoal-600">{geri}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-10 rounded-2xl bg-sage-50 border border-sage-200 p-6 text-center">
          <h3 className="font-serif text-xl font-bold text-charcoal-800 mb-2">Find a geriatrician in your area</h3>
          <Link href="/listings" className="btn-primary mt-2 inline-flex">Search the Directory</Link>
        </div>
      </article>
    </div>
  )
}
