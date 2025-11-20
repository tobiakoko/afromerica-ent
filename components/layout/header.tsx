"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { APP_METADATA, NAVIGATION } from "@/lib/constants";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

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
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-100 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        Skip to main content
      </a>

      <header
        className="sticky top-0 z-50 w-full border-b border-border/50 bg-background backdrop-blur-md shadow-sm"
        role="banner"
      >
        <nav
          className="container-wide flex items-center justify-between py-4"
          aria-label="Main"
          role="navigation"
        >
          {/* Logo */}
          <div className="flex lg:flex-1">
            <Link
              href="/"
              className="-m-1.5 p-1.5 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary focus-visible:ring-2 focus-visible:ring-primary transition-all duration-200 hover:scale-105"
              aria-label={`${APP_METADATA.NAME} home page`}
            >
              <Image
                src="/logo.png"
                alt={APP_METADATA.NAME}
                width={150}
                height={40}
                className="h-8 w-auto"
                priority
              />
            </Link>
          </div>

          {/* Mobile menu button */}
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
              className="focus-visible:ring-2 focus-visible:ring-primary"
            >
              <span className="sr-only">
                {mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              </span>
              {mobileMenuOpen ? (
                <X className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Menu className="h-5 w-5" aria-hidden="true" />
              )}
            </Button>
          </div>

          {/* Desktop navigation */}
          <ul className="hidden lg:flex lg:gap-x-8" role="list">
            {NAVIGATION.slice(1).map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm font-medium leading-6 text-foreground/90 hover:text-foreground transition-colors duration-200 rounded-lg px-2 py-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary focus-visible:ring-2 focus-visible:ring-primary relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* CTA Buttons */}
          <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-3">
            <Button variant="ghost" size="sm" asChild>
              <Link
                href="/signin"
                className="focus-visible:ring-2 focus-visible:ring-primary"
              >
                Sign in
              </Link>
            </Button>
            <Button size="sm" asChild>
              <Link
                href="/signup"
                className="focus-visible:ring-2 focus-visible:ring-primary"
              >
                Get Started
              </Link>
            </Button>
          </div>
        </nav>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div
            ref={mobileMenuRef}
            id="mobile-menu"
            className="lg:hidden border-t border-border/50 animate-fade-in-down"
            role="navigation"
            aria-label="Mobile"
          >
            <nav>
              <ul className="space-y-1 px-4 pb-3 pt-2" role="list">
                {NAVIGATION.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="block rounded-lg px-3 py-2 text-base font-medium leading-7 text-foreground hover:bg-primary/10 hover:text-primary transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary focus-visible:ring-2 focus-visible:ring-primary"
                      onClick={closeMobileMenu}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-4 space-y-2 px-4 pb-4 pt-4 border-t border-border/50">
                <Button variant="ghost" className="w-full focus-visible:ring-2 focus-visible:ring-primary" size="sm" asChild>
                  <Link href="/signin" onClick={closeMobileMenu}>
                    Sign in
                  </Link>
                </Button>
                <Button className="w-full focus-visible:ring-2 focus-visible:ring-primary" size="sm" asChild>
                  <Link href="/signup" onClick={closeMobileMenu}>
                    Get Started
                  </Link>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
