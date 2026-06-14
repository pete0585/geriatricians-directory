import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  const zip = request.nextUrl.searchParams.get('zip')

  if (!zip || !/^\d{5}$/.test(zip)) {
    return NextResponse.json({ error: 'Invalid zip code' }, { status: 400 })
  }

  try {
    const res = await fetch(`https://api.zippopotam.us/us/${zip}`, {
      headers: { 'User-Agent': 'curl/8.5.0' },
    })

    if (!res.ok) return NextResponse.json({ error: 'not found' }, { status: 404 })

    const data = await res.json()
    const place = data.places?.[0]
    if (!place) return NextResponse.json({ error: 'not found' }, { status: 404 })

    return NextResponse.json(
      {
        city: place['place name'] as string,
        state: place['state'] as string,
        state_abbr: place['state abbreviation'] as string,
        lat: parseFloat(place.latitude as string),
        lng: parseFloat(place.longitude as string),
      },
      { headers: { 'Cache-Control': 'public, max-age=86400, s-maxage=86400' } },
    )
  } catch {
    return NextResponse.json({ error: 'not found' }, { status: 404 })
  }
}
