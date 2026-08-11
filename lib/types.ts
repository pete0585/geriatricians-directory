export type ListingTier = 'free' | 'verified' | 'featured'

export interface Listing {
  id: string
  slug: string
  npi: string | null
  full_name: string
  credentials: string | null
  practice_name: string | null
  bio: string | null
  photo_url: string | null
  phone: string | null
  email: string | null
  website: string | null
  address_line1: string | null
  city: string
  state: string
  zip: string | null
  latitude: number | null
  longitude: number | null
  subspecialties: string[]
  conditions_treated: string[]
  insurance_accepted: string[]
  is_accepting_new_patients: boolean | null
  offers_telehealth: boolean
  is_abim_certified: boolean
  is_ags_member: boolean
  listing_tier: ListingTier
  listing_tier_rank: number
  is_active: boolean
  is_approved: boolean
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  subscription_expires_at: string | null
  claimed_at: string | null
  claimed_by: string | null
  source: string | null
  do_not_email: boolean
  outreach_sent_at: string | null
  outreach_last_sent_at: string | null
  nudge_sent_at: string | null
  search_vector: string | null
  created_at: string
  updated_at: string
}

export interface Claim {
  id: string
  listing_id: string
  email: string
  token: string
  verified: boolean
  verified_at: string | null
  created_at: string
  expires_at: string
  nudge_sent_at: string | null
}

export interface Payment {
  id: string
  listing_id: string
  stripe_session_id: string | null
  stripe_payment_intent_id: string | null
  amount: number
  tier: string
  status: string
  created_at: string
}

export interface Inquiry {
  id: string
  family_name: string | null
  family_phone: string | null
  family_email: string | null
  patient_age: number | null
  patient_situation: string | null
  state: string | null
  city: string | null
  insurance: string | null
  routed_to: string | null
  status: string
  created_at: string
}

export interface SearchFilters {
  q?: string
  state?: string
  city?: string
  subspecialty?: string
  accepting_new_patients?: string
  telehealth?: string
  tier?: string
  page?: number
}

export const SUBSPECIALTIES: Record<string, string> = {
  memory_care: 'Memory Care',
  fall_prevention: 'Fall Prevention',
  palliative_care: 'Palliative Care',
  polypharmacy: 'Polypharmacy Management',
  care_coordination: 'Care Coordination',
  post_acute: 'Post-Acute Care',
  dementia: 'Dementia',
  frailty_assessment: 'Frailty Assessment',
}

export const US_STATES: Record<string, string> = {
  AL: 'Alabama', AK: 'Alaska', AZ: 'Arizona', AR: 'Arkansas', CA: 'California',
  CO: 'Colorado', CT: 'Connecticut', DE: 'Delaware', FL: 'Florida', GA: 'Georgia',
  HI: 'Hawaii', ID: 'Idaho', IL: 'Illinois', IN: 'Indiana', IA: 'Iowa',
  KS: 'Kansas', KY: 'Kentucky', LA: 'Louisiana', ME: 'Maine', MD: 'Maryland',
  MA: 'Massachusetts', MI: 'Michigan', MN: 'Minnesota', MS: 'Mississippi', MO: 'Missouri',
  MT: 'Montana', NE: 'Nebraska', NV: 'Nevada', NH: 'New Hampshire', NJ: 'New Jersey',
  NM: 'New Mexico', NY: 'New York', NC: 'North Carolina', ND: 'North Dakota', OH: 'Ohio',
  OK: 'Oklahoma', OR: 'Oregon', PA: 'Pennsylvania', RI: 'Rhode Island', SC: 'South Carolina',
  SD: 'South Dakota', TN: 'Tennessee', TX: 'Texas', UT: 'Utah', VT: 'Vermont',
  VA: 'Virginia', WA: 'Washington', WV: 'West Virginia', WI: 'Wisconsin', WY: 'Wyoming',
  DC: 'Washington DC',
}

export const CATEGORIES = [
  { slug: 'memory-care', label: 'Memory Care Specialists', subspecialty: 'memory_care' },
  { slug: 'fall-prevention', label: 'Fall Prevention', subspecialty: 'fall_prevention' },
  { slug: 'palliative-care', label: 'Palliative Care', subspecialty: 'palliative_care' },
  { slug: 'polypharmacy', label: 'Polypharmacy Management', subspecialty: 'polypharmacy' },
  { slug: 'care-coordination', label: 'Care Coordination', subspecialty: 'care_coordination' },
  { slug: 'post-acute-care', label: 'Post-Acute Care', subspecialty: 'post_acute' },
]
