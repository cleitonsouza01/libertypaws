'use client'

import { useState, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { X, ImageIcon } from 'lucide-react'
import Image from 'next/image'

interface PhotoUploadProps {
  value: string
  onChange: (url: string) => void
  /** Translation namespace for labels (default: 'admin.registrations') */
  translationKey?: string
  /** R2 folder prefix (default: 'images/pets') */
  folder?: string
  /** Alt text for the preview image */
  alt?: string
  /** Preview size in px (default: 112) */
  size?: number
}

export function PhotoUpload({
  value,
  onChange,
  translationKey = 'admin.registrations',
  folder = 'images/pets',
  alt = 'Photo',
  size = 112,
}: PhotoUploadProps) {
  const t = useTranslations(translationKey)
  const [uploading, setUploading] = useState(false)
  const [localPreview, setLocalPreview] = useState<string | null>(null)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    // Show local preview immediately
    const objectUrl = URL.createObjectURL(file)
    setLocalPreview(objectUrl)
    setError('')
    setUploading(true)

    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', folder)

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Upload failed')
      }

      const { url } = await res.json()
      onChange(url)
    } catch (err) {
      setError(err instanceof Error ? err.message : t('uploadError'))
      setLocalPreview(null)
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  function handleRemove() {
    if (localPreview) {
      URL.revokeObjectURL(localPreview)
      setLocalPreview(null)
    }
    onChange('')
  }

  const previewSrc = value || localPreview

  return (
    <div className="space-y-3">
      {/* Preview area */}
      {previewSrc ? (
        <div className="flex items-end gap-3">
          <div className="avatar">
            <div className="rounded-xl border border-base-300 bg-base-300" style={{ width: size, height: size }}>
              {uploading ? (
                <div className="flex items-center justify-center" style={{ width: size, height: size }}>
                  <span className="loading loading-spinner loading-md text-primary" />
                </div>
              ) : (
                <Image
                  src={previewSrc}
                  alt={alt}
                  width={size}
                  height={size}
                  className="object-cover"
                  unoptimized={previewSrc.startsWith('blob:')}
                  onError={() => {
                    setLocalPreview(null)
                    setError(t('uploadError'))
                  }}
                />
              )}
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <button
              type="button"
              className="btn btn-outline btn-xs gap-1"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
            >
              <ImageIcon className="h-3 w-3" />
              {t('changePhoto')}
            </button>
            <button
              type="button"
              className="btn btn-error btn-soft btn-xs gap-1"
              onClick={handleRemove}
              disabled={uploading}
            >
              <X className="h-3 w-3" />
              {t('remove')}
            </button>
          </div>
        </div>
      ) : (
        /* File input area */
        <fieldset className="fieldset">
          <legend className="fieldset-legend">{t('uploadPhoto')}</legend>
          <input
            type="file"
            ref={inputRef}
            accept="image/jpeg,image/png,image/webp"
            className="file-input file-input-sm w-full max-w-xs"
            onChange={handleFileChange}
            disabled={uploading}
          />
          <label className="label">{t('petPhotoHint')}</label>
        </fieldset>
      )}

      {error && (
        <p className="text-xs text-error">{error}</p>
      )}
    </div>
  )
}
