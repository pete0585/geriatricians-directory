'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, Stethoscope } from 'lucide-react'

export default function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-ivory-200 bg-white/95 backdrop-blur-sm">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sage-100 group-hover:bg-sage-200 transition-colors">
              <Stethoscope className="h-4 w-4 text-sage fill-sage" />
            </div>
            <span className="font-serif text-lg font-bold text-charcoal-700">
              Geriatrician<span className="text-sage">Directory</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/listings" className="text-sm font-medium text-charcoal-400 hover:text-charcoal-700 transition-colors">
              Find a Geriatrician
            </Link>
            <Link href="/resources/what-is-a-geriatrician" className="text-sm font-medium text-charcoal-400 hover:text-charcoal-700 transition-colors">
              What is a Geriatrician?
            </Link>
            <Link href="/submit" className="text-sm font-medium text-charcoal-400 hover:text-charcoal-700 transition-colors">
              List Your Practice
            </Link>
            <Link href="/submit" className="btn-primary py-2 text-xs">
              Get Listed Free
            </Link>
          </div>

          <button
            className="md:hidden p-2 rounded-lg text-charcoal-400 hover:bg-ivory-100"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-ivory-200 py-4 space-y-1">
            <Link href="/listings" className="block px-4 py-2.5 text-sm font-medium text-charcoal-600 hover:bg-ivory-100 rounded-lg" onClick={() => setMobileOpen(false)}>
              Find a Geriatrician
            </Link>
            <Link href="/resources/what-is-a-geriatrician" className="block px-4 py-2.5 text-sm font-medium text-charcoal-600 hover:bg-ivory-100 rounded-lg" onClick={() => setMobileOpen(false)}>
              What is a Geriatrician?
            </Link>
            <Link href="/submit" className="block px-4 py-2.5 text-sm font-medium text-charcoal-600 hover:bg-ivory-100 rounded-lg" onClick={() => setMobileOpen(false)}>
              List Your Practice
            </Link>
            <div className="px-4 pt-2">
              <Link href="/submit" className="btn-primary w-full text-center">Get Listed Free</Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
