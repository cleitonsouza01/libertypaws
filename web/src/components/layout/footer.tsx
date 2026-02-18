import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { Mail, Phone, MessageCircle } from 'lucide-react'
import { getImageUrl } from '@/lib/assets'

export function Footer() {
  const t = useTranslations('footer')
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-base-200 border-t border-base-300">
      <div className="footer sm:footer-horizontal mx-auto max-w-7xl p-10 text-base-content">
        {/* Company Info */}
        <aside className="lg:col-span-2">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative h-10 w-10">
              <Image
                src={getImageUrl('images/logo.png')}
                alt="Liberty Paws International"
                fill
                className="object-contain"
              />
            </div>
            <span className="font-bold text-secondary">
              {t('company.title')}
            </span>
          </Link>
          <p className="mt-4 max-w-md text-sm">
            {t('company.description')}
          </p>
        </aside>

        {/* Quick Links */}
        <nav>
          <h6 className="footer-title">
            {t('links.title')}
          </h6>
          <Link href="/" className="link link-hover text-sm">
            {t('links.home')}
          </Link>
          <Link href="/products" className="link link-hover text-sm">
            {t('links.products')}
          </Link>
          <Link href="/contact" className="link link-hover text-sm">
            {t('links.contact')}
          </Link>
          <Link href="/privacy" className="link link-hover text-sm">
            {t('links.privacy')}
          </Link>
          <Link href="/terms" className="link link-hover text-sm">
            {t('links.terms')}
          </Link>
        </nav>

        {/* Contact */}
        <nav>
          <h6 className="footer-title">
            {t('contact.title')}
          </h6>
          <div className="flex items-center gap-2 text-sm">
            <Mail className="h-4 w-4" />
            <span>{t('contact.email')}</span>
          </div>
          <a href="tel:+15618846581" className="link link-hover flex items-center gap-2 text-sm">
            <Phone className="h-4 w-4" />
            <span>{t('contact.phone')}</span>
          </a>
          <a
            href="https://wa.me/15618846581"
            target="_blank"
            rel="noopener noreferrer"
            className="link link-hover flex items-center gap-2 text-sm"
          >
            <MessageCircle className="h-4 w-4" />
            <span>{t('contact.whatsapp')}</span>
          </a>
        </nav>
      </div>

      {/* Copyright */}
      <div className="footer footer-center border-t border-base-300 p-4 text-base-content">
        <div className="flex flex-col items-center gap-1">
          <p className="text-sm">{t('copyright', { year: currentYear })}</p>
          <p className="text-xs text-base-content/40">
            {t('craftedBy')}{' '}
            <a
              href="https://sunokrom.com"
              target="_blank"
              rel="noopener noreferrer"
              className="link link-hover"
            >
              sunokrom.com
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
