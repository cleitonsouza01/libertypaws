import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(request: Request) {
  // 1. Auth check — verify admin role
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (user.app_metadata?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // 2. Parse request body
  const body = await request.json()
  const {
    email,
    fullName,
    petName,
    petBreed,
    petSpecies,
    registrationType,
    serviceId,
    petColor,
    petWeight,
    petDateOfBirth,
    petPhotoUrl,
    expiryDate,
    registrationDate,
    adminNotes,
    locale,
  } = body

  if (!email || !fullName || !petName || !petBreed || !petSpecies || !registrationType || !serviceId) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  // 3. Service-role client for privileged operations
  const admin = createAdminClient()

  try {
    // 4. Find or create customer
    let customerId: string

    const { data: existingProfile } = await admin
      .from('profiles')
      .select('id')
      .eq('email', email.toLowerCase().trim())
      .limit(1)
      .single()

    if (existingProfile) {
      customerId = existingProfile.id
    } else {
      // Create auth user (triggers handle_new_user → auto-creates profile)
      const { data: newUser, error: createError } = await admin.auth.admin.createUser({
        email: email.toLowerCase().trim(),
        email_confirm: true,
        user_metadata: { full_name: fullName },
      })

      if (createError || !newUser.user) {
        return NextResponse.json(
          { error: `Failed to create customer: ${createError?.message || 'Unknown error'}` },
          { status: 500 }
        )
      }

      customerId = newUser.user.id

      // Update profile with full_name if handle_new_user didn't set it
      await admin
        .from('profiles')
        .update({ full_name: fullName, locale: locale || 'en' })
        .eq('id', customerId)
    }

    // 5. Generate order number
    const { data: orderNumber, error: orderNumError } = await admin.rpc('generate_order_number')
    if (orderNumError) {
      return NextResponse.json(
        { error: `Failed to generate order number: ${orderNumError.message}` },
        { status: 500 }
      )
    }

    // 6. Insert order (status: completed, $0)
    const { data: order, error: orderError } = await admin
      .from('orders')
      .insert({
        order_number: orderNumber,
        customer_id: customerId,
        status: 'completed',
        subtotal: 0,
        total_amount: 0,
        completed_at: new Date().toISOString(),
        admin_notes: adminNotes || null,
        locale: locale || 'en',
      })
      .select('id')
      .single()

    if (orderError || !order) {
      return NextResponse.json(
        { error: `Failed to create order: ${orderError?.message || 'Unknown error'}` },
        { status: 500 }
      )
    }

    // 7. Insert order item
    const { data: orderItem, error: itemError } = await admin
      .from('order_items')
      .insert({
        order_id: order.id,
        service_id: serviceId,
        quantity: 1,
        unit_price: 0,
        total_price: 0,
      })
      .select('id')
      .single()

    if (itemError || !orderItem) {
      return NextResponse.json(
        { error: `Failed to create order item: ${itemError?.message || 'Unknown error'}` },
        { status: 500 }
      )
    }

    // 8. Generate registration number
    const { data: registrationNumber, error: regNumError } = await admin.rpc(
      'generate_registration_number',
      { reg_type: registrationType.toUpperCase() }
    )
    if (regNumError) {
      return NextResponse.json(
        { error: `Failed to generate registration number: ${regNumError.message}` },
        { status: 500 }
      )
    }

    // 9. Insert pet registration
    const regData: Record<string, unknown> = {
      registration_number: registrationNumber,
      customer_id: customerId,
      order_id: order.id,
      order_item_id: orderItem.id,
      pet_name: petName,
      pet_breed: petBreed,
      pet_species: petSpecies,
      handler_name: fullName,
      registration_type: registrationType,
      status: 'active',
      is_public: true,
      registration_date: registrationDate || new Date().toISOString().split('T')[0],
    }

    if (expiryDate) regData.expiry_date = expiryDate
    if (petColor) regData.pet_color = petColor
    if (petWeight) regData.pet_weight = parseFloat(petWeight)
    if (petDateOfBirth) regData.pet_date_of_birth = petDateOfBirth
    if (petPhotoUrl) regData.pet_photo_url = petPhotoUrl

    const { data: registration, error: regError } = await admin
      .from('pet_registrations')
      .insert(regData)
      .select('id')
      .single()

    if (regError || !registration) {
      return NextResponse.json(
        { error: `Failed to create registration: ${regError?.message || 'Unknown error'}` },
        { status: 500 }
      )
    }

    // 10. Return success
    return NextResponse.json({
      registrationId: registration.id,
      registrationNumber,
      orderId: order.id,
      orderNumber,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
