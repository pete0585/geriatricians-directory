import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

function parseFromHeader(raw: string): { email: string; name: string | null } {
  const match = raw.match(/<([^>]+)>/)
  if (match) {
    const email = match[1].toLowerCase().trim()
    const name = raw.replace(/<[^>]+>/, '').replace(/"/g, '').trim() || null
    return { email, name }
  }
  return { email: raw.toLowerCase().trim(), name: null }
}

export async function POST(request: NextRequest) {
  let payload: Record<string, unknown>
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const emailData: Record<string, unknown> =
    payload.type === 'email.received' && payload.data && typeof payload.data === 'object'
      ? (payload.data as Record<string, unknown>)
      : payload

  const fromRaw = String(emailData.from ?? '')
  if (!fromRaw) return NextResponse.json({ error: 'Missing from address' }, { status: 400 })

  const { email: fromEmail, name: fromName } = parseFromHeader(fromRaw)
  const subject = String(emailData.subject ?? '')
  const bodyText = String(emailData.text ?? '')

  const autoReplyPatterns = /out of office|auto.?reply|automatic reply|delivery failed|undeliverable|vacation/i
  if (autoReplyPatterns.test(subject) || autoReplyPatterns.test(bodyText.slice(0, 200))) {
    return NextResponse.json({ received: true, skipped: 'auto-reply' })
  }

  const supabase = await createServiceClient()

  const { data: listing } = await supabase
    .from('geriatricians_listings')
    .select('id, slug')
    .eq('email', fromEmail)
    .maybeSingle()

  await supabase.from('inbound_emails').insert({
    directory: 'geriatricians',
    from_email: fromEmail,
    from_name: fromName,
    subject,
    body_text: bodyText,
    body_html: String(emailData.html ?? ''),
    to_address: String(emailData.to ?? ''),
    listing_id: listing?.id ?? null,
    listing_slug: listing?.slug ?? null,
    processed: false,
  })

  return NextResponse.json({ received: true })
}
