'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter, Link } from '@/i18n/routing'
import { createClient } from '@/lib/supabase/client'
import { fetchPaginatedCoupons } from '@/lib/admin/queries'
import { DataTable, type Column } from '@/components/admin/data-table'
import { SearchFilterBar } from '@/components/admin/search-filter-bar'
import { AdminPagination } from '@/components/admin/admin-pagination'
import { Plus } from 'lucide-react'
import type { AdminCoupon, PaginatedResult } from '@/types/admin'

export default function AdminCouponsPage() {
  const t = useTranslations('admin.coupons')
  const router = useRouter()
  const [result, setResult] = useState<PaginatedResult<AdminCoupon> | null>(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [sortBy, setSortBy] = useState('')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const load = useCallback(async () => {
    setLoading(true)
    const supabase = createClient()
    const data = await fetchPaginatedCoupons(supabase, { page, search, sortBy, sortOrder })
    setResult(data)
    setLoading(false)
  }, [page, search, sortBy, sortOrder])

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

  const columns: Column<AdminCoupon>[] = [
    {
      key: 'code',
      header: t('code'),
      sortable: true,
      render: (row) => <span className="font-mono font-bold">{row.code}</span>,
    },
    { key: 'description', header: t('description'), className: 'hidden md:table-cell' },
    {
      key: 'discount_value',
      header: t('discount'),
      render: (row) =>
        row.discount_type === 'percentage'
          ? `${row.discount_value}%`
          : `$${Number(row.discount_value).toFixed(2)}`,
    },
    {
      key: 'current_uses',
      header: t('uses'),
      render: (row) =>
        row.max_uses ? `${row.current_uses}/${row.max_uses}` : String(row.current_uses),
    },
    {
      key: 'is_active',
      header: t('status'),
      render: (row) => (
        <span className={`badge badge-sm ${row.is_active ? 'badge-success' : 'badge-ghost'}`}>
          {row.is_active ? t('active') : t('inactive')}
        </span>
      ),
    },
    {
      key: 'valid_until',
      header: t('expires'),
      render: (row) => row.valid_until ? new Date(row.valid_until).toLocaleDateString() : '—',
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-secondary">{t('title')}</h1>
        <Link href="/admin/coupons/new" className="btn btn-primary btn-sm">
          <Plus className="h-4 w-4" /> {t('addCoupon')}
        </Link>
      </div>

      <SearchFilterBar
        search={search}
        onSearchChange={(v) => { setSearch(v); setPage(1) }}
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
            onRowClick={(row) => router.push(`/admin/coupons/${row.id}`)}
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
