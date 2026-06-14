'use client'

import { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import { CheckCircle, Loader2, ShieldCheck, Star } from 'lucide-react'
import Link from 'next/link'

type Step = 'email' | 'verifying' | 'upgrade' | 'error'

export default function ClaimPage() {
  const params = useParams<{ id: string }>()
  const searchParams = useSearchParams()
  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [listingName, setListingName] = useState<string>('')

  useEffect(() => {
    if (searchParams.get('verified') === 'true') setStep('upgrade')
  }, [searchParams])

  async function sendClaimEmail(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listingId: params.id, email }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Failed to send claim email')
      setListingName(data.listingName ?? 'your listing')
      setStep('verifying')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setStep('error')
    } finally {
      setLoading(false)
    }
  }

  async function upgradeToTier(tier: 'pro' | 'verified') {
    setLoading(true)
    try {
      const res = await fetch('/api/upgrade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listingId: params.id, tier }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Failed to create checkout session')
      if (data.url) window.location.href = data.url
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start checkout.')
    } finally {
      setLoading(false)
    }
  }

  if (step === 'verifying') {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-sage-100 mx-auto mb-5">
          <CheckCircle className="h-8 w-8 text-sage-500" />
        </div>
        <h1 className="font-serif text-2xl font-bold text-charcoal-800 mb-3">Check your email</h1>
        <p className="text-charcoal-500">
          We sent a verification link to <strong>{email}</strong>. Click it to confirm you own{' '}
          <strong>{listingName}</strong>. The link expires in 30 days.
        </p>
        <p className="mt-4 text-sm text-charcoal-400">
          Didn&apos;t get it?{' '}
          <button onClick={() => setStep('email')} className="text-sage-500 hover:text-sage-600 font-medium">
            Try a different email
          </button>
        </p>
      </div>
    )
  }

  if (step === 'upgrade') {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16">
        <div className="text-center mb-10">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-sage-100 mx-auto mb-5">
            <CheckCircle className="h-8 w-8 text-sage-500" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-charcoal-800 mb-2">Listing claimed!</h1>
          <p className="text-charcoal-500">Your listing is live. Upgrade to show your full profile and attract more patients.</p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="card p-6 border border-sage-200">
            <div className="flex items-center gap-2 mb-3">
              <Star className="h-5 w-5 text-sage-500" />
              <span className="font-semibold text-charcoal-700">Pro Listing</span>
            </div>
            <p className="font-serif text-3xl font-bold text-charcoal-800 mb-1">$79<span className="text-base font-normal text-charcoal-400">/year</span></p>
            <p className="text-sm text-charcoal-500 mb-4">Photo, bio, specialties, contact form, priority placement.</p>
            <button onClick={() => upgradeToTier('pro')} disabled={loading} className="btn-primary w-full">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Upgrade to Pro'}
            </button>
          </div>

          <div className="card p-6 border-2 border-rose-200 bg-rose-50/50">
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="h-5 w-5 text-rose-400" />
              <span className="font-semibold text-charcoal-700">Verified Specialist</span>
            </div>
            <p className="font-serif text-3xl font-bold text-charcoal-800 mb-1">$129<span className="text-base font-normal text-charcoal-400">/year</span></p>
            <p className="text-sm text-charcoal-500 mb-4">Everything in Pro + credential verification, top placement.</p>
            <button onClick={() => upgradeToTier('verified')} disabled={loading} className="btn-rose w-full">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Get Verified'}
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-xl bg-red-50 border border-red-200 p-3 text-sm text-red-600 text-center">{error}</div>
        )}

        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-charcoal-400 hover:text-charcoal-600">
            Skip for now — keep my free listing
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-md px-4 py-20">
      <h1 className="font-serif text-3xl font-bold text-charcoal-800 mb-3">Claim Your Listing</h1>
      <p className="text-charcoal-500 mb-8">
        Enter your practice email. We&apos;ll send a verification link to confirm you own this listing.
      </p>

      <form onSubmit={sendClaimEmail} className="space-y-4">
        <div>
          <label className="label">Practice Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input"
            placeholder="dr@yourpractice.com"
            disabled={loading}
          />
        </div>

        {error && (
          <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-sm text-red-600">{error}</div>
        )}

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? <><Loader2 className="h-4 w-4 animate-spin" />Sending…</> : 'Send Claim Link'}
        </button>
      </form>
    </div>
  )
}
