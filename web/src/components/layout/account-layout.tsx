'use client'

import { useTranslations } from 'next-intl'
import { Link, usePathname, useRouter } from '@/i18n/routing'
import { User, ShoppingBag, PawPrint, Lock, LogOut } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { cn } from '@/lib/utils'

interface AccountLayoutProps {
  children: React.ReactNode
}

export function AccountLayout({ children }: AccountLayoutProps) {
  const t = useTranslations('auth.account')
  const { user, signOut } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const navItems = [
    { href: '/account', label: t('profile'), icon: User },
    { href: '/account/orders', label: t('orders'), icon: ShoppingBag },
    { href: '/account/registrations', label: t('registrations'), icon: PawPrint },
    { href: '/account/password', label: t('changePassword'), icon: Lock },
  ]

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold text-secondary">{t('title')}</h1>

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Sidebar */}
        <aside className="w-full lg:w-64 shrink-0">
          <div className="card bg-base-200 shadow-sm">
            <div className="card-body p-4">
              {/* User info */}
              {user && (
                <div className="mb-4 flex items-center gap-3 border-b border-base-300 pb-4">
                  <div className="avatar avatar-placeholder">
                    <div className="bg-primary text-primary-content w-10 rounded-full">
                      <span className="text-sm">
                        {user.fullName
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .toUpperCase()
                          .slice(0, 2)}
                      </span>
                    </div>
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{user.fullName}</p>
                    <p className="truncate text-xs text-base-content/60">{user.email}</p>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <ul className="menu p-0 gap-1">
                {navItems.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={cn(isActive && 'menu-active')}
                      >
                        <Icon className="h-4 w-4" />
                        {item.label}
                      </Link>
                    </li>
                  )
                })}
                <li>
                  <button
                    onClick={async () => {
                      await signOut()
                      router.replace('/auth/login')
                    }}
                    className="text-error"
                  >
                    <LogOut className="h-4 w-4" />
                    {t('logout')}
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1">{children}</div>
      </div>
    </div>
  )
}
