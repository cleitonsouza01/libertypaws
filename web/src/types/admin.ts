// ── Admin entity types ──────────────────────────────────────────────

export interface AdminProfile {
  id: string
  email: string
  full_name: string
  avatar_url: string | null
  locale: string
  created_at: string
  updated_at: string
  role: 'admin' | 'user'
  orders_count?: number
  registrations_count?: number
}

export interface AdminOrder {
  id: string
  customer_id: string
  order_number: string
  status: OrderStatus
  total_amount: number
  currency: string
  admin_notes: string | null
  created_at: string
  updated_at: string
  // Joined
  user_email?: string
  user_name?: string
  items_count?: number
}

export type OrderStatus =
  | 'pending'
  | 'paid'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'completed'
  | 'cancelled'
  | 'refunded'
  | 'failed'

export interface AdminOrderItem {
  id: string
  order_id: string
  service_id: string
  quantity: number
  unit_price: number
  total_price: number
  service_name?: string
}

export interface AdminRegistration {
  id: string
  customer_id: string
  registration_number: string
  pet_name: string
  pet_species: string
  pet_breed: string
  registration_type: 'esa' | 'psd'
  status: RegistrationStatus
  created_at: string
  updated_at: string
  expiry_date: string | null
  // Joined
  user_email?: string
  user_name?: string
}

export type RegistrationStatus =
  | 'pending_review'
  | 'active'
  | 'suspended'
  | 'revoked'
  | 'expired'

export interface AdminContactMessage {
  id: string
  name: string
  email: string
  phone: string | null
  subject: string
  message: string
  status: MessageStatus
  assigned_to: string | null
  admin_notes: string | null
  created_at: string
  updated_at: string
}

export type MessageStatus = 'new' | 'read' | 'replied' | 'closed'

export interface AdminService {
  id: string
  name: string
  slug: string
  description: string
  price: number
  currency: string
  category: string
  is_active: boolean
  is_featured: boolean
  features: string[]
  tags: string[]
  created_at: string
  updated_at: string
}

export interface AdminCoupon {
  id: string
  code: string
  description: string
  discount_type: 'percentage' | 'fixed_amount'
  discount_value: number
  min_order_amount: number | null
  max_uses: number | null
  current_uses: number
  is_active: boolean
  valid_from: string | null
  valid_until: string | null
  created_at: string
}

export interface AdminReview {
  id: string
  customer_id: string
  service_id: string | null
  rating: number
  title: string
  comment: string
  is_published: boolean
  admin_response: string | null
  created_at: string
  // Joined
  user_name?: string
  user_email?: string
  service_name?: string
}

// ── Pagination & Filtering ──────────────────────────────────────────

export interface PaginatedResult<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface PaginationParams {
  page?: number
  pageSize?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface DashboardStats {
  totalUsers: number
  totalOrders: number
  totalRegistrations: number
  pendingRegistrations: number
  unreadMessages: number
  totalRevenue: number
  activeServices: number
  activeCoupons: number
}

export interface ActivityItem {
  id: string
  type: 'order' | 'registration' | 'message' | 'review'
  title: string
  description: string
  timestamp: string
  status?: string
}
