import { cn } from '@/lib/utils'

interface PriceProps {
  amount: number
  maxAmount?: number
  className?: string
  size?: 'sm' | 'md' | 'lg'
  showFrom?: boolean
}

export function Price({
  amount,
  maxAmount,
  className,
  size = 'md',
  showFrom = false,
}: PriceProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price)
  }

  const sizeClasses = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl md:text-3xl',
  }

  return (
    <span className={cn('font-bold text-secondary', sizeClasses[size], className)}>
      {showFrom && maxAmount && (
        <span className="text-sm font-normal text-base-content/60 mr-1">From</span>
      )}
      {formatPrice(amount)}
      {maxAmount && maxAmount !== amount && (
        <>
          <span className="text-base-content/60 mx-1">-</span>
          {formatPrice(maxAmount)}
        </>
      )}
    </span>
  )
}
