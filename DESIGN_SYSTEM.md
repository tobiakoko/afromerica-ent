# Apple-Inspired Design System

This document outlines the design principles used throughout the Afromerica Entertainment website, inspired by Apple's design language.

## Core Design Principles

### 1. Minimalism & Clean Aesthetics
- Generous white space and breathing room
- Subtle borders with low opacity (e.g., `border-gray-200/60`)
- Minimal visual noise - focus on content
- Clean, uncluttered layouts

### 2. Typography
- **Headlines**: Large, bold, with tight tracking (`tracking-tight`)
  - Use: `text-3xl md:text-4xl lg:text-5xl` for major headings
  - Font weight: `font-semibold`
- **Body Text**: Light weight with relaxed leading (`font-light`, `leading-relaxed`)
  - Use proper hierarchy: `text-lg md:text-xl` for important copy
- **Small Text**: Uppercase labels with wider tracking (`uppercase tracking-wider`)
- **Color Hierarchy**:
  - Primary: `text-gray-900 dark:text-white`
  - Secondary: `text-gray-600 dark:text-gray-400`
  - Tertiary: `text-gray-500 dark:text-gray-500`

### 3. Spacing & Layout
- **Container Width**: Max 1440px for optimal readability
- **Padding**:
  - Mobile: `px-6`
  - Tablet: `md:px-12`
  - Desktop: `lg:px-16`
- **Section Spacing**: `py-24 md:py-32` for major sections
- **Card Spacing**: `p-6 pb-7` for content areas
- **Gaps**: `gap-8 lg:gap-10` between elements

### 4. Colors & Gradients
- **Background Gradients**: Subtle, multi-stop gradients
  - Example: `bg-gradient-to-b from-white via-gray-50/50 to-white`
  - Dark mode: `dark:from-gray-950 dark:via-gray-900/50 dark:to-gray-950`
- **Shadows**: Dramatic but refined
  - Hover: `hover:shadow-2xl hover:shadow-black/10`
  - Dark mode: `dark:hover:shadow-black/40`
- **Glassmorphism**: For overlays and badges
  - `backdrop-blur-md` with semi-transparent backgrounds
  - Example: `bg-white/95 dark:bg-gray-900/95`

### 5. Animations & Transitions
- **Duration**: Slower, more elegant
  - Standard: `duration-500`
  - Image zoom: `duration-700`
  - Fade-in: `duration-1000` for hero sections
- **Easing**: `ease-out` for natural feel
- **Hover Effects**:
  - Lift: `hover:-translate-y-1`
  - Scale: `group-hover:scale-110` (for images)
- **Staggered Entrance**:
  - `animate-in fade-in slide-in-from-bottom-4`
  - Delay: `style={{ animationDelay: \`\${index * 100}ms\` }}`

### 6. Border Radius
- Cards: `rounded-2xl` (16px)
- Badges: `rounded-full`
- Buttons: `rounded-lg` to `rounded-xl`

### 7. Icons
- Stroke width: `stroke-[1.5]` for thin, elegant lines
- Size: `w-[18px] h-[18px]` to `w-24 h-24` depending on context
- Color: Match text hierarchy

### 8. Interactive Elements
- **Cards**:
  - Base: Clean white/dark background with subtle border
  - Hover: Lift + dramatic shadow
  - Transition: `transition-all duration-500`
- **Images**:
  - Aspect ratio: `aspect-[4/3]` or `aspect-video`
  - Hover: Subtle zoom (`scale-110`)
  - Transition: `transition-transform duration-700 ease-out`

### 9. Responsive Design
- Mobile-first approach
- Breakpoints:
  - `sm:` 640px - 2 columns
  - `md:` 768px - Increase spacing/text
  - `lg:` 1024px - 3 columns
  - `xl:` 1280px - 4 columns or fixed widths

### 10. Accessibility
- Semantic HTML (`section`, `time`, `aria-label`)
- Proper color contrast
- `aria-hidden="true"` for decorative icons
- Descriptive alt text for images

## Component Patterns

### Card Pattern
```tsx
<div className="h-full flex flex-col bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-200/60 dark:border-gray-800 transition-all duration-500 hover:shadow-2xl hover:shadow-black/10 dark:hover:shadow-black/40 hover:-translate-y-1">
  {/* Content */}
</div>
```

### Hero Pattern
```tsx
<section className="relative py-24 md:py-32 overflow-hidden">
  <div className="absolute inset-0 bg-gradient-to-b from-white via-gray-50/50 to-white dark:from-gray-950 dark:via-gray-900/50 dark:to-gray-950" />
  <div className="relative max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16">
    {/* Content */}
  </div>
</section>
```

### Empty State Pattern
```tsx
<div className="flex flex-col items-center justify-center py-32 md:py-40 px-4">
  <div className="relative mb-8">
    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 blur-3xl rounded-full" />
    <Icon className="relative w-20 h-20 text-gray-300 stroke-[1.5]" />
  </div>
  <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight">Title</h2>
  <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 font-light">Description</p>
</div>
```

### Badge Pattern
```tsx
<span className="px-3 py-1.5 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md text-gray-900 dark:text-white rounded-full text-xs font-medium shadow-lg">
  Label
</span>
```

## Implementation Notes

1. **Always use gradients for backgrounds** - Never flat colors
2. **Prefer flexbox** over grid for natural flowing layouts
3. **Use semantic color names** - gray-900, gray-600, etc.
4. **Add dark mode** to every component
5. **Animate entrance** - Cards, sections should fade/slide in
6. **Hover states** are mandatory for interactive elements
7. **Generous spacing** - When in doubt, add more padding
8. **Typography scale** - Jump by at least 2 sizes between breakpoints

## Color Palette

### Light Mode
- Background: `white`, `gray-50`
- Text Primary: `gray-900`
- Text Secondary: `gray-600`
- Text Tertiary: `gray-500`
- Borders: `gray-200/60`
- Accents: `blue-600`, `orange-500`

### Dark Mode
- Background: `gray-950`, `gray-900`
- Text Primary: `white`
- Text Secondary: `gray-400`
- Text Tertiary: `gray-500`
- Borders: `gray-800`
- Accents: `blue-400`, `orange-500`
