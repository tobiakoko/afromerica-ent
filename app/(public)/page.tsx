import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HomepageCarousel } from "@/components/home/HeroCarousel";
import { Calendar, TrendingUp } from "lucide-react";
import { createClient } from "@/utils/supabase/server";

export default async function HomePage() {
  const supabase = await createClient();
  
  // Fetch December Showcase event
  const { data: decemberShowcase } = await supabase
    .from('events')
    .select('id, slug, title, date, image_url')
    .eq('slug', 'december-showcase-2025')
    .single();

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Hero Carousel Section */}
      <section className="relative h-screen">
        <HomepageCarousel />
        
        {/* Overlay Content */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="container-wide text-center text-white space-y-6">
            <h1 className="text-5xl md:text-7xl font-bold">
              Welcome to <span className="text-gradient">Afromerica</span>
            </h1>
            <p className="text-xl md:text-2xl max-w-2xl mx-auto">
              Celebrating African culture through music, art, and unforgettable experiences
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button size="lg" asChild>
                <Link href={`/events/${decemberShowcase?.slug}/leaderboard`}>
                  <TrendingUp className="w-5 h-5" />
                  View Leaderboard
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="bg-white/10 backdrop-blur-sm">
                <Link href="/vote">
                  <Calendar className="w-5 h-5" />
                  Vote Now
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}