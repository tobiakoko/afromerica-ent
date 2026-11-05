/**
 * Custom Image Loader for Next.js
 * Handles multiple image sources: Supabase Storage, CDN, external URLs, and local assets
 */

// Widths generated for each carousel crop in public/images/carousel
const RESPONSIVE_WIDTHS = {
  landscape: [640, 828, 1080, 1280, 1920, 2560],
  portrait: [640, 828, 1080, 1280],
}

interface ImageLoaderProps {
  src: string
  width: number
  quality?: number
}

export default function imageLoader({ src, width, quality }: ImageLoaderProps): string {
  const q = quality || 75

  // Handle absolute URLs (external images, Supabase storage, etc.)
  if (src.startsWith('http://') || src.startsWith('https://')) {
    const url = new URL(src)

    // Supabase Storage - use their built-in transformation
    if (url.hostname.includes('supabase.co')) {
      // Supabase storage supports width and quality parameters
      url.searchParams.set('width', width.toString())
      url.searchParams.set('quality', q.toString())
      return url.toString()
    }

    // Unsplash images - use their image API parameters
    if (url.hostname === 'images.unsplash.com') {
      url.searchParams.set('w', width.toString())
      url.searchParams.set('q', q.toString())
      url.searchParams.set('auto', 'format')
      url.searchParams.set('fit', 'crop')
      return url.toString()
    }

    // Custom CDN
    if (url.hostname === 'cdn.afromericaent.com') {
      url.searchParams.set('w', width.toString())
      url.searchParams.set('q', q.toString())
      return url.toString()
    }

    // Other external URLs - return as is (no transformation available)
    return src
  }

  // Pre-sized local images: `/images/carousel/<name>.webp` has variants on disk named
  // `<name>-<width>.webp` (generated ahead of time), so pick the smallest one that covers the request.
  const responsive = src.match(/^(\/images\/carousel\/[a-z0-9-]+-(landscape|portrait))\.webp$/)
  if (responsive) {
    const widths = RESPONSIVE_WIDTHS[responsive[2] as 'landscape' | 'portrait']
    const chosen = widths.find((w) => w >= width) ?? widths[widths.length - 1]
    return `${responsive[1]}-${chosen}.webp`
  }

  // Other local assets (from /public folder) are served directly without transformation
  if (src.startsWith('/')) {
    return src
  }

  // Default: assume it's a CDN path without protocol
  return `https://cdn.afromericaent.com/${src}?w=${width}&q=${q}`
}