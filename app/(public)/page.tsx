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
  ChevronDown
} from "lucide-react";

export default function HomePage() {
  const backgroundImageUrl = "/hero-background.jpg";

  // Social links
  const socials = [
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Youtube, href: "#", label: "YouTube" },
  ];

  // Music platforms
  const musicPlatforms = [
    { name: "Spotify", href: "#" },
    { name: "Apple Music", href: "#" },
    { name: "SoundCloud", href: "#" },
  ];

  // Navigation links
  const navigation = [
    { name: "Artists", href: "/artists" },
    { name: "Events", href: "/events" },
    { name: "Pilot Voting", href: "/pilot-voting" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <div className="relative h-screen w-full overflow-hidden bg-background-primary">
      {/* Background Image */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center transform-gpu will-change-transform"
          style={{ backgroundImage: `url(${backgroundImageUrl})` }}
        />
        {/* Dark overlay with gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/50" />
        {/* Radial gradient accent */}
        <div className="absolute inset-0 bg-gradient-radial opacity-30" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Top Info Badge */}
        <div className="w-full flex justify-center pt-6 px-4 animate-fade-in-down">
          <div className="card-glass px-6 py-2 rounded-full">
            <p className="text-sm font-semibold tracking-wider text-white uppercase">
              Afromerica Entertainment
            </p>
          </div>
        </div>

        {/* Social Links */}
        <div className="w-full flex justify-center pt-6 px-4 animate-fade-in-down" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center gap-6">
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="card-glass w-10 h-10 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-all duration-normal hover:scale-110"
              >
                <social.icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <nav className="w-full flex justify-center pt-8 px-4 animate-fade-in-down" style={{ animationDelay: '200ms' }}>
          <div className="card-glass rounded-full px-8 py-4">
            <div className="hidden md:flex items-center gap-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-sm font-semibold text-white/80 hover:text-white transition-colors duration-normal"
                >
                  {item.name}
                </Link>
              ))}
            </div>
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button className="text-white text-sm font-semibold">
                Menu
              </button>
            </div>
          </div>
        </nav>

        {/* Hero Content */}
        <section className="flex-1 flex items-center justify-center px-6 md:px-12 lg:px-20">
          <div className="max-w-6xl w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div className="text-center lg:text-left animate-hero-enter">
                {/* Badge */}
                <div className="inline-block mb-6">
                  <div className="bg-gradient-primary px-4 py-2 rounded-full">
                    <span className="text-xs font-bold tracking-widest text-white uppercase">
                      Celebrating African Culture
                    </span>
                  </div>
                </div>

                {/* Main Heading */}
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight mb-6">
                  <span className="text-white">Voice of </span>
                  <span className="text-gradient-rainbow">Soul</span>
                  <br />
                  <span className="text-white">Sound of </span>
                  <span className="text-brand-tertiary">Now</span>
                </h1>

                {/* Description */}
                <p className="text-lg md:text-xl text-text-secondary mb-8 max-w-xl mx-auto lg:mx-0">
                  Discover amazing artists, attend unforgettable events, and immerse yourself in the vibrant world of African and Afro-Caribbean entertainment.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
                  <Button variant="brandPrimary" size="xl" asChild>
                    <Link href="/pilot-voting">
                      <Play className="w-5 h-5 mr-2" />
                      Vote Now
                    </Link>
                  </Button>
                  <Button variant="brandGlass" size="xl" asChild>
                    <Link href="/events">
                      <Calendar className="w-5 h-5 mr-2" />
                      View Events
                    </Link>
                  </Button>
                </div>

                {/* Music Platforms */}
                <div className="flex items-center gap-4 justify-center lg:justify-start">
                  <p className="text-sm text-text-tertiary uppercase tracking-wider">
                    Listen on:
                  </p>
                  {musicPlatforms.map((platform) => (
                    <a
                      key={platform.name}
                      href={platform.href}
                      className="text-sm text-white/60 hover:text-white transition-colors duration-normal"
                    >
                      {platform.name}
                    </a>
                  ))}
                </div>
              </div>

              {/* Right Content - Featured Cards */}
              <div className="hidden lg:flex flex-col gap-4 animate-fade-in" style={{ animationDelay: '300ms' }}>
                {/* Top Card */}
                <div className="card-glass rounded-2xl overflow-hidden group cursor-pointer hover:scale-105 transition-all duration-normal hover:shadow-glow-pink">
                  <div className="aspect-video relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-hero opacity-50" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <Music2 className="w-16 h-16 text-white mb-4 mx-auto" />
                        <h3 className="text-2xl font-bold text-white">Featured Artists</h3>
                        <p className="text-text-secondary mt-2">Explore talent</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Row Cards */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="card-glass rounded-xl p-6 group cursor-pointer hover:bg-white/10 transition-all duration-normal">
                    <Calendar className="w-8 h-8 text-brand-secondary mb-3" />
                    <h4 className="text-lg font-bold text-white mb-1">Live Events</h4>
                    <p className="text-sm text-text-secondary">Book tickets</p>
                  </div>

                  <div className="card-glass rounded-xl p-6 group cursor-pointer hover:bg-white/10 transition-all duration-normal">
                    <Mic2 className="w-8 h-8 text-brand-tertiary mb-3" />
                    <h4 className="text-lg font-bold text-white mb-1">December Pilot</h4>
                    <p className="text-sm text-text-secondary">Vote now</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom Scroll Indicator */}
        <div className="w-full flex justify-center pb-8 animate-bounce">
          <div className="card-glass w-12 h-12 rounded-full flex items-center justify-center">
            <ChevronDown className="w-5 h-5 text-white/60" />
          </div>
        </div>
      </div>

      {/* Decorative Floating Elements */}
      <div className="absolute top-1/4 left-10 w-20 h-20 bg-brand-primary/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-10 w-32 h-32 bg-brand-secondary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-brand-tertiary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
    </div>
  );
}
