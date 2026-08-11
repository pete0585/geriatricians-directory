import { US_STATES, SUBSPECIALTIES } from '@/lib/types'

export function cn(...inputs: (string | undefined | null | false)[]) {
  return inputs.filter(Boolean).join(' ')
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function getAbsoluteUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://geriatriciandirectory.com'
  return `${base}${path}`
}

export function formatStateName(stateCode: string): string {
  return US_STATES[stateCode.toUpperCase()] || stateCode
}

export function formatStateSlug(stateName: string): string {
  return stateName.toLowerCase().replace(/\s+/g, '-')
}

export function stateSlugToCode(slug: string): string {
  const name = slug.replace(/-/g, ' ')
  const entry = Object.entries(US_STATES).find(
    ([, v]) => v.toLowerCase() === name.toLowerCase()
  )
  return entry ? entry[0] : slug.toUpperCase()
}

export function getSubspecialtyLabel(key: string): string {
  return SUBSPECIALTIES[key] || key
}

export function formatCredentials(name: string, credentials: string | null): string {
  if (!credentials) return name
  return `${name}, ${credentials}`
}

export function buildListingSlug(fullName: string, city: string, state: string): string {
  const namePart = slugify(fullName)
  const cityPart = slugify(city)
  const statePart = state.toLowerCase()
  return `${namePart}-${cityPart}-${statePart}`
}

export function truncate(text: string, max: number): string {
  if (text.length <= max) return text
  return text.slice(0, max).replace(/\s+\S*$/, '') + '…'
}
