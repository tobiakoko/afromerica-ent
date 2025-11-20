"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import AnnouncementBanner from "@/components/banner";

export function HomeNavigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const navigation = [
    { name: "Artists", href: "/artists" },
    { name: "Events", href: "/events" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

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
       />

      {/* Navigation */}
      <header className="absolute top-12 left-0 right-0 z-50 w-full" role="banner">
        <nav className="container mx-auto flex items-center justify-between p-4 lg:px-8" aria-label="Main" role="navigation">
          <div className="flex lg:flex-1 items-center">
            <Link
              href="/"
              className="-m-1.5 p-1.5 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white focus-visible:ring-2 focus-visible:ring-white transition-all duration-200 hover:scale-105 flex items-center gap-3"
              aria-label="AfroMerica Entertainment home page"
            >
              <div
                className="
                  flex items-center justify-center
                  rounded-md
                  p-1.5
                  bg-neutral-900/90 dark:bg-white/90
                  shadow-sm
                  ring-1 ring-white/10 dark:ring-black/30
                  w-auto h-10
                "
                style={{ minWidth: 40 }}
              >
                <Image
                  src="/logo.png"
                  alt="AfroMerica Entertainment"
                  width={160}
                  height={40}
                  className="h-8 w-auto object-contain"
                  priority
                  unoptimized
                />
              </div>
              <span className="hidden sm:inline-block text-base font-semibold tracking-tight text-white dark:text-white drop-shadow-md">
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
              className="text-white hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white"
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
              <li key={item.name}>
                <Link
                  href={item.href}
                  className="text-sm font-semibold text-white hover:text-white/90 transition-colors drop-shadow-lg rounded-lg px-2 py-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white focus-visible:ring-2 focus-visible:ring-white"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>

          <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-4 lg:items-center">
            <ThemeToggle />
            <Button variant="ghost" asChild className="text-white hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white">
              <Link href="/signin">Sign in</Link>
            </Button>
            <Button asChild className="bg-white text-primary hover:bg-white/90 focus-visible:ring-2 focus-visible:ring-primary">
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>
        </nav>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div
            ref={mobileMenuRef}
            id="mobile-menu"
            className="lg:hidden bg-black/90 backdrop-blur-lg border-t border-white/10"
            role="navigation"
            aria-label="Mobile"
          >
            <nav>
              <ul className="space-y-1 px-4 pb-3 pt-2" role="list">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="block rounded-lg px-3 py-2 text-base font-semibold text-white hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white focus-visible:ring-2 focus-visible:ring-white transition-all duration-200"
                      onClick={closeMobileMenu}
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-4 space-y-2 px-4 pb-3">
                <div className="flex justify-center py-2">
                  <ThemeToggle />
                </div>
                <Button variant="ghost" className="w-full text-white hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white" asChild>
                  <Link href="/signin" onClick={closeMobileMenu}>Sign in</Link>
                </Button>
                <Button className="w-full bg-white text-primary hover:bg-white/90 focus-visible:ring-2 focus-visible:ring-primary" asChild>
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

/*

import { useState, useEffect } from 'react';
import { Menu, X, Facebook, Instagram, Music, Coffee } from 'lucide-react';

interface NavigationProps {
  currentPage?: string;
  artistName?: string;
}

export function Navigation({ currentPage = 'home', artistName = '*Arlene McCoy )*' }: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Latest Releases', href: '#releases', id: 'releases' },
    { name: 'About Us', href: '#about', id: 'about' },
    { name: 'Upcoming Event', href: '#events', id: 'events' },
    { name: 'Discography', href: '#discography', id: 'discography' },
    { name: 'Newsletter', href: '#newsletter', id: 'newsletter' },
  ];

  const socialLinks = [
    { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
    { 
      icon: ({ className }: { className?: string }) => (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"/>
          <path d="M12 6c-3.309 0-6 2.691-6 6s2.691 6 6 6 6-2.691 6-6-2.691-6-6-6zm0 10c-2.206 0-4-1.794-4-4s1.794-4 4-4 4 1.794 4 4-1.794 4-4 4z"/>
        </svg>
      ), 
      href: 'https://snapchat.com', 
      label: 'Snapchat' 
    },
    { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
    { icon: Coffee, href: '#', label: 'Buy Me a Coffee' },
  ];

  const musicPlatforms = [
    { 
      icon: ({ className }: { className?: string }) => (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
        </svg>
      ), 
      href: 'https://spotify.com', 
      label: 'Spotify' 
    },
    { 
      icon: ({ className }: { className?: string }) => (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2A10 10 0 0 0 2 12a10 10 0 0 0 10 10 10 10 0 0 0 10-10A10 10 0 0 0 12 2m0 18a8 8 0 0 1-8-8 8 8 0 0 1 8-8 8 8 0 0 1 8 8 8 8 0 0 1-8 8m.84-5.8c.2 0 .34.04.44.12.1.08.16.24.16.44v2.68c-1.24.32-2.32.32-3.24 0-.64-.24-1.16-.64-1.52-1.2-.36-.6-.56-1.32-.56-2.2 0-.88.2-1.6.56-2.2.36-.56.88-.96 1.52-1.2.92-.32 2-.32 3.24 0v2.68c0 .2-.06.36-.16.44-.1.08-.24.12-.44.12-.2 0-.34-.04-.44-.12-.1-.08-.16-.24-.16-.44v-1.64c-.68-.16-1.28-.16-1.76 0-.36.12-.64.36-.84.68-.2.32-.32.76-.32 1.28s.12.96.32 1.28c.2.32.48.56.84.68.48.16 1.08.16 1.76 0v-1.64c0-.2.06-.36.16-.44.1-.08.24-.12.44-.12z"/>
        </svg>
      ), 
      href: 'https://soundcloud.com', 
      label: 'SoundCloud' 
    },
    { icon: Music, href: 'https://music.apple.com', label: 'Apple Music' },
    { 
      icon: ({ className }: { className?: string }) => (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
        </svg>
      ), 
      href: 'https://tiktok.com', 
      label: 'TikTok' 
    },
  ];

  return (
    <>
      {/* Top Navigation Bar *}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-obsidian-black/90 backdrop-blur-lg' : 'bg-transparent'
      }`}>
        {/* Primary Nav - Social Links, Artist Name, Music Platforms *}
        <div className="border-b border-white/10">
          <div className="container-custom py-4">
            <div className="flex items-center justify-between">
              {/* Left - Social Links *}
              <div className="flex items-center gap-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="text-white hover:text-electric-lime transition-colors duration-200"
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>

              {/* Center - Artist Name *}
              <a href="#home" className="text-white text-xl tracking-wide hidden md:block">
                {artistName}
              </a>

              {/* Right - Music Platforms *}
              <div className="flex items-center gap-4">
                {musicPlatforms.map((platform) => (
                  <a
                    key={platform.label}
                    href={platform.href}
                    aria-label={platform.label}
                    className="text-white hover:text-electric-lime transition-colors duration-200"
                  >
                    <platform.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Nav - Avatar and Main Links *}
        <div className="hidden lg:block">
          <div className="container-custom py-6">
            <div className="flex items-center gap-12">
              {/* Avatar *}
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-soft-gray to-muted-gray flex-shrink-0" />

              {/* Main Navigation Links *}
              <div className="flex items-center gap-10">
                {navLinks.map((link) => (
                  <a
                    key={link.id}
                    href={link.href}
                    className={`text-white transition-colors duration-200 hover:text-electric-lime ${
                      currentPage === link.id ? 'text-electric-lime' : ''
                    }`}
                  >
                    {link.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu Button *}
        <div className="lg:hidden absolute top-4 right-4">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="w-10 h-10 rounded bg-white/10 hover:bg-electric-lime flex items-center justify-center transition-colors duration-200 group"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-white group-hover:text-obsidian-black" />
            ) : (
              <Menu className="w-6 h-6 text-white group-hover:text-obsidian-black" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu *}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-obsidian-black/95 backdrop-blur-lg"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="relative h-full flex flex-col pt-24 px-6 animate-slide-up">
            <nav className="flex flex-col gap-6">
              {navLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`text-2xl transition-colors duration-200 ${
                    currentPage === link.id ? 'text-electric-lime' : 'text-white hover:text-electric-lime'
                  }`}
                >
                  {link.name}
                </a>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}

*/