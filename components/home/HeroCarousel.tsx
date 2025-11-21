"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

const slides = [
  {
    id: 1,
    image: "/images/carousel/slide-1.jpg",
    title: "Afromerica Entertainment",
    description: "Bringing African culture to the world"
  },
  {
    id: 2,
    image: "/images/carousel/slide-2.jpg",
    title: "December Showcase 2025",
    description: "Vote for your favorite artist and win amazing prizes"
  },
  {
    id: 3,
    image: "/images/carousel/slide-3.jpg",
    title: "Experience Live Music",
    description: "Book tickets to exclusive events"
  }
];

export function HomepageCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
  }, []);

  const togglePlay = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  // Auto-play carousel
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      nextSlide();
    }, 6000);

    return () => clearInterval(timer);
  }, [isPlaying, nextSlide]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === ' ') {
        e.preventDefault();
        togglePlay();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prevSlide, nextSlide, togglePlay]);

  return (
    <div className="relative w-full h-full overflow-hidden group">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-all duration-1500 ease-in-out ${
            index === currentSlide ? "opacity-100 scale-100" : "opacity-0 scale-105"
          }`}
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            className="object-cover"
            priority={index === 0}
          />
          {/* Subtle overlay for Apple aesthetic */}
          <div className="absolute inset-0 bg-black/20 dark:bg-black/40" />
        </div>
      ))}

      {/* Navigation Arrows - Apple style always visible with subtle presence */}
      <button
        onClick={prevSlide}
        type="button"
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 p-3 md:p-4 rounded-full bg-white/70 dark:bg-black/50 backdrop-blur-md hover:bg-white dark:hover:bg-black/80 transition-all duration-300 shadow-2xl border border-white/50 dark:border-white/20 opacity-70 group-hover:opacity-100 hover:scale-110 active:scale-95"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6 md:w-7 md:h-7 text-gray-900 dark:text-white stroke-[2.5]" />
      </button>
      <button
        onClick={nextSlide}
        type="button"
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 p-3 md:p-4 rounded-full bg-white/70 dark:bg-black/50 backdrop-blur-md hover:bg-white dark:hover:bg-black/80 transition-all duration-300 shadow-2xl border border-white/50 dark:border-white/20 opacity-70 group-hover:opacity-100 hover:scale-110 active:scale-95"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6 md:w-7 md:h-7 text-gray-900 dark:text-white stroke-[2.5]" />
      </button>

      {/* Play/Pause button */}
      <button
        onClick={togglePlay}
        type="button"
        className="absolute top-6 right-6 z-30 p-2.5 rounded-full bg-white/90 dark:bg-black/70 backdrop-blur-md hover:bg-white dark:hover:bg-black/90 transition-all duration-300 shadow-xl border border-gray-200/50 dark:border-white/10 opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95"
        aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
      >
        {isPlaying ? (
          <Pause className="w-4 h-4 text-gray-900 dark:text-white stroke-2" />
        ) : (
          <Play className="w-4 h-4 text-gray-900 dark:text-white stroke-2 ml-0.5" />
        )}
      </button>

      {/* Indicators - Apple style with progress */}
      <div className="absolute bottom-12 md:bottom-16 left-1/2 -translate-x-1/2 z-30 flex gap-2 items-center">
        {slides.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => goToSlide(index)}
            className={`relative h-2 rounded-full transition-all duration-500 overflow-hidden ${
              index === currentSlide
                ? "bg-white/30 dark:bg-white/20 w-12"
                : "bg-white/40 dark:bg-white/30 w-2 hover:bg-white/60 dark:hover:bg-white/50 hover:w-4"
            }`}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={index === currentSlide ? 'true' : 'false'}
          >
            {index === currentSlide && isPlaying && (
              <div
                className="absolute inset-0 bg-white dark:bg-white origin-left animate-[progress_6000ms_linear]"
                style={{ animation: 'progress 6000ms linear forwards' }}
              />
            )}
            {index === currentSlide && !isPlaying && (
              <div className="absolute inset-0 bg-white dark:bg-white" />
            )}
          </button>
        ))}
      </div>

      {/* Slide counter */}
      <div className="absolute bottom-6 right-6 z-30 px-3 py-1.5 rounded-full bg-black/50 dark:bg-white/10 backdrop-blur-md text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {currentSlide + 1} / {slides.length}
      </div>

      <style jsx>{`
        @keyframes progress {
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