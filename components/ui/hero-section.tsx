import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface HeroSectionProps {
  /** Hero title */
  title: string | ReactNode;
  /** Subtitle or description */
  subtitle?: string | ReactNode;
  /** Background image URL */
  backgroundImage?: string;
  /** Background video URL */
  backgroundVideo?: string;
  /** Height of hero section */
  height?: 'screen' | 'large' | 'medium' | 'small';
  /** CTA buttons */
  actions?: ReactNode;
  /** Additional content below title/subtitle */
  children?: ReactNode;
  /** Custom className */
  className?: string;
  /** Overlay opacity (0-100) */
  overlayOpacity?: number;
  /** Enable gradient overlay */
  gradientOverlay?: boolean;
  /** Content alignment */
  contentAlign?: 'left' | 'center' | 'right';
  /** Enable parallax effect */
  parallax?: boolean;
}

/**
 * Hero Section Component
 *
 * Full-bleed hero section with image/video background, gradient overlay,
 * and immersive entrance animations
 *
 * @example
 * ```tsx
 * <HeroSection
 *   title="Afromerica December Pilot Launch"
 *   subtitle="Vote for your favorite artists competing for the spotlight"
 *   backgroundImage="/hero.jpg"
 *   actions={
 *     <>
 *       <button className="btn-primary">Start Voting</button>
 *       <button className="btn-ghost">View Artists</button>
 *     </>
 *   }
 * />
 * ```
 */
export function HeroSection({
  title,
  subtitle,
  backgroundImage,
  backgroundVideo,
  height = 'screen',
  actions,
  children,
  className,
  overlayOpacity = 70,
  gradientOverlay = true,
  contentAlign = 'left',
  parallax = false,
}: HeroSectionProps) {
  const heightClasses = {
    screen: 'h-screen min-h-[600px]',
    large: 'h-[80vh] min-h-[500px]',
    medium: 'h-[60vh] min-h-[400px]',
    small: 'h-[40vh] min-h-[300px]',
  };

  const alignClasses = {
    left: 'items-center justify-start text-left',
    center: 'items-center justify-center text-center',
    right: 'items-center justify-end text-right',
  };

  return (
    <section
      className={cn(
        'relative full-bleed overflow-hidden',
        heightClasses[height],
        className
      )}
    >
      {/* Background Media */}
      <div className={cn('absolute inset-0', parallax && 'parallax')}>
        {backgroundVideo ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          >
            <source src={backgroundVideo} type="video/mp4" />
          </video>
        ) : backgroundImage ? (
          <img
            src={backgroundImage}
            alt="Hero background"
            className="w-full h-full object-cover"
          />
        ) : (
          // Fallback gradient background
          <div className="w-full h-full bg-gradient-hero" />
        )}

        {/* Overlay */}
        <div
          className={cn(
            'absolute inset-0',
            gradientOverlay ? 'hero-overlay' : 'bg-black'
          )}
          style={{
            opacity: gradientOverlay ? 1 : overlayOpacity / 100,
          }}
        />

        {/* Radial gradient accent */}
        <div className="absolute inset-0 bg-gradient-radial opacity-50" />
      </div>

      {/* Content */}
      <div
        className={cn(
          'relative container-wide h-full flex flex-col',
          alignClasses[contentAlign]
        )}
      >
        <div className="animate-hero-enter max-w-5xl">
          {/* Title */}
          {typeof title === 'string' ? (
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-gradient-rainbow mb-6 leading-tight">
              {title}
            </h1>
          ) : (
            <div className="mb-6">{title}</div>
          )}

          {/* Subtitle */}
          {subtitle && (
            <div className="text-xl md:text-2xl text-text-secondary mb-8 max-w-3xl">
              {typeof subtitle === 'string' ? <p>{subtitle}</p> : subtitle}
            </div>
          )}

          {/* Actions */}
          {actions && (
            <div className="flex flex-wrap gap-4 mb-8">{actions}</div>
          )}

          {/* Additional Content */}
          {children && <div className="mt-8">{children}</div>}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
          <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
}

/**
 * Hero Section with Split Layout
 *
 * Hero with content on one side and media on the other
 */
export function HeroSectionSplit({
  title,
  subtitle,
  image,
  actions,
  imagePosition = 'right',
  className,
}: {
  title: string | ReactNode;
  subtitle?: string | ReactNode;
  image: string;
  actions?: ReactNode;
  imagePosition?: 'left' | 'right';
  className?: string;
}) {
  return (
    <section className={cn('section bg-background-secondary', className)}>
      <div className="container-wide">
        <div
          className={cn(
            'grid grid-cols-1 lg:grid-cols-2 gap-12 items-center',
            imagePosition === 'left' && 'lg:grid-flow-dense'
          )}
        >
          {/* Content */}
          <div className={cn(imagePosition === 'left' && 'lg:col-start-2')}>
            <div className="animate-fade-in-up">
              {typeof title === 'string' ? (
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gradient mb-6">
                  {title}
                </h1>
              ) : (
                <div className="mb-6">{title}</div>
              )}

              {subtitle && (
                <div className="text-lg md:text-xl text-text-secondary mb-8">
                  {typeof subtitle === 'string' ? <p>{subtitle}</p> : subtitle}
                </div>
              )}

              {actions && <div className="flex flex-wrap gap-4">{actions}</div>}
            </div>
          </div>

          {/* Image */}
          <div className={cn(imagePosition === 'left' && 'lg:col-start-1')}>
            <div className="animate-fade-in aspect-square rounded-2xl overflow-hidden card-glow">
              <img
                src={image}
                alt="Hero"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
