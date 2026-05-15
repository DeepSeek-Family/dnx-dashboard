import { CDN_IMAGE_BASE } from '@/utils/api-base'

/** In dev, use same-origin paths so Vite can proxy `/uploads` and avoid CORP blocking in img tags. */
function cdnBaseForImgSrc(): string {
  return import.meta.env.DEV ? '' : CDN_IMAGE_BASE.replace(/\/$/, '')
}

/** Turn absolute CDN URLs into `/uploads/...` in dev so the browser hits the Vite proxy. */
function devProxyImageUrl(url: string): string {
  if (!import.meta.env.DEV) return url
  const prefix = `${CDN_IMAGE_BASE.replace(/\/$/, '')}/`
  if (url.startsWith(prefix)) {
    return `/${url.slice(prefix.length)}`
  }
  return url
}

export function getImageUrl(imagePath: string | null = ''): string {
  if (!imagePath) {
    const base = cdnBaseForImgSrc()
    return base || CDN_IMAGE_BASE
  }

  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return devProxyImageUrl(imagePath)
  }

  const base = cdnBaseForImgSrc()
  const relative = imagePath.replace(/^\/+/, '')
  return base ? `${base}/${relative}` : `/${relative}`
}

export const getProfileImageUrl = (imagePath: string | null = ''): string => {
  const raw = imagePath?.trim() ?? ''
  if (!raw) {
    return ''
  }

  if (raw.startsWith('http://') || raw.startsWith('https://')) {
    return devProxyImageUrl(raw)
  }

  const base = cdnBaseForImgSrc()
  const relative = raw.replace(/^\/+/, '')
  const path = relative.startsWith('uploads/') ? relative : `uploads/image/${relative}`

  return base ? `${base}/${path}` : `/${path}`
}
