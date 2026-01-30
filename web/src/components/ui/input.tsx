import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="mb-2 block text-sm font-medium text-text-primary">
            {label}
          </label>
        )}
        <input
          type={type}
          className={cn(
            'flex h-12 w-full rounded-xl border border-border-default bg-white px-4 py-2 text-base text-text-primary transition-colors',
            'placeholder:text-text-light',
            'focus:border-brand-lime focus:outline-none focus:ring-2 focus:ring-brand-lime/20',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-brand-red focus:border-brand-red focus:ring-brand-red/20',
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-brand-red">{error}</p>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'

export { Input }
