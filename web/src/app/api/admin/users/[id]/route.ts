import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

const PROFILE_FIELDS = new Set(['full_name', 'email', 'phone', 'locale', 'avatar_url'])
const VALID_LOCALES = new Set(['en', 'es', 'pt'])
const VALID_ROLES = new Set(['admin', 'user'])
const REQUIRED_STRING_FIELDS = new Set(['full_name', 'email'])

async function verifyAdmin(supabase: ReturnType<typeof createAdminClient>) {
  const serverClient = await createClient()
  const { data: { user }, error } = await serverClient.auth.getUser()
  if (error || !user) return null
  if (user.app_metadata?.role !== 'admin') return null
  return user
}

// GET — fetch user profile + role (from auth.users app_metadata)
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const admin = createAdminClient()

  const caller = await verifyAdmin(admin)
  if (!caller) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // Fetch profile data
  const { data: profile, error: profileError } = await admin
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single()

  if (profileError || !profile) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  // Fetch role from auth.users
  const { data: authUser, error: authError } = await admin.auth.admin.getUserById(id)

  const role = (!authError && authUser?.user?.app_metadata?.role) || 'user'

  return NextResponse.json({ ...profile, role })
}

// PATCH — update profile fields + role (role via auth admin API)
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const admin = createAdminClient()

  const caller = await verifyAdmin(admin)
  if (!caller) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // 1. Parse and whitelist fields
  const body = await request.json()
  const profileUpdates: Record<string, unknown> = {}
  let roleUpdate: string | null = null

  for (const [key, value] of Object.entries(body)) {
    if (PROFILE_FIELDS.has(key)) {
      profileUpdates[key] = value
    } else if (key === 'role') {
      roleUpdate = value as string
    }
  }

  if (Object.keys(profileUpdates).length === 0 && roleUpdate === null) {
    return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
  }

  // 2. Validate profile fields
  for (const field of REQUIRED_STRING_FIELDS) {
    if (field in profileUpdates && !(profileUpdates[field] as string)?.trim()) {
      return NextResponse.json({ error: `${field} is required` }, { status: 400 })
    }
  }

  if ('email' in profileUpdates) {
    const email = (profileUpdates.email as string).trim().toLowerCase()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }
    profileUpdates.email = email
  }

  if ('locale' in profileUpdates && !VALID_LOCALES.has(profileUpdates.locale as string)) {
    return NextResponse.json({ error: 'Invalid locale' }, { status: 400 })
  }

  if (roleUpdate !== null && !VALID_ROLES.has(roleUpdate)) {
    return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
  }

  // 3. Verify the user profile exists
  const { data: existing } = await admin
    .from('profiles')
    .select('id')
    .eq('id', id)
    .single()

  if (!existing) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  // 4. Check email uniqueness if changed
  if ('email' in profileUpdates) {
    const { data: duplicate } = await admin
      .from('profiles')
      .select('id')
      .eq('email', profileUpdates.email as string)
      .neq('id', id)
      .limit(1)
      .single()

    if (duplicate) {
      return NextResponse.json({ error: 'Email already in use' }, { status: 409 })
    }
  }

  // 5. Normalize optional fields: empty string → null
  for (const key of ['avatar_url', 'phone']) {
    if (key in profileUpdates && (profileUpdates[key] === '' || profileUpdates[key] === undefined)) {
      profileUpdates[key] = null
    }
  }

  // 6. Update profile table (if any profile fields changed)
  if (Object.keys(profileUpdates).length > 0) {
    profileUpdates.updated_at = new Date().toISOString()

    const { error: updateError } = await admin
      .from('profiles')
      .update(profileUpdates)
      .eq('id', id)

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }
  }

  // 7. Update role in auth.users app_metadata (if role changed)
  if (roleUpdate !== null) {
    const { error: roleError } = await admin.auth.admin.updateUserById(id, {
      app_metadata: { role: roleUpdate },
    })

    if (roleError) {
      return NextResponse.json({ error: roleError.message }, { status: 500 })
    }
  }

  return NextResponse.json({ success: true })
}
