'use client'

import { useTranslations } from 'next-intl'
import { Search } from 'lucide-react'

interface FilterOption {
  value: string
  label: string
}

interface SearchFilterBarProps {
  search: string
  onSearchChange: (value: string) => void
  filters?: {
    key: string
    label: string
    value: string
    options: FilterOption[]
    onChange: (value: string) => void
  }[]
}

export function SearchFilterBar({ search, onSearchChange, filters }: SearchFilterBarProps) {
  const t = useTranslations('admin.common')

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      {/* Search */}
      <label className="input input-bordered flex items-center gap-2 flex-1">
        <Search className="h-4 w-4 text-base-content/40" />
        <input
          type="text"
          className="grow"
          placeholder={t('search')}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </label>

      {/* Filters */}
      {filters?.map((filter) => (
        <select
          key={filter.key}
          className="select select-bordered"
          value={filter.value}
          onChange={(e) => filter.onChange(e.target.value)}
        >
          <option value="">{filter.label}</option>
          {filter.options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ))}
    </div>
  )
}
