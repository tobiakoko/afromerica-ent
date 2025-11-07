import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './features/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Brand Colors
      colors: {
        brand: {
          primary: '#FF006B',
          secondary: '#9D4EDD',
          tertiary: '#00F5FF',
          accent: '#FFD60A',
        },
        background: {
          primary: '#0A0A0F',
          secondary: '#151520',
          tertiary: '#1E1E2E',
          elevated: '#252538',
          glass: 'rgba(255, 255, 255, 0.05)',
        },
        text: {
          primary: '#FFFFFF',
          secondary: '#B4B4C8',
          tertiary: '#8A8A9E',
          disabled: '#5A5A6E',
          inverse: '#0A0A0F',
        },
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
        border: {
          DEFAULT: 'rgba(255, 255, 255, 0.1)',
          light: 'rgba(255, 255, 255, 0.05)',
          medium: 'rgba(255, 255, 255, 0.15)',
          strong: 'rgba(255, 255, 255, 0.3)',
          accent: '#FF006B',
        },
      },

      // Background Images (Gradients)
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #FF006B 0%, #9D4EDD 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #9D4EDD 0%, #00F5FF 100%)',
        'gradient-tertiary': 'linear-gradient(135deg, #00F5FF 0%, #FFD60A 100%)',
        'gradient-hero': 'linear-gradient(135deg, #FF006B 0%, #9D4EDD 50%, #00F5FF 100%)',
        'gradient-dark': 'linear-gradient(180deg, rgba(10, 10, 15, 0) 0%, rgba(10, 10, 15, 0.95) 100%)',
        'gradient-radial': 'radial-gradient(circle at 50% 50%, rgba(157, 78, 221, 0.15) 0%, rgba(10, 10, 15, 0) 70%)',
        'gradient-glow': 'radial-gradient(circle at 50% 50%, rgba(255, 0, 107, 0.3) 0%, rgba(255, 0, 107, 0) 70%)',
        'shimmer': 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
      },

      // Font Families
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        heading: ['var(--font-heading)', 'system-ui', 'sans-serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },

      // Font Sizes
      fontSize: {
        '7xl': ['5rem', { lineHeight: '1.1' }],
        '6xl': ['4rem', { lineHeight: '1.1' }],
        '5xl': ['3.5rem', { lineHeight: '1.15' }],
        '4xl': ['3rem', { lineHeight: '1.2' }],
        '3xl': ['2.5rem', { lineHeight: '1.2' }],
        '2xl': ['2rem', { lineHeight: '1.25' }],
        xl: ['1.5rem', { lineHeight: '1.3' }],
        lg: ['1.25rem', { lineHeight: '1.4' }],
        base: ['1rem', { lineHeight: '1.5' }],
        sm: ['0.875rem', { lineHeight: '1.5' }],
        xs: ['0.75rem', { lineHeight: '1.5' }],
        '2xs': ['0.625rem', { lineHeight: '1.5' }],
      },

      // Letter Spacing
      letterSpacing: {
        tighter: '-0.05em',
        tight: '-0.025em',
        normal: '0',
        wide: '0.025em',
        wider: '0.05em',
        widest: '0.1em',
        display: '-0.02em',
        heading: '-0.01em',
      },

      // Box Shadows (including glows)
      boxShadow: {
        sm: '0 1px 2px rgba(0, 0, 0, 0.3)',
        DEFAULT: '0 4px 8px rgba(0, 0, 0, 0.4)',
        md: '0 6px 12px rgba(0, 0, 0, 0.5)',
        lg: '0 10px 20px rgba(0, 0, 0, 0.6)',
        xl: '0 20px 40px rgba(0, 0, 0, 0.7)',
        '2xl': '0 30px 60px rgba(0, 0, 0, 0.8)',
        inner: 'inset 0 2px 4px rgba(0, 0, 0, 0.3)',
        'glow-pink': '0 0 20px rgba(255, 0, 107, 0.5), 0 0 40px rgba(255, 0, 107, 0.3)',
        'glow-purple': '0 0 20px rgba(157, 78, 221, 0.5), 0 0 40px rgba(157, 78, 221, 0.3)',
        'glow-cyan': '0 0 20px rgba(0, 245, 255, 0.5), 0 0 40px rgba(0, 245, 255, 0.3)',
        'glow-multi': '0 0 20px rgba(255, 0, 107, 0.4), 0 0 40px rgba(157, 78, 221, 0.3), 0 0 60px rgba(0, 245, 255, 0.2)',
        none: 'none',
      },

      // Text Shadow (glows)
      textShadow: {
        sm: '0 2px 4px rgba(0, 0, 0, 0.3)',
        DEFAULT: '0 4px 8px rgba(0, 0, 0, 0.5)',
        lg: '0 8px 16px rgba(0, 0, 0, 0.7)',
        'glow-pink': '0 0 20px rgba(255, 0, 107, 0.8), 0 0 40px rgba(255, 0, 107, 0.4)',
        'glow-purple': '0 0 20px rgba(157, 78, 221, 0.8), 0 0 40px rgba(157, 78, 221, 0.4)',
        'glow-cyan': '0 0 20px rgba(0, 245, 255, 0.8), 0 0 40px rgba(0, 245, 255, 0.4)',
        'glow-multi': '0 0 10px rgba(255, 0, 107, 0.6), 0 0 20px rgba(157, 78, 221, 0.4), 0 0 30px rgba(0, 245, 255, 0.2)',
        none: 'none',
      },

      // Border Radius
      borderRadius: {
        none: '0',
        sm: '0.25rem',
        DEFAULT: '0.5rem',
        md: '0.75rem',
        lg: '1rem',
        xl: '1.5rem',
        '2xl': '2rem',
        '3xl': '3rem',
        full: '9999px',
      },

      // Backdrop Blur
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        DEFAULT: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
        '2xl': '40px',
        '3xl': '64px',
      },

      // Animation Durations
      transitionDuration: {
        instant: '100ms',
        fast: '200ms',
        normal: '300ms',
        slow: '500ms',
        slower: '700ms',
        slowest: '1000ms',
      },

      // Animation Timing Functions
      transitionTimingFunction: {
        'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'bounce-out': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        smooth: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        spring: 'cubic-bezier(0.68, -0.6, 0.32, 1.6)',
      },

      // Keyframe Animations
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        scaleOut: {
          '0%': { opacity: '1', transform: 'scale(1)' },
          '100%': { opacity: '0', transform: 'scale(0.9)' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        pulse: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.05)', opacity: '0.9' },
        },
        bounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        spin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(255, 0, 107, 0.5)' },
          '50%': { boxShadow: '0 0 40px rgba(255, 0, 107, 0.8), 0 0 60px rgba(157, 78, 221, 0.6)' },
        },
        glowText: {
          '0%, 100%': { textShadow: '0 0 20px rgba(255, 0, 107, 0.6)' },
          '50%': { textShadow: '0 0 40px rgba(255, 0, 107, 1), 0 0 60px rgba(157, 78, 221, 0.8)' },
        },
        gradientShift: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        visualizer: {
          '0%, 100%': { transform: 'scaleY(1)' },
          '10%': { transform: 'scaleY(0.6)' },
          '20%': { transform: 'scaleY(0.8)' },
          '30%': { transform: 'scaleY(0.4)' },
          '40%': { transform: 'scaleY(0.7)' },
          '50%': { transform: 'scaleY(1.2)' },
          '60%': { transform: 'scaleY(0.9)' },
          '70%': { transform: 'scaleY(0.5)' },
          '80%': { transform: 'scaleY(1.1)' },
          '90%': { transform: 'scaleY(0.7)' },
        },
        heroEnter: {
          '0%': {
            opacity: '0',
            transform: 'scale(0.95) translateY(30px)',
            filter: 'blur(10px)',
          },
          '100%': {
            opacity: '1',
            transform: 'scale(1) translateY(0)',
            filter: 'blur(0)',
          },
        },
      },

      // Animation Classes
      animation: {
        'fade-in': 'fadeIn 300ms ease-out',
        'fade-out': 'fadeOut 300ms ease-out',
        'fade-in-up': 'fadeInUp 300ms ease-out',
        'fade-in-down': 'fadeInDown 300ms ease-out',
        'scale-in': 'scaleIn 300ms cubic-bezier(0.34, 1.56, 0.64, 1)',
        'scale-out': 'scaleOut 300ms cubic-bezier(0.34, 1.56, 0.64, 1)',
        'slide-in-left': 'slideInLeft 500ms ease-out',
        'slide-in-right': 'slideInRight 500ms ease-out',
        pulse: 'pulse 1000ms ease-in-out infinite',
        bounce: 'bounce 1000ms ease-in-out infinite',
        spin: 'spin 1000ms linear infinite',
        'spin-slow': 'spin 3000ms linear infinite',
        shimmer: 'shimmer 2s linear infinite',
        glow: 'glow 2s ease-in-out infinite',
        'glow-text': 'glowText 2s ease-in-out infinite',
        'gradient-shift': 'gradientShift 3s ease-in-out infinite',
        float: 'float 3s ease-in-out infinite',
        visualizer: 'visualizer 1.2s ease-in-out infinite',
        'hero-enter': 'heroEnter 700ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      },

      // Spacing (extended)
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '100': '25rem',
        '112': '28rem',
        '128': '32rem',
      },

      // Z-Index
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
    },
  },
  plugins: [
    // Custom plugin for text shadow utilities
    function ({ addUtilities }: any) {
      const textShadowUtilities = {
        '.text-shadow-sm': {
          textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
        },
        '.text-shadow': {
          textShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
        },
        '.text-shadow-lg': {
          textShadow: '0 8px 16px rgba(0, 0, 0, 0.7)',
        },
        '.text-shadow-glow-pink': {
          textShadow: '0 0 20px rgba(255, 0, 107, 0.8), 0 0 40px rgba(255, 0, 107, 0.4)',
        },
        '.text-shadow-glow-purple': {
          textShadow: '0 0 20px rgba(157, 78, 221, 0.8), 0 0 40px rgba(157, 78, 221, 0.4)',
        },
        '.text-shadow-glow-cyan': {
          textShadow: '0 0 20px rgba(0, 245, 255, 0.8), 0 0 40px rgba(0, 245, 255, 0.4)',
        },
        '.text-shadow-glow-multi': {
          textShadow:
            '0 0 10px rgba(255, 0, 107, 0.6), 0 0 20px rgba(157, 78, 221, 0.4), 0 0 30px rgba(0, 245, 255, 0.2)',
        },
        '.text-shadow-none': {
          textShadow: 'none',
        },
      };

      const gradientTextUtilities = {
        '.text-gradient-primary': {
          background: 'linear-gradient(135deg, #FF006B 0%, #9D4EDD 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        },
        '.text-gradient-secondary': {
          background: 'linear-gradient(135deg, #9D4EDD 0%, #00F5FF 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        },
        '.text-gradient-rainbow': {
          background: 'linear-gradient(135deg, #FF006B 0%, #9D4EDD 33%, #00F5FF 66%, #FFD60A 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        },
      };

      const glassmorphismUtilities = {
        '.glass': {
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
        '.glass-strong': {
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
        },
      };

      addUtilities({ ...textShadowUtilities, ...gradientTextUtilities, ...glassmorphismUtilities });
    },
  ],
};

export default config;
