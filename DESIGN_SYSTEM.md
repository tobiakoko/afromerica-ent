# Afromerica Design System

> A bold, immersive design system for music and entertainment

## Overview

The Afromerica design system is built for maximum visual impact with a focus on **dark aesthetics**, **vibrant colors**, and **smooth animations**. It's designed specifically for music artists, live events, and entertainment experiences.

## Table of Contents

1. [Brand Colors](#brand-colors)
2. [Typography](#typography)
3. [Layout & Spacing](#layout--spacing)
4. [Components](#components)
5. [Animations](#animations)
6. [Usage Examples](#usage-examples)

---

## Brand Colors

### Primary Palette

```css
Electric Pink:    #FF006B
Vibrant Purple:   #9D4EDD
Bright Cyan:      #00F5FF
Electric Yellow:  #FFD60A
```

### Background Colors (Dark Theme)

```css
Deep Black:       #0A0A0F    /* Primary background */
Dark Purple-Black: #151520   /* Secondary surfaces */
Charcoal:         #1E1E2E    /* Cards, elevated surfaces */
Elevated Surface: #252538    /* Popovers, modals */
```

### Text Colors

```css
Primary:   #FFFFFF  /* Main text */
Secondary: #B4B4C8  /* Supporting text */
Tertiary:  #8A8A9E  /* Muted text */
Disabled:  #5A5A6E  /* Disabled state */
```

### Using Colors

**Tailwind Classes:**
```html
<!-- Brand colors -->
<div class="bg-brand-primary text-white">Electric Pink</div>
<div class="bg-brand-secondary text-white">Vibrant Purple</div>
<div class="bg-brand-tertiary text-black">Bright Cyan</div>
<div class="bg-brand-accent text-black">Electric Yellow</div>

<!-- Background -->
<div class="bg-background-primary">Deep Black</div>
<div class="bg-background-secondary">Dark Purple-Black</div>

<!-- Text -->
<p class="text-text-primary">Primary text</p>
<p class="text-text-secondary">Secondary text</p>
```

### Gradients

```html
<!-- Gradient backgrounds -->
<div class="bg-gradient-hero">Hero gradient</div>
<div class="bg-gradient-primary">Primary gradient</div>
<div class="bg-gradient-radial">Radial gradient</div>

<!-- Gradient text -->
<h1 class="text-gradient">Gradient heading</h1>
<h2 class="text-gradient-rainbow">Rainbow heading</h2>
```

---

## Typography

### Font Stack

- **Display**: Space Grotesk → Inter → System UI (for hero titles)
- **Heading**: Inter → System UI (for section headings)
- **Body**: Inter → System UI (for body text)
- **Mono**: JetBrains Mono → Fira Code (for code)

### Font Sizes

| Size  | Pixels | Use Case              |
|-------|--------|-----------------------|
| 7xl   | 80px   | Hero titles          |
| 6xl   | 64px   | Major headings       |
| 5xl   | 56px   | Section titles       |
| 4xl   | 48px   | Large headings       |
| 3xl   | 40px   | Subsection titles    |
| 2xl   | 32px   | Card headings        |
| xl    | 24px   | Small headings       |
| lg    | 20px   | Large body text      |
| base  | 16px   | Default body text    |
| sm    | 14px   | Small text           |
| xs    | 12px   | Captions, labels     |

### Typography Presets

**Hero Title:**
```html
<h1 class="font-display text-6xl font-black tracking-display">
  Afromerica December Pilot Launch
</h1>
```

**Section Title:**
```html
<h2 class="font-heading text-4xl font-bold tracking-heading">
  Featured Artists
</h2>
```

**Body Text:**
```html
<p class="font-body text-base leading-relaxed">
  Regular paragraph text content.
</p>
```

### Text Effects

**Gradient Text:**
```html
<h1 class="text-gradient">Colorful Heading</h1>
<h1 class="text-gradient-rainbow">Rainbow Heading</h1>
```

**Glow Text:**
```html
<h1 class="text-shadow-glow-pink">Pink Glow</h1>
<h1 class="text-shadow-glow-purple">Purple Glow</h1>
<h1 class="text-shadow-glow-multi">Multi Glow</h1>
```

---

## Layout & Spacing

### Container Widths

```html
<!-- Narrow container (max-w-4xl) -->
<div class="container-narrow">...</div>

<!-- Wide container (max-w-7xl) -->
<div class="container-wide">...</div>

<!-- Full container (max-w-screen-2xl) -->
<div class="container-full">...</div>
```

### Section Spacing

```html
<!-- Standard section -->
<section class="section">...</section>

<!-- Small section -->
<section class="section-sm">...</section>

<!-- Large section -->
<section class="section-lg">...</section>
```

### Spacing Scale

Uses Tailwind's default spacing scale (0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32, etc.)

**Common Patterns:**
- Component padding: `p-4` or `p-6`
- Section padding: `py-20 md:py-28 lg:py-32`
- Gap between elements: `gap-4`, `gap-6`, `gap-8`

---

## Components

### Buttons

#### Primary Button
```html
<button class="btn-primary">
  Book Tickets
</button>
```
- Background: Electric Pink (#FF006B)
- Hover: Scale up + pink glow
- Active: Scale down

#### Secondary Button
```html
<button class="btn-secondary">
  Learn More
</button>
```
- Background: Vibrant Purple (#9D4EDD)
- Hover: Scale up + purple glow
- Active: Scale down

#### Ghost Button
```html
<button class="btn-ghost">
  See Artists
</button>
```
- Transparent with pink border
- Hover: Fills with pink

#### Glass Button
```html
<button class="btn-glass">
  Explore
</button>
```
- Glassmorphism effect
- Hover: Subtle pink tint

### Cards

#### Glass Card
```html
<div class="card-glass rounded-xl p-6">
  <h3 class="text-xl font-bold">Artist Name</h3>
  <p class="text-text-secondary">Afrobeats · Lagos</p>
</div>
```

#### Glow Card
```html
<div class="card-glow rounded-xl p-6">
  <h3 class="text-xl font-bold">Featured Event</h3>
</div>
```

#### Lift Card (Hover Effect)
```html
<div class="card-lift card-glass rounded-xl p-6">
  <!-- Lifts up on hover -->
</div>
```

### Hero Section

```html
<section class="relative h-screen full-bleed">
  <!-- Background Image -->
  <div class="absolute inset-0">
    <img src="/hero.jpg" alt="Hero" class="w-full h-full object-cover" />
    <div class="hero-overlay absolute inset-0"></div>
  </div>

  <!-- Content -->
  <div class="relative container-wide h-full flex items-center">
    <div class="animate-hero-enter">
      <h1 class="text-6xl md:text-7xl font-black text-gradient-rainbow mb-6">
        Afromerica December Pilot Launch
      </h1>
      <p class="text-xl md:text-2xl text-text-secondary mb-8">
        Vote for your favorite artists competing for the spotlight
      </p>
      <button class="btn-primary text-lg px-8 py-4">
        Start Voting
      </button>
    </div>
  </div>
</section>
```

### Artist/Event Card

```html
<div class="card-lift card-glass rounded-2xl overflow-hidden group">
  <!-- Image -->
  <div class="aspect-card relative overflow-hidden">
    <img
      src="/artist.jpg"
      alt="Artist"
      class="w-full h-full object-cover transition-transform duration-slow group-hover:scale-110"
    />
    <div class="hero-overlay absolute inset-0"></div>
  </div>

  <!-- Content -->
  <div class="p-6">
    <h3 class="text-2xl font-bold mb-2">Artist Name</h3>
    <p class="text-text-secondary mb-4">Afrobeats · Lagos</p>

    <!-- Stats -->
    <div class="flex items-center justify-between">
      <div>
        <p class="text-3xl font-black text-gradient">1,234</p>
        <p class="text-sm text-text-tertiary uppercase tracking-wider">Votes</p>
      </div>
      <button class="btn-primary">Vote Now</button>
    </div>
  </div>
</div>
```

### Leaderboard Item

```html
<div class="card-glass rounded-xl p-6 flex items-center gap-6">
  <!-- Rank -->
  <div class="text-4xl font-black text-gradient">
    #1
  </div>

  <!-- Artist Info -->
  <div class="aspect-square w-16 h-16 rounded-full overflow-hidden">
    <img src="/artist.jpg" alt="Artist" class="w-full h-full object-cover" />
  </div>

  <div class="flex-1">
    <h4 class="text-xl font-bold">Artist Name</h4>
    <p class="text-text-secondary">Afrobeats</p>
  </div>

  <!-- Vote Count -->
  <div class="text-right">
    <p class="text-3xl font-black text-brand-primary">5,432</p>
    <p class="text-sm text-text-tertiary uppercase tracking-wider">Votes</p>
  </div>
</div>
```

---

## Animations

### Entrance Animations

```html
<!-- Fade in -->
<div class="animate-fade-in">...</div>

<!-- Fade in from bottom -->
<div class="animate-fade-in-up">...</div>

<!-- Scale in with bounce -->
<div class="animate-scale-in">...</div>

<!-- Slide in from left -->
<div class="animate-slide-in-left">...</div>

<!-- Hero entrance (scale + fade + blur) -->
<div class="animate-hero-enter">...</div>
```

### Continuous Animations

```html
<!-- Pulse -->
<div class="animate-pulse">...</div>

<!-- Bounce -->
<div class="animate-bounce">...</div>

<!-- Float -->
<div class="float">...</div>

<!-- Glow -->
<div class="pulse-glow">...</div>

<!-- Shimmer -->
<div class="shimmer">...</div>

<!-- Spin -->
<div class="animate-spin">...</div>
```

### Stagger Animations (Sequential)

```html
<div class="space-y-4">
  <div class="animate-fade-in-up" style="animation-delay: 0ms;">Item 1</div>
  <div class="animate-fade-in-up" style="animation-delay: 100ms;">Item 2</div>
  <div class="animate-fade-in-up" style="animation-delay: 200ms;">Item 3</div>
  <div class="animate-fade-in-up" style="animation-delay: 300ms;">Item 4</div>
</div>
```

### Transition Classes

```html
<!-- Fast transition -->
<div class="transition-all duration-fast">...</div>

<!-- Normal transition -->
<div class="transition-all duration-normal">...</div>

<!-- Slow transition -->
<div class="transition-all duration-slow">...</div>

<!-- Custom easing -->
<div class="transition-all duration-normal ease-spring">...</div>
```

---

## Usage Examples

### Full Page Example

```tsx
import { Button } from '@/components/ui/button';

export default function EventPage() {
  return (
    <div className="min-h-screen bg-background-primary">
      {/* Hero Section */}
      <section className="relative h-screen full-bleed">
        <div className="absolute inset-0">
          <img
            src="/event-hero.jpg"
            alt="Event"
            className="w-full h-full object-cover"
          />
          <div className="hero-overlay absolute inset-0" />
        </div>

        <div className="relative container-wide h-full flex items-center">
          <div className="animate-hero-enter">
            <h1 className="text-6xl md:text-7xl font-black text-gradient-rainbow mb-6">
              December Pilot Launch
            </h1>
            <p className="text-xl md:text-2xl text-text-secondary mb-8 max-w-2xl">
              The biggest night in Afrobeats. Vote for your favorite artists.
            </p>
            <div className="flex gap-4">
              <button className="btn-primary text-lg px-8 py-4">
                Vote Now
              </button>
              <button className="btn-ghost text-lg px-8 py-4">
                View Lineup
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Artists Section */}
      <section className="section bg-background-secondary">
        <div className="container-wide">
          <h2 className="text-4xl font-bold mb-12 text-gradient">
            Featured Artists
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Artist cards go here */}
          </div>
        </div>
      </section>

      {/* Leaderboard Section */}
      <section className="section bg-background-primary">
        <div className="container-narrow">
          <h2 className="text-4xl font-bold mb-12 text-gradient">
            Live Rankings
          </h2>

          <div className="space-y-4">
            {/* Leaderboard items go here */}
          </div>
        </div>
      </section>
    </div>
  );
}
```

### Component Example (Artist Card)

```tsx
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ArtistCardProps {
  name: string;
  genre: string;
  location: string;
  votes: number;
  image: string;
  rank: number;
}

export function ArtistCard({
  name,
  genre,
  location,
  votes,
  image,
  rank,
}: ArtistCardProps) {
  return (
    <div className="card-lift card-glass rounded-2xl overflow-hidden group">
      {/* Image */}
      <div className="aspect-card relative overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-slow group-hover:scale-110"
        />
        <div className="hero-overlay absolute inset-0" />

        {/* Rank Badge */}
        <div className="absolute top-4 left-4">
          <div className="bg-brand-primary text-white px-4 py-2 rounded-full font-bold">
            #{rank}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-2xl font-bold mb-2">{name}</h3>
        <p className="text-text-secondary mb-4">
          {genre} · {location}
        </p>

        {/* Stats */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-3xl font-black text-gradient">
              {votes.toLocaleString()}
            </p>
            <p className="text-sm text-text-tertiary uppercase tracking-wider">
              Votes
            </p>
          </div>
          <button className="btn-primary">Vote Now</button>
        </div>
      </div>
    </div>
  );
}
```

---

## Design Principles

### 1. **Dark First**
Always design for dark mode first. Our primary audience expects immersive, dark experiences typical of music and entertainment platforms.

### 2. **Bold & Vibrant**
Don't be afraid of bright colors. Use electric pink, vibrant purple, and bright cyan liberally for CTAs and accents.

### 3. **Motion Matters**
Animations should feel smooth and purposeful. Use entrance animations for page loads, hover effects for interactions, and continuous animations sparingly for emphasis.

### 4. **Hierarchy Through Scale**
Use dramatic scale differences for hierarchy. Hero titles should be massive (6xl-7xl), section titles large (4xl), and body text comfortable (base-lg).

### 5. **Glassmorphism**
Leverage glassmorphism (frosted glass effects) for cards and overlays to create depth while maintaining visual interest.

### 6. **Full-Bleed Imagery**
Use full-bleed images for heroes and featured content. Overlay gradients ensure text readability.

---

## Accessibility

- All text meets WCAG AA contrast standards on dark backgrounds
- Focus states use visible pink outlines
- Interactive elements have clear hover/active states
- Animations respect `prefers-reduced-motion`
- Alt text required for all images
- Semantic HTML structure maintained

---

## Resources

- **Colors**: `/lib/design-system/colors.ts`
- **Typography**: `/lib/design-system/typography.ts`
- **Animations**: `/lib/design-system/animations.ts`
- **Tailwind Config**: `/tailwind.config.ts`
- **Global CSS**: `/app/globals.css`

---

## Version

**v1.0.0** - Initial Release (December 2024)

---

Built with ❤️ for Afromerica by the design team.
