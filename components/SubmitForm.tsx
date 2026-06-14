'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CheckCircle, Loader2 } from 'lucide-react'
import { SPECIALTIES, INSURANCE_OPTIONS, US_STATES, VISIT_TYPES } from '@/types'

const schema = z.object({
  name: z.string().min(2, 'Full name is required'),
  credentials: z.string().min(1, 'Credentials are required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().length(2, 'Select a state'),
  zip: z.string().optional(),
  phone: z.string().optional(),
  website: z.string().url('Enter a valid URL').optional().or(z.literal('')),
  email: z.string().email('Enter a valid email'),
  telehealth: z.boolean().default(false),
  accepting_new_clients: z.boolean().default(true),
  visit_types: z.array(z.string()).optional(),
  insurance_accepted: z.array(z.string()).optional(),
  specialties: z.array(z.string()).optional(),
  bio: z.string().max(2000, 'Bio must be 2000 characters or less').optional(),
  languages: z.string().optional(),
})

type FormData = z.infer<typeof schema>

export default function SubmitForm() {
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      telehealth: false,
      accepting_new_clients: true,
      visit_types: [],
      insurance_accepted: [],
      specialties: [],
    },
  })

  async function onSubmit(data: FormData) {
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const body = await res.json()
        throw new Error(body.error ?? 'Submission failed')
      }
      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-sage-100 mb-4">
          <CheckCircle className="h-8 w-8 text-sage-500" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-charcoal-700">You&apos;re listed!</h2>
        <p className="mt-3 text-charcoal-500 max-w-sm">
          Your listing has been submitted and is under review. You&apos;ll receive an email once it&apos;s live.
          Look out for a claim link so you can add your full profile.
        </p>
      </div>
    )
  }

  const visitTypesValue = watch('visit_types') ?? []
  const insuranceValue = watch('insurance_accepted') ?? []
  const specialtiesValue = watch('specialties') ?? []

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div>
        <h2 className="font-serif text-xl font-semibold text-charcoal-700 mb-4">Your Information</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="label">Full Name *</label>
            <input {...register('name')} className="input" placeholder="Dr. Sarah Johnson" />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
          </div>
          <div>
            <label className="label">Credentials *</label>
            <input {...register('credentials')} className="input" placeholder="MD, FAAGS" />
            {errors.credentials && <p className="mt-1 text-xs text-red-500">{errors.credentials.message}</p>}
          </div>
          <div>
            <label className="label">Email Address * <span className="font-normal text-charcoal-300">(not shown publicly)</span></label>
            <input {...register('email')} type="email" className="input" placeholder="dr@yourpractice.com" />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
          </div>
          <div>
            <label className="label">Phone <span className="font-normal text-charcoal-300">(optional)</span></label>
            <input {...register('phone')} type="tel" className="input" placeholder="(555) 123-4567" />
          </div>
          <div>
            <label className="label">Website <span className="font-normal text-charcoal-300">(optional)</span></label>
            <input {...register('website')} type="url" className="input" placeholder="https://yourpractice.com" />
            {errors.website && <p className="mt-1 text-xs text-red-500">{errors.website.message}</p>}
          </div>
        </div>
      </div>

      <div>
        <h2 className="font-serif text-xl font-semibold text-charcoal-700 mb-4">Location</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="sm:col-span-1">
            <label className="label">City *</label>
            <input {...register('city')} className="input" placeholder="Miami" />
            {errors.city && <p className="mt-1 text-xs text-red-500">{errors.city.message}</p>}
          </div>
          <div>
            <label className="label">State *</label>
            <select {...register('state')} className="input">
              <option value="">Select state</option>
              {US_STATES.map((s) => <option key={s.abbr} value={s.abbr}>{s.name}</option>)}
            </select>
            {errors.state && <p className="mt-1 text-xs text-red-500">{errors.state.message}</p>}
          </div>
          <div>
            <label className="label">ZIP Code</label>
            <input {...register('zip')} className="input" placeholder="33101" />
          </div>
        </div>
      </div>

      <div>
        <h2 className="font-serif text-xl font-semibold text-charcoal-700 mb-4">Practice Details</h2>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" {...register('telehealth')} className="h-4 w-4 rounded border-ivory-300 text-sage focus:ring-sage-200" />
              <span className="text-sm font-medium text-charcoal-700">Telehealth available</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" {...register('accepting_new_clients')} className="h-4 w-4 rounded border-ivory-300 text-sage focus:ring-sage-200" />
              <span className="text-sm font-medium text-charcoal-700">Accepting new patients</span>
            </label>
          </div>
          <div>
            <label className="label">Visit Types</label>
            <div className="flex flex-wrap gap-4">
              {VISIT_TYPES.map((vt) => (
                <label key={vt.value} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={visitTypesValue.includes(vt.value)}
                    onChange={(e) => {
                      const current = visitTypesValue
                      setValue('visit_types', e.target.checked ? [...current, vt.value] : current.filter((v) => v !== vt.value))
                    }}
                    className="h-4 w-4 rounded border-ivory-300 text-sage focus:ring-sage-200"
                  />
                  <span className="text-sm text-charcoal-600">{vt.label}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="label">Languages Spoken <span className="font-normal text-charcoal-300">(optional)</span></label>
            <input {...register('languages')} className="input" placeholder="English, Spanish" />
          </div>
        </div>
      </div>

      <div>
        <label className="label">Insurance Accepted</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {INSURANCE_OPTIONS.map((ins) => (
            <label key={ins} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={insuranceValue.includes(ins)}
                onChange={(e) => {
                  const current = insuranceValue
                  setValue('insurance_accepted', e.target.checked ? [...current, ins] : current.filter((v) => v !== ins))
                }}
                className="h-4 w-4 rounded border-ivory-300 text-sage focus:ring-sage-200"
              />
              <span className="text-sm text-charcoal-600">{ins}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="label">Specialties</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {SPECIALTIES.map((spec) => (
            <label key={spec} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={specialtiesValue.includes(spec)}
                onChange={(e) => {
                  const current = specialtiesValue
                  setValue('specialties', e.target.checked ? [...current, spec] : current.filter((v) => v !== spec))
                }}
                className="h-4 w-4 rounded border-ivory-300 text-sage focus:ring-sage-200"
              />
              <span className="text-sm text-charcoal-600">{spec}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="label">
          Bio <span className="font-normal text-charcoal-300">(optional — upgrade to Pro to display)</span>
        </label>
        <textarea
          {...register('bio')}
          rows={5}
          className="input resize-none"
          placeholder="Tell patients about your approach to geriatric care, your training, and what you focus on…"
        />
        {errors.bio && <p className="mt-1 text-xs text-red-500">{errors.bio.message}</p>}
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-600">{error}</div>
      )}

      <button type="submit" disabled={submitting} className="btn-primary w-full sm:w-auto px-10">
        {submitting ? (
          <><Loader2 className="h-4 w-4 animate-spin" />Submitting…</>
        ) : (
          'Submit My Listing'
        )}
      </button>
    </form>
  )
}
