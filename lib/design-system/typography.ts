/**
 * Afromerica Design System - Typography
 *
 * Modern, minimalist typography following industry best practices
 * Inspired by Material Design, Carbon, and Apple's Human Interface Guidelines
 * Features clean, readable fonts with excellent spacing and hierarchy
 */

/**
 * Font Families
 * Using Inter for its exceptional readability and modern aesthetic
 */
export const fontFamilies = {
  display: 'var(--font-display)',    // For hero titles and major headings
  heading: 'var(--font-heading)',    // For section headings
  body: 'var(--font-body)',          // For body text
  mono: 'var(--font-mono)',          // For code and technical text
} as const;

/**
 * Font Sizes (with line heights)
 * Refined scale for better readability and modern aesthetic
 */
export const fontSizes = {
  // Display sizes (for heroes and major titles) - More compact
  '7xl': { size: '4.5rem', lineHeight: '1.1' },     // 72px
  '6xl': { size: '3.75rem', lineHeight: '1.1' },    // 60px
  '5xl': { size: '3rem', lineHeight: '1.15' },      // 48px
  '4xl': { size: '2.25rem', lineHeight: '1.2' },    // 36px

  // Heading sizes - More refined
  '3xl': { size: '1.875rem', lineHeight: '1.25' },  // 30px
  '2xl': { size: '1.5rem', lineHeight: '1.3' },     // 24px
  xl: { size: '1.25rem', lineHeight: '1.4' },       // 20px
  lg: { size: '1.125rem', lineHeight: '1.5' },      // 18px

  // Body sizes - Optimized for readability
  base: { size: '1rem', lineHeight: '1.6' },        // 16px
  sm: { size: '0.875rem', lineHeight: '1.5' },      // 14px
  xs: { size: '0.75rem', lineHeight: '1.5' },       // 12px
  '2xs': { size: '0.625rem', lineHeight: '1.5' },   // 10px
} as const;

/**
 * Font Weights
 */
export const fontWeights = {
  thin: '100',
  extralight: '200',
  light: '300',
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
  black: '900',
} as const;

/**
 * Letter Spacing
 * Refined for better readability
 */
export const letterSpacing = {
  tighter: '-0.03em',
  tight: '-0.015em',
  normal: '0',
  wide: '0.01em',
  wider: '0.025em',
  widest: '0.05em',
  display: '-0.02em',    // For large display text
  heading: '-0.01em',    // For headings
} as const;

/**
 * Typography Presets
 * Ready-to-use combinations for common patterns
 */
export const typographyPresets = {
  // Display text (for heroes)
  heroTitle: {
    fontFamily: fontFamilies.display,
    fontSize: fontSizes['5xl'].size,
    lineHeight: fontSizes['5xl'].lineHeight,
    fontWeight: fontWeights.bold,
    letterSpacing: letterSpacing.display,
  },

  heroSubtitle: {
    fontFamily: fontFamilies.body,
    fontSize: fontSizes.lg.size,
    lineHeight: fontSizes.lg.lineHeight,
    fontWeight: fontWeights.normal,
    letterSpacing: letterSpacing.normal,
  },

  // Section headings
  sectionTitle: {
    fontFamily: fontFamilies.heading,
    fontSize: fontSizes['3xl'].size,
    lineHeight: fontSizes['3xl'].lineHeight,
    fontWeight: fontWeights.bold,
    letterSpacing: letterSpacing.heading,
  },

  sectionSubtitle: {
    fontFamily: fontFamilies.body,
    fontSize: fontSizes.base.size,
    lineHeight: fontSizes.base.lineHeight,
    fontWeight: fontWeights.normal,
    letterSpacing: letterSpacing.normal,
  },

  // Card headings
  cardTitle: {
    fontFamily: fontFamilies.heading,
    fontSize: fontSizes.lg.size,
    lineHeight: fontSizes.lg.lineHeight,
    fontWeight: fontWeights.semibold,
    letterSpacing: letterSpacing.tight,
  },

  cardSubtitle: {
    fontFamily: fontFamilies.body,
    fontSize: fontSizes.sm.size,
    lineHeight: fontSizes.sm.lineHeight,
    fontWeight: fontWeights.normal,
    letterSpacing: letterSpacing.normal,
  },

  // Body text
  bodyLarge: {
    fontFamily: fontFamilies.body,
    fontSize: fontSizes.lg.size,
    lineHeight: fontSizes.lg.lineHeight,
    fontWeight: fontWeights.normal,
    letterSpacing: letterSpacing.normal,
  },

  bodyRegular: {
    fontFamily: fontFamilies.body,
    fontSize: fontSizes.base.size,
    lineHeight: fontSizes.base.lineHeight,
    fontWeight: fontWeights.normal,
    letterSpacing: letterSpacing.normal,
  },

  bodySmall: {
    fontFamily: fontFamilies.body,
    fontSize: fontSizes.sm.size,
    lineHeight: fontSizes.sm.lineHeight,
    fontWeight: fontWeights.normal,
    letterSpacing: letterSpacing.normal,
  },

  // Special text
  label: {
    fontFamily: fontFamilies.body,
    fontSize: fontSizes.xs.size,
    lineHeight: fontSizes.xs.lineHeight,
    fontWeight: fontWeights.medium,
    letterSpacing: letterSpacing.wide,
    textTransform: 'uppercase' as const,
  },

  caption: {
    fontFamily: fontFamilies.body,
    fontSize: fontSizes.xs.size,
    lineHeight: fontSizes.xs.lineHeight,
    fontWeight: fontWeights.normal,
    letterSpacing: letterSpacing.normal,
  },

  // Button text
  buttonLarge: {
    fontFamily: fontFamilies.body,
    fontSize: fontSizes.base.size,
    lineHeight: '1',
    fontWeight: fontWeights.medium,
    letterSpacing: letterSpacing.normal,
  },

  buttonRegular: {
    fontFamily: fontFamilies.body,
    fontSize: fontSizes.sm.size,
    lineHeight: '1',
    fontWeight: fontWeights.medium,
    letterSpacing: letterSpacing.normal,
  },

  buttonSmall: {
    fontFamily: fontFamilies.body,
    fontSize: fontSizes.xs.size,
    lineHeight: '1',
    fontWeight: fontWeights.medium,
    letterSpacing: letterSpacing.normal,
  },

  // Artist/Event names (special emphasis)
  artistName: {
    fontFamily: fontFamilies.heading,
    fontSize: fontSizes.xl.size,
    lineHeight: fontSizes.xl.lineHeight,
    fontWeight: fontWeights.semibold,
    letterSpacing: letterSpacing.tight,
  },

  eventTitle: {
    fontFamily: fontFamilies.heading,
    fontSize: fontSizes['2xl'].size,
    lineHeight: fontSizes['2xl'].lineHeight,
    fontWeight: fontWeights.semibold,
    letterSpacing: letterSpacing.heading,
  },

  // Stats/Numbers (for voting counts, etc.)
  statNumber: {
    fontFamily: fontFamilies.display,
    fontSize: fontSizes['4xl'].size,
    lineHeight: '1',
    fontWeight: fontWeights.bold,
    letterSpacing: letterSpacing.tight,
  },

  statLabel: {
    fontFamily: fontFamilies.body,
    fontSize: fontSizes.xs.size,
    lineHeight: fontSizes.xs.lineHeight,
    fontWeight: fontWeights.medium,
    letterSpacing: letterSpacing.wide,
    textTransform: 'uppercase' as const,
  },
} as const;

/**
 * Text Effects
 */
export const textEffects = {
  gradient: {
    primary: {
      background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    },
    secondary: {
      background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    },
    accent: {
      background: 'linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    },
  },

  glow: {
    subtle: {
      textShadow: '0 0 20px rgba(99, 102, 241, 0.3)',
    },
    medium: {
      textShadow: '0 0 30px rgba(139, 92, 246, 0.4)',
    },
    strong: {
      textShadow: '0 0 40px rgba(236, 72, 153, 0.5)',
    },
  },

  shadow: {
    soft: {
      textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
    },
    medium: {
      textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
    },
    strong: {
      textShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
    },
  },
} as const;

/**
 * Typography utility functions
 */
export const typographyUtils = {
  /**
   * Get CSS styles for a typography preset
   */
  getPreset(presetKey: keyof typeof typographyPresets): React.CSSProperties {
    return typographyPresets[presetKey];
  },

  /**
   * Get CSS styles for a text effect
   */
  getEffect(category: keyof typeof textEffects, effectKey: string): React.CSSProperties {
    return (textEffects[category] as any)[effectKey];
  },

  /**
   * Combine multiple typography styles
   */
  combine(...styles: React.CSSProperties[]): React.CSSProperties {
    return Object.assign({}, ...styles);
  },

  /**
   * Get responsive font size
   */
  getResponsiveSize(
    mobile: keyof typeof fontSizes,
    tablet: keyof typeof fontSizes,
    desktop: keyof typeof fontSizes
  ) {
    return {
      fontSize: fontSizes[mobile].size,
      lineHeight: fontSizes[mobile].lineHeight,
      '@media (min-width: 768px)': {
        fontSize: fontSizes[tablet].size,
        lineHeight: fontSizes[tablet].lineHeight,
      },
      '@media (min-width: 1024px)': {
        fontSize: fontSizes[desktop].size,
        lineHeight: fontSizes[desktop].lineHeight,
      },
    };
  },
};

export default {
  fontFamilies,
  fontSizes,
  fontWeights,
  letterSpacing,
  typographyPresets,
  textEffects,
  typographyUtils,
};
