/**
 * Asset URL helper for Cloudflare R2 CDN integration
 *
 * In production, assets are served from R2 CDN.
 * In development (when NEXT_PUBLIC_CDN_URL is not set), falls back to local /public paths.
 */

const CDN_URL = process.env.NEXT_PUBLIC_CDN_URL || ''

/**
 * Get the full URL for an asset path
 * @param path - Asset path relative to public folder (e.g., 'images/logo.png' or '/images/logo.png')
 * @returns Full URL to the asset (CDN URL in production, local path in development)
 */
export function getAssetUrl(path: string): string {
  // Remove leading slash if present for consistency
  const cleanPath = path.startsWith('/') ? path.slice(1) : path

  if (CDN_URL) {
    return `${CDN_URL}/${cleanPath}`
  }

  // Fallback to local path for development
  return `/${cleanPath}`
}

/**
 * Get asset URL for use in Next.js Image component
 * Same as getAssetUrl but explicitly typed for image paths
 */
export function getImageUrl(path: string): string {
  return getAssetUrl(path)
}

/**
 * Get asset URL for video sources
 * Same as getAssetUrl but explicitly typed for video paths
 */
export function getVideoUrl(path: string): string {
  return getAssetUrl(path)
}
