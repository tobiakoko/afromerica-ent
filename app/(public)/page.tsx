import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Instagram,
  Twitter,
  Youtube,
  Music2,
  Play,
  Calendar,
  Mic2,
  Facebook
} from "lucide-react";
import { siteConfig } from "@/config/site";

const socialIconMap = {
  facebook: Facebook,
  instagram: Instagram,
  twitter: Twitter,
  youtube: Youtube,
};

export default function HomePage() {
  const backgroundImageUrl = "https://images.unsplash.com/photo-1632478179636-23973447e686?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbGJ1bSUyMGNvdmVyJTIwYXJ0JTIwcG9ydHJhaXR8ZW58MXx8fHwxNzYxNDIyNjY1fDA&ixlib=rb-4.1.0&q=80&w=1080";

  // Get social links
  const socials = siteConfig.footerSocialLinks.slice(0, 3).map(link => ({
    icon: socialIconMap[link.platform as keyof typeof socialIconMap],
    href: link.href,
    label: link.label,
  }));

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background">
      {/* Background with mesh gradient */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${backgroundImageUrl})` }}
        />
        {/* Dark overlay with gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/85 to-background/75" />
        {/* Mesh gradient accent */}
        <div className="absolute inset-0 bg-mesh opacity-50" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Top Section with Badge and Social */}
        <div className="container-wide pt-8 pb-6 animate-fade-in-down">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Brand Badge */}
            <div className="card-glass px-5 py-2 rounded-lg">
              <p className="text-xs font-medium tracking-wider text-foreground uppercase">
                {siteConfig.brand.fullName}
              </p>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socials.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="card-glass w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/10 transition-all duration-200 hover:scale-105"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Hero Content */}
        <section className="container-wide py-16 md:py-24 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left animate-hero-enter space-y-8">
              {/* Badge */}
              <div className="inline-block">
                <div className="bg-gradient-primary px-4 py-1.5 rounded-full">
                  <span className="text-[10px] font-semibold tracking-widest text-white uppercase">
                    Celebrating African Culture
                  </span>
                </div>
              </div>

              {/* Main Heading */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="text-foreground">Voice of </span>
                <span className="text-gradient">Soul</span>
                <br />
                <span className="text-foreground">Sound of </span>
                <span className="text-accent">Now</span>
              </h1>

              {/* Description */}
              <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0">
                {siteConfig.description}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <Button size="default" asChild>
                  <Link href="/pilot-vote">
                    <Play className="w-4 h-4" />
                    Vote Now
                  </Link>
                </Button>
                <Button variant="outline" size="default" asChild>
                  <Link href="/events">
                    <Calendar className="w-4 h-4" />
                    View Events
                  </Link>
                </Button>
              </div>

              {/* Music Platforms */}
              <div className="flex items-center gap-4 justify-center lg:justify-start flex-wrap">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">
                  Listen on:
                </p>
                {siteConfig.musicPlatforms.slice(0, 3).map((platform) => (
                  <a
                    key={platform.name}
                    href={platform.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors duration-200"
                    aria-label={platform.label}
                  >
                    {platform.name}
                  </a>
                ))}
              </div>
            </div>

            {/* Right Content - Featured Cards */}
            <div className="hidden lg:flex flex-col gap-4 animate-fade-in" style={{ animationDelay: '300ms' }}>
              {/* Top Card */}
              <Link href="/artists">
                <div className="card-glass rounded-lg overflow-hidden group cursor-pointer hover:scale-[1.02] transition-all duration-200 hover:shadow-md">
                  <div className="aspect-video relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-hero opacity-40" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <Music2 className="w-12 h-12 text-white mb-3 mx-auto" />
                        <h3 className="text-xl font-semibold text-white">Featured Artists</h3>
                        <p className="text-muted-foreground text-sm mt-1">Explore talent</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>

              {/* Bottom Row Cards */}
              <div className="grid grid-cols-2 gap-4">
                <Link href="/events">
                  <div className="card-glass rounded-lg p-5 group cursor-pointer hover:bg-white/10 transition-all duration-200">
                    <Calendar className="w-7 h-7 text-secondary mb-2" />
                    <h4 className="text-sm font-semibold text-foreground mb-0.5">Live Events</h4>
                    <p className="text-xs text-muted-foreground">Book tickets</p>
                  </div>
                </Link>

                <Link href="/pilot-vote">
                  <div className="card-glass rounded-lg p-5 group cursor-pointer hover:bg-white/10 transition-all duration-200">
                    <Mic2 className="w-7 h-7 text-accent mb-2" />
                    <h4 className="text-sm font-semibold text-foreground mb-0.5">December Pilot</h4>
                    <p className="text-xs text-muted-foreground">Vote now</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Decorative Floating Elements - More subtle */}
      <div className="absolute top-1/4 left-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-10 w-40 h-40 bg-secondary/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/3 w-36 h-36 bg-accent/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
    </div>
  );
}
