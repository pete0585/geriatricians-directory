import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import crypto from 'crypto'

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })

  const { listingId, email } = body
  if (!listingId || !email) {
    return NextResponse.json({ error: 'listingId and email are required' }, { status: 400 })
  }

  const supabase = await createServiceClient()

  // Verify the listing exists
  const { data: listing, error: listingError } = await supabase
    .from('geriatrician_listings')
    .select('id, full_name, city, state, slug')
    .eq('id', listingId)
    .eq('is_active', true)
    .single()

  if (listingError || !listing) {
    return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
  }

  // Generate token and expiry
  const token = crypto.randomBytes(32).toString('hex')
  const expiresAt = new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString()

  // Insert claim record
  const { error: claimError } = await supabase.from('geriatrician_claims').insert({
    listing_id: listingId,
    email,
    token,
    expires_at: expiresAt,
    verified: false,
  })

  if (claimError) {
    console.error('Claim insert error:', claimError)
    return NextResponse.json({ error: 'Failed to create claim' }, { status: 500 })
  }

  // Send verification email via Resend
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://geriatriciandirectory.com'
  const verifyUrl = `${siteUrl}/claim/${listingId}?token=${token}`
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'hello@mail.geriatriciandirectory.com'

  const emailRes = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: fromEmail,
      to: email,
      subject: `Verify your listing — ${listing.full_name} on GeriatricianDirectory.com`,
      html: `
        <div style="font-family: Inter, system-ui, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px;">
          <h2 style="color: #1B3A5C; font-size: 22px; margin-bottom: 16px;">
            Verify your geriatrician listing
          </h2>
          <p style="color: #4A5568; font-size: 15px; line-height: 1.6; margin-bottom: 24px;">
            You requested to claim the listing for <strong>${listing.full_name}</strong> in ${listing.city}, ${listing.state}
            on GeriatricianDirectory.com.
          </p>
          <p style="margin-bottom: 32px;">
            <a href="${verifyUrl}" style="background: #1B3A5C; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block;">
              Verify &amp; Claim Your Listing
            </a>
          </p>
          <p style="color: #718096; font-size: 13px; line-height: 1.5;">
            This link expires in 72 hours. If you didn't request this, you can safely ignore this email.
          </p>
          <p style="color: #718096; font-size: 13px; margin-top: 8px;">
            After claiming, you can upgrade to a <strong>Verified listing ($99/yr)</strong> to display your contact info
            and get priority placement — or <strong>Featured ($199/yr)</strong> to be pinned first in your city.
          </p>
          <hr style="border: none; border-top: 1px solid #E2E8F0; margin: 24px 0;" />
          <p style="color: #A0AEC0; font-size: 12px;">GeriatricianDirectory.com — 7,000 specialists for 58 million seniors</p>
        </div>
      `,
    }),
  })

  if (!emailRes.ok) {
    const err = await emailRes.text()
    console.error('Resend error:', err)
    return NextResponse.json({ error: 'Failed to send verification email' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
