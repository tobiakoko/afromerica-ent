/**
 * Afromerica Design System - Animations
 *
 * Smooth, immersive animations for music and entertainment
 * Features transitions, keyframes, and interactive effects
 */
 
/**
 * Animation Durations
 */
export const durations = {
  instant: '100ms',
  fast: '200ms',
  normal: '300ms',
  slow: '500ms',
  slower: '700ms',
  slowest: '1000ms',
} as const;
 
/**
 * Animation Timing Functions (Easing)
 */
export const easings = {
  linear: 'linear',
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  bounceIn: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  bounceOut: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  smooth: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  spring: 'cubic-bezier(0.68, -0.6, 0.32, 1.6)',
} as const;
 
/**
 * Keyframe Animations
 */
export const keyframes = {
  // Fade animations
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
 
  // Scale animations
  scaleIn: {
    '0%': { opacity: '0', transform: 'scale(0.9)' },
    '100%': { opacity: '1', transform: 'scale(1)' },
  },
 
  scaleOut: {
    '0%': { opacity: '1', transform: 'scale(1)' },
    '100%': { opacity: '0', transform: 'scale(0.9)' },
  },
 
  pulse: {
    '0%, 100%': { transform: 'scale(1)', opacity: '1' },
    '50%': { transform: 'scale(1.05)', opacity: '0.9' },
  },
 
  // Slide animations
  slideInLeft: {
    '0%': { transform: 'translateX(-100%)', opacity: '0' },
    '100%': { transform: 'translateX(0)', opacity: '1' },
  },
 
  slideInRight: {
    '0%': { transform: 'translateX(100%)', opacity: '0' },
    '100%': { transform: 'translateX(0)', opacity: '1' },
  },
 
  slideOutLeft: {
    '0%': { transform: 'translateX(0)', opacity: '1' },
    '100%': { transform: 'translateX(-100%)', opacity: '0' },
  },
 
  slideOutRight: {
    '0%': { transform: 'translateX(0)', opacity: '1' },
    '100%': { transform: 'translateX(100%)', opacity: '0' },
  },
 
  // Rotation animations
  spin: {
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' },
  },
 
  spinSlow: {
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' },
  },
 
  // Bounce animations
  bounce: {
    '0%, 100%': { transform: 'translateY(0)' },
    '50%': { transform: 'translateY(-10px)' },
  },
 
  bounceIn: {
    '0%': { opacity: '0', transform: 'scale(0.3)' },
    '50%': { opacity: '1', transform: 'scale(1.05)' },
    '70%': { transform: 'scale(0.9)' },
    '100%': { transform: 'scale(1)' },
  },
 
  // Shake animations
  shake: {
    '0%, 100%': { transform: 'translateX(0)' },
    '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-5px)' },
    '20%, 40%, 60%, 80%': { transform: 'translateX(5px)' },
  },
 
  // Glow/Shimmer animations
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
 
  // Gradient animations
  gradientShift: {
    '0%': { backgroundPosition: '0% 50%' },
    '50%': { backgroundPosition: '100% 50%' },
    '100%': { backgroundPosition: '0% 50%' },
  },
 
  gradientRotate: {
    '0%': { backgroundPosition: '0% 50%', filter: 'hue-rotate(0deg)' },
    '50%': { backgroundPosition: '100% 50%', filter: 'hue-rotate(180deg)' },
    '100%': { backgroundPosition: '0% 50%', filter: 'hue-rotate(360deg)' },
  },
 
  // Card flip
  flipIn: {
    '0%': { transform: 'rotateY(-90deg)', opacity: '0' },
    '100%': { transform: 'rotateY(0)', opacity: '1' },
  },
 
  // Float animation
  float: {
    '0%, 100%': { transform: 'translateY(0)' },
    '50%': { transform: 'translateY(-20px)' },
  },
 
  // Music visualization inspired
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
 
  // Hero animation
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
} as const;
 
/**
 * Predefined Animation Combinations
 */
export const animations = {
  // Entrance animations
  fadeIn: {
    animation: 'fadeIn',
    duration: durations.normal,
    easing: easings.easeOut,
  },
 
  fadeInUp: {
    animation: 'fadeInUp',
    duration: durations.normal,
    easing: easings.easeOut,
  },
 
  fadeInDown: {
    animation: 'fadeInDown',
    duration: durations.normal,
    easing: easings.easeOut,
  },
 
  scaleIn: {
    animation: 'scaleIn',
    duration: durations.normal,
    easing: easings.bounceOut,
  },
 
  slideInLeft: {
    animation: 'slideInLeft',
    duration: durations.slow,
    easing: easings.easeOut,
  },
 
  slideInRight: {
    animation: 'slideInRight',
    duration: durations.slow,
    easing: easings.easeOut,
  },
 
  heroEnter: {
    animation: 'heroEnter',
    duration: durations.slower,
    easing: easings.smooth,
  },
 
  // Continuous animations
  pulse: {
    animation: 'pulse',
    duration: durations.slowest,
    easing: easings.easeInOut,
    iterationCount: 'infinite',
  },
 
  spin: {
    animation: 'spin',
    duration: durations.slowest,
    easing: easings.linear,
    iterationCount: 'infinite',
  },
 
  bounce: {
    animation: 'bounce',
    duration: durations.slowest,
    easing: easings.easeInOut,
    iterationCount: 'infinite',
  },
 
  float: {
    animation: 'float',
    duration: '3s',
    easing: easings.easeInOut,
    iterationCount: 'infinite',
  },
 
  shimmer: {
    animation: 'shimmer',
    duration: '2s',
    easing: easings.linear,
    iterationCount: 'infinite',
  },
 
  glow: {
    animation: 'glow',
    duration: '2s',
    easing: easings.easeInOut,
    iterationCount: 'infinite',
  },
 
  glowText: {
    animation: 'glowText',
    duration: '2s',
    easing: easings.easeInOut,
    iterationCount: 'infinite',
  },
 
  gradientShift: {
    animation: 'gradientShift',
    duration: '3s',
    easing: easings.easeInOut,
    iterationCount: 'infinite',
  },
 
  visualizer: {
    animation: 'visualizer',
    duration: '1.2s',
    easing: easings.easeInOut,
    iterationCount: 'infinite',
  },
} as const;
 
/**
 * Transition Presets
 */
export const transitions = {
  // Default transitions
  default: `all ${durations.normal} ${easings.easeInOut}`,
  fast: `all ${durations.fast} ${easings.easeInOut}`,
  slow: `all ${durations.slow} ${easings.easeInOut}`,
 
  // Property-specific transitions
  colors: `color ${durations.normal} ${easings.easeInOut}, background-color ${durations.normal} ${easings.easeInOut}, border-color ${durations.normal} ${easings.easeInOut}`,
  opacity: `opacity ${durations.normal} ${easings.easeInOut}`,
  transform: `transform ${durations.normal} ${easings.easeOut}`,
  shadow: `box-shadow ${durations.normal} ${easings.easeInOut}`,
 
  // Hover transitions
  hoverLift: `transform ${durations.normal} ${easings.easeOut}, box-shadow ${durations.normal} ${easings.easeOut}`,
  hoverScale: `transform ${durations.fast} ${easings.bounceOut}`,
  hoverGlow: `box-shadow ${durations.normal} ${easings.easeInOut}, filter ${durations.normal} ${easings.easeInOut}`,
 
  // Interactive transitions
  button: `all ${durations.fast} ${easings.easeOut}`,
  card: `transform ${durations.normal} ${easings.easeOut}, box-shadow ${durations.normal} ${easings.easeOut}`,
  modal: `opacity ${durations.normal} ${easings.easeInOut}, transform ${durations.normal} ${easings.easeOut}`,
} as const;
 
/**
 * Hover Effects
 */
export const hoverEffects = {
  lift: {
    transform: 'translateY(-8px)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
  },
 
  scale: {
    transform: 'scale(1.05)',
  },
 
  scaleSmall: {
    transform: 'scale(1.02)',
  },
 
  glow: {
    boxShadow: '0 0 30px rgba(255, 0, 107, 0.6), 0 0 60px rgba(157, 78, 221, 0.4)',
  },
 
  brighten: {
    filter: 'brightness(1.2)',
  },
 
  blur: {
    filter: 'blur(2px)',
  },
 
  tilt: {
    transform: 'perspective(1000px) rotateX(5deg) rotateY(5deg)',
  },
} as const;
 
/**
 * Stagger Delays (for sequential animations)
 */
export const staggerDelays = {
  '1': '50ms',
  '2': '100ms',
  '3': '150ms',
  '4': '200ms',
  '5': '250ms',
  '6': '300ms',
  '7': '350ms',
  '8': '400ms',
} as const;
 
/**
 * Animation utility functions
 */
export const animationUtils = {
  /**
   * Generate animation CSS string
   */
  generateAnimation(
    name: string,
    duration: string = durations.normal,
    easing: string = easings.easeInOut,
    delay: string = '0s',
    iterationCount: string | number = '1',
    direction: string = 'normal',
    fillMode: string = 'both'
  ): string {
    return `${name} ${duration} ${easing} ${delay} ${iterationCount} ${direction} ${fillMode}`;
  },
 
  /**
   * Get stagger delay for nth child
   */
  getStaggerDelay(index: number, baseDelay: number = 50): string {
    return `${index * baseDelay}ms`;
  },
 
  /**
   * Create keyframe styles for CSS-in-JS
   */
  createKeyframes(name: string, frames: Record<string, any>): string {
    const frameStrings = Object.entries(frames)
      .map(([key, value]) => {
        const styles = Object.entries(value)
          .map(([prop, val]) => `${prop}: ${val};`)
          .join(' ');
        return `${key} { ${styles} }`;
      })
      .join(' ');
 
    return `@keyframes ${name} { ${frameStrings} }`;
  },
};
 
export default {
  durations,
  easings,
  keyframes,
  animations,
  transitions,
  hoverEffects,
  staggerDelays,
  animationUtils,
};