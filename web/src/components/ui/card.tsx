import { cn } from '@/lib/utils'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
}

export function Card({ children, className, hover = false }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-border-light bg-white p-6 shadow-sm',
        hover && 'transition-all duration-200 hover:shadow-md hover:-translate-y-1',
        className
      )}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className }: CardProps) {
  return <div className={cn('mb-4', className)}>{children}</div>
}

export function CardContent({ children, className }: CardProps) {
  return <div className={cn('', className)}>{children}</div>
}

export function CardFooter({ children, className }: CardProps) {
  return <div className={cn('mt-4 pt-4 border-t border-border-light', className)}>{children}</div>
}
