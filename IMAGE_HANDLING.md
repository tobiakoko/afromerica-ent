# Image Handling Configuration

This document explains how images are handled in the application.

## Custom Image Loader

The custom image loader ([lib/image-loader.ts](lib/image-loader.ts)) intelligently handles images from multiple sources:

### Supported Image Sources

1. **Supabase Storage** (`*.supabase.co`)
   - Uses Supabase's built-in image transformation API
   - Automatically adds `width` and `quality` parameters
   - Example: `https://project.supabase.co/storage/v1/object/public/images/photo.jpg?width=800&quality=75`

2. **Unsplash** (`images.unsplash.com`)
   - Uses Unsplash's image API parameters
   - Automatically optimizes with `w`, `q`, `auto=format`, and `fit=crop`
   - Example: `https://images.unsplash.com/photo-123?w=800&q=75&auto=format&fit=crop`

3. **Custom CDN** (`cdn.afromericaent.com`)
   - Adds width and quality query parameters
   - Example: `https://cdn.afromericaent.com/image.jpg?w=800&q=75`

4. **Other External URLs**
   - Passed through without modification
   - No transformation available

5. **Local Assets** (starts with `/`)
   - Served directly from `/public` folder
   - No transformation applied
   - Example: `/images/logo.png`, `/images/default-artist.svg`

## Next.js Image Configuration

The [next.config.ts](next.config.ts) includes:

- **Custom loader**: Points to `./lib/image-loader.ts`
- **Remote patterns**: Whitelist for Supabase, Unsplash, and custom CDN
- **Modern formats**: Supports AVIF and WebP for optimal performance
- **Device sizes**: Optimized breakpoints for responsive images
- **SVG support**: Enabled with security policies
- **Cache TTL**: 60 seconds minimum cache

## Placeholder Images

Default placeholder images are located in `/public/images/`:

- `default-artist.svg` - Artist profile placeholder
- `default-event.svg` - Event image placeholder

These are lightweight SVG files that load instantly and provide a consistent fallback experience.

## Usage in Components

Images automatically work with Next.js `<Image>` component:

```tsx
import Image from 'next/image'

// Supabase storage image
<Image
  src="https://project.supabase.co/storage/v1/object/public/images/photo.jpg"
  width={800}
  height={600}
  alt="Photo"
/>

// Local placeholder
<Image
  src="/images/default-artist.svg"
  width={400}
  height={400}
  alt="Placeholder"
/>

// CDN image
<Image
  src="https://cdn.afromericaent.com/events/photo.jpg"
  width={1200}
  height={800}
  alt="Event"
/>
```

## Environment Variables

Required environment variable:
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL

## Benefits

1. **Automatic optimization**: Images are automatically resized and compressed
2. **Multiple sources**: Seamlessly handles images from different providers
3. **Performance**: Modern formats (AVIF, WebP) with fallbacks
4. **Security**: SVG sandboxing and CSP policies
5. **Caching**: Efficient caching strategy for faster loads
6. **Fallbacks**: Graceful degradation with placeholder images
