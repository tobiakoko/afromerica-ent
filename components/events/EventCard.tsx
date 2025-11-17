/**
 * Event Card Component
 * Displays event summary in list/grid views
 */

import Link from 'next/link'
import Image from 'next/image'
import { Card } from '@/components/ui/card'
import { Calendar, MapPin, Music, TrendingUp } from 'lucide-react'
import { format } from 'date-fns'
import { type PublicEvent } from '@/lib/validations/event'
import { cn } from '@/lib/utils'

interface EventCardProps {
  event: PublicEvent
  priority?: boolean
}

export function EventCard({ event, priority = false }: EventCardProps) {
  const eventDate = new Date(event.event_date)

  return (
    <Link
      href={`/events/${event.slug}`}
      className={cn('group block', event.featured && 'md:col-span-2 lg:col-span-1')}
    >
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 h-full flex flex-col">
        {/* Image */}
        <div className={cn('relative bg-muted', event.featured ? 'h-80' : 'h-56')}>
          {(event.image_url || event.cover_image_url) ? (
            <Image
              src={event.image_url || event.cover_image_url!}
              alt={`${event.title} event image`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              priority={priority}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
              <Music className="w-16 h-16 text-muted-foreground/30" aria-hidden="true" />
            </div>
          )}

          {/* Status Overlays */}
          {event.is_sold_out && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="text-white font-bold text-xl">SOLD OUT</span>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            {event.featured && !event.is_sold_out && (
              <span className="px-3 py-1 bg-primary text-primary-foreground rounded-full text-xs font-medium shadow-lg">
                Featured
              </span>
            )}
            {event.sold_out_percentage >= 90 && !event.is_sold_out && (
              <span className="px-3 py-1 bg-orange-500 text-white rounded-full text-xs font-medium shadow-lg">
                Almost Full
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          <h3 className="font-semibold text-lg mb-3 line-clamp-2 group-hover:text-primary transition-colors">
            {event.title}
          </h3>

          <div className="space-y-2 text-sm text-muted-foreground mt-auto">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 shrink-0" aria-hidden="true" />
              <time dateTime={event.event_date}>
                {format(eventDate, 'MMM d, yyyy')}
                {event.time && <span className="ml-1">• {event.time}</span>}
              </time>
            </div>

            {event.venue && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span className="line-clamp-1">
                  {event.venue}
                  {event.city && <span className="ml-1">• {event.city}</span>}
                </span>
              </div>
            )}

            {event.show_leaderboard && (
              <div className="flex items-center gap-2 text-primary">
                <TrendingUp className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span className="font-medium">Voting Enabled</span>
              </div>
            )}
          </div>

          {/* Price */}
          {event.ticket_price !== null && event.ticket_price !== undefined && (
            <div className="mt-4 pt-4 border-t">
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-muted-foreground">From</span>
                <span className="text-lg font-bold text-primary">
                  ₦{event.ticket_price.toLocaleString('en-NG')}
                </span>
              </div>
            </div>
          )}
        </div>
      </Card>
    </Link>
  )
}