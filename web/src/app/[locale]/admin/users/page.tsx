'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/routing'
import { createClient } from '@/lib/supabase/client'
import { fetchPaginatedUsers } from '@/lib/admin/queries'
import { DataTable, type Column } from '@/components/admin/data-table'
import { SearchFilterBar } from '@/components/admin/search-filter-bar'
import { AdminPagination } from '@/components/admin/admin-pagination'
import type { AdminProfile, PaginatedResult } from '@/types/admin'

export default function AdminUsersPage() {
  const t = useTranslations('admin.users')
  const router = useRouter()
  const [result, setResult] = useState<PaginatedResult<AdminProfile> | null>(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [sortBy, setSortBy] = useState('')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const load = useCallback(async () => {
    setLoading(true)
    const supabase = createClient()
    const data = await fetchPaginatedUsers(supabase, { page, search, sortBy, sortOrder })
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

  const columns: Column<AdminProfile>[] = [
    { key: 'full_name', header: t('name'), sortable: true },
    { key: 'email', header: t('email'), sortable: true },
    { key: 'locale', header: t('locale'), className: 'hidden lg:table-cell' },
    {
      key: 'created_at',
      header: t('joined'),
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
            onRowClick={(row) => router.push(`/admin/users/${row.id}`)}
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
