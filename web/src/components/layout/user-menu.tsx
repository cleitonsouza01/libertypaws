'use client'

import { useTranslations } from 'next-intl'
import { Link, useRouter } from '@/i18n/routing'
import { User, ShoppingBag, LogOut } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'

export function UserMenu() {
  const t = useTranslations('auth.userMenu')
  const { user, signOut } = useAuth()
  const router = useRouter()

  if (!user) return null

  const initials = user.fullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
        <div className="avatar avatar-placeholder">
          <div className="bg-primary text-primary-content w-9 rounded-full">
            <span className="text-xs">{initials}</span>
          </div>
        </div>
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content menu bg-base-100 rounded-box z-50 mt-2 w-56 p-2 shadow-md"
      >
        {/* User info */}
        <li className="pointer-events-none px-3 py-2">
          <div className="flex flex-col gap-0.5 !bg-transparent !p-0">
            <span className="text-sm font-medium">{user.fullName}</span>
            <span className="text-xs text-base-content/60">{user.email}</span>
          </div>
        </li>
        <div className="divider my-0" />
        <li>
          <Link href="/account">
            <User className="h-4 w-4" />
            {t('account')}
          </Link>
        </li>
        <li>
          <Link href="/account">
            <ShoppingBag className="h-4 w-4" />
            {t('orders')}
          </Link>
        </li>
        <div className="divider my-0" />
        <li>
          <button onClick={async () => { await signOut(); router.replace('/auth/login') }} className="text-error">
            <LogOut className="h-4 w-4" />
            {t('logout')}
          </button>
        </li>
      </ul>
    </div>
  )
}
