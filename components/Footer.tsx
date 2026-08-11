import Link from 'next/link'
import { Stethoscope } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-navy-900 text-navy-200 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 text-white font-display font-bold text-lg mb-3">
              <Stethoscope className="w-5 h-5 text-gold" aria-label="logo" />
              <span>GeriatricianDirectory.com</span>
            </Link>
            <p className="text-sm text-navy-300 leading-relaxed">
              The most complete directory of board-certified geriatricians in the United States.
              7,000 specialists for 58 million seniors.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold text-sm mb-4">Find Care</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/listings" className="hover:text-white transition-colors">Browse All Geriatricians</Link></li>
              <li><Link href="/listings?accepting_new_patients=yes" className="hover:text-white transition-colors">Accepting New Patients</Link></li>
              <li><Link href="/listings?telehealth=yes" className="hover:text-white transition-colors">Telehealth Available</Link></li>
              <li><Link href="/categories/memory-care" className="hover:text-white transition-colors">Memory Care</Link></li>
              <li><Link href="/categories/fall-prevention" className="hover:text-white transition-colors">Fall Prevention</Link></li>
              <li><Link href="/categories/palliative-care" className="hover:text-white transition-colors">Palliative Care</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold text-sm mb-4">For Physicians</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/submit" className="hover:text-white transition-colors">Add Your Practice</Link></li>
              <li><Link href="/listings" className="hover:text-white transition-colors">Claim Your Listing</Link></li>
              <li><Link href="/submit#verified" className="hover:text-white transition-colors">Verified ($99/yr)</Link></li>
              <li><Link href="/submit#featured" className="hover:text-white transition-colors">Featured ($199/yr)</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold text-sm mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/categories/polypharmacy" className="hover:text-white transition-colors">Polypharmacy Management</Link></li>
              <li><Link href="/categories/care-coordination" className="hover:text-white transition-colors">Care Coordination</Link></li>
              <li><Link href="/categories/post-acute-care" className="hover:text-white transition-colors">Post-Acute Care</Link></li>
              <li><Link href="/admin" className="hover:text-white transition-colors">Admin</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-navy-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-navy-400">
          <p>© {new Date().getFullYear()} GeriatricianDirectory.com. All rights reserved.</p>
          <p className="text-center">
            There are fewer than 7,000 board-certified geriatricians for 58 million Americans over 65.
            <br className="sm:hidden" /> This directory makes every one of them findable.
          </p>
        </div>
      </div>
    </footer>
  )
}
