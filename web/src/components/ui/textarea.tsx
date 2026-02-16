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
      <fieldset className="fieldset w-full">
        {label && (
          <legend className="fieldset-legend">{label}</legend>
        )}
        <textarea
          className={cn(
            'textarea textarea-lg w-full min-h-[120px]',
            error && 'textarea-error',
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="label text-error">{error}</p>
        )}
      </fieldset>
    )
  }
)
Textarea.displayName = 'Textarea'

export { Textarea }
