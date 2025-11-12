"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <nav className="container-wide flex items-center justify-between py-4" aria-label="Main navigation">
        {/* Logo */}
        <div className="flex lg:flex-1">
          <Link
            href="/"
            className="-m-1.5 p-1.5 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-all duration-200 hover:scale-105"
            aria-label="Afromerica Entertainment home page"
          >
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {siteConfig.brand.shortName}
            </span>
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </Button>
        </div>

        {/* Desktop navigation */}
        <div className="hidden lg:flex lg:gap-x-8" role="navigation">
          {siteConfig.navigation.slice(1).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium leading-6 text-foreground hover:text-primary transition-colors duration-200 rounded-lg px-2 py-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-3">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/auth/login">Sign in</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/auth/signup">Get Started</Link>
          </Button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div
          id="mobile-menu"
          className="lg:hidden border-t border-border/50 animate-fade-in-down"
          role="navigation"
          aria-label="Mobile navigation"
        >
          <div className="space-y-1 px-4 pb-3 pt-2">
            {siteConfig.navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-lg px-3 py-2 text-base font-medium leading-7 text-foreground hover:bg-accent/10 hover:text-primary transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-4 space-y-2 pt-4 border-t border-border/50">
              <Button variant="ghost" className="w-full" size="sm" asChild>
                <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                  Sign in
                </Link>
              </Button>
              <Button className="w-full" size="sm" asChild>
                <Link href="/auth/signup" onClick={() => setMobileMenuOpen(false)}>
                  Get Started
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
