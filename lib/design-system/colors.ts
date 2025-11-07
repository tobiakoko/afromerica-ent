/**
 * Afromerica Design System - Color Palette
 *
 * A bold, immersive color system for music and entertainment
 * Features dark backgrounds with vibrant accent colors
 */

export const colors = {
  // Brand Colors
  brand: {
    primary: '#FF006B',      // Electric Pink
    secondary: '#9D4EDD',    // Vibrant Purple
    tertiary: '#00F5FF',     // Bright Cyan
    accent: '#FFD60A',       // Electric Yellow
  },

  // Background Colors (Dark Theme)
  background: {
    primary: '#0A0A0F',      // Deep Black
    secondary: '#151520',    // Dark Purple-Black
    tertiary: '#1E1E2E',     // Charcoal
    elevated: '#252538',     // Elevated Surface
    glass: 'rgba(255, 255, 255, 0.05)', // Glassmorphism
  },

  // Text Colors
  text: {
    primary: '#FFFFFF',      // Pure White
    secondary: '#B4B4C8',    // Light Gray
    tertiary: '#8A8A9E',     // Medium Gray
    disabled: '#5A5A6E',     // Disabled Gray
    inverse: '#0A0A0F',      // Black (for light backgrounds)
  },

  // Gradient Colors
  gradients: {
    primary: 'linear-gradient(135deg, #FF006B 0%, #9D4EDD 100%)',
    secondary: 'linear-gradient(135deg, #9D4EDD 0%, #00F5FF 100%)',
    tertiary: 'linear-gradient(135deg, #00F5FF 0%, #FFD60A 100%)',
    hero: 'linear-gradient(135deg, #FF006B 0%, #9D4EDD 50%, #00F5FF 100%)',
    dark: 'linear-gradient(180deg, rgba(10, 10, 15, 0) 0%, rgba(10, 10, 15, 0.95) 100%)',
    radial: 'radial-gradient(circle at 50% 50%, rgba(157, 78, 221, 0.15) 0%, rgba(10, 10, 15, 0) 70%)',
    glow: 'radial-gradient(circle at 50% 50%, rgba(255, 0, 107, 0.3) 0%, rgba(255, 0, 107, 0) 70%)',
  },

  // Semantic Colors
  success: {
    DEFAULT: '#10B981',
    light: '#34D399',
    dark: '#059669',
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
    hover: 'rgba(255, 255, 255, 0.1)',
    active: 'rgba(255, 255, 255, 0.15)',
    focus: '#FF006B',
    disabled: 'rgba(255, 255, 255, 0.05)',
  },

  // Border Colors
  border: {
    DEFAULT: 'rgba(255, 255, 255, 0.1)',
    light: 'rgba(255, 255, 255, 0.05)',
    medium: 'rgba(255, 255, 255, 0.15)',
    strong: 'rgba(255, 255, 255, 0.3)',
    accent: '#FF006B',
  },

  // Shadow Colors (for glows and depth)
  shadow: {
    pink: 'rgba(255, 0, 107, 0.5)',
    purple: 'rgba(157, 78, 221, 0.5)',
    cyan: 'rgba(0, 245, 255, 0.5)',
    yellow: 'rgba(255, 214, 10, 0.5)',
    dark: 'rgba(0, 0, 0, 0.5)',
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

  artistCard: {
    background: colors.background.elevated,
    border: colors.border.light,
    text: colors.text.primary,
    accent: colors.brand.secondary,
    hover: colors.interactive.hover,
  },

  eventCard: {
    background: colors.background.secondary,
    border: colors.border.medium,
    text: colors.text.primary,
    date: colors.brand.tertiary,
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
    backdrop: 'blur(20px)',
  },
};

export default colors;
