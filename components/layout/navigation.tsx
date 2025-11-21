"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import AnnouncementBanner from "@/components/banner";
import { APP_METADATA, NAVIGATION } from "@/lib/constants";

export function HomeNavigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  // Use navigation from constants
  const navigation = NAVIGATION;

  // Handle Escape key to close mobile menu
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && mobileMenuOpen) {
        setMobileMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when menu is open
      document.body.style.overflow = "hidden";

      // Focus first menu item when opened
      const firstMenuItem = mobileMenuRef.current?.querySelector<HTMLAnchorElement>('a');
      firstMenuItem?.focus();
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    menuButtonRef.current?.focus();
  };

  return (
    <>
      {/* Skip to main content link for keyboard navigation - WCAG 2.4.1 */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-100 focus:px-4 focus:py-2 focus:bg-white focus:text-primary focus:rounded-md focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary"
      >
        Skip to main content
      </a>

      {/* Top Banner */}
      <AnnouncementBanner
          message="Welcome to AfroMerica Entertainment"
          linkHref="events/december-showcase-2025"
          linkText="December Artist Discovery is open"
          onDismiss={() => setBannerDismissed(true)}
       />

      {/* Navigation - Apple style */}
      <header
        className="fixed left-0 right-0 z-40 w-full bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-white/10 transition-all duration-500 ease-in-out"
        style={{ top: bannerDismissed ? '0' : '48px' }}
        role="banner"
      >
        <nav className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16 flex items-center justify-between h-16" aria-label="Main" role="navigation">
          <div className="flex lg:flex-1 items-center">
            <Link
              href="/"
              className="group flex items-center gap-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900 dark:focus-visible:outline-white transition-all duration-200"
              aria-label={`${APP_METADATA.NAME} home page`}
            >
              <div className="rounded-xl bg-gray-100 dark:bg-white/10 p-1.5 flex items-center group-hover:bg-gray-200 dark:group-hover:bg-white/20 transition-colors">
                <Image
                  src="/logo.png"
                  alt="AfroMerica Entertainment"
                  width={140}
                  height={36}
                  className="h-7 w-auto object-contain"
                  priority
                  unoptimized
                />
              </div>
              <span className="hidden sm:inline-block text-sm font-semibold tracking-tight text-gray-900 dark:text-white">
                AfroMerica
                <span className="sr-only"> Entertainment</span>
              </span>
            </Link>
          </div>

          <div className="flex lg:hidden">
            <Button
              ref={menuButtonRef}
              variant="ghost"
              size="icon"
              onClick={handleMobileMenuToggle}
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
              aria-haspopup="true"
              className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-gray-900 dark:focus-visible:ring-white"
            >
              <span className="sr-only">
                {mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              </span>
              {mobileMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </Button>
          </div>

          <ul className="hidden lg:flex lg:gap-x-8" role="list">
            {navigation.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-4 lg:items-center">
            <ThemeToggle />
            <Button variant="ghost" asChild className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10">
              <Link href="/signin">Sign in</Link>
            </Button>
            <Button asChild className="bg-gray-900 dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100 rounded-full">
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>
        </nav>

        {/* Mobile menu - Apple style */}
        {mobileMenuOpen && (
          <div
            ref={mobileMenuRef}
            id="mobile-menu"
            className="lg:hidden bg-white/95 dark:bg-black/95 backdrop-blur-xl border-t border-gray-200/50 dark:border-white/10"
            role="navigation"
            aria-label="Mobile"
          >
            <nav>
              <ul className="space-y-1 px-4 pb-3 pt-2" role="list">
                {navigation.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="block rounded-lg px-3 py-2 text-base font-medium text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-all duration-200"
                      onClick={closeMobileMenu}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-4 space-y-2 px-4 pb-3">
                <div className="flex justify-center py-2">
                  <ThemeToggle />
                </div>
                <Button variant="ghost" className="w-full text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10" asChild>
                  <Link href="/signin" onClick={closeMobileMenu}>Sign in</Link>
                </Button>
                <Button className="w-full bg-gray-900 dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100 rounded-full" asChild>
                  <Link href="/signup" onClick={closeMobileMenu}>Get Started</Link>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}