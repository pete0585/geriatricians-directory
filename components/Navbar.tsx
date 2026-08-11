'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, Stethoscope } from 'lucide-react'

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="bg-white border-b border-navy-100 sticky top-0 z-50 shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 font-display font-bold text-navy text-lg">
            <Stethoscope className="w-6 h-6 text-navy" aria-label="Geriatrician Directory logo" />
            <span>GeriatricianDirectory</span>
            <span className="text-gold">.com</span>
          </Link>

          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="/listings" className="text-charcoal hover:text-navy transition-colors">
              Find a Geriatrician
            </Link>
            <Link href="/categories/memory-care" className="text-charcoal hover:text-navy transition-colors">
              Memory Care
            </Link>
            <Link href="/categories/palliative-care" className="text-charcoal hover:text-navy transition-colors">
              Palliative Care
            </Link>
            <Link href="/submit" className="btn-secondary text-xs px-4 py-2">
              Add Your Practice
            </Link>
            <Link href="/listings?accepting_new_patients=yes" className="btn-primary text-xs px-4 py-2">
              Accepting Patients
            </Link>
          </div>

          <button
            className="md:hidden p-2 rounded-lg text-charcoal hover:text-navy"
            onClick={() => setOpen(!open)}
            aria-label="Toggle navigation menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-navy-100 bg-white px-4 py-4 space-y-3">
          <Link href="/listings" className="block text-sm font-medium text-charcoal hover:text-navy py-1" onClick={() => setOpen(false)}>
            Find a Geriatrician
          </Link>
          <Link href="/categories/memory-care" className="block text-sm font-medium text-charcoal hover:text-navy py-1" onClick={() => setOpen(false)}>
            Memory Care
          </Link>
          <Link href="/categories/palliative-care" className="block text-sm font-medium text-charcoal hover:text-navy py-1" onClick={() => setOpen(false)}>
            Palliative Care
          </Link>
          <Link href="/submit" className="block text-sm font-medium text-charcoal hover:text-navy py-1" onClick={() => setOpen(false)}>
            Add Your Practice
          </Link>
          <Link
            href="/listings?accepting_new_patients=yes"
            className="btn-primary w-full justify-center mt-2"
            onClick={() => setOpen(false)}
          >
            Accepting New Patients
          </Link>
        </div>
      )}
    </nav>
  )
}
