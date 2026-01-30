import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="mb-2 block text-sm font-medium text-text-primary">
            {label}
          </label>
        )}
        <textarea
          className={cn(
            'flex min-h-[120px] w-full rounded-xl border border-border-default bg-white px-4 py-3 text-base text-text-primary transition-colors',
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
Textarea.displayName = 'Textarea'

export { Textarea }
