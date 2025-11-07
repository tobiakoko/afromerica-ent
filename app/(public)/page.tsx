import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Music2, Calendar, Users } from "lucide-react";
import { HomeNavigation } from "@/components/layout/home-navigation";

export default function HomePage() {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Background with gradient and pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-purple-600/20 to-pink-600/20">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
      </div>

      {/* Navigation */}
      <HomeNavigation />

      {/* Main Content */}
      <div className="relative h-full flex items-center justify-center">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-5xl mx-auto text-center">
            {/* Hero Content */}
            <div className="mb-8 space-y-6">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight">
                <span className="block mb-2">Celebrating Culture</span>
                <span className="block bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Through Music & Art
                </span>
              </h1>

              <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto">
                Discover amazing artists, attend unforgettable events, and immerse yourself in the vibrant world of African and Afro-Caribbean entertainment.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="lg" asChild className="text-base h-12 px-8">
                <Link href="/events">
                  Explore Events <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-base h-12 px-8">
                <Link href="/artists">View Artists</Link>
              </Button>
            </div>

            {/* Feature Pills */}
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
              <div className="flex items-center gap-2 bg-background/50 backdrop-blur-sm border rounded-full px-4 py-2 md:px-6 md:py-3">
                <Music2 className="h-5 w-5 text-primary" />
                <span className="text-sm md:text-base font-medium">Discover Artists</span>
              </div>
              <div className="flex items-center gap-2 bg-background/50 backdrop-blur-sm border rounded-full px-4 py-2 md:px-6 md:py-3">
                <Calendar className="h-5 w-5 text-primary" />
                <span className="text-sm md:text-base font-medium">Upcoming Events</span>
              </div>
              <div className="flex items-center gap-2 bg-background/50 backdrop-blur-sm border rounded-full px-4 py-2 md:px-6 md:py-3">
                <Users className="h-5 w-5 text-primary" />
                <span className="text-sm md:text-base font-medium">Book Talent</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator (optional - can be removed for pure no-scroll) */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
        <p className="text-sm text-muted-foreground mb-2">Explore More</p>
        <div className="animate-bounce">
          <ArrowRight className="h-5 w-5 text-muted-foreground rotate-90 mx-auto" />
        </div>
      </div>
    </div>
  );
}
