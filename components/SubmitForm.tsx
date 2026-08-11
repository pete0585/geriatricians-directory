'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CheckCircle } from 'lucide-react'
import { US_STATES } from '@/lib/types'

const schema = z.object({
  full_name: z.string().min(2, 'Full name is required'),
  credentials: z.string().optional(),
  practice_name: z.string().optional(),
  email: z.string().email('Valid email required'),
  phone: z.string().optional(),
  website: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  address_line1: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  state: z.string().length(2, 'Select a state'),
  zip: z.string().optional(),
  bio: z.string().max(1000).optional(),
  npi: z.string().optional(),
  is_accepting_new_patients: z.boolean().optional(),
  offers_telehealth: z.boolean().optional(),
})

type FormData = z.infer<typeof schema>

export default function SubmitForm() {
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setError(null)
    const res = await fetch('/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (res.ok) {
      setSubmitted(true)
    } else {
      const body = await res.json().catch(() => ({}))
      setError(body.error || 'Something went wrong. Please try again.')
    }
  }

  if (submitted) {
    return (
      <div className="card p-8 text-center max-w-lg mx-auto">
        <CheckCircle className="w-12 h-12 text-sage mx-auto mb-4" aria-label="success" />
        <h2 className="font-display font-bold text-navy text-xl mb-2">Listing Submitted!</h2>
        <p className="text-navy-500 text-sm">
          Your listing is under review and will be live within 24 hours. You&#39;ll receive an email when it&#39;s approved.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="card p-6 space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="label">Full Name *</label>
          <input {...register('full_name')} className="input" placeholder="Dr. Jane Smith" />
          {errors.full_name && <p className="text-red-500 text-xs mt-1">{errors.full_name.message}</p>}
        </div>
        <div>
          <label className="label">Credentials</label>
          <input {...register('credentials')} className="input" placeholder="MD, DO, MBBS" />
        </div>
      </div>

      <div>
        <label className="label">Practice / Organization Name</label>
        <input {...register('practice_name')} className="input" placeholder="Senior Health Associates" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="label">Email Address *</label>
          <input {...register('email')} type="email" className="input" placeholder="dr.smith@practice.com" />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>
        <div>
          <label className="label">Phone</label>
          <input {...register('phone')} className="input" placeholder="(555) 123-4567" />
        </div>
      </div>

      <div>
        <label className="label">Website</label>
        <input {...register('website')} type="url" className="input" placeholder="https://yourpractice.com" />
        {errors.website && <p className="text-red-500 text-xs mt-1">{errors.website.message}</p>}
      </div>

      <div>
        <label className="label">Practice Address</label>
        <input {...register('address_line1')} className="input" placeholder="123 Medical Center Dr" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="sm:col-span-2">
          <label className="label">City *</label>
          <input {...register('city')} className="input" placeholder="Miami" />
          {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
        </div>
        <div>
          <label className="label">State *</label>
          <select {...register('state')} className="input">
            <option value="">Select</option>
            {Object.entries(US_STATES).sort(([, a], [, b]) => a.localeCompare(b)).map(([code, name]) => (
              <option key={code} value={code}>{code} — {name}</option>
            ))}
          </select>
          {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state.message}</p>}
        </div>
        <div>
          <label className="label">ZIP</label>
          <input {...register('zip')} className="input" placeholder="33101" maxLength={10} />
        </div>
      </div>

      <div>
        <label className="label">NPI Number</label>
        <input {...register('npi')} className="input" placeholder="1234567890" maxLength={10} />
        <p className="text-xs text-navy-400 mt-1">Your NPI from the CMS registry (optional but recommended)</p>
      </div>

      <div>
        <label className="label">Professional Bio</label>
        <textarea
          {...register('bio')}
          className="input h-28 resize-none"
          placeholder="Describe your geriatric medicine practice, areas of expertise, and approach to senior care..."
        />
      </div>

      <div className="space-y-2">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" {...register('is_accepting_new_patients')} className="w-4 h-4 text-navy rounded border-navy-300" />
          <span className="text-sm">Currently accepting new patients</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" {...register('offers_telehealth')} className="w-4 h-4 text-navy rounded border-navy-300" />
          <span className="text-sm">Offer telehealth / virtual visits</span>
        </label>
      </div>

      {error && (
        <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg">{error}</div>
      )}

      <button type="submit" disabled={isSubmitting} className="btn-primary w-full justify-center">
        {isSubmitting ? 'Submitting...' : 'Submit Your Listing'}
      </button>

      <p className="text-xs text-center text-navy-400">
        Listings are reviewed within 24 hours. Submitting is free — no credit card required.
      </p>
    </form>
  )
}
