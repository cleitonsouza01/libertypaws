'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/routing'
import { Link } from '@/i18n/routing'
import { createClient } from '@/lib/supabase/client'
import { fetchPaginatedRegistrations } from '@/lib/admin/queries'
import { approveRegistration, rejectRegistration } from '@/lib/admin/actions'
import { DataTable, type Column } from '@/components/admin/data-table'
import { SearchFilterBar } from '@/components/admin/search-filter-bar'
import { AdminPagination } from '@/components/admin/admin-pagination'
import { StatusBadge } from '@/components/admin/status-badge'
import { Check, X, Plus } from 'lucide-react'
import type { AdminRegistration, PaginatedResult } from '@/types/admin'

export default function AdminRegistrationsPage() {
  const t = useTranslations('admin.registrations')
  const router = useRouter()
  const [result, setResult] = useState<PaginatedResult<AdminRegistration> | null>(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const [sortBy, setSortBy] = useState('')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const load = useCallback(async () => {
    setLoading(true)
    const supabase = createClient()
    const data = await fetchPaginatedRegistrations(supabase, { page, search, sortBy, sortOrder, status })
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

  async function handleQuickApprove(e: React.MouseEvent, reg: AdminRegistration) {
    e.stopPropagation()
    const supabase = createClient()
    await approveRegistration(supabase, reg.id)
    load()
  }

  async function handleQuickReject(e: React.MouseEvent, reg: AdminRegistration) {
    e.stopPropagation()
    const supabase = createClient()
    await rejectRegistration(supabase, reg.id)
    load()
  }

  const statusOptions = [
    { value: 'pending_review', label: t('statuses.pendingReview') },
    { value: 'active', label: t('statuses.active') },
    { value: 'suspended', label: t('statuses.suspended') },
    { value: 'revoked', label: t('statuses.revoked') },
    { value: 'expired', label: t('statuses.expired') },
  ]

  const columns: Column<AdminRegistration>[] = [
    { key: 'registration_number', header: t('regNumber'), sortable: true },
    {
      key: 'status',
      header: t('status'),
      render: (row) => <StatusBadge status={row.status} />,
    },
    { key: 'pet_name', header: t('petName'), sortable: true },
    { key: 'registration_type', header: t('type'), className: 'hidden md:table-cell' },
    { key: 'user_name', header: t('owner'), className: 'hidden lg:table-cell' },
    {
      key: 'created_at',
      header: t('date'),
      sortable: true,
      render: (row) => new Date(row.created_at).toLocaleDateString(),
    },
    {
      key: 'actions',
      header: '',
      render: (row) =>
        row.status === 'pending_review' ? (
          <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
            <button
              className="btn btn-success btn-xs btn-circle"
              title={t('approve')}
              onClick={(e) => handleQuickApprove(e, row)}
            >
              <Check className="h-3 w-3" />
            </button>
            <button
              className="btn btn-error btn-xs btn-circle"
              title={t('reject')}
              onClick={(e) => handleQuickReject(e, row)}
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ) : null,
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-secondary">{t('title')}</h1>
        <Link href="/admin/registrations/new" className="btn btn-primary btn-sm gap-1">
          <Plus className="h-4 w-4" />
          {t('addRegistration')}
        </Link>
      </div>

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
            onRowClick={(row) => router.push(`/admin/registrations/${row.id}`)}
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
