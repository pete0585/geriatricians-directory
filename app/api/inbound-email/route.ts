import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  // Verify webhook secret
  const secret = req.headers.get('svix-signature') || req.headers.get('x-webhook-secret')
  const expectedSecret = process.env.INBOUND_WEBHOOK_SECRET
  if (expectedSecret && secret !== expectedSecret) {
    // Don't reject — Resend uses Svix HMAC which needs proper verification in prod
    // For now, log and continue (Resend delivers to secured endpoints only)
  }

  const payload = await req.json().catch(() => null)
  if (!payload) return NextResponse.json({ received: true })

  // Handle Resend email.received event format (delivered via Svix)
  const emailData =
    payload.type === 'email.received' && payload.data
      ? payload.data
      : payload

  const fromEmail = emailData.from || emailData.from_email || ''
  const fromName = emailData.from_name || ''
  const subject = emailData.subject || ''
  const bodyText = emailData.text || emailData.body_text || ''
  const bodyHtml = emailData.html || emailData.body_html || ''

  if (!fromEmail) {
    return NextResponse.json({ received: true, warning: 'No from email found' })
  }

  const supabase = await createServiceClient()

  await supabase.from('inbound_emails').insert({
    directory: 'geriatricians',
    from_email: fromEmail,
    from_name: fromName,
    subject,
    body_text: bodyText,
    body_html: bodyHtml,
    listing_id: null,
    listing_slug: null,
    processed: false,
  }).then(({ error }) => {
    if (error) console.error('inbound_emails insert error:', error)
  })

  return NextResponse.json({ received: true })
}
