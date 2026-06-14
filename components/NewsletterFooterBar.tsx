'use client'

import { useState, useEffect } from 'react'

const DISMISSED_KEY = 'geriatrician_footer_dismissed'

export default function NewsletterFooterBar() {
  const [dismissed, setDismissed] = useState(true)
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  useEffect(() => {
    const isDismissed = localStorage.getItem(DISMISSED_KEY) === 'true'
    if (!isDismissed) {
      const timer = setTimeout(() => setDismissed(false), 1500)
      return () => clearTimeout(timer)
    }
  }, [])

  function dismiss() {
    localStorage.setItem(DISMISSED_KEY, 'true')
    setDismissed(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || status === 'loading') return
    setStatus('loading')
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      setStatus(res.ok ? 'success' : 'error')
    } catch {
      setStatus('error')
    }
  }

  if (dismissed) return null

  return (
    <div
      role="complementary"
      aria-label="Newsletter signup"
      className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-ivory-200 shadow-[0_-4px_24px_rgba(61,53,53,0.10)]"
    >
      <div className="max-w-4xl mx-auto px-4 py-3 sm:py-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
        <button
          onClick={dismiss}
          aria-label="Dismiss"
          className="absolute top-2 right-3 text-charcoal-300 hover:text-charcoal-500 text-lg leading-none transition-colors"
        >
          ×
        </button>
        <div className="flex-1 min-w-0">
          <p className="font-serif font-semibold text-charcoal-700 text-sm sm:text-base leading-tight">
            Caregiver tips from geriatric specialists
          </p>
          <p className="text-charcoal-400 text-xs sm:text-sm mt-0.5">
            Plus new geriatricians near you. No spam, ever.
          </p>
        </div>
        {status === 'success' ? (
          <p className="text-sage-500 font-semibold text-sm shrink-0">You&apos;re in! First email coming soon.</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
              disabled={status === 'loading'}
              className="flex-1 sm:w-52 rounded-full border border-ivory-300 bg-ivory-50 px-4 py-2 text-sm text-charcoal placeholder:text-charcoal-300 focus:border-sage focus:outline-none focus:ring-2 focus:ring-sage-100 disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="shrink-0 rounded-full bg-sage px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-sage-400 disabled:opacity-60"
            >
              {status === 'loading' ? 'Sending…' : 'Subscribe'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
