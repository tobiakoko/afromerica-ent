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
import { PUBLIC_ROUTES } from '@/lib/constants'

interface EventCardProps {
  event: PublicEvent
  priority?: boolean
}

export function EventCard({ event, priority = false }: EventCardProps) {
  const eventDate = new Date(event.event_date)

  return (
    <Link
      href={PUBLIC_ROUTES.EVENT_DETAIL(event.slug)}
      className="group block h-full"
    >
      {/* Apple-style card with minimal border and subtle shadow */}
      <div className="h-full flex flex-col bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-200/60 dark:border-gray-800 transition-all duration-500 hover:shadow-2xl hover:shadow-black/10 dark:hover:shadow-black/40 hover:-translate-y-1">
        {/* Image */}
        <div className="relative bg-gray-100 dark:bg-gray-800 aspect-[4/3] overflow-hidden">
          {(event.image_url || event.cover_image_url) ? (
            <Image
              src={event.image_url || event.cover_image_url!}
              alt={`${event.title} event image`}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 400px"
              priority={priority}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900">
              <Music className="w-20 h-20 text-gray-300 dark:text-gray-700 stroke-[1.5]" aria-hidden="true" />
            </div>
          )}

          {/* Status Overlays */}
          {event.is_sold_out && (
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center">
              <span className="text-white font-semibold text-2xl tracking-tight">Sold Out</span>
            </div>
          )}

          {/* Badges - Apple style minimal badges */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            {event.featured && !event.is_sold_out && (
              <span className="px-3 py-1.5 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md text-gray-900 dark:text-white rounded-full text-xs font-medium shadow-lg">
                Featured
              </span>
            )}
            {event.sold_out_percentage >= 90 && !event.is_sold_out && (
              <span className="px-3 py-1.5 bg-orange-500/95 backdrop-blur-md text-white rounded-full text-xs font-medium shadow-lg">
                Almost Full
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col p-6 pb-7">
          <h3 className="font-semibold text-xl md:text-2xl tracking-tight text-gray-900 dark:text-white mb-4 line-clamp-2 leading-snug">
            {event.title}
          </h3>

          <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400 mt-auto">
            <div className="flex items-start gap-3">
              <Calendar className="w-[18px] h-[18px] shrink-0 mt-0.5 stroke-[1.5]" aria-hidden="true" />
              <time dateTime={event.event_date} className="leading-relaxed">
                {format(eventDate, 'MMMM d, yyyy')}
                {event.time && <span className="block text-xs mt-0.5 text-gray-500 dark:text-gray-500">{event.time}</span>}
              </time>
            </div>

            {event.venue && (
              <div className="flex items-start gap-3">
                <MapPin className="w-[18px] h-[18px] shrink-0 mt-0.5 stroke-[1.5]" aria-hidden="true" />
                <span className="line-clamp-2 leading-relaxed">
                  {event.venue}
                  {event.city && <span className="block text-xs mt-0.5 text-gray-500 dark:text-gray-500">{event.city}</span>}
                </span>
              </div>
            )}

            {event.show_leaderboard && (
              <div className="flex items-center gap-3 text-blue-600 dark:text-blue-400">
                <TrendingUp className="w-[18px] h-[18px] shrink-0 stroke-[1.5]" aria-hidden="true" />
                <span className="font-medium">Voting Enabled</span>
              </div>
            )}
          </div>

          {/* Price - Apple style clean pricing */}
          {event.ticket_price !== null && event.ticket_price !== undefined && (
            <div className="mt-6 pt-5 border-t border-gray-200/60 dark:border-gray-800">
              <div className="flex items-baseline justify-between">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-500 uppercase tracking-wider">From</span>
                <span className="text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">
                  ₦{event.ticket_price.toLocaleString('en-NG')}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}