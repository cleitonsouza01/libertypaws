'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { AuthGuard } from '@/components/layout/auth-guard'
import { AccountLayout } from '@/components/layout/account-layout'
import { Button } from '@/components/ui/button'
import {
  PawPrint,
  FileText,
  RefreshCw,
  Calendar,
  Shield,
} from 'lucide-react'

type RegistrationStatus = 'active' | 'pending' | 'expired'
type RegistrationType = 'esa' | 'psd'

interface MockRegistration {
  id: string
  petName: string
  breed: string
  type: RegistrationType
  status: RegistrationStatus
  registeredOn: string
  expiresOn: string
  photoPlaceholder: string
}

const mockRegistrations: MockRegistration[] = [
  {
    id: 'REG-2025-08421',
    petName: 'Max',
    breed: 'Golden Retriever',
    type: 'esa',
    status: 'active',
    registeredOn: '2025-08-15',
    expiresOn: '2026-08-15',
    photoPlaceholder: 'M',
  },
  {
    id: 'REG-2025-07103',
    petName: 'Luna',
    breed: 'German Shepherd',
    type: 'psd',
    status: 'active',
    registeredOn: '2025-07-02',
    expiresOn: '2026-07-02',
    photoPlaceholder: 'L',
  },
  {
    id: 'REG-2024-03298',
    petName: 'Buddy',
    breed: 'Labrador Retriever',
    type: 'esa',
    status: 'expired',
    registeredOn: '2024-03-10',
    expiresOn: '2025-03-10',
    photoPlaceholder: 'B',
  },
]

const statusColorMap: Record<RegistrationStatus, string> = {
  active: 'badge-success',
  pending: 'badge-warning',
  expired: 'badge-error',
}

const typeColorMap: Record<RegistrationType, string> = {
  esa: 'badge-info',
  psd: 'badge-accent',
}

function RegistrationsContent() {
  const t = useTranslations('auth.account.registrationsPage')

  if (mockRegistrations.length === 0) {
    return (
      <div className="card bg-base-200 shadow-sm">
        <div className="card-body items-center text-center py-16">
          <PawPrint className="h-16 w-16 text-base-content/20" />
          <p className="mt-4 text-base-content/60">{t('emptyState')}</p>
          <div className="card-actions mt-4">
            <Link href="/products">
              <Button variant="primary">{t('getStarted')}</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-secondary">{t('title')}</h2>

      {mockRegistrations.map((reg) => (
        <div key={reg.id} className="card bg-base-200 shadow-sm">
          <div className="card-body">
            {/* Registration header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-center gap-4">
                {/* Pet avatar placeholder */}
                <div className="avatar avatar-placeholder">
                  <div className="bg-secondary text-secondary-content w-14 rounded-full">
                    <span className="text-xl">{reg.photoPlaceholder}</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold">{reg.petName}</h3>
                  <p className="text-sm text-base-content/60">{reg.breed}</p>
                  <p className="mt-1 text-xs text-base-content/50">
                    {t('registrationId')}: {reg.id}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className={`badge badge-soft ${typeColorMap[reg.type]}`}>
                  {t(`types.${reg.type}`)}
                </span>
                <span className={`badge badge-soft ${statusColorMap[reg.status]}`}>
                  {t(`statuses.${reg.status}`)}
                </span>
              </div>
            </div>

            <div className="divider my-2" />

            {/* Registration details */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-xs text-base-content/50">{t('type')}</p>
                  <p className="text-sm font-medium">{t(`types.${reg.type}`)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-xs text-base-content/50">{t('registeredOn')}</p>
                  <p className="text-sm font-medium">
                    {new Date(reg.registeredOn).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-error" />
                <div>
                  <p className="text-xs text-base-content/50">{t('expiresOn')}</p>
                  <p className={`text-sm font-medium ${reg.status === 'expired' ? 'text-error' : ''}`}>
                    {new Date(reg.expiresOn).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="card-actions mt-4 justify-end">
              {reg.status === 'expired' ? (
                <button className="btn btn-primary btn-sm gap-1">
                  <RefreshCw className="h-4 w-4" />
                  {t('renewRegistration')}
                </button>
              ) : (
                <button className="btn btn-ghost btn-sm gap-1">
                  <FileText className="h-4 w-4" />
                  {t('viewCertificate')}
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function RegistrationsPage() {
  return (
    <AuthGuard>
      <AccountLayout>
        <RegistrationsContent />
      </AccountLayout>
    </AuthGuard>
  )
}
