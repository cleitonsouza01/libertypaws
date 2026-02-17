'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { LogIn, UserPlus, User, LogOut } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/auth-context'

interface MobileNavProps {
  isOpen: boolean
  onClose: () => void
  links: { href: string; label: string }[]
}

export function MobileNav({ isOpen, onClose, links }: MobileNavProps) {
  const t = useTranslations('auth.userMenu')
  const { user, isAuthenticated, signOut } = useAuth()

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className="absolute top-full left-0 right-0 border-t border-base-300 bg-base-200 md:hidden"
        >
          {/* User info (if logged in) */}
          {isAuthenticated && user && (
            <div className="flex items-center gap-3 border-b border-base-300 px-4 py-3">
              <div className="avatar avatar-placeholder">
                <div className="bg-primary text-primary-content w-9 rounded-full">
                  <span className="text-xs">
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

          <ul className="menu p-4 gap-1">
            {links.map((link, index) => (
              <motion.li
                key={link.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  href={link.href}
                  onClick={onClose}
                  className="text-lg font-medium text-secondary"
                >
                  {link.label}
                </Link>
              </motion.li>
            ))}

            {/* Auth links */}
            {isAuthenticated ? (
              <>
                <motion.li
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: links.length * 0.05 }}
                >
                  <Link
                    href="/account"
                    onClick={onClose}
                    className="text-lg font-medium text-secondary"
                  >
                    <User className="h-5 w-5" />
                    {t('account')}
                  </Link>
                </motion.li>
                <motion.li
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (links.length + 1) * 0.05 }}
                >
                  <button
                    onClick={() => {
                      signOut()
                      onClose()
                    }}
                    className="text-lg font-medium text-error"
                  >
                    <LogOut className="h-5 w-5" />
                    {t('logout')}
                  </button>
                </motion.li>
              </>
            ) : (
              <>
                <div className="divider my-1" />
                <motion.li
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: links.length * 0.05 }}
                >
                  <Link
                    href="/auth/login"
                    onClick={onClose}
                    className="text-lg font-medium text-secondary"
                  >
                    <LogIn className="h-5 w-5" />
                    {t('login')}
                  </Link>
                </motion.li>
                <motion.li
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (links.length + 1) * 0.05 }}
                >
                  <Link
                    href="/auth/register"
                    onClick={onClose}
                    className="text-lg font-medium text-secondary"
                  >
                    <UserPlus className="h-5 w-5" />
                    {t('register')}
                  </Link>
                </motion.li>
              </>
            )}
          </ul>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
