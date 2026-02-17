'use client'

import { forwardRef, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface PasswordInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  error?: string
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, label, error, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false)

    return (
      <fieldset className="fieldset w-full">
        {label && <legend className="fieldset-legend">{label}</legend>}
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            className={cn(
              'input input-lg w-full pr-12',
              error && 'input-error',
              className
            )}
            ref={ref}
            {...props}
          />
          <button
            type="button"
            className="btn btn-ghost btn-sm btn-square absolute right-2 top-1/2 -translate-y-1/2"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-base-content/50" />
            ) : (
              <Eye className="h-4 w-4 text-base-content/50" />
            )}
          </button>
        </div>
        {error && <p className="label text-error">{error}</p>}
      </fieldset>
    )
  }
)
PasswordInput.displayName = 'PasswordInput'

export { PasswordInput }
