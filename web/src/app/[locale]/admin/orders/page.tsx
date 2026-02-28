'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/routing'
import { createClient } from '@/lib/supabase/client'
import { fetchPaginatedOrders } from '@/lib/admin/queries'
import { DataTable, type Column } from '@/components/admin/data-table'
import { SearchFilterBar } from '@/components/admin/search-filter-bar'
import { AdminPagination } from '@/components/admin/admin-pagination'
import { StatusBadge } from '@/components/admin/status-badge'
import type { AdminOrder, PaginatedResult } from '@/types/admin'

export default function AdminOrdersPage() {
  const t = useTranslations('admin.orders')
  const router = useRouter()
  const [result, setResult] = useState<PaginatedResult<AdminOrder> | null>(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const [sortBy, setSortBy] = useState('')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const load = useCallback(async () => {
    setLoading(true)
    const supabase = createClient()
    const data = await fetchPaginatedOrders(supabase, { page, search, sortBy, sortOrder, status })
    setResult(data)
    setLoading(false)
  }, [page, search, sortBy, sortOrder, status])

  useEffect(() => {
    const timer = setTimeout(load, search ? 300 : 0)
    return () => clearTimeout(timer)
  }, [load, search])

  function handleSort(key: string) {
    if (sortBy === key) {
      setSortOrder((o) => (o === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortBy(key)
      setSortOrder('asc')
    }
  }

  const statusOptions = [
    { value: 'pending', label: t('statuses.pending') },
    { value: 'paid', label: t('statuses.paid') },
    { value: 'processing', label: t('statuses.processing') },
    { value: 'shipped', label: t('statuses.shipped') },
    { value: 'delivered', label: t('statuses.delivered') },
    { value: 'completed', label: t('statuses.completed') },
    { value: 'cancelled', label: t('statuses.cancelled') },
    { value: 'refunded', label: t('statuses.refunded') },
    { value: 'failed', label: t('statuses.failed') },
  ]

  const columns: Column<AdminOrder>[] = [
    { key: 'order_number', header: t('orderNumber'), sortable: true },
    {
      key: 'status',
      header: t('status'),
      render: (row) => <StatusBadge status={row.status} />,
    },
    { key: 'user_name', header: t('customer') },
    {
      key: 'total_amount',
      header: t('total'),
      sortable: true,
      render: (row) => `$${Number(row.total_amount).toFixed(2)}`,
    },
    {
      key: 'created_at',
      header: t('date'),
      sortable: true,
      render: (row) => new Date(row.created_at).toLocaleDateString(),
    },
  ]

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-secondary">{t('title')}</h1>

      <SearchFilterBar
        search={search}
        onSearchChange={(v) => { setSearch(v); setPage(1) }}
        filters={[
          {
            key: 'status',
            label: t('filterByStatus'),
            value: status,
            options: statusOptions,
            onChange: (v) => { setStatus(v); setPage(1) },
          },
        ]}
      />

      <div className="card bg-base-200 shadow-sm">
        <div className="card-body p-0">
          <DataTable
            columns={columns}
            data={result?.data ?? []}
            loading={loading}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={handleSort}
            onRowClick={(row) => router.push(`/admin/orders/${row.id}`)}
            rowKey={(row) => row.id}
          />
        </div>
      </div>

      {result && (
        <AdminPagination
          page={result.page}
          totalPages={result.totalPages}
          total={result.total}
          onPageChange={setPage}
        />
      )}
    </div>
  )
}
