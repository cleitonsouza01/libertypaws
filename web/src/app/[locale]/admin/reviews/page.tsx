'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase/client'
import { fetchPaginatedReviews } from '@/lib/admin/queries'
import { toggleReviewPublished, addAdminResponse } from '@/lib/admin/actions'
import { DataTable, type Column } from '@/components/admin/data-table'
import { SearchFilterBar } from '@/components/admin/search-filter-bar'
import { AdminPagination } from '@/components/admin/admin-pagination'
import { Star, MessageSquare } from 'lucide-react'
import type { AdminReview, PaginatedResult } from '@/types/admin'

export default function AdminReviewsPage() {
  const t = useTranslations('admin.reviews')
  const [result, setResult] = useState<PaginatedResult<AdminReview> | null>(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [sortBy, setSortBy] = useState('')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [responseText, setResponseText] = useState('')
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    const supabase = createClient()
    const data = await fetchPaginatedReviews(supabase, { page, search, sortBy, sortOrder })
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

  async function handleTogglePublished(e: React.MouseEvent, review: AdminReview) {
    e.stopPropagation()
    const supabase = createClient()
    await toggleReviewPublished(supabase, review.id, !review.is_published)
    load()
  }

  async function handleSaveResponse(reviewId: string) {
    setSaving(true)
    const supabase = createClient()
    await addAdminResponse(supabase, reviewId, responseText)
    setExpandedId(null)
    setResponseText('')
    setSaving(false)
    load()
  }

  const columns: Column<AdminReview>[] = [
    {
      key: 'rating',
      header: t('rating'),
      render: (row) => (
        <div className="flex items-center gap-1">
          <Star className="h-4 w-4 fill-warning text-warning" />
          <span className="font-medium">{row.rating}</span>
        </div>
      ),
    },
    { key: 'title', header: t('reviewTitle'), sortable: true },
    { key: 'user_name', header: t('customer'), className: 'hidden md:table-cell' },
    { key: 'service_name', header: t('service'), className: 'hidden lg:table-cell' },
    {
      key: 'is_published',
      header: t('published'),
      render: (row) => (
        <div onClick={(e) => e.stopPropagation()}>
          <input
            type="checkbox"
            className="toggle toggle-success toggle-sm"
            checked={row.is_published}
            onChange={(e) => handleTogglePublished(e as unknown as React.MouseEvent, row)}
          />
        </div>
      ),
    },
    {
      key: 'actions',
      header: '',
      render: (row) => (
        <button
          className="btn btn-ghost btn-xs"
          onClick={(e) => {
            e.stopPropagation()
            setExpandedId(expandedId === row.id ? null : row.id)
            setResponseText(row.admin_response ?? '')
          }}
        >
          <MessageSquare className="h-3 w-3" />
        </button>
      ),
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
            onRowClick={(row) => {
              setExpandedId(expandedId === row.id ? null : row.id)
              setResponseText(row.admin_response ?? '')
            }}
            rowKey={(row) => row.id}
          />
        </div>
      </div>

      {/* Expanded review detail */}
      {expandedId && result?.data && (() => {
        const review = result.data.find((r) => r.id === expandedId)
        if (!review) return null
        return (
          <div className="card bg-base-200 shadow-sm">
            <div className="card-body space-y-3">
              <div>
                <h3 className="font-bold">{review.title}</h3>
                <p className="text-sm text-base-content/70">{review.comment}</p>
                <p className="mt-1 text-xs text-base-content/40">
                  {review.user_name} — {new Date(review.created_at).toLocaleDateString()}
                </p>
              </div>

              <div className="divider my-0" />

              <fieldset className="fieldset">
                <legend className="fieldset-legend">{t('adminResponse')}</legend>
                <textarea
                  className="textarea textarea-bordered w-full"
                  rows={3}
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder={t('responsePlaceholder')}
                />
              </fieldset>

              <div className="card-actions justify-end">
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => setExpandedId(null)}
                >
                  {t('cancel')}
                </button>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => handleSaveResponse(review.id)}
                  disabled={saving}
                >
                  {saving ? <span className="loading loading-spinner loading-xs" /> : t('saveResponse')}
                </button>
              </div>
            </div>
          </div>
        )
      })()}

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
