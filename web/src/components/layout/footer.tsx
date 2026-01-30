import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { Mail } from 'lucide-react'

export function Footer() {
  const t = useTranslations('footer')
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border-light bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="relative h-10 w-10">
                <Image
                  src="/images/logo.png"
                  alt="Liberty Paws International"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="font-bold text-brand-navy">
                {t('company.title')}
              </span>
            </Link>
            <p className="mt-4 max-w-md text-sm text-text-muted">
              {t('company.description')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 font-semibold text-brand-navy">
              {t('links.title')}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-sm text-text-muted transition-colors hover:text-brand-lime"
                >
                  {t('links.home')}
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="text-sm text-text-muted transition-colors hover:text-brand-lime"
                >
                  {t('links.products')}
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-text-muted transition-colors hover:text-brand-lime"
                >
                  {t('links.contact')}
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-text-muted transition-colors hover:text-brand-lime"
                >
                  {t('links.privacy')}
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-text-muted transition-colors hover:text-brand-lime"
                >
                  {t('links.terms')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 font-semibold text-brand-navy">
              {t('contact.title')}
            </h3>
            <div className="flex items-center gap-2 text-sm text-text-muted">
              <Mail className="h-4 w-4" />
              <span>{t('contact.email')}</span>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 border-t border-border-light pt-8 text-center text-sm text-text-muted">
          {t('copyright', { year: currentYear })}
        </div>
      </div>
    </footer>
  )
}
