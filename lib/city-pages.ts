import type { Metadata } from 'next'
import { US_STATES } from '@/lib/types'
import { getAbsoluteUrl } from '@/lib/utils'

/** `{city-slug}-{state}` e.g. austin-tx, new-york-ny, san-antonio-tx */
const CITY_STATE_FOLDER = /^([a-z0-9]+(?:-[a-z0-9]+)*)-([a-z]{2})$/

export function isCityPageFolder(name: string): boolean {
  const match = name.match(CITY_STATE_FOLDER)
  if (!match) return false
  return match[2].toUpperCase() in US_STATES
}

export function getCityPagePath(slug: string): string {
  return `/listings/${slug}`
}

export function cityPageMetadata(slug: string, title: string, description: string): Metadata {
  const url = getAbsoluteUrl(getCityPagePath(slug))
  return {
    title,
    description,
    openGraph: { title, description, type: 'website', url },
    alternates: { canonical: url },
  }
}
