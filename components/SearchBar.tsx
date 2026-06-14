'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Search, MapPin, Loader2 } from 'lucide-react'

interface SearchBarProps {
  defaultLocation?: string
  defaultQuery?: string
  size?: 'default' | 'large'
  className?: string
}

interface ZipResult {
  city: string
  state: string
  state_abbr: string
  lat: number
  lng: number
}

export default function SearchBar({
  defaultLocation = '',
  defaultQuery = '',
  size = 'default',
  className = '',
}: SearchBarProps) {
  const [location, setLocation] = useState(defaultLocation)
  const [query, setQuery] = useState(defaultQuery)
  const [resolvedCity, setResolvedCity] = useState<string | undefined>()
  const [resolvedState, setResolvedState] = useState<string | undefined>()
  const [zipLoading, setZipLoading] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const router = useRouter()

  async function resolveZip(value: string) {
    if (!/^\d{5}$/.test(value)) return
    setZipLoading(true)
    try {
      const res = await fetch(`/api/geocode/zip?zip=${value}`)
      if (!res.ok) return
      const data: ZipResult = await res.json()
      setLocation(`${data.city}, ${data.state_abbr}`)
      setResolvedCity(data.city)
      setResolvedState(data.state_abbr)
    } catch {
      // silently ignore
    } finally {
      setZipLoading(false)
    }
  }

  function handleLocationChange(value: string) {
    setLocation(value)
    setResolvedCity(undefined)
    setResolvedState(undefined)
    if (/^\d{5}$/.test(value)) {
      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => resolveZip(value), 400)
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams()
    if (resolvedCity) params.set('city', resolvedCity)
    if (resolvedState) params.set('state', resolvedState)
    else if (location.trim()) params.set('location', location.trim())
    if (query.trim()) params.set('q', query.trim())
    router.push(`/listings?${params.toString()}`)
  }

  const isLarge = size === 'large'

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex flex-col sm:flex-row gap-2 ${isLarge ? 'w-full max-w-2xl' : 'w-full max-w-xl'} ${className}`}
    >
      <div className={`relative flex-1 ${isLarge ? 'sm:flex-[2]' : ''}`}>
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-300" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Memory care, fall prevention, dementia…"
          className={`w-full rounded-xl border border-ivory-300 bg-white pl-10 pr-4 text-sm text-charcoal placeholder:text-charcoal-300 focus:border-sage focus:outline-none focus:ring-2 focus:ring-sage-100 ${isLarge ? 'py-4' : 'py-3'}`}
        />
      </div>

      <div className="relative flex-1">
        {zipLoading ? (
          <Loader2 className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-sage-400 animate-spin" />
        ) : (
          <MapPin className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-300" />
        )}
        <input
          type="text"
          value={location}
          onChange={(e) => handleLocationChange(e.target.value)}
          placeholder="City, state, or zip…"
          className={`w-full rounded-xl border border-ivory-300 bg-white pl-10 pr-4 text-sm text-charcoal placeholder:text-charcoal-300 focus:border-sage focus:outline-none focus:ring-2 focus:ring-sage-100 ${isLarge ? 'py-4' : 'py-3'}`}
        />
      </div>

      <button type="submit" className={`btn-primary shrink-0 ${isLarge ? 'px-8 py-4 text-base' : 'px-6 py-3'}`}>
        Find a Geriatrician
      </button>
    </form>
  )
}
