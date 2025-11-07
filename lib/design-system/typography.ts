/**
 * Afromerica Design System - Typography
 *
 * Modern, impactful typography for music and entertainment
 * Features bold headings and readable body text
 */

/**
 * Font Families
 */
export const fontFamilies = {
  display: 'var(--font-display)',    // For hero titles and major headings
  heading: 'var(--font-heading)',    // For section headings
  body: 'var(--font-body)',          // For body text
  mono: 'var(--font-mono)',          // For code and technical text
} as const;

/**
 * Font Sizes (with line heights)
 */
export const fontSizes = {
  // Display sizes (for heroes and major titles)
  '7xl': { size: '5rem', lineHeight: '1.1' },      // 80px
  '6xl': { size: '4rem', lineHeight: '1.1' },      // 64px
  '5xl': { size: '3.5rem', lineHeight: '1.15' },   // 56px
  '4xl': { size: '3rem', lineHeight: '1.2' },      // 48px

  // Heading sizes
  '3xl': { size: '2.5rem', lineHeight: '1.2' },    // 40px
  '2xl': { size: '2rem', lineHeight: '1.25' },     // 32px
  xl: { size: '1.5rem', lineHeight: '1.3' },       // 24px
  lg: { size: '1.25rem', lineHeight: '1.4' },      // 20px

  // Body sizes
  base: { size: '1rem', lineHeight: '1.5' },       // 16px
  sm: { size: '0.875rem', lineHeight: '1.5' },     // 14px
  xs: { size: '0.75rem', lineHeight: '1.5' },      // 12px
  '2xs': { size: '0.625rem', lineHeight: '1.5' },  // 10px
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
 */
export const letterSpacing = {
  tighter: '-0.05em',
  tight: '-0.025em',
  normal: '0',
  wide: '0.025em',
  wider: '0.05em',
  widest: '0.1em',
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
    fontSize: fontSizes['6xl'].size,
    lineHeight: fontSizes['6xl'].lineHeight,
    fontWeight: fontWeights.black,
    letterSpacing: letterSpacing.display,
  },

  heroSubtitle: {
    fontFamily: fontFamilies.heading,
    fontSize: fontSizes.xl.size,
    lineHeight: fontSizes.xl.lineHeight,
    fontWeight: fontWeights.medium,
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
    fontSize: fontSizes.lg.size,
    lineHeight: fontSizes.lg.lineHeight,
    fontWeight: fontWeights.normal,
    letterSpacing: letterSpacing.normal,
  },

  // Card headings
  cardTitle: {
    fontFamily: fontFamilies.heading,
    fontSize: fontSizes.xl.size,
    lineHeight: fontSizes.xl.lineHeight,
    fontWeight: fontWeights.bold,
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
    fontWeight: fontWeights.semibold,
    letterSpacing: letterSpacing.wider,
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
    fontWeight: fontWeights.semibold,
    letterSpacing: letterSpacing.wide,
  },

  buttonRegular: {
    fontFamily: fontFamilies.body,
    fontSize: fontSizes.sm.size,
    lineHeight: '1',
    fontWeight: fontWeights.semibold,
    letterSpacing: letterSpacing.wide,
  },

  buttonSmall: {
    fontFamily: fontFamilies.body,
    fontSize: fontSizes.xs.size,
    lineHeight: '1',
    fontWeight: fontWeights.semibold,
    letterSpacing: letterSpacing.wider,
  },

  // Artist/Event names (special emphasis)
  artistName: {
    fontFamily: fontFamilies.heading,
    fontSize: fontSizes['2xl'].size,
    lineHeight: fontSizes['2xl'].lineHeight,
    fontWeight: fontWeights.extrabold,
    letterSpacing: letterSpacing.tight,
  },

  eventTitle: {
    fontFamily: fontFamilies.heading,
    fontSize: fontSizes['3xl'].size,
    lineHeight: fontSizes['3xl'].lineHeight,
    fontWeight: fontWeights.bold,
    letterSpacing: letterSpacing.heading,
  },

  // Stats/Numbers (for voting counts, etc.)
  statNumber: {
    fontFamily: fontFamilies.display,
    fontSize: fontSizes['4xl'].size,
    lineHeight: '1',
    fontWeight: fontWeights.black,
    letterSpacing: letterSpacing.tight,
  },

  statLabel: {
    fontFamily: fontFamilies.body,
    fontSize: fontSizes.sm.size,
    lineHeight: fontSizes.sm.lineHeight,
    fontWeight: fontWeights.medium,
    letterSpacing: letterSpacing.wider,
    textTransform: 'uppercase' as const,
  },
} as const;

/**
 * Text Effects
 */
export const textEffects = {
  gradient: {
    primary: {
      background: 'linear-gradient(135deg, #FF006B 0%, #9D4EDD 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    },
    secondary: {
      background: 'linear-gradient(135deg, #9D4EDD 0%, #00F5FF 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    },
    rainbow: {
      background: 'linear-gradient(135deg, #FF006B 0%, #9D4EDD 33%, #00F5FF 66%, #FFD60A 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    },
  },

  glow: {
    pink: {
      textShadow: '0 0 20px rgba(255, 0, 107, 0.8), 0 0 40px rgba(255, 0, 107, 0.4)',
    },
    purple: {
      textShadow: '0 0 20px rgba(157, 78, 221, 0.8), 0 0 40px rgba(157, 78, 221, 0.4)',
    },
    cyan: {
      textShadow: '0 0 20px rgba(0, 245, 255, 0.8), 0 0 40px rgba(0, 245, 255, 0.4)',
    },
    multi: {
      textShadow: '0 0 10px rgba(255, 0, 107, 0.6), 0 0 20px rgba(157, 78, 221, 0.4), 0 0 30px rgba(0, 245, 255, 0.2)',
    },
  },

  shadow: {
    soft: {
      textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
    },
    medium: {
      textShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
    },
    strong: {
      textShadow: '0 8px 16px rgba(0, 0, 0, 0.7)',
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
