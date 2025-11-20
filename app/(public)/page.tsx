// app/page.tsx
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { HomepageCarousel } from "@/components/home/HeroCarousel";
import { Calendar, TrendingUp } from "lucide-react";
import { createCachedClient } from "@/utils/supabase/server-cached";
import { ShaderRGB } from "@/components/ui/shader-rgb";
import { Suspense } from "react";

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
      // eslint-disable-next-line no-console
      console.error("Failed to load decemberShowcase:", error);
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("Unexpected error loading showcase:", err);
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-linear-to-b from-black via-neutral-900 to-black text-white">
      {/* Decorative animated shader — client component */}
      <ShaderRGB />

      {/* Site header (lightweight) */}
      <header className="absolute inset-x-0 top-6 z-30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            {/* Logo + brand */}
            <Link
              href="/"
              aria-label="AfroMerica Entertainment homepage"
              className="flex items-center gap-3"
            >
              {/* local uploaded logo path (tooling can convert this to public URL during build) */}
              <div className="rounded-md bg-neutral-900/80 dark:bg-white/90 p-1.5 flex items-center">
                <Image
                  src="/logo.png"
                  alt="AfroMerica Entertainment logo"
                  width={140}
                  height={36}
                  className="h-8 w-auto object-contain"
                  priority
                  unoptimized
                />
              </div>

              <span className="hidden sm:inline-block text-sm font-semibold tracking-tight text-white drop-shadow-sm">
                AfroMerica
              </span>
            </Link>

            {/* CTA group — visible on larger screens */}
            <div className="hidden md:flex items-center gap-3">
              <Button
                asChild
                size="sm"
                className="bg-white text-black hover:bg-white/90 border-0"
                aria-label="Get started"
              >
                <Link href="/signup">Get Started</Link>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                asChild
                className="text-white/90 hover:text-white"
              >
                <Link href="/signin">Sign in</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero / Carousel */}
      <main id="main-content" className="relative z-10">
        <section className="relative h-screen w-full">
          {/* Carousel is a client component that handles autoplay/controls */}
          <div className="absolute inset-0">
            <Suspense fallback={<div className="w-full h-full bg-black" />}>
              <HomepageCarousel />
            </Suspense>
            {/* subtle overlay to ensure foreground text contrast */}
            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* Centered content card */}
          <div className="relative z-20 flex h-full items-center justify-center px-6">
            <div className="w-full max-w-4xl">
              <div className="rounded-2xl bg-black/50 border border-white/10 backdrop-blur-md p-8 sm:p-10 md:p-12">
                {/* Live badge */}
                <div className="mb-4 flex items-center justify-center gap-3">
                  <span className="flex h-3 w-3 items-center justify-center">
                    <span className="inline-block h-2 w-2 rounded-full bg-[#00FFF0] animate-pulse" />
                  </span>
                  <p className="text-xs md:text-sm text-[#00FFF0] font-semibold">
                    December Showcase 2025 — live now
                  </p>
                </div>

                {/* Headline */}
                <h1 className="text-center text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight mb-3">
                  Welcome to{" "}
                  <span className="bg-clip-text text-transparent bg-linear-to-r from-[#00FFF0] via-[#8B5CF6] to-[#FB7185]">
                    Afromerica
                  </span>
                </h1>

                {/* Supporting text */}
                <p className="mx-auto max-w-2xl text-center text-sm sm:text-base text-white/85 mb-6">
                  Celebrating African culture through music, live experiences and community —
                  discover artists, events and the December showcase.
                </p>

                {/* CTA actions */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-4">
                  <Button
                    asChild
                    size="lg"
                    className="flex items-center gap-3 bg-[#00FFF0] text-black font-semibold shadow-md border-0"
                  >
                    <Link
                      href={
                        decemberShowcase?.slug
                          ? `/events/${decemberShowcase.slug}/leaderboard`
                          : "/events"
                      }
                      aria-label="Vote for artists"
                    >
                      <span className="inline-flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        <span>Vote for Artists</span>
                      </span>
                    </Link>
                  </Button>

                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="flex items-center gap-3 border-white/20 text-white hover:bg-white/5"
                  >
                    <Link href="/events" aria-label="View events">
                      <span className="inline-flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>Events</span>
                      </span>
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom compact nav (sticky visual) */}
          <div className="absolute bottom-6 inset-x-0 z-20 flex items-center justify-center pointer-events-none">
            <nav
              aria-label="Quick links"
              className="pointer-events-auto bg-black/40 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-3 border border-white/10"
            >
              <Link
                href="/artists"
                className="text-xs sm:text-sm text-white/80 px-3 py-1 rounded hover:bg-white/5 transition"
              >
                Artists
              </Link>
              <Link
                href="/events"
                className="text-xs sm:text-sm text-white/80 px-3 py-1 rounded hover:bg-white/5 transition"
              >
                Events
              </Link>
              <Link
                href="/about"
                className="text-xs sm:text-sm text-white/80 px-3 py-1 rounded hover:bg-white/5 transition"
              >
                About
              </Link>
              <Link
                href="/contact"
                className="text-xs sm:text-sm text-white/80 px-3 py-1 rounded hover:bg-white/5 transition"
              >
                Contact
              </Link>
            </nav>
          </div>
        </section>
      </main>
    </div>
  );
}
