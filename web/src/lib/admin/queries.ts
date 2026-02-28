import type { SupabaseClient } from '@supabase/supabase-js'
import type {
  DashboardStats,
  ActivityItem,
  PaginatedResult,
  PaginationParams,
  AdminProfile,
  AdminOrder,
  AdminRegistration,
  AdminContactMessage,
  AdminService,
  AdminCoupon,
  AdminReview,
} from '@/types/admin'

// ── Dashboard ───────────────────────────────────────────────────────

export async function fetchDashboardStats(supabase: SupabaseClient): Promise<DashboardStats> {
  const [users, orders, registrations, pendingRegs, messages, services, coupons, revenue] =
    await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('orders').select('*', { count: 'exact', head: true }),
      supabase.from('pet_registrations').select('*', { count: 'exact', head: true }),
      supabase.from('pet_registrations').select('*', { count: 'exact', head: true }).eq('status', 'pending_review'),
      supabase.from('contact_messages').select('*', { count: 'exact', head: true }).eq('status', 'new'),
      supabase.from('services').select('*', { count: 'exact', head: true }).eq('is_active', true),
      supabase.from('coupons').select('*', { count: 'exact', head: true }).eq('is_active', true),
      supabase.from('orders').select('total_amount').eq('status', 'delivered'),
    ])

  const totalRevenue = (revenue.data ?? []).reduce(
    (sum, o) => sum + (Number(o.total_amount) || 0),
    0
  )

  return {
    totalUsers: users.count ?? 0,
    totalOrders: orders.count ?? 0,
    totalRegistrations: registrations.count ?? 0,
    pendingRegistrations: pendingRegs.count ?? 0,
    unreadMessages: messages.count ?? 0,
    totalRevenue,
    activeServices: services.count ?? 0,
    activeCoupons: coupons.count ?? 0,
  }
}

export async function fetchRecentActivity(supabase: SupabaseClient): Promise<ActivityItem[]> {
  const [orders, registrations, messages] = await Promise.all([
    supabase
      .from('orders')
      .select('id, order_number, status, created_at')
      .order('created_at', { ascending: false })
      .limit(5),
    supabase
      .from('pet_registrations')
      .select('id, registration_number, pet_name, status, created_at')
      .order('created_at', { ascending: false })
      .limit(5),
    supabase
      .from('contact_messages')
      .select('id, name, subject, created_at')
      .order('created_at', { ascending: false })
      .limit(5),
  ])

  const items: ActivityItem[] = [
    ...(orders.data ?? []).map((o) => ({
      id: `order-${o.id}`,
      type: 'order' as const,
      title: `Order #${o.order_number}`,
      description: `Status: ${o.status}`,
      timestamp: o.created_at,
      status: o.status,
    })),
    ...(registrations.data ?? []).map((r) => ({
      id: `reg-${r.id}`,
      type: 'registration' as const,
      title: `Registration ${r.registration_number}`,
      description: `${r.pet_name} — ${r.status}`,
      timestamp: r.created_at,
      status: r.status,
    })),
    ...(messages.data ?? []).map((m) => ({
      id: `msg-${m.id}`,
      type: 'message' as const,
      title: m.subject,
      description: `From: ${m.name}`,
      timestamp: m.created_at,
    })),
  ]

  items.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  return items.slice(0, 10)
}

// ── Users ───────────────────────────────────────────────────────────

export async function fetchPaginatedUsers(
  supabase: SupabaseClient,
  params: PaginationParams
): Promise<PaginatedResult<AdminProfile>> {
  const page = params.page ?? 1
  const pageSize = params.pageSize ?? 20

  let query = supabase
    .from('profiles')
    .select('*', { count: 'exact' })

  if (params.search) {
    query = query.or(`full_name.ilike.%${params.search}%,email.ilike.%${params.search}%`)
  }

  if (params.sortBy) {
    query = query.order(params.sortBy, { ascending: params.sortOrder !== 'desc' })
  } else {
    query = query.order('created_at', { ascending: false })
  }

  const from = (page - 1) * pageSize
  query = query.range(from, from + pageSize - 1)

  const { data, count, error } = await query

  if (error) throw error

  return {
    data: (data ?? []) as unknown as AdminProfile[],
    total: count ?? 0,
    page,
    pageSize,
    totalPages: Math.ceil((count ?? 0) / pageSize),
  }
}

export async function fetchUserDetail(
  supabase: SupabaseClient,
  userId: string
): Promise<AdminProfile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error || !data) return null
  return data as unknown as AdminProfile
}

// ── Orders ──────────────────────────────────────────────────────────

export async function fetchPaginatedOrders(
  supabase: SupabaseClient,
  params: PaginationParams & { status?: string }
): Promise<PaginatedResult<AdminOrder>> {
  const page = params.page ?? 1
  const pageSize = params.pageSize ?? 20

  let query = supabase
    .from('orders')
    .select('*, profiles!orders_customer_id_fkey(full_name, email)', { count: 'exact' })

  if (params.status) {
    query = query.eq('status', params.status)
  }

  if (params.search) {
    query = query.or(`order_number.ilike.%${params.search}%`)
  }

  if (params.sortBy) {
    query = query.order(params.sortBy, { ascending: params.sortOrder !== 'desc' })
  } else {
    query = query.order('created_at', { ascending: false })
  }

  const from = (page - 1) * pageSize
  query = query.range(from, from + pageSize - 1)

  const { data, count, error } = await query

  if (error) throw error

  const mapped = (data ?? []).map((row: Record<string, unknown>) => {
    const profile = row.profiles as Record<string, string> | null
    return {
      ...row,
      user_name: profile?.full_name ?? '',
      user_email: profile?.email ?? '',
      profiles: undefined,
    }
  }) as unknown as AdminOrder[]

  return {
    data: mapped,
    total: count ?? 0,
    page,
    pageSize,
    totalPages: Math.ceil((count ?? 0) / pageSize),
  }
}

export async function fetchOrderDetail(
  supabase: SupabaseClient,
  orderId: string
) {
  const [orderResult, itemsResult] = await Promise.all([
    supabase
      .from('orders')
      .select('*, profiles!orders_customer_id_fkey(full_name, email)')
      .eq('id', orderId)
      .single(),
    supabase
      .from('order_items')
      .select('*, services(name)')
      .eq('order_id', orderId),
  ])

  if (orderResult.error || !orderResult.data) return null

  const profile = (orderResult.data as Record<string, unknown>).profiles as Record<string, string> | null

  return {
    order: {
      ...orderResult.data,
      user_name: profile?.full_name ?? '',
      user_email: profile?.email ?? '',
      profiles: undefined,
    } as unknown as AdminOrder,
    items: (itemsResult.data ?? []).map((item: Record<string, unknown>) => {
      const svc = item.services as Record<string, string> | null
      return {
        ...item,
        service_name: svc?.name ?? '',
        services: undefined,
      }
    }) as unknown as import('@/types/admin').AdminOrderItem[],
  }
}

// ── Registrations ───────────────────────────────────────────────────

export async function fetchPaginatedRegistrations(
  supabase: SupabaseClient,
  params: PaginationParams & { status?: string }
): Promise<PaginatedResult<AdminRegistration>> {
  const page = params.page ?? 1
  const pageSize = params.pageSize ?? 20

  let query = supabase
    .from('pet_registrations')
    .select('*, profiles!pet_registrations_customer_id_fkey(full_name, email)', { count: 'exact' })

  if (params.status) {
    query = query.eq('status', params.status)
  }

  if (params.search) {
    query = query.or(
      `registration_number.ilike.%${params.search}%,pet_name.ilike.%${params.search}%`
    )
  }

  if (params.sortBy) {
    query = query.order(params.sortBy, { ascending: params.sortOrder !== 'desc' })
  } else {
    query = query.order('created_at', { ascending: false })
  }

  const from = (page - 1) * pageSize
  query = query.range(from, from + pageSize - 1)

  const { data, count, error } = await query

  if (error) throw error

  const mapped = (data ?? []).map((row: Record<string, unknown>) => {
    const profile = row.profiles as Record<string, string> | null
    return {
      ...row,
      user_name: profile?.full_name ?? '',
      user_email: profile?.email ?? '',
      profiles: undefined,
    }
  }) as unknown as AdminRegistration[]

  return {
    data: mapped,
    total: count ?? 0,
    page,
    pageSize,
    totalPages: Math.ceil((count ?? 0) / pageSize),
  }
}

export async function fetchRegistrationDetail(
  supabase: SupabaseClient,
  regId: string
) {
  const { data, error } = await supabase
    .from('pet_registrations')
    .select('*, profiles!pet_registrations_customer_id_fkey(full_name, email)')
    .eq('id', regId)
    .single()

  if (error || !data) return null

  const profile = (data as Record<string, unknown>).profiles as Record<string, string> | null

  return {
    ...data,
    user_name: profile?.full_name ?? '',
    user_email: profile?.email ?? '',
    profiles: undefined,
  } as unknown as AdminRegistration
}

// ── Messages ────────────────────────────────────────────────────────

export async function fetchPaginatedMessages(
  supabase: SupabaseClient,
  params: PaginationParams & { status?: string }
): Promise<PaginatedResult<AdminContactMessage>> {
  const page = params.page ?? 1
  const pageSize = params.pageSize ?? 20

  let query = supabase
    .from('contact_messages')
    .select('*', { count: 'exact' })

  if (params.status) {
    query = query.eq('status', params.status)
  }

  if (params.search) {
    query = query.or(`name.ilike.%${params.search}%,email.ilike.%${params.search}%,subject.ilike.%${params.search}%`)
  }

  if (params.sortBy) {
    query = query.order(params.sortBy, { ascending: params.sortOrder !== 'desc' })
  } else {
    query = query.order('created_at', { ascending: false })
  }

  const from = (page - 1) * pageSize
  query = query.range(from, from + pageSize - 1)

  const { data, count, error } = await query

  if (error) throw error

  return {
    data: (data ?? []) as unknown as AdminContactMessage[],
    total: count ?? 0,
    page,
    pageSize,
    totalPages: Math.ceil((count ?? 0) / pageSize),
  }
}

// ── Services ────────────────────────────────────────────────────────

export async function fetchPaginatedServices(
  supabase: SupabaseClient,
  params: PaginationParams & { category?: string }
): Promise<PaginatedResult<AdminService>> {
  const page = params.page ?? 1
  const pageSize = params.pageSize ?? 20

  let query = supabase
    .from('services')
    .select('*', { count: 'exact' })

  if (params.category) {
    query = query.eq('category', params.category)
  }

  if (params.search) {
    query = query.or(`name.ilike.%${params.search}%,slug.ilike.%${params.search}%`)
  }

  if (params.sortBy) {
    query = query.order(params.sortBy, { ascending: params.sortOrder !== 'desc' })
  } else {
    query = query.order('created_at', { ascending: false })
  }

  const from = (page - 1) * pageSize
  query = query.range(from, from + pageSize - 1)

  const { data, count, error } = await query

  if (error) throw error

  return {
    data: (data ?? []) as unknown as AdminService[],
    total: count ?? 0,
    page,
    pageSize,
    totalPages: Math.ceil((count ?? 0) / pageSize),
  }
}

export async function fetchServiceDetail(
  supabase: SupabaseClient,
  serviceId: string
): Promise<AdminService | null> {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('id', serviceId)
    .single()

  if (error || !data) return null
  return data as unknown as AdminService
}

// ── Coupons ─────────────────────────────────────────────────────────

export async function fetchPaginatedCoupons(
  supabase: SupabaseClient,
  params: PaginationParams
): Promise<PaginatedResult<AdminCoupon>> {
  const page = params.page ?? 1
  const pageSize = params.pageSize ?? 20

  let query = supabase
    .from('coupons')
    .select('*', { count: 'exact' })

  if (params.search) {
    query = query.or(`code.ilike.%${params.search}%,description.ilike.%${params.search}%`)
  }

  if (params.sortBy) {
    query = query.order(params.sortBy, { ascending: params.sortOrder !== 'desc' })
  } else {
    query = query.order('created_at', { ascending: false })
  }

  const from = (page - 1) * pageSize
  query = query.range(from, from + pageSize - 1)

  const { data, count, error } = await query

  if (error) throw error

  return {
    data: (data ?? []) as unknown as AdminCoupon[],
    total: count ?? 0,
    page,
    pageSize,
    totalPages: Math.ceil((count ?? 0) / pageSize),
  }
}

// ── Reviews ─────────────────────────────────────────────────────────

export async function fetchPaginatedReviews(
  supabase: SupabaseClient,
  params: PaginationParams & { published?: boolean }
): Promise<PaginatedResult<AdminReview>> {
  const page = params.page ?? 1
  const pageSize = params.pageSize ?? 20

  let query = supabase
    .from('reviews')
    .select('*, profiles!reviews_customer_id_fkey(full_name, email), services(name)', { count: 'exact' })

  if (params.published !== undefined) {
    query = query.eq('is_published', params.published)
  }

  if (params.search) {
    query = query.or(`title.ilike.%${params.search}%,comment.ilike.%${params.search}%`)
  }

  if (params.sortBy) {
    query = query.order(params.sortBy, { ascending: params.sortOrder !== 'desc' })
  } else {
    query = query.order('created_at', { ascending: false })
  }

  const from = (page - 1) * pageSize
  query = query.range(from, from + pageSize - 1)

  const { data, count, error } = await query

  if (error) throw error

  const mapped = (data ?? []).map((row: Record<string, unknown>) => {
    const profile = row.profiles as Record<string, string> | null
    const svc = row.services as Record<string, string> | null
    return {
      ...row,
      user_name: profile?.full_name ?? '',
      user_email: profile?.email ?? '',
      service_name: svc?.name ?? '',
      profiles: undefined,
      services: undefined,
    }
  }) as unknown as AdminReview[]

  return {
    data: mapped,
    total: count ?? 0,
    page,
    pageSize,
    totalPages: Math.ceil((count ?? 0) / pageSize),
  }
}
