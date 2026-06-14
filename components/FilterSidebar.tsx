'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import { X, SlidersHorizontal } from 'lucide-react'
import { SPECIALTIES, INSURANCE_OPTIONS, US_STATES } from '@/types'

interface FilterSidebarProps {
  onClose?: () => void
  mobile?: boolean
}

export default function FilterSidebar({ onClose, mobile = false }: FilterSidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const updateFilter = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value === null || value === '') {
        params.delete(key)
      } else {
        params.set(key, value)
      }
      params.delete('page')
      router.push(`${pathname}?${params.toString()}`)
    },
    [router, pathname, searchParams],
  )

  const clearAll = useCallback(() => {
    router.push(pathname)
  }, [router, pathname])

  const hasFilters = ['state', 'specialty', 'insurance', 'visitType', 'telehealth', 'acceptingNew', 'tier'].some(
    (k) => searchParams.has(k),
  )

  return (
    <div className={mobile ? 'p-4' : 'sticky top-20'}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-charcoal-400" />
          <span className="text-sm font-semibold text-charcoal-700">Filter Results</span>
        </div>
        <div className="flex gap-2">
          {hasFilters && (
            <button onClick={clearAll} className="text-xs text-sage-500 hover:text-sage-600 font-medium">
              Clear all
            </button>
          )}
          {onClose && (
            <button onClick={onClose} className="text-charcoal-400 hover:text-charcoal-600">
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      <div className="space-y-6">
        {/* State */}
        <div>
          <label className="label">State</label>
          <select
            value={searchParams.get('state') ?? ''}
            onChange={(e) => updateFilter('state', e.target.value || null)}
            className="input text-sm"
          >
            <option value="">All states</option>
            {US_STATES.map((s) => (
              <option key={s.abbr} value={s.abbr}>{s.name}</option>
            ))}
          </select>
        </div>

        {/* Telehealth toggle */}
        <div>
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="checkbox"
              checked={searchParams.get('telehealth') === 'true'}
              onChange={(e) => updateFilter('telehealth', e.target.checked ? 'true' : null)}
              className="h-4 w-4 rounded border-ivory-300 text-sage focus:ring-sage-200"
            />
            <span className="text-sm font-semibold text-charcoal-700 group-hover:text-charcoal-800">
              Telehealth available
            </span>
          </label>
        </div>

        {/* Accepting new patients */}
        <div>
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="checkbox"
              checked={searchParams.get('acceptingNew') === 'true'}
              onChange={(e) => updateFilter('acceptingNew', e.target.checked ? 'true' : null)}
              className="h-4 w-4 rounded border-ivory-300 text-sage focus:ring-sage-200"
            />
            <span className="text-sm font-semibold text-charcoal-700 group-hover:text-charcoal-800">
              Accepting new patients
            </span>
          </label>
        </div>

        {/* Insurance */}
        <div>
          <label className="label">Insurance Accepted</label>
          <select
            value={searchParams.get('insurance') ?? ''}
            onChange={(e) => updateFilter('insurance', e.target.value || null)}
            className="input text-sm"
          >
            <option value="">Any insurance</option>
            {INSURANCE_OPTIONS.map((ins) => (
              <option key={ins} value={ins}>{ins}</option>
            ))}
          </select>
        </div>

        {/* Specialty */}
        <div>
          <label className="label">Specialty</label>
          <select
            value={searchParams.get('specialty') ?? ''}
            onChange={(e) => updateFilter('specialty', e.target.value || null)}
            className="input text-sm"
          >
            <option value="">All specialties</option>
            {SPECIALTIES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Visit Type */}
        <div>
          <label className="label">Visit Type</label>
          <div className="space-y-2">
            {[
              { value: 'home', label: 'Home visits' },
              { value: 'office', label: 'In-office' },
              { value: 'virtual', label: 'Virtual / Telehealth' },
            ].map((opt) => (
              <label key={opt.value} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={searchParams.get('visitType') === opt.value}
                  onChange={(e) => updateFilter('visitType', e.target.checked ? opt.value : null)}
                  className="h-4 w-4 rounded border-ivory-300 text-sage focus:ring-sage-200"
                />
                <span className="text-sm text-charcoal-600 group-hover:text-charcoal-800">{opt.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Listing tier */}
        <div>
          <label className="label">Listing Type</label>
          <div className="space-y-2">
            {[
              { value: 'verified', label: '✓ Verified specialist' },
              { value: 'pro', label: '★ Pro listing' },
            ].map((opt) => (
              <label key={opt.value} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={searchParams.get('tier') === opt.value}
                  onChange={(e) => updateFilter('tier', e.target.checked ? opt.value : null)}
                  className="h-4 w-4 rounded border-ivory-300 text-sage focus:ring-sage-200"
                />
                <span className="text-sm text-charcoal-600 group-hover:text-charcoal-800">{opt.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
