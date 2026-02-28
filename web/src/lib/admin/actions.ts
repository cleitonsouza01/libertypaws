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
  const { error } = await supabase
    .from('services')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', serviceId)

  if (error) throw error
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
