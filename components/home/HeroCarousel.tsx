"use client";

import { useState, useEffect, useCallback, useSyncExternalStore } from "react";
import { getImageProps } from "next/image";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

interface Slide {
  /** Base name of the pre-sized crops in public/images/carousel */
  slug: string;
  alt: string;
}

// Photos: Unsplash License (free for commercial use). Credits:
//   lagos-brass-band, lagos-stage-dancer, lagos-percussion, lagos-dance-crew — Ayoola Salako (@salakoay_ola), Lagos
//   lagos-singer-spotlight — Clout Africa (@cloutafrica), Lagos
// Each has a 3:2 landscape crop and a 9:16 portrait crop for phones. To add a slide, generate
// both crops at the widths listed in lib/image-loader.ts (RESPONSIVE_WIDTHS).
const slides: Slide[] = [
  {
    slug: "lagos-brass-band",
    alt: "A brass band in colourful traditional Yoruba outfits plays trumpets and saxophones on a Lagos stage",
  },
  {
    slug: "lagos-singer-spotlight",
    alt: "A singer in a blue satin outfit stands beside a vintage microphone under red stage lights",
  },
  {
    slug: "lagos-stage-dancer",
    alt: "A performer dances with outstretched arms in front of a live band at a Lagos concert",
  },
  {
    slug: "lagos-percussion",
    alt: "A percussionist plays red conga drums beside a singer during a live show in Lagos",
  },
  {
    slug: "lagos-dance-crew",
    alt: "A dancer in Ankara-print trousers performs with the crew on a dimly lit stage",
  },
];

const SLIDE_DURATION_MS = 6000;

const reducedMotionQuery = "(prefers-reduced-motion: reduce)";
function subscribeReducedMotion(onChange: () => void) {
  const media = window.matchMedia(reducedMotionQuery);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}
function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(reducedMotionQuery).matches,
    () => false
  );
}

/**
 * Art-directed slide image: a portrait crop on portrait screens (phones, tablets held upright)
 * and a landscape crop elsewhere, so the subject stays framed and sharp at every size.
 * `sizes` reflects object-cover: the image renders at whichever is larger of the viewport
 * width or the viewport height times the crop's aspect ratio.
 */
function SlidePicture({ slide, eager }: { slide: Slide; eager: boolean }) {
  const common = {
    alt: slide.alt,
    fill: true,
    loading: eager ? ("eager" as const) : ("lazy" as const),
    fetchPriority: eager ? ("high" as const) : ("auto" as const),
  };
  const {
    props: { srcSet: portraitSrcSet, sizes: portraitSizes },
  } = getImageProps({
    ...common,
    src: `/images/carousel/${slide.slug}-portrait.webp`,
    sizes: "(min-aspect-ratio: 9/16) 100vw, 56.25vh",
  });
  const { props: landscapeProps } = getImageProps({
    ...common,
    src: `/images/carousel/${slide.slug}-landscape.webp`,
    sizes: "(min-aspect-ratio: 3/2) 100vw, 150vh",
  });

  return (
    <picture>
      <source media="(orientation: portrait)" srcSet={portraitSrcSet} sizes={portraitSizes} />
      {/* <picture> art direction needs a raw <img>; getImageProps supplies alt, srcSet and sizes */}
      {/* eslint-disable-next-line jsx-a11y/alt-text */}
      <img {...landscapeProps} className="object-cover" />
    </picture>
  );
}

export function HomepageCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  // null = follow the reduced-motion preference; true/false = the visitor pressed play/pause
  const [userWantsPlay, setUserWantsPlay] = useState<boolean | null>(null);
  // Autoplay also pauses while the pointer is over the carousel or focus is inside it
  const [pausedByInteraction, setPausedByInteraction] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  const isPlaying = userWantsPlay ?? !prefersReducedMotion;
  const isRotating = isPlaying && !pausedByInteraction;

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  const togglePlay = useCallback(() => {
    setUserWantsPlay(!isPlaying);
  }, [isPlaying]);

  useEffect(() => {
    if (!isRotating) return;
    const timer = setInterval(nextSlide, SLIDE_DURATION_MS);
    return () => clearInterval(timer);
  }, [isRotating, nextSlide, currentSlide]);

  // Arrow keys only act while focus is inside the carousel, so they never hijack page scrolling
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      prevSlide();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      nextSlide();
    }
  };

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Afromerica highlights"
      className="relative w-full h-full overflow-hidden group"
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setPausedByInteraction(true)}
      onMouseLeave={() => setPausedByInteraction(false)}
      onFocus={() => setPausedByInteraction(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setPausedByInteraction(false);
      }}
    >
      {/* Slides — announced politely only when the visitor is controlling them */}
      <div aria-live={isRotating ? "off" : "polite"} className="absolute inset-0">
        {slides.map((slide, index) => {
          const isActive = index === currentSlide;
          return (
            <div
              key={slide.slug}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${slides.length}`}
              aria-hidden={!isActive}
              inert={!isActive}
              className={`absolute inset-0 transition-[opacity,transform] duration-1500 ease-in-out motion-reduce:transition-none ${
                isActive ? "opacity-100 scale-100" : "opacity-0 scale-105 motion-reduce:scale-100"
              }`}
            >
              <SlidePicture slide={slide} eager={index === 0} />
              {/* Darkening layer: keeps the white hero text at 4.5:1 contrast or better on every photo */}
              <div className="absolute inset-0 bg-black/60" />
            </div>
          );
        })}
      </div>

      {/* Previous / next — hidden below lg, where they would cover the hero text; the dots below still navigate */}
      <button
        onClick={prevSlide}
        type="button"
        className="hidden lg:block absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 p-3 md:p-4 rounded-full bg-white/70 dark:bg-black/50 backdrop-blur-md hover:bg-white dark:hover:bg-black/80 transition-all duration-300 shadow-2xl border border-white/50 dark:border-white/20 opacity-70 group-hover:opacity-100 focus-visible:opacity-100 hover:scale-110 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6 md:w-7 md:h-7 text-gray-900 dark:text-white stroke-[2.5]" aria-hidden="true" />
      </button>
      <button
        onClick={nextSlide}
        type="button"
        className="hidden lg:block absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 p-3 md:p-4 rounded-full bg-white/70 dark:bg-black/50 backdrop-blur-md hover:bg-white dark:hover:bg-black/80 transition-all duration-300 shadow-2xl border border-white/50 dark:border-white/20 opacity-70 group-hover:opacity-100 focus-visible:opacity-100 hover:scale-110 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6 md:w-7 md:h-7 text-gray-900 dark:text-white stroke-[2.5]" aria-hidden="true" />
      </button>

      {/* Pause control (always visible — WCAG 2.2.2) and slide picker */}
      <div className="absolute bottom-28 sm:bottom-16 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1">
        <button
          onClick={togglePlay}
          type="button"
          className="mr-1 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 backdrop-blur-md border border-white/30 text-white hover:bg-black/70 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
        >
          {isPlaying ? (
            <Pause className="w-3.5 h-3.5 stroke-2" aria-hidden="true" />
          ) : (
            <Play className="w-3.5 h-3.5 stroke-2 ml-0.5" aria-hidden="true" />
          )}
        </button>
        {slides.map((slide, index) => {
          const isActive = index === currentSlide;
          return (
            <button
              key={slide.slug}
              type="button"
              onClick={() => setCurrentSlide(index)}
              className="group/dot flex h-6 min-w-6 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-white"
              aria-label={`Show slide ${index + 1} of ${slides.length}`}
              aria-current={isActive ? "true" : undefined}
            >
              <span
                className={`relative block h-2 rounded-full overflow-hidden transition-all duration-500 motion-reduce:transition-none ${
                  isActive ? "w-12 bg-white/30" : "w-2 bg-white/50 group-hover/dot:bg-white/80"
                }`}
              >
                {isActive && (
                  <span
                    key={`${currentSlide}-${isRotating}`}
                    className={`absolute inset-0 bg-white origin-left ${isRotating ? "animate-[carousel-progress_6000ms_linear_forwards]" : ""}`}
                  />
                )}
              </span>
            </button>
          );
        })}
      </div>

      <style jsx global>{`
        @keyframes carousel-progress {
          from {
            transform: scaleX(0);
          }
          to {
            transform: scaleX(1);
          }
        }
      `}</style>
    </div>
  );
}
