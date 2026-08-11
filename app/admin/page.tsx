import { getAllListingsAdmin, getTotalCount } from '@/lib/data'
import AdminTable from '@/components/AdminTable'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const [listings, total] = await Promise.all([
    getAllListingsAdmin(),
    getTotalCount(),
  ])

  const pending = listings.filter((l) => !l.is_approved)
  const claimed = listings.filter((l) => l.claimed_at).length
  const verified = listings.filter((l) => l.listing_tier === 'verified' || l.listing_tier === 'featured').length

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display font-bold text-navy text-2xl mb-6">Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Listings', value: total.toLocaleString() },
            { label: 'Pending Review', value: pending.length },
            { label: 'Claimed', value: claimed },
            { label: 'Paid (Verified+)', value: verified },
          ].map(({ label, value }) => (
            <div key={label} className="card p-5 text-center">
              <div className="font-display font-bold text-navy text-2xl">{value}</div>
              <div className="text-xs text-navy-400 mt-1">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {pending.length > 0 && (
        <div>
          <h2 className="font-display font-bold text-navy text-xl mb-4">Pending Review ({pending.length})</h2>
          <AdminTable listings={pending} />
        </div>
      )}

      <div>
        <h2 className="font-display font-bold text-navy text-xl mb-4">All Listings (Recent 200)</h2>
        <AdminTable listings={listings} />
      </div>
    </div>
  )
}
