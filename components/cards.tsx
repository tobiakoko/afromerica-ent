import { ArrowRight, Calendar, Instagram, MapPin, Music } from "lucide-react"
import Image from "next/image"
import { Button } from "./ui/button"
import Link from "next/link"

// components/ui/event-card.tsx
interface EventCardProps {
  event: {
    id: string
    title: string
    date: string
    venue: string
    image: string
    ticketsAvailable: boolean
  }
}

export function EventCard({ event }: EventCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-dark-100 transition-all hover:scale-[1.02]">
      {/* Image Container */}
      <div className="aspect-[4/3] overflow-hidden">
        <Image
          src={event.image}
          alt={event.title}
          width={600}
          height={450}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/60 to-transparent opacity-80" />
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6">
        {/* Date Badge */}
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-dark">
          <Calendar className="h-3 w-3" />
          {event.date}
        </div>

        {/* Title */}
        <h3 className="mb-2 font-heading text-2xl font-bold text-white">
          {event.title}
        </h3>

        {/* Venue */}
        <p className="mb-4 flex items-center gap-2 text-sm text-text-secondary">
          <MapPin className="h-4 w-4" />
          {event.venue}
        </p>

        {/* CTA */}
        {event.ticketsAvailable ? (
          <Button variant="default" size="sm" className="w-full">
            Get Tickets
          </Button>
        ) : (
          <Button variant="outline" size="sm" className="w-full" disabled>
            Sold Out
          </Button>
        )}
      </div>

      {/* Hover State Indicator */}
      <div className="absolute right-4 top-4 rounded-full bg-white/10 p-2 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
        <ArrowRight className="h-5 w-5 text-white" />
      </div>
    </div>
  )
}


interface ArtistCardProps {
  artist: {
    slug: string
    image?: string
    name: string
    genre?: string
    spotify?: string
    instagram?: string
  }
}

export function ArtistCard({ artist }: ArtistCardProps) {
  return (
    <Link 
      href={`/artists/${artist.slug}`}
      className="group block"
    >
      <div className="overflow-hidden rounded-2xl bg-dark-100 transition-all hover:bg-dark-50">
        {/* Image */}
        <div className="aspect-square overflow-hidden">
          <Image
            src={artist.image || ''}
            alt={artist.name}
            width={400}
            height={400}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        </div>

        {/* Info */}
        <div className="p-6">
          <h3 className="mb-1 font-heading text-xl font-bold text-white">
            {artist.name}
          </h3>
          <p className="text-sm text-text-secondary">
            {artist.genre}
          </p>
          
          {/* Social Links */}
          <div className="mt-4 flex gap-3">
            {artist.spotify && (
              <a href={artist.spotify} className="text-text-secondary hover:text-accent">
                <Music className="h-5 w-5" />
              </a>
            )}
            {artist.instagram && (
              <a href={artist.instagram} className="text-text-secondary hover:text-accent">
                <Instagram className="h-5 w-5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}