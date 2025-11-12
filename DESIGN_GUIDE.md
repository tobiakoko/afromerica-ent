# Afromerica Entertainment Design System

A modern, minimalist design system inspired by industry-leading design frameworks including Material Design 3, IBM Carbon, Apple Human Interface Guidelines, and Atlassian Design System.

## Overview

This design system emphasizes:
- **Clean, minimal aesthetics** with sophisticated color palettes
- **Exceptional readability** with refined typography
- **Subtle, purposeful animations** for enhanced UX
- **Compact, efficient components** that maximize screen real estate
- **Professional polish** suitable for enterprise-grade applications

---

## Color System

### Brand Colors

```css
Primary:   #6366F1  /* Indigo - Professional, trustworthy */
Secondary: #8B5CF6  /* Purple - Creative, premium */
Tertiary:  #EC4899  /* Pink - Vibrant, energetic */
Accent:    #06B6D4  /* Cyan - Fresh, modern */
```

### Background Colors (Dark Theme)

```css
Primary:   #09090B  /* Deep black - main background */
Secondary: #18181B  /* Elevated surfaces */
Tertiary:  #27272A  /* Cards and panels */
Elevated:  #3F3F46  /* Highly elevated elements */
```

### Text Colors

```css
Primary:   #FAFAFA  /* Main text - excellent contrast */
Secondary: #D4D4D8  /* Secondary information */
Tertiary:  #A1A1AA  /* De-emphasized text */
Disabled:  #71717A  /* Disabled states */
```

### Usage Guidelines

- **Primary brand color** for CTAs, primary actions, and interactive elements
- **Secondary** for creative elements and secondary actions
- **Accent** for highlights and notifications
- **Backgrounds** follow a clear elevation hierarchy
- **Text colors** maintain WCAG AAA compliance for readability

---

## Typography

### Font Family

The system uses **Inter** throughout for its exceptional readability and modern aesthetic:

```css
--font-display: 'Inter', system-ui, -apple-system, sans-serif;
--font-heading: 'Inter', system-ui, -apple-system, sans-serif;
--font-body:    'Inter', system-ui, -apple-system, sans-serif;
```

### Type Scale

| Size | px   | Usage                     |
|------|------|---------------------------|
| 7xl  | 72px | Hero titles (rare)        |
| 6xl  | 60px | Large hero titles         |
| 5xl  | 48px | Page hero titles          |
| 4xl  | 36px | Section titles            |
| 3xl  | 30px | Sub-section titles        |
| 2xl  | 24px | Card/component titles     |
| xl   | 20px | Emphasized text           |
| lg   | 18px | Large body                |
| base | 16px | Default body text         |
| sm   | 14px | Small text                |
| xs   | 12px | Labels, captions          |

### Font Weights

- **Bold (700)**: Headings, emphasis
- **Semibold (600)**: Sub-headings, labels
- **Medium (500)**: Buttons, interactive elements
- **Normal (400)**: Body text

### Letter Spacing

- **Display**: -0.02em (large titles)
- **Heading**: -0.01em (headings)
- **Normal**: 0 (body text)
- **Wide**: 0.01em (small caps, labels)

---

## Spacing System

### Container Widths

```css
.container-narrow: max-width: 64rem (1024px)
.container-wide:   max-width: 80rem (1280px)
.container-full:   max-width: 96rem (1536px)
```

### Section Spacing

```css
.section:    py-16 md:py-24 lg:py-28  /* Default sections */
.section-sm: py-12 md:py-16 lg:py-20  /* Compact sections */
.section-lg: py-24 md:py-32 lg:py-40  /* Large sections */
```

### Component Spacing

- Card padding: `1.25rem` (20px)
- Card gap: `1rem` (16px)
- Button padding: `1rem 1.5rem` (default)
- Input padding: `0.75rem 1rem`

---

## Components

### Buttons

**Sizes:**
- `sm`: height 32px, padding 12px
- `default`: height 36px, padding 16px
- `lg`: height 40px, padding 20px

**Variants:**
- `default`: Primary brand color with subtle shadow
- `outline`: Border only, transparent background
- `ghost`: No border, hover background
- `secondary`: Secondary brand color
- `destructive`: Error/delete actions

**Best Practices:**
- Use `default` variant for primary actions
- Use `outline` or `ghost` for secondary actions
- Limit to 1-2 primary buttons per view
- Always include proper hover/focus states

### Cards

**Structure:**
```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Main content */}
  </CardContent>
  <CardFooter>
    {/* Actions */}
  </CardFooter>
</Card>
```

**Styling:**
- Border: `1px solid rgba(255, 255, 255, 0.08)`
- Border radius: `0.75rem` (12px)
- Padding: `1.25rem` (20px)
- Shadow: Subtle `shadow-sm` on hover
- Transition: `200ms` for smooth interactions

**Best Practices:**
- Keep cards compact and scannable
- Use clear visual hierarchy
- Limit to essential information
- Include hover states for interactive cards

### Inputs

**Styling:**
- Height: `36px`
- Border radius: `0.75rem` (12px)
- Border: Subtle border that intensifies on focus
- Focus: Primary color ring with 20% opacity

**States:**
- Default: Subtle border
- Hover: Slightly more visible border
- Focus: Primary color border + ring
- Error: Destructive color border + ring
- Disabled: 50% opacity, no pointer events

---

## Elevation & Shadows

### Shadow Levels

```css
sm:      0 1px 2px 0 rgba(0, 0, 0, 0.3)
default: 0 4px 6px -1px rgba(0, 0, 0, 0.5)
md:      0 10px 15px -3px rgba(0, 0, 0, 0.5)
lg:      0 20px 25px -5px rgba(0, 0, 0, 0.6)
```

### Usage

- **No shadow**: Flat UI elements
- **sm**: Subtle lift for cards at rest
- **md**: Cards on hover, dropdowns
- **lg**: Modals, important overlays

---

## Animations

### Duration

```css
fast:   150ms  /* Micro-interactions */
normal: 200ms  /* Default transitions */
slow:   300ms  /* Complex animations */
```

### Easing

- Use `cubic-bezier(0.4, 0, 0.2, 1)` for smooth, natural motion
- Avoid linear easing except for continuous animations

### Best Practices

- Keep animations subtle and purposeful
- Respect `prefers-reduced-motion`
- Use transforms over position changes
- Animate opacity, transform, and colors
- Avoid animating layout properties

---

## Design Patterns

### Visual Hierarchy

1. **Primary information**: Largest, boldest, highest contrast
2. **Secondary information**: Medium size, regular weight
3. **Tertiary information**: Smallest, muted color

### Spacing Hierarchy

```
Large gaps (48px+):   Between major sections
Medium gaps (24-32px): Between related groups
Small gaps (12-16px):  Between related items
Tiny gaps (4-8px):     Within tightly grouped items
```

### Color Usage

- **60%**: Backgrounds and neutral colors
- **30%**: Secondary colors and accents
- **10%**: Primary brand color for emphasis

### Consistency

- Use consistent spacing multiples (4px base)
- Maintain consistent border radii
- Keep button sizes consistent within contexts
- Use design tokens from the design system

---

## Accessibility

### Color Contrast

All text meets WCAG AAA standards:
- Large text (18px+): 4.5:1 minimum
- Normal text: 7:1 minimum
- Interactive elements: Clear focus indicators

### Focus Management

- Visible focus rings on all interactive elements
- Logical tab order
- Skip links for keyboard navigation

### Screen Readers

- Semantic HTML structure
- ARIA labels where needed
- Alt text for all images
- Clear button and link text

---

## Responsive Design

### Breakpoints

```css
sm:  640px   /* Mobile landscape */
md:  768px   /* Tablet */
lg:  1024px  /* Desktop */
xl:  1280px  /* Large desktop */
2xl: 1536px  /* Extra large */
```

### Mobile-First Approach

- Design for mobile first
- Progressively enhance for larger screens
- Use fluid typography
- Stack layouts on mobile
- Maintain touch-friendly targets (44px minimum)

---

## Best Practices

### Do's

✅ Use consistent spacing from the design system
✅ Maintain clear visual hierarchy
✅ Keep interfaces clean and minimal
✅ Use subtle animations for feedback
✅ Ensure high contrast for readability
✅ Test across devices and screen sizes
✅ Follow accessibility guidelines

### Don'ts

❌ Mix inconsistent border radii
❌ Use too many colors in one view
❌ Create overly large buttons
❌ Neglect hover/focus states
❌ Use animation without purpose
❌ Ignore responsive design
❌ Sacrifice accessibility for aesthetics

---

## File Structure

```
/lib/design-system/
  ├── colors.ts       # Color palette and utilities
  ├── typography.ts   # Font scales and presets
  └── animations.ts   # Animation definitions

/components/ui/
  ├── button.tsx      # Button component
  ├── card.tsx        # Card component
  ├── input.tsx       # Input component
  └── ...             # Other UI components

/app/
  └── globals.css     # Global styles and CSS variables
```

---

## Resources

### Inspiration Sources

- **Material Design 3**: [m3.material.io](https://m3.material.io)
- **IBM Carbon**: [carbondesignsystem.com](https://carbondesignsystem.com)
- **Apple HIG**: [developer.apple.com/design](https://developer.apple.com/design)
- **Atlassian**: [atlassian.design](https://atlassian.design)
- **Tailwind UI**: [tailwindui.com](https://tailwindui.com)

### Tools

- **Figma**: Design mockups and prototypes
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Accessible component primitives
- **shadcn/ui**: Re-usable component library

---

## Updates & Maintenance

This design system is a living document. As the product evolves:

1. Document all changes
2. Update components consistently
3. Maintain backwards compatibility when possible
4. Communicate changes to the team
5. Gather feedback from users

---

**Version**: 1.0.0
**Last Updated**: January 2025
**Maintained by**: Afromerica Entertainment Team
