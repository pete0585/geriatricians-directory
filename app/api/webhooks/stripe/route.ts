import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createServiceClient } from '@/lib/supabase/server'
import type Stripe from 'stripe'

export async function POST(request: NextRequest) {
  // If webhook secret is a placeholder, skip verification and return 200
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret || webhookSecret.startsWith('PLACEHOLDER')) {
    console.log('Stripe webhook: PLACEHOLDER secret — skipping processing')
    return NextResponse.json({ received: true, skipped: 'placeholder' })
  }

  const body = await request.text()
  const sig = request.headers.get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = await createServiceClient()

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const listingId = session.metadata?.listing_id
      const planTier = session.metadata?.plan_tier as 'pro' | 'verified' | undefined

      if (!listingId || !planTier) {
        console.error('STRIPE WEBHOOK: checkout.session.completed missing metadata', { sessionId: session.id })
        if (process.env.RESEND_API_KEY) {
          await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
              from: process.env.RESEND_FROM_EMAIL ?? 'hello@mail.geriatriciandirectory.com',
              to: process.env.ADMIN_EMAIL ?? 'adam@thestrategicveteran.com',
              subject: '⚠️ Stripe payment received but listing NOT upgraded',
              html: `<p>A Stripe checkout completed but listing_id or plan_tier metadata was missing. Session ID: ${session.id}</p>`,
            }),
          }).catch(console.error)
        }
        break
      }

      await supabase
        .from('geriatricians_listings')
        .update({
          plan_tier: planTier,
          stripe_customer_id: session.customer as string,
          plan_expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'active',
        })
        .eq('id', listingId)

      await supabase.from('geriatricians_payments').insert({
        listing_id: listingId,
        stripe_payment_intent_id: session.payment_intent as string,
        stripe_subscription_id: session.subscription as string,
        plan_tier: planTier,
        amount_cents: session.amount_total ?? 0,
        currency: session.currency ?? 'usd',
        status: 'active',
        period_start: new Date().toISOString(),
        period_end: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      })
      break
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription
      const listingId = subscription.metadata?.listing_id
      if (!listingId) break
      await supabase
        .from('geriatricians_listings')
        .update({ plan_tier: 'free', plan_expires_at: null })
        .eq('id', listingId)
      await supabase
        .from('geriatricians_payments')
        .update({ status: 'canceled' })
        .eq('stripe_subscription_id', subscription.id)
      break
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice
      const subscriptionId = typeof invoice.subscription === 'string' ? invoice.subscription : invoice.subscription?.id
      if (subscriptionId) {
        await supabase
          .from('geriatricians_payments')
          .update({ status: 'past_due' })
          .eq('stripe_subscription_id', subscriptionId)
      }
      break
    }
  }

  return NextResponse.json({ received: true })
}
