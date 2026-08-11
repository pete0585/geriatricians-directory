'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { CheckCircle, Mail, Loader2, AlertCircle } from 'lucide-react'
import type { Listing } from '@/lib/types'
import { formatCredentials } from '@/lib/utils'

interface ClaimFlowProps {
  listing: Listing
  token: string
}

export default function ClaimFlow({ listing, token }: ClaimFlowProps) {
  const [email, setEmail] = useState('')
  const [step, setStep] = useState<'email' | 'sent' | 'verified' | 'error'>('email')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  // Auto-verify if token present in URL
  useEffect(() => {
    if (!token) return
    setLoading(true)
    fetch(`/api/claim/verify?token=${encodeURIComponent(token)}&id=${listing.id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setStep('verified')
        else { setErrorMsg(data.error || 'Verification failed.'); setStep('error') }
      })
      .catch(() => { setErrorMsg('Network error. Please try again.'); setStep('error') })
      .finally(() => setLoading(false))
  }, [token, listing.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    setErrorMsg('')
    const res = await fetch('/api/claim', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ listingId: listing.id, email }),
    })
    const data = await res.json()
    setLoading(false)
    if (res.ok) {
      setStep('sent')
    } else {
      setErrorMsg(data.error || 'Something went wrong.')
    }
  }

  const name = formatCredentials(listing.full_name, listing.credentials)

  if (loading && token) {
    return (
      <div className="card p-8 text-center">
        <Loader2 className="w-10 h-10 text-navy animate-spin mx-auto mb-4" aria-label="loading" />
        <p className="text-navy-500">Verifying your claim...</p>
      </div>
    )
  }

  if (step === 'verified') {
    return (
      <div className="card p-8 text-center">
        <CheckCircle className="w-12 h-12 text-sage mx-auto mb-4" aria-label="success" />
        <h1 className="font-display font-bold text-navy text-2xl mb-2">Listing Claimed!</h1>
        <p className="text-navy-500 text-sm mb-6">
          You&apos;ve successfully verified and claimed your listing for <strong>{name}</strong>.
          Log in to complete your profile and add your photo, bio, and subspecialties.
        </p>
        <Link href={`/listings/${listing.slug}`} className="btn-primary">
          View Your Listing
        </Link>
      </div>
    )
  }

  if (step === 'error') {
    return (
      <div className="card p-8 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" aria-label="error" />
        <h1 className="font-display font-bold text-navy text-xl mb-2">Verification Failed</h1>
        <p className="text-navy-500 text-sm mb-4">{errorMsg}</p>
        <p className="text-navy-400 text-xs mb-6">The link may have expired (links are valid for 72 hours). Try claiming again below.</p>
        <button onClick={() => setStep('email')} className="btn-secondary">
          Try Again
        </button>
      </div>
    )
  }

  if (step === 'sent') {
    return (
      <div className="card p-8 text-center">
        <Mail className="w-12 h-12 text-navy mx-auto mb-4" aria-label="email sent" />
        <h1 className="font-display font-bold text-navy text-2xl mb-2">Check Your Email</h1>
        <p className="text-navy-500 text-sm mb-2">
          We sent a verification link to <strong>{email}</strong>.
        </p>
        <p className="text-navy-400 text-xs">
          Click the link in the email to verify and claim your listing. The link expires in 72 hours.
        </p>
      </div>
    )
  }

  return (
    <div className="card p-8">
      <h1 className="font-display font-bold text-navy text-2xl mb-2">Claim Your Listing</h1>
      <p className="text-navy-500 text-sm mb-6">
        You&apos;re claiming the listing for <strong>{name}</strong> in {listing.city}, {listing.state}.
        Enter your practice email to receive a verification link.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label" htmlFor="claim-email">Practice Email Address</label>
          <input
            id="claim-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
            placeholder="dr.smith@yourpractice.com"
            required
          />
          <p className="text-xs text-navy-400 mt-1">
            Use your professional email. We&apos;ll send a verification link — no password required.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg">{errorMsg}</div>
        )}

        <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
          {loading ? (
            <><Loader2 className="w-4 h-4 animate-spin" aria-label="loading" /> Sending...</>
          ) : (
            'Send Verification Link'
          )}
        </button>
      </form>

      <div className="mt-6 p-4 bg-navy-50 rounded-lg text-xs text-navy-500">
        <strong>Claim is free.</strong> After claiming, you can add your photo, bio, subspecialty tags,
        and insurance accepted. Upgrade to Verified ($99/yr) to display your contact info and get priority placement.
      </div>
    </div>
  )
}
