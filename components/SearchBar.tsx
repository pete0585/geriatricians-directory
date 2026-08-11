'use client'

import { useState, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, MapPin } from 'lucide-react'

interface SearchBarProps {
  placeholder?: string
  className?: string
}

export default function SearchBar({ placeholder = 'Search by name, city, or state...', className = '' }: SearchBarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [q, setQ] = useState(searchParams.get('q') || '')
  const [state, setState] = useState(searchParams.get('state') || '')

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (q.trim()) params.set('q', q.trim())
    if (state.trim()) params.set('state', state.trim().toUpperCase())
    router.push(`/listings?${params.toString()}`)
  }, [q, state, router])

  return (
    <form onSubmit={handleSearch} className={`flex flex-col sm:flex-row gap-3 ${className}`}>
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400" aria-label="search icon" />
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-3 border border-navy-200 rounded-lg text-charcoal placeholder-navy-400 focus:outline-none focus:ring-2 focus:ring-navy-300 focus:border-transparent bg-white text-sm"
        />
      </div>
      <div className="relative sm:w-48">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400" aria-label="location icon" />
        <input
          type="text"
          value={state}
          onChange={(e) => setState(e.target.value)}
          placeholder="State (e.g. FL)"
          maxLength={2}
          className="w-full pl-10 pr-4 py-3 border border-navy-200 rounded-lg text-charcoal placeholder-navy-400 focus:outline-none focus:ring-2 focus:ring-navy-300 focus:border-transparent bg-white text-sm uppercase"
        />
      </div>
      <button type="submit" className="btn-primary px-6 py-3 text-sm whitespace-nowrap">
        Search
      </button>
    </form>
  )
}
