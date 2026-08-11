import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'

export async function PATCH(req: NextRequest) {
  // Verify admin session
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const adminEmail = process.env.ADMIN_EMAIL
  if (adminEmail && user.email !== adminEmail) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'Invalid request' }, { status: 400 })

  const { id, action } = body
  if (!id || !action) return NextResponse.json({ error: 'id and action required' }, { status: 400 })

  const serviceClient = await createServiceClient()

  if (action === 'approve') {
    const { error } = await serviceClient
      .from('geriatrician_listings')
      .update({ is_approved: true })
      .eq('id', id)
    if (error) return NextResponse.json({ error: 'Failed to approve' }, { status: 500 })
  } else if (action === 'reject') {
    const { error } = await serviceClient
      .from('geriatrician_listings')
      .update({ is_active: false, is_approved: false })
      .eq('id', id)
    if (error) return NextResponse.json({ error: 'Failed to reject' }, { status: 500 })
  } else {
    return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
  }

  return NextResponse.json({ success: true })
}
