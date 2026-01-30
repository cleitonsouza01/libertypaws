import { cn } from '@/lib/utils'

interface TypographyProps {
  children: React.ReactNode
  className?: string
}

export function H1({ children, className }: TypographyProps) {
  return (
    <h1
      className={cn(
        'text-4xl font-bold tracking-tight text-brand-navy md:text-5xl lg:text-6xl',
        className
      )}
    >
      {children}
    </h1>
  )
}

export function H2({ children, className }: TypographyProps) {
  return (
    <h2
      className={cn(
        'text-3xl font-bold tracking-tight text-brand-navy md:text-4xl lg:text-5xl',
        className
      )}
    >
      {children}
    </h2>
  )
}

export function H3({ children, className }: TypographyProps) {
  return (
    <h3
      className={cn(
        'text-2xl font-semibold tracking-tight text-brand-navy md:text-3xl',
        className
      )}
    >
      {children}
    </h3>
  )
}

export function H4({ children, className }: TypographyProps) {
  return (
    <h4
      className={cn(
        'text-xl font-semibold tracking-tight text-brand-navy md:text-2xl',
        className
      )}
    >
      {children}
    </h4>
  )
}

export function P({ children, className }: TypographyProps) {
  return (
    <p className={cn('text-base text-text-muted md:text-lg', className)}>
      {children}
    </p>
  )
}

export function Lead({ children, className }: TypographyProps) {
  return (
    <p className={cn('text-lg text-text-muted md:text-xl', className)}>
      {children}
    </p>
  )
}

export function Small({ children, className }: TypographyProps) {
  return (
    <p className={cn('text-sm text-text-muted', className)}>{children}</p>
  )
}
