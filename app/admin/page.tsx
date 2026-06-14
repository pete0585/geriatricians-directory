import type { Metadata } from 'next'
import { createServiceClient } from '@/lib/supabase/server'
import AdminTable from '@/components/AdminTable'
import { Users, CheckCircle, Clock, DollarSign } from 'lucide-react'

export const metadata: Metadata = { title: 'Admin Dashboard' }

interface Props {
  searchParams: Promise<{ tab?: string }>
}

export default async function AdminPage({ searchParams }: Props) {
  const { tab = 'pending' } = await searchParams
  const supabase = await createServiceClient()

  const [pendingRes, activeRes, paidRes, totalRes] = await Promise.all([
    supabase.from('geriatricians_listings').select('*').eq('status', 'pending').order('created_at', { ascending: false }),
    supabase.from('geriatricians_listings').select('*').eq('status', 'active').order('created_at', { ascending: false }).limit(50),
    supabase.from('geriatricians_listings').select('id', { count: 'exact' }).in('plan_tier', ['pro', 'verified']),
    supabase.from('geriatricians_listings').select('id', { count: 'exact' }),
  ])

  const stats = [
    { label: 'Total Listings', value: totalRes.count ?? 0, icon: Users, color: 'bg-sage-100 text-sage-600' },
    { label: 'Active', value: activeRes.data?.length ?? 0, icon: CheckCircle, color: 'bg-green-50 text-green-600' },
    { label: 'Pending Review', value: pendingRes.data?.length ?? 0, icon: Clock, color: 'bg-amber-50 text-amber-600' },
    { label: 'Paid Listings', value: paidRes.count ?? 0, icon: DollarSign, color: 'bg-rose-50 text-rose-500' },
  ]

  const listings = tab === 'active' ? (activeRes.data ?? []) : (pendingRes.data ?? [])

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-charcoal-800 mb-6">Dashboard</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="card p-5">
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-charcoal-800">{stat.value}</p>
                <p className="text-xs text-charcoal-400">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2 mb-5">
        {[
          { id: 'pending', label: `Pending (${pendingRes.data?.length ?? 0})` },
          { id: 'active', label: 'Active' },
        ].map((t) => (
          <a key={t.id} href={`?tab=${t.id}`}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${tab === t.id ? 'bg-charcoal-700 text-white' : 'bg-white text-charcoal-500 hover:bg-ivory-100'}`}
          >
            {t.label}
          </a>
        ))}
      </div>
      <AdminTable listings={listings as Parameters<typeof AdminTable>[0]['listings']} type={tab === 'active' ? 'active' : 'pending'} />
    </div>
  )
}
