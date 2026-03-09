import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

const ALLOWED_FIELDS = new Set([
  'registration_number',
  'pet_name',
  'pet_breed',
  'pet_species',
  'pet_color',
  'pet_weight',
  'pet_date_of_birth',
  'pet_photo_url',
  'handler_name',
  'registration_type',
  'registration_date',
  'expiry_date',
])

const VALID_SPECIES = new Set(['dog', 'cat', 'other'])
const VALID_TYPES = new Set(['esa', 'psd'])
const REQUIRED_STRING_FIELDS = new Set(['pet_name', 'pet_breed', 'handler_name'])

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  // 1. Auth check — verify admin role
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (user.app_metadata?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // 2. Parse and whitelist fields
  const body = await request.json()
  const updates: Record<string, unknown> = {}

  for (const [key, value] of Object.entries(body)) {
    if (ALLOWED_FIELDS.has(key)) {
      updates[key] = value
    }
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
  }

  // 3. Validate fields
  for (const field of REQUIRED_STRING_FIELDS) {
    if (field in updates && !(updates[field] as string)?.trim()) {
      return NextResponse.json({ error: `${field} is required` }, { status: 400 })
    }
  }

  if ('pet_species' in updates && !VALID_SPECIES.has(updates.pet_species as string)) {
    return NextResponse.json({ error: 'Invalid pet species' }, { status: 400 })
  }

  if ('registration_type' in updates && !VALID_TYPES.has(updates.registration_type as string)) {
    return NextResponse.json({ error: 'Invalid registration type' }, { status: 400 })
  }

  const admin = createAdminClient()

  // 4. Verify the registration exists
  const { data: existing } = await admin
    .from('pet_registrations')
    .select('id')
    .eq('id', id)
    .single()

  if (!existing) {
    return NextResponse.json({ error: 'Registration not found' }, { status: 404 })
  }

  // 5. Check registration_number uniqueness if changed
  if ('registration_number' in updates) {
    const regNum = (updates.registration_number as string)?.trim()
    if (!regNum) {
      return NextResponse.json({ error: 'Registration number is required' }, { status: 400 })
    }

    const { data: duplicate } = await admin
      .from('pet_registrations')
      .select('id')
      .eq('registration_number', regNum)
      .neq('id', id)
      .limit(1)
      .single()

    if (duplicate) {
      return NextResponse.json({ error: 'Registration number already exists' }, { status: 409 })
    }

    updates.registration_number = regNum
  }

  // 6. Normalize optional fields: empty string → null
  for (const key of ['pet_color', 'pet_weight', 'pet_date_of_birth', 'expiry_date', 'pet_photo_url']) {
    if (key in updates && (updates[key] === '' || updates[key] === undefined)) {
      updates[key] = null
    }
  }

  // 7. Update
  updates.updated_at = new Date().toISOString()

  const { error: updateError } = await admin
    .from('pet_registrations')
    .update(updates)
    .eq('id', id)

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  // Auth check — verify admin role
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (user.app_metadata?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const admin = createAdminClient()

  // Verify the registration exists
  const { data: existing } = await admin
    .from('pet_registrations')
    .select('id')
    .eq('id', id)
    .single()

  if (!existing) {
    return NextResponse.json({ error: 'Registration not found' }, { status: 404 })
  }

  // Delete the registration
  const { error: deleteError } = await admin
    .from('pet_registrations')
    .delete()
    .eq('id', id)

  if (deleteError) {
    return NextResponse.json({ error: deleteError.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
