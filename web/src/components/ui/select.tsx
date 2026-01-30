import { forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { ChevronDown } from 'lucide-react'

export interface SelectOption {
  value: string
  label: string
}

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: SelectOption[]
  placeholder?: string
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, placeholder, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="mb-2 block text-sm font-medium text-text-primary">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            className={cn(
              'flex h-12 w-full appearance-none rounded-xl border border-border-default bg-white px-4 py-2 pr-10 text-base text-text-primary transition-colors',
              'focus:border-brand-lime focus:outline-none focus:ring-2 focus:ring-brand-lime/20',
              'disabled:cursor-not-allowed disabled:opacity-50',
              error && 'border-brand-red focus:border-brand-red focus:ring-brand-red/20',
              className
            )}
            ref={ref}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted" />
        </div>
        {error && (
          <p className="mt-1 text-sm text-brand-red">{error}</p>
        )}
      </div>
    )
  }
)
Select.displayName = 'Select'

export { Select }
