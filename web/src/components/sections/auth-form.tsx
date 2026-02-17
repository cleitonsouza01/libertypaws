import { cn } from '@/lib/utils'

interface AuthFormProps {
  title: string
  subtitle?: string
  children: React.ReactNode
  className?: string
}

export function AuthForm({ title, subtitle, children, className }: AuthFormProps) {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div
        className={cn(
          'card bg-base-200 w-full max-w-md shadow-sm',
          className
        )}
      >
        <div className="card-body gap-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-secondary">{title}</h1>
            {subtitle && (
              <p className="mt-1 text-sm text-base-content/60">{subtitle}</p>
            )}
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}
