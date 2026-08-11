'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import { US_STATES, CATEGORIES } from '@/lib/types'

export default function FilterSidebar() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const update = useCallback((key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    params.delete('page')
    router.push(`/listings?${params.toString()}`)
  }, [router, searchParams])

  const clear = useCallback(() => {
    router.push('/listings')
  }, [router])

  const currentState = searchParams.get('state') || ''
  const currentSubspecialty = searchParams.get('subspecialty') || ''
  const currentAccepting = searchParams.get('accepting_new_patients') || ''
  const currentTelehealth = searchParams.get('telehealth') || ''
  const currentTier = searchParams.get('tier') || ''

  const hasFilters = currentState || currentSubspecialty || currentAccepting || currentTelehealth || currentTier

  return (
    <aside className="w-full lg:w-64 flex-shrink-0">
      <div className="card p-5 sticky top-24">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display font-semibold text-navy text-sm">Filter Results</h2>
          {hasFilters && (
            <button onClick={clear} className="text-xs text-navy-400 hover:text-navy underline">
              Clear all
            </button>
          )}
        </div>

        {/* State */}
        <div className="mb-5">
          <label className="label">State</label>
          <select
            value={currentState}
            onChange={(e) => update('state', e.target.value)}
            className="input"
          >
            <option value="">All states</option>
            {Object.entries(US_STATES).sort(([, a], [, b]) => a.localeCompare(b)).map(([code, name]) => (
              <option key={code} value={code}>{name}</option>
            ))}
          </select>
        </div>

        {/* Specialty */}
        <div className="mb-5">
          <label className="label">Specialty Area</label>
          <select
            value={currentSubspecialty}
            onChange={(e) => update('subspecialty', e.target.value)}
            className="input"
          >
            <option value="">All specialties</option>
            {CATEGORIES.map((cat) => (
              <option key={cat.subspecialty} value={cat.subspecialty}>{cat.label}</option>
            ))}
          </select>
        </div>

        {/* Accepting new patients */}
        <div className="mb-5">
          <label className="label">Availability</label>
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer text-sm">
              <input
                type="checkbox"
                checked={currentAccepting === 'yes'}
                onChange={(e) => update('accepting_new_patients', e.target.checked ? 'yes' : '')}
                className="w-4 h-4 text-navy rounded border-navy-300"
              />
              <span>Accepting new patients</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-sm">
              <input
                type="checkbox"
                checked={currentTelehealth === 'yes'}
                onChange={(e) => update('telehealth', e.target.checked ? 'yes' : '')}
                className="w-4 h-4 text-navy rounded border-navy-300"
              />
              <span>Telehealth available</span>
            </label>
          </div>
        </div>

        {/* Listing tier */}
        <div className="mb-2">
          <label className="label">Listing Type</label>
          <select
            value={currentTier}
            onChange={(e) => update('tier', e.target.value)}
            className="input"
          >
            <option value="">All listings</option>
            <option value="featured">Featured only</option>
            <option value="verified">Verified only</option>
          </select>
        </div>
      </div>
    </aside>
  )
}
