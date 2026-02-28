'use client'

import { useRef, useEffect } from 'react'
import { useTranslations } from 'next-intl'

interface ConfirmDialogProps {
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'error' | 'warning' | 'primary'
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel,
  cancelLabel,
  variant = 'error',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const t = useTranslations('admin.common')
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    if (open) {
      dialogRef.current?.showModal()
    } else {
      dialogRef.current?.close()
    }
  }, [open])

  const btnClass = variant === 'error' ? 'btn-error' : variant === 'warning' ? 'btn-warning' : 'btn-primary'

  return (
    <dialog ref={dialogRef} className="modal" onClose={onCancel}>
      <div className="modal-box">
        <h3 className="text-lg font-bold">{title}</h3>
        <p className="py-4">{message}</p>
        <div className="modal-action">
          <button className="btn btn-ghost" onClick={onCancel}>
            {cancelLabel ?? t('cancel')}
          </button>
          <button className={`btn ${btnClass}`} onClick={onConfirm}>
            {confirmLabel ?? t('confirm')}
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button type="button" onClick={onCancel}>close</button>
      </form>
    </dialog>
  )
}
