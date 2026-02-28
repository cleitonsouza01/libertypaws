'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/routing'
import { createClient } from '@/lib/supabase/client'
import { fetchPaginatedMessages } from '@/lib/admin/queries'
import { DataTable, type Column } from '@/components/admin/data-table'
import { SearchFilterBar } from '@/components/admin/search-filter-bar'
import { AdminPagination } from '@/components/admin/admin-pagination'
import { StatusBadge } from '@/components/admin/status-badge'
import type { AdminContactMessage, PaginatedResult } from '@/types/admin'

export default function AdminMessagesPage() {
  const t = useTranslations('admin.messages')
  const router = useRouter()
  const [result, setResult] = useState<PaginatedResult<AdminContactMessage> | null>(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const [sortBy, setSortBy] = useState('')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const load = useCallback(async () => {
    setLoading(true)
    const supabase = createClient()
    const data = await fetchPaginatedMessages(supabase, { page, search, sortBy, sortOrder, status })
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
    { value: 'new', label: t('statuses.new') },
    { value: 'read', label: t('statuses.read') },
    { value: 'replied', label: t('statuses.replied') },
    { value: 'closed', label: t('statuses.closed') },
  ]

  const columns: Column<AdminContactMessage>[] = [
    {
      key: 'status',
      header: t('status'),
      render: (row) => <StatusBadge status={row.status} />,
    },
    { key: 'name', header: t('from'), sortable: true },
    { key: 'subject', header: t('subject'), sortable: true },
    { key: 'email', header: t('email'), className: 'hidden lg:table-cell' },
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
            onRowClick={(row) => router.push(`/admin/messages/${row.id}`)}
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
