/**
 * Seed script for GeriatricianDirectory.com
 *
 * Primary source: CMS NPI Registry bulk download (taxonomy 207QG0300X)
 * Secondary: DataForSEO Google Maps enrichment
 *
 * Run: npx ts-node scripts/seed.ts
 *
 * Requires env vars: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, serviceKey)

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

function buildSlug(fullName: string, city: string, state: string): string {
  return `${slugify(fullName)}-${slugify(city)}-${state.toLowerCase()}`
}

// Sample seed data from top geriatrician markets
// In production: replace with NPI registry bulk download (207QG0300X taxonomy)
const SEED_LISTINGS = [
  // Florida — highest 65+ population density
  {
    full_name: 'Dr. Maria Rodriguez',
    credentials: 'MD',
    practice_name: 'South Florida Geriatric Associates',
    city: 'Miami',
    state: 'FL',
    zip: '33136',
    phone: '(305) 555-0101',
    subspecialties: ['memory_care', 'care_coordination'],
    is_accepting_new_patients: true,
    offers_telehealth: true,
    is_abim_certified: true,
    source: 'npi',
  },
  {
    full_name: 'Dr. James Chen',
    credentials: 'MD',
    practice_name: 'Tampa Bay Senior Medicine',
    city: 'Tampa',
    state: 'FL',
    zip: '33602',
    phone: '(813) 555-0102',
    subspecialties: ['fall_prevention', 'polypharmacy'],
    is_accepting_new_patients: true,
    offers_telehealth: false,
    is_abim_certified: true,
    source: 'npi',
  },
  {
    full_name: 'Dr. Sarah Thompson',
    credentials: 'DO',
    practice_name: 'Orlando Geriatric Medicine',
    city: 'Orlando',
    state: 'FL',
    zip: '32801',
    phone: '(407) 555-0103',
    subspecialties: ['palliative_care', 'care_coordination'],
    is_accepting_new_patients: null,
    offers_telehealth: true,
    is_abim_certified: false,
    source: 'npi',
  },
  // Arizona
  {
    full_name: 'Dr. Robert Kim',
    credentials: 'MD',
    practice_name: 'Phoenix Geriatric Care Center',
    city: 'Phoenix',
    state: 'AZ',
    zip: '85003',
    phone: '(602) 555-0201',
    subspecialties: ['dementia', 'memory_care', 'frailty_assessment'],
    is_accepting_new_patients: false,
    offers_telehealth: false,
    is_abim_certified: true,
    source: 'npi',
  },
  {
    full_name: 'Dr. Linda Patel',
    credentials: 'MD',
    practice_name: 'Scottsdale Senior Specialists',
    city: 'Scottsdale',
    state: 'AZ',
    zip: '85251',
    phone: '(480) 555-0202',
    subspecialties: ['polypharmacy', 'fall_prevention'],
    is_accepting_new_patients: true,
    offers_telehealth: true,
    is_abim_certified: true,
    is_ags_member: true,
    source: 'npi',
  },
  // California
  {
    full_name: 'Dr. Angela Wu',
    credentials: 'MD',
    practice_name: 'LA Geriatric & Palliative Medicine',
    city: 'Los Angeles',
    state: 'CA',
    zip: '90001',
    phone: '(310) 555-0301',
    subspecialties: ['palliative_care', 'post_acute', 'care_coordination'],
    is_accepting_new_patients: true,
    offers_telehealth: true,
    is_abim_certified: true,
    is_ags_member: true,
    source: 'npi',
  },
  {
    full_name: 'Dr. Michael Torres',
    credentials: 'MD',
    practice_name: 'San Diego Elder Care Specialists',
    city: 'San Diego',
    state: 'CA',
    zip: '92101',
    phone: '(619) 555-0302',
    subspecialties: ['memory_care', 'dementia'],
    is_accepting_new_patients: true,
    offers_telehealth: false,
    is_abim_certified: true,
    source: 'npi',
  },
  // Texas
  {
    full_name: 'Dr. Patricia Johnson',
    credentials: 'MD',
    practice_name: 'Houston Geriatric Medicine Group',
    city: 'Houston',
    state: 'TX',
    zip: '77001',
    phone: '(713) 555-0401',
    subspecialties: ['care_coordination', 'frailty_assessment', 'polypharmacy'],
    is_accepting_new_patients: true,
    offers_telehealth: true,
    is_abim_certified: true,
    source: 'npi',
  },
  {
    full_name: 'Dr. David Smith',
    credentials: 'MD',
    practice_name: 'Dallas Geriatric Associates',
    city: 'Dallas',
    state: 'TX',
    zip: '75201',
    phone: '(214) 555-0402',
    subspecialties: ['fall_prevention', 'post_acute'],
    is_accepting_new_patients: null,
    offers_telehealth: true,
    is_abim_certified: false,
    source: 'npi',
  },
  // New York
  {
    full_name: 'Dr. Susan Lee',
    credentials: 'MD',
    practice_name: 'NYC Geriatric Medicine Center',
    city: 'New York',
    state: 'NY',
    zip: '10001',
    phone: '(212) 555-0501',
    subspecialties: ['memory_care', 'care_coordination', 'palliative_care'],
    is_accepting_new_patients: false,
    offers_telehealth: true,
    is_abim_certified: true,
    is_ags_member: true,
    source: 'npi',
  },
]

async function seed() {
  console.log('Starting geriatrician directory seed...')

  let inserted = 0
  let skipped = 0

  for (const raw of SEED_LISTINGS) {
    const slug = buildSlug(raw.full_name, raw.city, raw.state)

    // Check for existing slug
    const { data: existing } = await supabase
      .from('geriatrician_listings')
      .select('id')
      .eq('slug', slug)
      .single()

    if (existing) {
      console.log(`Skip (exists): ${slug}`)
      skipped++
      continue
    }

    const { error } = await supabase.from('geriatrician_listings').insert({
      slug,
      full_name: raw.full_name,
      credentials: raw.credentials,
      practice_name: raw.practice_name,
      city: raw.city,
      state: raw.state,
      zip: raw.zip,
      phone: raw.phone,
      subspecialties: raw.subspecialties || [],
      is_accepting_new_patients: raw.is_accepting_new_patients ?? null,
      offers_telehealth: raw.offers_telehealth ?? false,
      is_abim_certified: (raw as { is_abim_certified?: boolean }).is_abim_certified ?? false,
      is_ags_member: (raw as { is_ags_member?: boolean }).is_ags_member ?? false,
      listing_tier: 'free',
      listing_tier_rank: 0,
      source: raw.source || 'seed',
      is_active: true,
      is_approved: true,
    })

    if (error) {
      console.error(`Error inserting ${slug}:`, error.message)
    } else {
      console.log(`Inserted: ${raw.full_name} — ${raw.city}, ${raw.state}`)
      inserted++
    }
  }

  console.log(`\nSeed complete: ${inserted} inserted, ${skipped} skipped`)
  console.log('\nNext steps:')
  console.log('1. Download NPI bulk file: https://npiregistry.cms.hhs.gov/search')
  console.log('2. Filter by taxonomy code 207QG0300X (Geriatric Medicine)')
  console.log('3. Run data-seeder agent to insert all ~7,000 geriatricians')
}

seed().catch(console.error)
