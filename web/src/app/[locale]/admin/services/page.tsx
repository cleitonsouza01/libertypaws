'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/routing'
import { createClient } from '@/lib/supabase/client'
import { fetchPaginatedServices } from '@/lib/admin/queries'
import { toggleServiceActive, toggleServiceFeatured } from '@/lib/admin/actions'
import { DataTable, type Column } from '@/components/admin/data-table'
import { SearchFilterBar } from '@/components/admin/search-filter-bar'
import { AdminPagination } from '@/components/admin/admin-pagination'
import { Plus } from 'lucide-react'
import { Link } from '@/i18n/routing'
import type { AdminService, PaginatedResult } from '@/types/admin'

export default function AdminServicesPage() {
  const t = useTranslations('admin.services')
  const router = useRouter()
  const [result, setResult] = useState<PaginatedResult<AdminService> | null>(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [sortBy, setSortBy] = useState('')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const load = useCallback(async () => {
    setLoading(true)
    const supabase = createClient()
    const data = await fetchPaginatedServices(supabase, { page, search, sortBy, sortOrder })
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

  async function handleToggleActive(e: React.MouseEvent, svc: AdminService) {
    e.stopPropagation()
    const supabase = createClient()
    await toggleServiceActive(supabase, svc.id, !svc.is_active)
    load()
  }

  async function handleToggleFeatured(e: React.MouseEvent, svc: AdminService) {
    e.stopPropagation()
    const supabase = createClient()
    await toggleServiceFeatured(supabase, svc.id, !svc.is_featured)
    load()
  }

  const columns: Column<AdminService>[] = [
    { key: 'name', header: t('name'), sortable: true },
    { key: 'category', header: t('category'), className: 'hidden md:table-cell' },
    {
      key: 'price',
      header: t('price'),
      sortable: true,
      render: (row) => `$${Number(row.price).toFixed(2)}`,
    },
    {
      key: 'is_active',
      header: t('active'),
      render: (row) => (
        <div onClick={(e) => e.stopPropagation()}>
          <input
            type="checkbox"
            className="toggle toggle-primary toggle-sm"
            checked={row.is_active}
            onChange={(e) => handleToggleActive(e as unknown as React.MouseEvent, row)}
          />
        </div>
      ),
    },
    {
      key: 'is_featured',
      header: t('featured'),
      render: (row) => (
        <div onClick={(e) => e.stopPropagation()}>
          <input
            type="checkbox"
            className="toggle toggle-secondary toggle-sm"
            checked={row.is_featured}
            onChange={(e) => handleToggleFeatured(e as unknown as React.MouseEvent, row)}
          />
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-secondary">{t('title')}</h1>
        <Link href="/admin/services/new" className="btn btn-primary btn-sm">
          <Plus className="h-4 w-4" /> {t('addService')}
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
            onRowClick={(row) => router.push(`/admin/services/${row.id}`)}
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
