'use client'

import { useTranslations } from 'next-intl'
import { Link, usePathname } from '@/i18n/routing'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  PawPrint,
  MessageSquare,
  Briefcase,
  Ticket,
  Star,
  ArrowLeft,
} from 'lucide-react'

interface AdminLayoutProps {
  children: React.ReactNode
}

const navItems = [
  { href: '/admin', icon: LayoutDashboard, labelKey: 'dashboard' },
  { href: '/admin/users', icon: Users, labelKey: 'users' },
  { href: '/admin/orders', icon: ShoppingBag, labelKey: 'orders' },
  { href: '/admin/registrations', icon: PawPrint, labelKey: 'registrations' },
  { href: '/admin/messages', icon: MessageSquare, labelKey: 'messages' },
  { href: '/admin/services', icon: Briefcase, labelKey: 'services' },
  { href: '/admin/coupons', icon: Ticket, labelKey: 'coupons' },
  { href: '/admin/reviews', icon: Star, labelKey: 'reviews' },
] as const

export function AdminLayout({ children }: AdminLayoutProps) {
  const t = useTranslations('admin.nav')
  const pathname = usePathname()

  function isActive(href: string) {
    if (href === '/admin') return pathname === '/admin'
    return pathname.startsWith(href)
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Sidebar */}
        <aside className="w-full shrink-0 lg:w-56">
          <div className="card bg-base-200 shadow-sm">
            <div className="card-body p-4">
              <h2 className="mb-2 text-sm font-bold uppercase tracking-wider text-base-content/40">
                {t('title')}
              </h2>

              <ul className="menu gap-1 p-0">
                {navItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={cn(isActive(item.href) && 'menu-active')}
                      >
                        <Icon className="h-4 w-4" />
                        {t(item.labelKey)}
                      </Link>
                    </li>
                  )
                })}
              </ul>

              <div className="divider my-1" />

              <ul className="menu p-0">
                <li>
                  <Link href="/" className="text-base-content/60">
                    <ArrowLeft className="h-4 w-4" />
                    {t('backToSite')}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  )
}
