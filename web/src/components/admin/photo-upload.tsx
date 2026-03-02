'use client'

import { useState, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { X, ImageIcon } from 'lucide-react'
import Image from 'next/image'

interface PhotoUploadProps {
  value: string
  onChange: (url: string) => void
}

export function PhotoUpload({ value, onChange }: PhotoUploadProps) {
  const t = useTranslations('admin.registrations')
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
            <div className="w-28 rounded-xl border border-base-300 bg-base-300">
              {uploading ? (
                <div className="flex h-28 w-28 items-center justify-center">
                  <span className="loading loading-spinner loading-md text-primary" />
                </div>
              ) : (
                <Image
                  src={previewSrc}
                  alt="Pet photo"
                  width={112}
                  height={112}
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
