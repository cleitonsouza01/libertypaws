import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET() {
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

  const { data: registrationNumber, error } = await admin.rpc(
    'generate_registration_number',
    { reg_type: 'ESA' }
  )

  if (error) {
    return NextResponse.json(
      { error: `Failed to generate registration number: ${error.message}` },
      { status: 500 }
    )
  }

  return NextResponse.json({ registrationNumber })
}
