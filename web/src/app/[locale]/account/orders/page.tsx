'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { AuthGuard } from '@/components/layout/auth-guard'
import { AccountLayout } from '@/components/layout/account-layout'
import { Button } from '@/components/ui/button'
import {
  ShoppingBag,
  Package,
  Eye,
  ChevronRight,
} from 'lucide-react'

type OrderStatus = 'processing' | 'evaluated' | 'shipped' | 'delivered' | 'cancelled'

interface MockOrder {
  id: string
  date: string
  status: OrderStatus
  total: number
  items: {
    name: string
    quantity: number
    price: number
  }[]
  stepIndex: number
}

const mockOrders: MockOrder[] = [
  {
    id: 'LP-2026-001847',
    date: '2026-02-10',
    status: 'shipped',
    total: 249,
    items: [
      { name: 'ESA Complete Package', quantity: 1, price: 249 },
    ],
    stepIndex: 3,
  },
  {
    id: 'LP-2026-001632',
    date: '2026-01-22',
    status: 'delivered',
    total: 349,
    items: [
      { name: 'PSD Complete Kit', quantity: 1, price: 349 },
    ],
    stepIndex: 4,
  },
  {
    id: 'LP-2026-001501',
    date: '2026-01-05',
    status: 'processing',
    total: 149,
    items: [
      { name: 'ESA Letter for Housing', quantity: 1, price: 149 },
    ],
    stepIndex: 1,
  },
]

const statusColorMap: Record<OrderStatus, string> = {
  processing: 'badge-warning',
  evaluated: 'badge-info',
  shipped: 'badge-accent',
  delivered: 'badge-success',
  cancelled: 'badge-error',
}

function OrdersContent() {
  const t = useTranslations('auth.account.ordersPage')

  const stepKeys = ['ordered', 'evaluation', 'processing', 'shipped', 'delivered'] as const

  if (mockOrders.length === 0) {
    return (
      <div className="card bg-base-200 shadow-sm">
        <div className="card-body items-center text-center py-16">
          <ShoppingBag className="h-16 w-16 text-base-content/20" />
          <p className="mt-4 text-base-content/60">{t('emptyState')}</p>
          <div className="card-actions mt-4">
            <Link href="/products">
              <Button variant="primary">{t('browseProducts')}</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-secondary">{t('title')}</h2>

      {mockOrders.map((order) => (
        <div key={order.id} className="card bg-base-200 shadow-sm">
          <div className="card-body">
            {/* Order header */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Package className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">{t('orderNumber')} #{order.id}</p>
                  <p className="text-xs text-base-content/60">
                    {t('date')}: {new Date(order.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`badge badge-soft ${statusColorMap[order.status]}`}>
                  {t(`statuses.${order.status}`)}
                </span>
                <span className="text-lg font-bold text-secondary">
                  ${order.total.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="divider my-2" />

            {/* Order items */}
            <div className="overflow-x-auto">
              <table className="table table-sm">
                <thead>
                  <tr>
                    <th>{t('items')}</th>
                    <th className="text-right">{t('total')}</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item, idx) => (
                    <tr key={idx}>
                      <td>
                        <span className="font-medium">{item.name}</span>
                        <span className="text-base-content/50"> x{item.quantity}</span>
                      </td>
                      <td className="text-right">${item.price.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Order progress steps */}
            {order.status !== 'cancelled' && (
              <>
                <div className="divider my-2" />
                <ul className="steps steps-horizontal w-full text-xs">
                  {stepKeys.map((key, idx) => (
                    <li
                      key={key}
                      className={`step ${idx < order.stepIndex ? 'step-primary' : ''}`}
                    >
                      <span className="hidden sm:inline">{t(`steps.${key}`)}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}

            {/* Actions */}
            <div className="card-actions mt-2 justify-end">
              <button className="btn btn-ghost btn-sm gap-1">
                <Eye className="h-4 w-4" />
                {t('viewDetails')}
                <ChevronRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function OrdersPage() {
  return (
    <AuthGuard>
      <AccountLayout>
        <OrdersContent />
      </AccountLayout>
    </AuthGuard>
  )
}
