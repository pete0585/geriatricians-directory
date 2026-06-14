import Link from 'next/link'
import { Stethoscope } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-charcoal-700 text-charcoal-100">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-5">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sage-300/20">
                <Stethoscope className="h-4 w-4 text-sage-300" />
              </div>
              <span className="font-serif text-lg font-bold text-white">
                Geriatrician<span className="text-sage-300">Directory</span>
              </span>
            </Link>
            <p className="text-sm text-charcoal-200 max-w-sm leading-relaxed">
              The nationwide directory of board-certified geriatricians and geriatric care specialists.
              Helping older adults and their families find expert care.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">For Patients & Families</h3>
            <ul className="space-y-2.5">
              <li><Link href="/listings" className="text-sm text-charcoal-200 hover:text-white transition-colors">Find a Geriatrician</Link></li>
              <li><Link href="/resources/what-is-a-geriatrician" className="text-sm text-charcoal-200 hover:text-white transition-colors">What is a Geriatrician?</Link></li>
              <li><Link href="/listings?telehealth=true" className="text-sm text-charcoal-200 hover:text-white transition-colors">Telehealth Geriatricians</Link></li>
              <li><Link href="/listings?acceptingNew=true" className="text-sm text-charcoal-200 hover:text-white transition-colors">Accepting New Patients</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">For Specialists</h3>
            <ul className="space-y-2.5">
              <li><Link href="/submit" className="text-sm text-charcoal-200 hover:text-white transition-colors">List Your Practice</Link></li>
              <li><Link href="/submit#pricing" className="text-sm text-charcoal-200 hover:text-white transition-colors">Pricing</Link></li>
              <li><Link href="/admin" className="text-sm text-charcoal-200 hover:text-white transition-colors">Admin Login</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Specialties</h3>
            <ul className="space-y-2.5">
              <li><Link href="/specialties/memory-care" className="text-sm text-charcoal-200 hover:text-white transition-colors">Memory Care</Link></li>
              <li><Link href="/specialties/dementia" className="text-sm text-charcoal-200 hover:text-white transition-colors">Dementia</Link></li>
              <li><Link href="/specialties/fall-prevention" className="text-sm text-charcoal-200 hover:text-white transition-colors">Fall Prevention</Link></li>
              <li><Link href="/specialties/polypharmacy" className="text-sm text-charcoal-200 hover:text-white transition-colors">Polypharmacy</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-charcoal-600 pt-8">
          <p className="text-xs text-charcoal-400 max-w-3xl leading-relaxed mb-4">
            GeriatricianDirectory.com is an independent directory and is not affiliated with any medical board or certification body.
            Always verify credentials independently. Information is provided for convenience only and does not constitute medical advice.
          </p>
          <p className="text-xs text-charcoal-300">© {currentYear} GeriatricianDirectory.com. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
