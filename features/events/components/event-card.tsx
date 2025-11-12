'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Calendar, MapPin, Users } from 'lucide-react';
import { formatEventDate, formatPrice } from '@/lib/utils';
import type { Event, EventFilter } from '../types/event.types';

interface EventCardProps {
  event: Event;
  filter?: EventFilter;
}

export function EventCard({ event, filter }: EventCardProps) {
  const isUpcoming = new Date(event.date) > new Date();
  const isSoldOut = filter === 'soldout' || (event.ticketsSold !== undefined && event.capacity !== undefined && event.ticketsSold >= event.capacity);

  return (
    <Link href={`/events/${event.slug}`} className="block h-full">
      <article className="group relative overflow-hidden rounded-lg bg-card border border-border/50 hover:border-border transition-all duration-200 hover:shadow-lg h-full flex flex-col">
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          {event.image ? (
            <Image
              src={event.image}
              alt={event.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-200"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
              <span className="text-5xl">🎵</span>
            </div>
          )}

          {/* Status Badges */}
          {(event.featured || isSoldOut || !isUpcoming) && (
            <div className="absolute top-3 left-3 flex gap-1.5">
              {event.featured && (
                <span className="px-2 py-0.5 bg-primary text-primary-foreground text-[10px] font-medium rounded">
                  FEATURED
                </span>
              )}
              {isSoldOut && (
                <span className="px-2 py-0.5 bg-destructive text-white text-[10px] font-medium rounded">
                  SOLD OUT
                </span>
              )}
              {!isUpcoming && event.status === 'completed' && (
                <span className="px-2 py-0.5 bg-muted text-muted-foreground text-[10px] font-medium rounded">
                  PAST EVENT
                </span>
              )}
            </div>
          )}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>

        {/* Content */}
        <div className="p-4 space-y-3 flex-1 flex flex-col">
          {/* Title */}
          <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-tight">
            {event.title}
          </h3>

          {/* Artists */}
          {event.artists && event.artists.length > 0 && (
            <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
              <Users className="w-3.5 h-3.5" />
              <span className="line-clamp-1">
                {event.artists.map(a => a.name).join(', ')}
              </span>
            </div>
          )}

          {/* Date & Location */}
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center gap-1.5 text-foreground">
              <Calendar className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-medium">
                {formatEventDate(event.date)}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-foreground/80">
              <MapPin className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs line-clamp-1">
                {typeof event.venue === 'string' ? event.venue : event.venue.name}, {event.city}
              </span>
            </div>
          </div>

          {/* Price & CTA */}
          <div className="flex items-center justify-between pt-3 border-t border-border/50">
            <div>
              <p className="text-muted-foreground text-[10px] uppercase tracking-wide">From</p>
              <p className="text-foreground font-semibold text-sm">
                {formatPrice(event.price || 0)}
              </p>
            </div>
            <button className="px-3 py-1.5 bg-primary text-primary-foreground text-xs font-medium rounded-md hover:bg-primary/90 transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed" disabled={isSoldOut}>
              {isSoldOut ? 'Sold Out' : 'Get Tickets'}
            </button>
          </div>
        </div>
      </article>
    </Link>
  );
}
