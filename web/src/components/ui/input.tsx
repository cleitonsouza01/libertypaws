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
      <fieldset className="fieldset w-full">
        {label && (
          <legend className="fieldset-legend">{label}</legend>
        )}
        <input
          type={type}
          className={cn(
            'input input-lg w-full',
            error && 'input-error',
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
Input.displayName = 'Input'

export { Input }
