import { Calendar, MapPin, ChevronRight } from "lucide-react";

interface FeaturedEventProps {
  title: string;
  subtitle: string;
  date: string;
  venue: string;
  image?: string;
}

const FeaturedEvent: React.FC<FeaturedEventProps> = ({ title, subtitle, date, venue, image }) => (
  <section className="relative h-screen flex items-center justify-center overflow-hidden">
    {/* Background */}
    <div className="absolute inset-0">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/60 to-black z-10"></div>
      <img
        src={image || "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1920&q=80"}
        alt={title}
        className="w-full h-full object-cover opacity-40"
      />
    </div>

    {/* Content */}
    <div className="relative z-20 text-center max-w-5xl mx-auto px-8">
      <div className="mb-6">
        <span className="inline-flex items-center px-4 py-2 bg-white text-black text-xs font-bold uppercase tracking-wider rounded-full">
          Featured Event
        </span>
      </div>
      <h1 className="text-8xl md:text-9xl font-bold text-white mb-4 tracking-tighter">
        {title}
      </h1>
      <p className="text-3xl text-white/80 mb-8 font-light">{subtitle}</p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-white/80 mb-12">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          <span className="text-lg">{date}</span>
        </div>
        <div className="hidden sm:block w-1 h-1 bg-white/40 rounded-full"></div>
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          <span className="text-lg">{venue}</span>
        </div>
      </div>
      <button className="px-8 py-4 bg-lime-400 text-black font-bold rounded-lg hover:bg-lime-500 transition-colors duration-200 text-lg">
        Get Tickets Now
      </button>
    </div>

    {/* Scroll Indicator */}
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce z-20">
      <ChevronRight className="w-6 h-6 text-white/60 rotate-90" />
    </div>
  </section>
);

export { FeaturedEvent };