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
          className="absolute top-full left-0 right-0 border-t border-base-300 bg-base-200 md:hidden"
        >
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
          </ul>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: links.length * 0.05 }}
            className="px-4 pb-4 border-t border-base-300 pt-4"
          >
            <Button variant="primary" className="btn-block" onClick={onClose}>
              <Search className="h-4 w-4" />
              {t('searchRegistration')}
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
