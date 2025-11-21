import { Music, Users, Trophy, Heart, Target, Lightbulb } from "lucide-react";
import Link from "next/link";
 
export const dynamic = 'force-dynamic'

const values = [
  {
    icon: Music,
    title: "Authentic African Music",
    description: "We celebrate the rich diversity of African music and culture"
  },
  {
    icon: Users,
    title: "Community First",
    description: "Building a vibrant community of artists and music lovers"
  },
  {
    icon: Trophy,
    title: "Excellence",
    description: "Showcasing the best talent and delivering premium experiences"
  },
  {
    icon: Heart,
    title: "Passion",
    description: "Driven by our love for African music and culture"
  },
];
 
export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section with Gradient */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-linear-to-b from-white via-gray-50/50 to-white dark:from-gray-950 dark:via-gray-900/50 dark:to-gray-950" />
 
        <div className="relative max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16">
          <div className="max-w-4xl mx-auto text-center animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="inline-flex items-center px-4 py-1.5 bg-linear-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full text-xs font-medium text-blue-700 dark:text-blue-300 uppercase tracking-wider mb-6 shadow-lg">
              Our Story
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-gray-900 dark:text-white mb-6 leading-tight">
              About Afromerica
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 font-light leading-relaxed">
              Celebrating African culture through music and events
            </p>
          </div>
        </div>
      </section>
 
      {/* Story Section */}
      <section className="relative pb-24 md:pb-32">
        <div className="relative max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Who We Are */}
            <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-2xl border border-gray-200/60 dark:border-gray-800 p-8 lg:p-10 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-0.5 animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: '200ms' }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                  <Lightbulb className="w-6 h-6 text-gray-600 dark:text-gray-400 stroke-[1.5]" aria-hidden="true" />
                </div>
                <h2 className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
                  Who We Are
                </h2>
              </div>
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <p className="text-lg text-gray-600 dark:text-gray-400 font-light leading-relaxed">
                  Afromerica Entertainment is a premier entertainment company dedicated to promoting
                  African music and culture. We organize world-class events, support emerging artists,
                  and create unforgettable experiences for music lovers.
                </p>
              </div>
            </div>
 
            {/* Our Mission */}
            <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-2xl border border-gray-200/60 dark:border-gray-800 p-8 lg:p-10 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-0.5 animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: '300ms' }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                  <Target className="w-6 h-6 text-gray-600 dark:text-gray-400 stroke-[1.5]" aria-hidden="true" />
                </div>
                <h2 className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
                  Our Mission
                </h2>
              </div>
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <p className="text-lg text-gray-600 dark:text-gray-400 font-light leading-relaxed">
                  To bridge the gap between African artists and global audiences by providing platforms
                  for talent showcase, cultural exchange, and community building.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
 
      {/* Values Section */}
      <section className="relative pb-24 md:pb-32 border-t border-gray-200/60 dark:border-gray-800">
        <div className="relative max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16 pt-24 md:pt-32">
          {/* Section Header */}
          <div className="mb-12 md:mb-16 text-center animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-gray-900 dark:text-white mb-4">
              Our Values
            </h2>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 font-light leading-relaxed max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>
 
          {/* Values Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
 
              return (
                <div
                  key={value.title}
                  className="group bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-2xl border border-gray-200/60 dark:border-gray-800 p-8 shadow-lg hover:shadow-2xl hover:shadow-black/10 dark:hover:shadow-black/40 transition-all duration-500 hover:-translate-y-1 text-center animate-in fade-in slide-in-from-bottom-4"
                  style={{ animationDelay: `${400 + index * 100}ms` }}
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-gray-100 dark:bg-gray-800 mb-6 transition-transform duration-500 group-hover:scale-110">
                    <Icon className="w-8 h-8 md:w-10 md:h-10 text-gray-600 dark:text-gray-400 stroke-[1.5]" aria-hidden="true" />
                  </div>
                  <h3 className="font-semibold text-xl md:text-2xl tracking-tight text-gray-900 dark:text-white mb-3">
                    {value.title}
                  </h3>
                  <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 font-light leading-relaxed">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
 
      {/* CTA Section */}
      <section className="relative pb-24 md:pb-32">
        <div className="relative max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16">
          <div className="bg-linear-to-br from-blue-600 to-purple-600 rounded-3xl p-12 md:p-16 text-center text-white shadow-2xl shadow-black/20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight mb-6">
              Join Our Community
            </h2>
            <p className="text-xl md:text-2xl font-light leading-relaxed mb-8 max-w-2xl mx-auto opacity-90">
              Be part of the movement celebrating African music and culture
            </p>
            <Link
              href="/events"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 rounded-xl text-lg font-semibold hover:bg-gray-100 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
            >
              Explore Events
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}