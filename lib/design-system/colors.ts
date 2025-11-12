/**
 * Afromerica Design System - Color Palette
 *
 * Modern, sophisticated color system inspired by Material Design 3, Carbon, and Apple HIG
 * Features elegant dark backgrounds with refined accent colors
 * Designed for accessibility and visual hierarchy
 */

export const colors = {
  // Brand Colors - More sophisticated and modern
  brand: {
    primary: '#6366F1',      // Indigo - Professional and trustworthy
    secondary: '#8B5CF6',    // Purple - Creative and premium
    tertiary: '#EC4899',     // Pink - Vibrant and energetic
    accent: '#06B6D4',       // Cyan - Fresh and modern
  },

  // Background Colors (Dark Theme) - More refined
  background: {
    primary: '#09090B',      // Almost black - Deep, rich
    secondary: '#18181B',    // Zinc 900 - Elevated
    tertiary: '#27272A',     // Zinc 800 - Cards
    elevated: '#3F3F46',     // Zinc 700 - Elevated surfaces
    glass: 'rgba(255, 255, 255, 0.03)', // Subtle glassmorphism
    hover: 'rgba(255, 255, 255, 0.05)',  // Hover state
  },

  // Text Colors - Optimized for readability
  text: {
    primary: '#FAFAFA',      // Zinc 50 - Main text
    secondary: '#D4D4D8',    // Zinc 300 - Secondary text
    tertiary: '#A1A1AA',     // Zinc 400 - Tertiary text
    disabled: '#71717A',     // Zinc 500 - Disabled
    inverse: '#09090B',      // For light backgrounds
  },

  // Gradient Colors - More subtle and professional
  gradients: {
    primary: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
    secondary: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
    tertiary: 'linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)',
    hero: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #EC4899 100%)',
    dark: 'linear-gradient(180deg, rgba(9, 9, 11, 0) 0%, rgba(9, 9, 11, 0.95) 100%)',
    radial: 'radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.1) 0%, rgba(9, 9, 11, 0) 70%)',
    glow: 'radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.2) 0%, rgba(99, 102, 241, 0) 70%)',
    mesh: 'radial-gradient(at 40% 20%, rgba(99, 102, 241, 0.15) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(139, 92, 246, 0.15) 0px, transparent 50%), radial-gradient(at 0% 50%, rgba(236, 72, 153, 0.15) 0px, transparent 50%)',
  },

  // Semantic Colors - WCAG compliant
  success: {
    DEFAULT: '#22C55E',
    light: '#4ADE80',
    dark: '#16A34A',
  },

  warning: {
    DEFAULT: '#F59E0B',
    light: '#FBBF24',
    dark: '#D97706',
  },

  error: {
    DEFAULT: '#EF4444',
    light: '#F87171',
    dark: '#DC2626',
  },

  info: {
    DEFAULT: '#3B82F6',
    light: '#60A5FA',
    dark: '#2563EB',
  },

  // Interactive States
  interactive: {
    hover: 'rgba(255, 255, 255, 0.08)',
    active: 'rgba(255, 255, 255, 0.12)',
    focus: '#6366F1',
    disabled: 'rgba(255, 255, 255, 0.04)',
  },

  // Border Colors - Subtle and refined
  border: {
    DEFAULT: 'rgba(255, 255, 255, 0.08)',
    light: 'rgba(255, 255, 255, 0.04)',
    medium: 'rgba(255, 255, 255, 0.12)',
    strong: 'rgba(255, 255, 255, 0.2)',
    accent: '#6366F1',
  },

  // Shadow Colors - For depth and elevation
  shadow: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
    DEFAULT: '0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -2px rgba(0, 0, 0, 0.5)',
    md: '0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -4px rgba(0, 0, 0, 0.5)',
    lg: '0 20px 25px -5px rgba(0, 0, 0, 0.6), 0 8px 10px -6px rgba(0, 0, 0, 0.6)',
    xl: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.4)',
    glow: {
      primary: '0 0 20px rgba(99, 102, 241, 0.3)',
      secondary: '0 0 20px rgba(139, 92, 246, 0.3)',
      tertiary: '0 0 20px rgba(236, 72, 153, 0.3)',
      accent: '0 0 20px rgba(6, 182, 212, 0.3)',
    },
  },
} as const;

/**
 * Color utility functions
 */
export const colorUtils = {
  /**
   * Convert hex to RGBA
   */
  hexToRgba(hex: string, alpha: number): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  },

  /**
   * Get gradient CSS
   */
  getGradient(gradientKey: keyof typeof colors.gradients): string {
    return colors.gradients[gradientKey];
  },

  /**
   * Get color with opacity
   */
  withOpacity(colorKey: string, opacity: number): string {
    const colorPath = colorKey.split('.');
    let color: any = colors;

    for (const key of colorPath) {
      color = color[key];
    }

    if (typeof color === 'string' && color.startsWith('#')) {
      return this.hexToRgba(color, opacity);
    }

    return color;
  },
};

/**
 * Predefined color combinations for common UI patterns
 */
export const colorCombinations = {
  heroBanner: {
    background: colors.background.primary,
    gradient: colors.gradients.hero,
    text: colors.text.primary,
    accent: colors.brand.primary,
  },

  card: {
    background: colors.background.tertiary,
    border: colors.border.light,
    text: colors.text.primary,
    accent: colors.brand.primary,
    hover: colors.background.elevated,
  },

  artistCard: {
    background: colors.background.tertiary,
    border: colors.border.light,
    text: colors.text.primary,
    accent: colors.brand.secondary,
    hover: colors.interactive.hover,
  },

  eventCard: {
    background: colors.background.tertiary,
    border: colors.border.medium,
    text: colors.text.primary,
    date: colors.brand.accent,
    cta: colors.brand.primary,
  },

  votingLeaderboard: {
    background: colors.background.tertiary,
    topRank: colors.brand.primary,
    secondRank: colors.brand.secondary,
    thirdRank: colors.brand.tertiary,
    defaultRank: colors.text.secondary,
  },

  glassmorphism: {
    background: colors.background.glass,
    border: colors.border.light,
    backdrop: 'blur(12px)',
  },
};

export default colors;
