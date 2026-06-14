export type PlanTier = 'free' | 'pro' | 'verified'
export type ListingStatus = 'pending' | 'active' | 'suspended'
export type VisitType = 'home' | 'office' | 'virtual'

export interface Listing {
  id: string
  slug: string
  name: string
  credentials: string[]
  bio: string | null
  photo_url: string | null
  phone: string | null
  email: string | null
  website: string | null
  city: string
  state: string
  zip: string | null
  lat: number | null
  lng: number | null
  accepting_new_clients: boolean
  telehealth: boolean
  visit_types: VisitType[]
  insurance_accepted: string[]
  specialties: string[]
  languages: string[]
  plan_tier: PlanTier
  credential_verified: boolean
  claimed: boolean
  claimed_at: string | null
  stripe_customer_id: string | null
  plan_expires_at: string | null
  status: ListingStatus
  created_at: string
  updated_at: string
}

export interface Claim {
  id: string
  listing_id: string
  email: string
  token: string
  verified: boolean
  created_at: string
  expires_at: string
}

export interface Payment {
  id: string
  listing_id: string
  stripe_payment_intent_id: string | null
  stripe_subscription_id: string | null
  plan_tier: PlanTier
  amount_cents: number
  currency: string
  status: 'active' | 'canceled' | 'past_due'
  period_start: string
  period_end: string
  created_at: string
}

export interface City {
  id: string
  city: string
  state: string
  slug: string
  latitude: number | null
  longitude: number | null
  listing_count: number
  meta_description: string | null
  intro_paragraph: string | null
  active: boolean
}

export const SPECIALTIES = [
  'Memory Care',
  'Dementia & Alzheimer\'s',
  'Fall Prevention',
  'Polypharmacy Management',
  'Geriatric Oncology',
  'Hospice & Palliative Care',
  'Osteoporosis & Bone Health',
  'Incontinence Management',
  'Cognitive Decline',
  'Frailty & Mobility',
  'Post-Surgical Recovery',
  'Heart Failure Management',
  'Diabetes in the Elderly',
  'Depression & Anxiety in Seniors',
  'Caregiver Support',
  'Medication Review',
  'Hospital at Home',
  'Nursing Home Care',
] as const

export const INSURANCE_OPTIONS = [
  'Medicare',
  'Medicare Advantage',
  'Medicaid',
  'Aetna',
  'Blue Cross Blue Shield',
  'Cigna',
  'UnitedHealthcare',
  'Humana',
  'Tricare',
  'Anthem',
  'Kaiser Permanente',
  'Self-pay',
] as const

export const VISIT_TYPES: { value: VisitType; label: string }[] = [
  { value: 'home', label: 'Home Visits' },
  { value: 'office', label: 'Office Visits' },
  { value: 'virtual', label: 'Virtual / Telehealth' },
]

export const US_STATES: { abbr: string; name: string }[] = [
  { abbr: 'AL', name: 'Alabama' },
  { abbr: 'AK', name: 'Alaska' },
  { abbr: 'AZ', name: 'Arizona' },
  { abbr: 'AR', name: 'Arkansas' },
  { abbr: 'CA', name: 'California' },
  { abbr: 'CO', name: 'Colorado' },
  { abbr: 'CT', name: 'Connecticut' },
  { abbr: 'DE', name: 'Delaware' },
  { abbr: 'FL', name: 'Florida' },
  { abbr: 'GA', name: 'Georgia' },
  { abbr: 'HI', name: 'Hawaii' },
  { abbr: 'ID', name: 'Idaho' },
  { abbr: 'IL', name: 'Illinois' },
  { abbr: 'IN', name: 'Indiana' },
  { abbr: 'IA', name: 'Iowa' },
  { abbr: 'KS', name: 'Kansas' },
  { abbr: 'KY', name: 'Kentucky' },
  { abbr: 'LA', name: 'Louisiana' },
  { abbr: 'ME', name: 'Maine' },
  { abbr: 'MD', name: 'Maryland' },
  { abbr: 'MA', name: 'Massachusetts' },
  { abbr: 'MI', name: 'Michigan' },
  { abbr: 'MN', name: 'Minnesota' },
  { abbr: 'MS', name: 'Mississippi' },
  { abbr: 'MO', name: 'Missouri' },
  { abbr: 'MT', name: 'Montana' },
  { abbr: 'NE', name: 'Nebraska' },
  { abbr: 'NV', name: 'Nevada' },
  { abbr: 'NH', name: 'New Hampshire' },
  { abbr: 'NJ', name: 'New Jersey' },
  { abbr: 'NM', name: 'New Mexico' },
  { abbr: 'NY', name: 'New York' },
  { abbr: 'NC', name: 'North Carolina' },
  { abbr: 'ND', name: 'North Dakota' },
  { abbr: 'OH', name: 'Ohio' },
  { abbr: 'OK', name: 'Oklahoma' },
  { abbr: 'OR', name: 'Oregon' },
  { abbr: 'PA', name: 'Pennsylvania' },
  { abbr: 'RI', name: 'Rhode Island' },
  { abbr: 'SC', name: 'South Carolina' },
  { abbr: 'SD', name: 'South Dakota' },
  { abbr: 'TN', name: 'Tennessee' },
  { abbr: 'TX', name: 'Texas' },
  { abbr: 'UT', name: 'Utah' },
  { abbr: 'VT', name: 'Vermont' },
  { abbr: 'VA', name: 'Virginia' },
  { abbr: 'WA', name: 'Washington' },
  { abbr: 'WV', name: 'West Virginia' },
  { abbr: 'WI', name: 'Wisconsin' },
  { abbr: 'WY', name: 'Wyoming' },
  { abbr: 'DC', name: 'District of Columbia' },
]

export const PLAN_PRICES = {
  pro: {
    amount: 7900,
    label: '$79/year',
    display: '$79',
    period: 'year',
  },
  verified: {
    amount: 12900,
    label: '$129/year',
    display: '$129',
    period: 'year',
  },
} as const
