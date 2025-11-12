'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';
import { formatEventDate, formatPrice } from '@/lib/utils';
import type { Event } from '../types/event.types';

interface FeaturedEventProps {
  event: Event;
}

export function FeaturedEvent({ event }: FeaturedEventProps) {
  return (
    <section className="relative h-[70vh] min-h-[600px] overflow-hidden">
      {/* Background Image */}
      {(event.featuredImage || event.image) ? (
        <Image
          src={(event.featuredImage || event.image)!}
          alt={event.title}
          fill
          priority
          className="object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-lime-400/20 to-purple-600/20" />
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />

      {/* Content */}
      <div className="relative h-full container mx-auto px-4 sm:px-8">
        <div className="h-full flex items-center">
          <div className="max-w-2xl space-y-6">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-lime-400 text-black text-sm font-bold rounded-full">
              <span className="w-2 h-2 bg-black rounded-full animate-pulse" />
              FEATURED EVENT
            </div>

            {/* Title */}
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
              {event.title}
            </h1>

            {/* Description */}
            {event.description && (
              <p className="text-xl text-white/80 leading-relaxed">
                {event.description}
              </p>
            )}

            {/* Event Details */}
            <div className="flex flex-wrap gap-6 text-white/90">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-lime-400" />
                <span className="font-medium">{formatEventDate(event.date)}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-lime-400" />
                <span className="font-medium">
                  {typeof event.venue === 'string' ? event.venue : event.venue.name}
                </span>
              </div>
            </div>

            {/* Artists */}
            {event.artists && event.artists.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {event.artists.map((artist) => (
                  <Link
                    key={artist.id}
                    href={`/artists/${artist.slug}`}
                    className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white hover:bg-white/20 transition-colors"
                  >
                    {artist.name}
                  </Link>
                ))}
              </div>
            )}

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                href={`/events/${event.slug}`}
                className="group px-8 py-4 bg-lime-400 text-black font-bold rounded-lg hover:bg-lime-300 transition-all duration-200 flex items-center gap-2 hover:scale-105"
              >
                Get Tickets from {formatPrice(event.price || 0)}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href={`/events/${event.slug}`}
                className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold rounded-lg hover:bg-white/20 transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />
    </section>
  );
}