'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/admin`,
      },
    })
    if (error) setError(error.message)
    else setSent(true)
  }

  if (sent) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center p-4">
        <div className="card p-8 max-w-sm w-full text-center">
          <h1 className="font-display font-bold text-navy text-xl mb-2">Check Your Email</h1>
          <p className="text-navy-500 text-sm">We sent a magic link to <strong>{email}</strong>. Click it to sign in to admin.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-4">
      <div className="card p-8 max-w-sm w-full">
        <h1 className="font-display font-bold text-navy text-xl mb-6">Admin Login</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="label" htmlFor="admin-email">Email</label>
            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              placeholder="admin@geriatriciandirectory.com"
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" className="btn-primary w-full justify-center">
            Send Magic Link
          </button>
        </form>
      </div>
    </div>
  )
}
