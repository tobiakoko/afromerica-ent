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

// Music Platform Icons (SVG)
const SpotifyIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
  </svg>
);

const AppleMusicIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.994 6.124a9.23 9.23 0 0 0-.24-2.19c-.317-1.31-1.062-2.31-2.18-3.043a5.022 5.022 0 0 0-1.877-.726 10.496 10.496 0 0 0-1.564-.15c-.04-.003-.083-.01-.124-.013H5.986c-.152.01-.303.017-.455.026-.747.043-1.49.123-2.193.4-1.336.53-2.3 1.452-2.865 2.78-.192.448-.292.925-.363 1.408a10.61 10.61 0 0 0-.1 1.18c0 .032-.007.062-.01.093v12.223c.01.14.017.283.027.424.05.815.154 1.624.497 2.373.65 1.42 1.738 2.353 3.234 2.801.42.127.856.187 1.293.228.555.053 1.11.06 1.667.06h11.03a12.5 12.5 0 0 0 1.57-.1c.822-.106 1.596-.35 2.296-.81a5.046 5.046 0 0 0 1.88-2.207c.186-.42.293-.87.37-1.324.113-.675.138-1.358.137-2.04-.002-3.8 0-7.595-.003-11.393zm-6.423 3.99v5.712c0 .417-.058.827-.244 1.206-.29.59-.76.962-1.388 1.14-.35.1-.706.157-1.07.173-.95.045-1.773-.6-1.943-1.536a1.88 1.88 0 0 1 1.038-2.022c.323-.16.67-.25 1.018-.324.378-.082.758-.153 1.134-.24.274-.063.457-.23.51-.516a.904.904 0 0 0 .02-.193c0-1.815 0-3.63-.002-5.443a.725.725 0 0 0-.026-.185c-.04-.15-.15-.243-.304-.234-.16.01-.318.035-.475.066-.76.15-1.52.303-2.28.456l-2.325.47-1.372.278c-.016.003-.034.005-.05.01-.208.048-.29.158-.29.37-.002 2.16 0 4.318 0 6.477 0 .14-.01.28-.035.418-.126.717-.515 1.246-1.188 1.59-.238.12-.49.2-.748.26-.934.22-1.77-.16-2.108-1.01a1.855 1.855 0 0 1 .423-2.054c.38-.357.842-.575 1.335-.68.382-.08.766-.153 1.148-.236.27-.06.447-.223.497-.497a.896.896 0 0 0 .02-.198c0-2.348.002-4.696 0-7.044 0-.076.005-.15.014-.224.024-.202.136-.334.335-.363.068-.01.136-.02.204-.027.46-.09.918-.182 1.377-.27 1.15-.232 2.3-.463 3.448-.697.575-.117 1.148-.236 1.723-.35.262-.052.524-.088.788-.116.16-.017.238.05.273.206.01.045.014.09.014.136v5.622z"/>
  </svg>
);

const SoundCloudIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M1.175 12.225c-.051 0-.094.046-.101.1l-.233 2.154.233 2.105c.007.058.05.098.101.098.05 0 .09-.04.099-.098l.255-2.105-.27-2.154c0-.057-.045-.1-.09-.1m-.899.828c-.06 0-.091.037-.104.094L0 14.479l.165 1.308c0 .055.045.094.09.094s.089-.045.104-.104l.21-1.319-.21-1.334c0-.061-.044-.1-.09-.1m1.83-1.229c-.061 0-.12.045-.12.104l-.21 2.563.225 2.458c0 .06.045.12.119.12.061 0 .105-.061.121-.12l.254-2.474-.254-2.548c-.016-.06-.061-.12-.121-.12m.945-.089c-.075 0-.135.06-.15.135l-.193 2.64.193 2.498c.016.074.075.134.15.134.074 0 .134-.06.15-.134l.209-2.498-.209-2.64c-.016-.074-.076-.135-.15-.135m.809-.104c-.09 0-.15.074-.165.149l-.194 2.848.194 2.548c.016.077.075.138.165.138.075 0 .149-.074.15-.138l.209-2.548-.209-2.848c-.016-.074-.075-.149-.15-.149m1.006.119c-.09 0-.165.06-.18.149l-.18 2.729.18 2.458c.015.09.09.15.18.15.09 0 .164-.074.18-.15l.209-2.458-.209-2.729c-.016-.09-.075-.149-.18-.149m.959-.465c-.104 0-.195.09-.21.179l-.164 3.134.164 2.474c.015.09.105.165.21.165.09 0 .18-.074.195-.165l.193-2.474-.193-3.134c-.015-.09-.104-.179-.195-.179m1.006.614c-.119 0-.21.09-.225.209l-.15 2.52.15 2.205c.015.119.105.225.225.225.104 0 .195-.105.209-.225l.164-2.205-.164-2.52c-.015-.12-.105-.21-.209-.21m.93-.735c-.12 0-.226.106-.24.226l-.149 3.255.149 2.174c.015.119.12.225.24.225s.226-.105.24-.225l.164-2.174-.164-3.255c-.015-.12-.12-.226-.24-.226m1.02.794c-.135 0-.24.106-.255.24l-.135 2.461.135 2.175c.015.119.12.225.255.225.119 0 .225-.091.239-.225l.15-2.175-.15-2.461c-.014-.134-.12-.24-.239-.24m1.006-.885c-.135 0-.27.12-.285.255l-.119 3.346.119 2.115c.015.134.15.255.285.255s.255-.12.27-.255l.134-2.115-.134-3.346c-.015-.135-.135-.255-.27-.255m.959 0c-.135 0-.271.12-.286.255l-.104 3.346.104 2.13c.016.12.15.24.286.24.134 0 .254-.105.269-.24l.12-2.13-.12-3.346c-.015-.135-.135-.255-.269-.255m1.02-.149c-.15 0-.271.119-.286.27l-.09 3.494.09 2.07c.015.134.135.254.286.254.134 0 .254-.12.269-.254l.104-2.07-.104-3.494c-.015-.151-.135-.27-.269-.27m.988.179c-.165 0-.27.12-.3.285l-.061 3.285.061 2.01c.03.149.135.269.3.269.151 0 .271-.12.286-.27l.076-2.01-.076-3.285c-.015-.164-.135-.284-.286-.284m1.006-.075c-.165 0-.286.121-.301.286l-.074 3.359.074 1.965c.015.149.136.284.301.284.149 0 .284-.12.299-.284l.09-1.965-.09-3.359c-.015-.165-.15-.286-.299-.286m1.021.104c-.18 0-.301.135-.316.3l-.062 3.255.062 1.996c.015.165.135.3.316.3.164 0 .3-.135.3-.3l.074-1.996-.074-3.255c0-.165-.136-.3-.3-.3m.964-.164c-.18 0-.315.149-.33.313l-.046 3.434.046 1.979c.015.18.15.315.33.315.166 0 .316-.135.331-.315l.06-1.979-.06-3.434c-.015-.164-.165-.313-.331-.313m1.006.15c-.195 0-.33.149-.346.33l-.029 3.255.029 1.935c.016.164.166.33.346.33.18 0 .33-.166.33-.33l.045-1.935-.045-3.255c0-.181-.15-.33-.33-.33m1.036-.196c-.195 0-.345.15-.36.33l-.016 3.45.016 1.906c.015.18.165.344.36.344s.345-.164.36-.344l.029-1.906-.029-3.45c-.015-.18-.165-.33-.36-.33"/>
  </svg>
);

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

        {/* Navigation Links */}
        <nav className="container-wide py-4 animate-fade-in" style={{ animationDelay: '150ms' }}>
          <div className="flex items-center justify-center gap-8">
            {siteConfig.navigation.slice(0, 5).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 relative group"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-primary group-hover:w-full transition-all duration-200" />
              </Link>
            ))}
          </div>
        </nav>

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
                <div className="flex items-center gap-3">
                  <a
                    href={siteConfig.musicPlatforms[0].href}
                    aria-label={siteConfig.musicPlatforms[0].label}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-[#1DB954] bg-muted/30 hover:bg-muted/50 transition-all duration-200 hover:scale-110"
                    title="Spotify"
                  >
                    <SpotifyIcon className="w-4 h-4" />
                  </a>
                  <a
                    href={siteConfig.musicPlatforms[1].href}
                    aria-label={siteConfig.musicPlatforms[1].label}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground bg-muted/30 hover:bg-muted/50 transition-all duration-200 hover:scale-110"
                    title="Apple Music"
                  >
                    <AppleMusicIcon className="w-4 h-4" />
                  </a>
                  <a
                    href={siteConfig.musicPlatforms[2].href}
                    aria-label={siteConfig.musicPlatforms[2].label}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-[#FF5500] bg-muted/30 hover:bg-muted/50 transition-all duration-200 hover:scale-110"
                    title="SoundCloud"
                  >
                    <SoundCloudIcon className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>

            {/* Right Content - Featured Cards */}
            <div className="hidden lg:flex flex-col gap-4 animate-fade-in" style={{ animationDelay: '300ms' }}>
              {/* Top Card */}
              <Link href="/artists">
                <div className="card-glass rounded-lg overflow-hidden group cursor-pointer hover:scale-[1.02] transition-all duration-200 hover:shadow-md">
                  <div className="aspect-video relative overflow-hidden">
                    {/* Featured Artist Image */}
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                      style={{
                        backgroundImage: `url(https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=1200&auto=format&fit=crop)`
                      }}
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    {/* Content */}
                    <div className="absolute inset-0 flex items-end p-6">
                      <div className="text-left w-full">
                        <div className="flex items-center gap-2 mb-2">
                          <Music2 className="w-5 h-5 text-primary" />
                          <span className="text-xs font-medium text-primary uppercase tracking-wider">Featured Artists</span>
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-1">Discover Amazing Talent</h3>
                        <p className="text-white/70 text-sm">Explore our roster of incredible artists</p>
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
