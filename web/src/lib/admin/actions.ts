import type { SupabaseClient } from '@supabase/supabase-js'
import type { OrderStatus, RegistrationStatus, MessageStatus } from '@/types/admin'

// ── Order actions ───────────────────────────────────────────────────

const ORDER_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending: ['paid', 'cancelled', 'failed'],
  paid: ['processing', 'cancelled', 'refunded'],
  processing: ['shipped', 'cancelled'],
  shipped: ['delivered'],
  delivered: ['completed', 'refunded'],
  completed: ['refunded'],
  cancelled: [],
  refunded: [],
  failed: [],
}

export async function updateOrderStatus(
  supabase: SupabaseClient,
  orderId: string,
  newStatus: OrderStatus
) {
  // Validate state transition
  const { data: order } = await supabase
    .from('orders')
    .select('status')
    .eq('id', orderId)
    .single()

  if (!order) throw new Error('Order not found')

  const currentStatus = order.status as OrderStatus
  const allowed = ORDER_TRANSITIONS[currentStatus]
  if (!allowed?.includes(newStatus)) {
    throw new Error(`Cannot transition from ${currentStatus} to ${newStatus}`)
  }

  const { error } = await supabase
    .from('orders')
    .update({ status: newStatus, updated_at: new Date().toISOString() })
    .eq('id', orderId)

  if (error) throw error
}

export async function updateOrderAdminNotes(
  supabase: SupabaseClient,
  orderId: string,
  notes: string
) {
  const { error } = await supabase
    .from('orders')
    .update({ admin_notes: notes, updated_at: new Date().toISOString() })
    .eq('id', orderId)

  if (error) throw error
}

// ── Registration actions ────────────────────────────────────────────

export async function approveRegistration(
  supabase: SupabaseClient,
  regId: string
) {
  const { error } = await supabase
    .from('pet_registrations')
    .update({
      status: 'active' as RegistrationStatus,
      updated_at: new Date().toISOString(),
    })
    .eq('id', regId)
    .eq('status', 'pending_review')

  if (error) throw error
}

export async function rejectRegistration(
  supabase: SupabaseClient,
  regId: string
) {
  const { error } = await supabase
    .from('pet_registrations')
    .update({
      status: 'revoked' as RegistrationStatus,
      updated_at: new Date().toISOString(),
    })
    .eq('id', regId)
    .eq('status', 'pending_review')

  if (error) throw error
}

export async function updateRegistrationStatus(
  supabase: SupabaseClient,
  regId: string,
  status: RegistrationStatus
) {
  const { error } = await supabase
    .from('pet_registrations')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', regId)

  if (error) throw error
}

export async function toggleRegistrationPublic(
  supabase: SupabaseClient,
  regId: string,
  isPublic: boolean
) {
  const { error } = await supabase
    .from('pet_registrations')
    .update({ is_public: isPublic, updated_at: new Date().toISOString() })
    .eq('id', regId)

  if (error) throw error
}

// ── Message actions ─────────────────────────────────────────────────

export async function updateMessageStatus(
  supabase: SupabaseClient,
  msgId: string,
  status: MessageStatus
) {
  const { error } = await supabase
    .from('contact_messages')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', msgId)

  if (error) throw error
}

export async function updateMessageNotes(
  supabase: SupabaseClient,
  msgId: string,
  notes: string
) {
  const { error } = await supabase
    .from('contact_messages')
    .update({ admin_notes: notes, updated_at: new Date().toISOString() })
    .eq('id', msgId)

  if (error) throw error
}

// ── Service actions ─────────────────────────────────────────────────

export async function createService(
  supabase: SupabaseClient,
  data: Record<string, unknown>
) {
  const { error } = await supabase.from('services').insert(data)
  if (error) throw error
}

export async function updateService(
  supabase: SupabaseClient,
  serviceId: string,
  data: Record<string, unknown>
) {
  // Separate junction-table / media fields from direct service columns
  const { category, tags, image_url, ...serviceFields } = data

  // Update the services table (direct columns only)
  const { error } = await supabase
    .from('services')
    .update({ ...serviceFields, updated_at: new Date().toISOString() })
    .eq('id', serviceId)

  if (error) throw error

  // Update category via service_categories junction table
  if (typeof category === 'string') {
    const { data: catRow } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', category)
      .single()

    if (catRow) {
      // Remove existing categories for this service, then insert new one
      await supabase
        .from('service_categories')
        .delete()
        .eq('service_id', serviceId)

      await supabase
        .from('service_categories')
        .insert({ service_id: serviceId, category_id: catRow.id })
    }
  }

  // Update tags via service_tags junction table
  if (Array.isArray(tags) && tags.length > 0) {
    // Remove existing tags
    await supabase
      .from('service_tags')
      .delete()
      .eq('service_id', serviceId)

    // Upsert tags and link them
    for (const tagName of tags as string[]) {
      const slug = tagName.toLowerCase().replace(/\s+/g, '-')
      const { data: tagRow } = await supabase
        .from('tags')
        .upsert({ slug, name: tagName }, { onConflict: 'slug' })
        .select('id')
        .single()

      if (tagRow) {
        await supabase
          .from('service_tags')
          .insert({ service_id: serviceId, tag_id: tagRow.id })
      }
    }
  }

  // Update primary image via service_media table
  if (typeof image_url === 'string') {
    // Strip CDN prefix to store only relative paths in DB
    const cdnUrl = process.env.NEXT_PUBLIC_CDN_URL || ''
    let cleanImageUrl = image_url as string
    if (cdnUrl && cleanImageUrl.startsWith(cdnUrl)) {
      cleanImageUrl = cleanImageUrl.slice(cdnUrl.length).replace(/^\//, '')
    }

    if (cleanImageUrl) {
      // Upsert: update existing primary image or insert new one
      const { data: existing } = await supabase
        .from('service_media')
        .select('id')
        .eq('service_id', serviceId)
        .eq('is_primary', true)
        .single()

      if (existing) {
        await supabase
          .from('service_media')
          .update({ url: cleanImageUrl })
          .eq('id', existing.id)
      } else {
        await supabase
          .from('service_media')
          .insert({
            service_id: serviceId,
            url: cleanImageUrl,
            media_type: 'image',
            is_primary: true,
            sort_order: 0,
          })
      }
    } else {
      // Empty string = remove image
      await supabase
        .from('service_media')
        .delete()
        .eq('service_id', serviceId)
        .eq('is_primary', true)
    }
  }
}

export async function toggleServiceActive(
  supabase: SupabaseClient,
  serviceId: string,
  isActive: boolean
) {
  const { error } = await supabase
    .from('services')
    .update({ is_active: isActive, updated_at: new Date().toISOString() })
    .eq('id', serviceId)

  if (error) throw error
}

export async function toggleServiceFeatured(
  supabase: SupabaseClient,
  serviceId: string,
  isFeatured: boolean
) {
  const { error } = await supabase
    .from('services')
    .update({ is_featured: isFeatured, updated_at: new Date().toISOString() })
    .eq('id', serviceId)

  if (error) throw error
}

// ── Coupon actions ──────────────────────────────────────────────────

export async function createCoupon(
  supabase: SupabaseClient,
  data: Record<string, unknown>
) {
  const { error } = await supabase.from('coupons').insert(data)
  if (error) throw error
}

export async function updateCoupon(
  supabase: SupabaseClient,
  couponId: string,
  data: Record<string, unknown>
) {
  const { error } = await supabase
    .from('coupons')
    .update(data)
    .eq('id', couponId)

  if (error) throw error
}

// ── Review actions ──────────────────────────────────────────────────

export async function toggleReviewPublished(
  supabase: SupabaseClient,
  reviewId: string,
  isPublished: boolean
) {
  const { error } = await supabase
    .from('reviews')
    .update({ is_published: isPublished })
    .eq('id', reviewId)

  if (error) throw error
}

export async function addAdminResponse(
  supabase: SupabaseClient,
  reviewId: string,
  response: string
) {
  const { error } = await supabase
    .from('reviews')
    .update({ admin_response: response })
    .eq('id', reviewId)

  if (error) throw error
}
