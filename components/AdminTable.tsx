'use client'

import { useState } from 'react'
import { CheckCircle, XCircle, ExternalLink } from 'lucide-react'
import type { Listing } from '@/lib/types'

interface AdminTableProps {
  listings: Listing[]
}

export default function AdminTable({ listings }: AdminTableProps) {
  const [items, setItems] = useState(listings)
  const [loading, setLoading] = useState<string | null>(null)

  const approve = async (id: string) => {
    setLoading(id)
    const res = await fetch('/api/admin/listings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, action: 'approve' }),
    })
    if (res.ok) {
      setItems((prev) => prev.map((l) => l.id === id ? { ...l, is_approved: true } : l))
    }
    setLoading(null)
  }

  const reject = async (id: string) => {
    setLoading(id)
    const res = await fetch('/api/admin/listings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, action: 'reject' }),
    })
    if (res.ok) {
      setItems((prev) => prev.filter((l) => l.id !== id))
    }
    setLoading(null)
  }

  if (items.length === 0) {
    return (
      <div className="card p-8 text-center text-navy-400">
        No listings to review.
      </div>
    )
  }

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-navy-50 border-b border-navy-100">
              <th className="text-left px-4 py-3 font-semibold text-navy-600 text-xs uppercase tracking-wide">Name</th>
              <th className="text-left px-4 py-3 font-semibold text-navy-600 text-xs uppercase tracking-wide">Location</th>
              <th className="text-left px-4 py-3 font-semibold text-navy-600 text-xs uppercase tracking-wide">Tier</th>
              <th className="text-left px-4 py-3 font-semibold text-navy-600 text-xs uppercase tracking-wide">Source</th>
              <th className="text-left px-4 py-3 font-semibold text-navy-600 text-xs uppercase tracking-wide">Status</th>
              <th className="text-left px-4 py-3 font-semibold text-navy-600 text-xs uppercase tracking-wide">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-navy-50">
            {items.map((listing) => (
              <tr key={listing.id} className="hover:bg-cream transition-colors">
                <td className="px-4 py-3">
                  <div className="font-medium text-navy">{listing.full_name}</div>
                  {listing.credentials && <div className="text-navy-400 text-xs">{listing.credentials}</div>}
                </td>
                <td className="px-4 py-3 text-navy-600">{listing.city}, {listing.state}</td>
                <td className="px-4 py-3">
                  <span className={`badge ${listing.listing_tier === 'featured' ? 'badge-featured' : listing.listing_tier === 'verified' ? 'badge-verified' : 'bg-gray-100 text-gray-600'}`}>
                    {listing.listing_tier}
                  </span>
                </td>
                <td className="px-4 py-3 text-navy-400">{listing.source || '—'}</td>
                <td className="px-4 py-3">
                  <span className={`badge ${listing.is_approved ? 'badge-accepting' : 'bg-amber-50 text-amber-700'}`}>
                    {listing.is_approved ? 'Approved' : 'Pending'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <a
                      href={`/listings/${listing.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 text-navy-400 hover:text-navy rounded"
                      aria-label="View listing"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    {!listing.is_approved && (
                      <button
                        onClick={() => approve(listing.id)}
                        disabled={loading === listing.id}
                        className="p-1.5 text-green-600 hover:text-green-700 rounded disabled:opacity-50"
                        aria-label="Approve listing"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => reject(listing.id)}
                      disabled={loading === listing.id}
                      className="p-1.5 text-red-500 hover:text-red-600 rounded disabled:opacity-50"
                      aria-label="Reject listing"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
