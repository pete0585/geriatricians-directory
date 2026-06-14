'use client'

import { useState } from 'react'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'
import type { Listing } from '@/types'

interface AdminTableProps {
  listings: Listing[]
  type: 'pending' | 'active'
}

export default function AdminTable({ listings, type }: AdminTableProps) {
  const [loading, setLoading] = useState<string | null>(null)
  const [updated, setUpdated] = useState<Set<string>>(new Set())

  async function updateListing(id: string, updates: Record<string, unknown>) {
    setLoading(id)
    try {
      const res = await fetch(`/api/admin/listing/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })
      if (res.ok) {
        setUpdated((prev) => new Set([...prev, id]))
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(null)
    }
  }

  if (listings.length === 0) {
    return <p className="text-charcoal-400 text-sm py-8 text-center">No listings in this category.</p>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-ivory-200 text-left">
            <th className="pb-3 pr-4 font-semibold text-charcoal-600">Name</th>
            <th className="pb-3 pr-4 font-semibold text-charcoal-600">Location</th>
            <th className="pb-3 pr-4 font-semibold text-charcoal-600">Email</th>
            <th className="pb-3 pr-4 font-semibold text-charcoal-600">Tier</th>
            <th className="pb-3 font-semibold text-charcoal-600">Actions</th>
          </tr>
        </thead>
        <tbody>
          {listings.map((listing) => (
            <tr key={listing.id} className={`border-b border-ivory-100 ${updated.has(listing.id) ? 'opacity-50' : ''}`}>
              <td className="py-3 pr-4">
                <p className="font-medium text-charcoal-700">{listing.name}</p>
                <p className="text-xs text-charcoal-400">{(listing.credentials ?? []).join(', ')}</p>
              </td>
              <td className="py-3 pr-4 text-charcoal-600">{listing.city}, {listing.state}</td>
              <td className="py-3 pr-4 text-charcoal-500">{listing.email ?? '—'}</td>
              <td className="py-3 pr-4">
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${listing.plan_tier === 'verified' ? 'bg-rose-50 text-rose-500' : listing.plan_tier === 'pro' ? 'bg-sage-100 text-sage-600' : 'bg-ivory-200 text-charcoal-400'}`}>
                  {listing.plan_tier}
                </span>
              </td>
              <td className="py-3">
                <div className="flex gap-2">
                  {type === 'pending' && (
                    <button
                      onClick={() => updateListing(listing.id, { status: 'active' })}
                      disabled={loading === listing.id}
                      className="flex items-center gap-1 rounded-lg bg-green-50 px-2 py-1 text-xs font-medium text-green-600 hover:bg-green-100 disabled:opacity-50"
                    >
                      {loading === listing.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <CheckCircle className="h-3 w-3" />}
                      Approve
                    </button>
                  )}
                  {type === 'active' && (
                    <button
                      onClick={() => updateListing(listing.id, { status: 'suspended' })}
                      disabled={loading === listing.id}
                      className="flex items-center gap-1 rounded-lg bg-red-50 px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-100 disabled:opacity-50"
                    >
                      {loading === listing.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <XCircle className="h-3 w-3" />}
                      Suspend
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
