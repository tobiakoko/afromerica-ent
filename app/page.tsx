// app/page.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HomepageCarousel } from "@/components/home/HeroCarousel";
import { Calendar, TrendingUp } from "lucide-react";
import { createCachedClient } from "@/utils/supabase/server-cached";
import { ShaderRGB } from "@/components/ui/shader-rgb";
import { Suspense } from "react";
import { SOCIAL_LINKS } from "@/lib/constants";
import { CarouselLoadingSkeleton } from "@/components/ui/loading-skeleton";

export const revalidate = 300; // 5 minutes ISR — good balance for marketing content

/**
 * Home page (server component)
 * - keeps logic simple and robust
 * - uses server-side fetch for SEO and predictable rendering
 * - graceful fallback when featured event isn't found
 *
 * Notes:
 * - I intentionally keep the UI markup accessible and semantic:
 *   header/main/footer, proper heading levels, visible focus states, ARIA on interactive controls.
 * - Avoid excessive heavy shadows and many nested inset shadows for better performance and clarity.
 */

export default async function HomePage() {
  // lightweight safe fetch with graceful error handling
  let decemberShowcase: { id: string; slug: string; title?: string; image_url?: string } | null =
    null;

  try {
    const supabase = createCachedClient();
    const { data, error } = await supabase
      .from("events")
      .select("id, slug, title, cover_image_url:cover_image_url, image_url")
      .eq("slug", "december-showcase-2025")
      .maybeSingle();

    if (!error && data) {
      decemberShowcase = {
        id: data.id,
        slug: data.slug,
        title: data.title,
        image_url: data.cover_image_url || data.image_url || null,
      };
    } else if (error) {
      // log server-side for diagnostics but don't break the page
      // (consider integrating Sentry or similar in production)
      console.error("Failed to load decemberShowcase:", error);
    }
  } catch (err) {
    console.error("Unexpected error loading showcase:", err);
  }

  const socialIcons = [
    { name: 'Instagram', url: SOCIAL_LINKS.INSTAGRAM, icon: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' },
    { name: 'Facebook', url: SOCIAL_LINKS.FACEBOOK, icon: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' },
    { name: 'Twitter', url: SOCIAL_LINKS.TWITTER, icon: 'M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z' },
    { name: 'YouTube', url: SOCIAL_LINKS.YOUTUBE, icon: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z' },
    { name: 'TikTok', url: SOCIAL_LINKS.TIKTOK, icon: 'M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z' },
  ];

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-white dark:bg-black">
      {/* Decorative animated shader — client component */}
      <div className="dark:block hidden">
        <ShaderRGB />
      </div>

      {/* Hero / Carousel */}
      <main id="main-content" className="relative z-10">
        <section className="relative min-h-screen w-full">
          {/* Carousel is a client component that handles autoplay/controls */}
          <div className="absolute inset-0">
            <Suspense fallback={<CarouselLoadingSkeleton />}>
              <HomepageCarousel />
            </Suspense>
            {/* Apple-style gradient overlay */}
            <div className="absolute inset-0 bg-linear-to-b from-black/30 via-transparent to-black/60 dark:to-black/80 pointer-events-none" />
          </div>

          {/* Centered content - Apple style clean and minimal */}
          <div className="relative z-20 flex min-h-screen items-center justify-center px-4 sm:px-6 py-16 sm:py-20">
            <div className="w-full max-w-5xl text-center animate-in fade-in slide-in-from-bottom-6 duration-1000">
              {/* Live badge - Apple style pill */}
              <div className="mb-6 sm:mb-8 flex items-center justify-center gap-2 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                <span className="flex h-2 w-2">
                  <span className="absolute inline-flex h-2 w-2 rounded-full bg-[#00FFF0] opacity-75 animate-ping" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#00FFF0]" />
                </span>
                <p className="text-[10px] sm:text-xs md:text-sm text-gray-700 dark:text-[#00FFF0] font-medium tracking-wide uppercase">
                  December Showcase 2025 — Live Now
                </p>
              </div>

              {/* Headline - Apple style large and bold */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-semibold tracking-tight leading-[1.05] mb-6 sm:mb-8 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300 px-2">
                <span className="text-gray-900 dark:text-white">Welcome to </span>
                <span className="bg-clip-text text-transparent bg-linear-to-r from-[#00FFF0] via-[#8B5CF6] to-[#FB7185]">
                  Afromerica
                </span>
              </h1>

              {/* Supporting text - Apple style light and spacious */}
              <p className="mx-auto max-w-3xl text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 dark:text-gray-400 font-light leading-relaxed mb-8 sm:mb-12 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500 px-4">
                Celebrating African culture through music, live experiences and community.
                Discover artists, events and the December showcase.
              </p>

              {/* CTA actions - Apple style improved buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-700 px-4">
                <Button
                  asChild
                  size="lg"
                  className="w-full sm:w-auto h-12 sm:h-14 px-6 sm:px-10 text-sm sm:text-base bg-[#00FFF0] hover:bg-[#00E6D8] text-black font-semibold rounded-full shadow-2xl hover:shadow-[0_20px_60px_-15px_rgba(0,255,240,0.5)] hover:scale-105 active:scale-95 transition-all duration-300 border-0"
                >
                  <Link
                    href={
                      decemberShowcase?.slug
                        ? `/events/${decemberShowcase.slug}/leaderboard`
                        : "/events"
                    }
                    aria-label="Vote for artists"
                  >
                    <span className="inline-flex items-center gap-2 sm:gap-3">
                      <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 stroke-2" />
                      <span>Vote for Artists</span>
                    </span>
                  </Link>
                </Button>

                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto h-12 sm:h-14 px-6 sm:px-10 text-sm sm:text-base border-2 border-white/30 bg-white/5 backdrop-blur-md text-white hover:bg-white/10 hover:border-white/50 rounded-full transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg"
                >
                  <Link href="/events" aria-label="View events">
                    <span className="inline-flex items-center gap-2 sm:gap-3">
                      <Calendar className="w-4 h-4 sm:w-5 sm:h-5 stroke-2" />
                      <span>Explore Events</span>
                    </span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Bottom Navigation - Apple style split layout */}
          <div className="absolute bottom-4 sm:bottom-8 inset-x-0 z-30">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0">
                {/* Social Links - Bottom Left */}
                <div className="flex items-center gap-1 sm:gap-1.5">
                  {socialIcons.map((social) => (
                    <Link
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative p-1.5 sm:p-2 rounded-full hover:bg-white/20 dark:hover:bg-white/10 transition-all duration-300"
                      aria-label={`Follow us on ${social.name}`}
                    >
                      <svg
                        className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white/80 group-hover:text-white transition-colors duration-300 group-hover:scale-110"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path d={social.icon} />
                      </svg>

                      {/* Animated underline */}
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-[#00FFF0] rounded-full group-hover:w-5 transition-all duration-300" />
                    </Link>
                  ))}
                </div>

                {/* Navigation Links - Bottom Right */}
                <nav aria-label="Footer navigation" className="flex items-center gap-3 sm:gap-6">
                  <Link
                    href="/artists"
                    className="group relative text-xs sm:text-sm font-medium text-white/80 hover:text-white transition-colors duration-300"
                  >
                    Artists
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#00FFF0] rounded-full group-hover:w-full transition-all duration-300" />
                  </Link>
                  <Link
                    href="/events"
                    className="group relative text-xs sm:text-sm font-medium text-white/80 hover:text-white transition-colors duration-300"
                  >
                    Events
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#00FFF0] rounded-full group-hover:w-full transition-all duration-300" />
                  </Link>
                  <Link
                    href="/about"
                    className="group relative text-xs sm:text-sm font-medium text-white/80 hover:text-white transition-colors duration-300"
                  >
                    About
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#00FFF0] rounded-full group-hover:w-full transition-all duration-300" />
                  </Link>
                  <Link
                    href="/contact"
                    className="group relative text-xs sm:text-sm font-medium text-white/80 hover:text-white transition-colors duration-300"
                  >
                    Contact
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#00FFF0] rounded-full group-hover:w-full transition-all duration-300" />
                  </Link>
                </nav>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
