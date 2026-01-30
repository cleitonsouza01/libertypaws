'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { Search } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { Button } from '@/components/ui/button'

interface MobileNavProps {
  isOpen: boolean
  onClose: () => void
  links: { href: string; label: string }[]
}

export function MobileNav({ isOpen, onClose, links }: MobileNavProps) {
  const t = useTranslations('nav')

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className="border-t border-border-light bg-white md:hidden"
        >
          <nav className="flex flex-col px-4 py-4">
            {links.map((link, index) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  href={link.href}
                  onClick={onClose}
                  className="block py-3 text-lg font-medium text-brand-navy transition-colors hover:text-brand-lime"
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: links.length * 0.05 }}
              className="mt-4 pt-4 border-t border-border-light"
            >
              <Button variant="primary" className="w-full" onClick={onClose}>
                <Search className="h-4 w-4" />
                {t('searchRegistration')}
              </Button>
            </motion.div>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
