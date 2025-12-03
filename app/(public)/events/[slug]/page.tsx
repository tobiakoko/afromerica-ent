/**
 * Event Detail Page
 * Displays comprehensive information about a single event
 */

import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Calendar, MapPin, Clock, Ticket, Music, Users, TrendingUp, AlertCircle } from 'lucide-react'
import { format } from 'date-fns'
import { getEventBySlug, hasAvailableTickets } from '@/lib/services/events'
import { EventTicketProgress } from '@/components/events/EventTicketProgress'

export const dynamic = 'force-dynamic'

interface EventPageProps {
  params: Promise<{ slug: string }>
}

export default async function EventPage({ params }: EventPageProps) {
  const { slug } = await params

  // Fetch event with service layer (includes validation & transformation)
  const { event, error } = await getEventBySlug(slug)

  // Handle errors
  if (error) {
    console.error('Error fetching event:', error)
    notFound()
  }

  // Handle not found
  if (!event) {
    notFound()
  }

  // Derive dates
  const eventDate = new Date(event.event_date)
  const endDate = event.end_date ? new Date(event.end_date) : null

  // Get event image with type safety
  const eventImage = event.cover_image_url || event.image_url

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-linear-to-b from-white via-gray-50/50 to-white dark:from-gray-950 dark:via-gray-900/50 dark:to-gray-950" />

        {/* Hero Image */}
        <div className="relative h-[50vh] md:h-[60vh] w-full overflow-hidden animate-in fade-in duration-1000">
          {eventImage ? (
            <Image
              src={eventImage}
              alt={`${event.title} cover image`}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-gray-100 via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-950">
              <div className="relative">
                <div className="absolute inset-0 bg-linear-to-br from-blue-500/20 to-purple-500/20 blur-3xl rounded-full" />
                <Music className="relative w-32 h-32 text-gray-300 dark:text-gray-700 stroke-[1.5]" aria-hidden="true" />
              </div>
            </div>
          )}
          {/* Sophisticated Gradient Overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-white via-white/80 to-transparent dark:from-gray-950 dark:via-gray-950/80 dark:to-transparent" />
        </div>
      </section>

      {/* Event Details */}
      <div className="relative max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Header with Staggered Animation */}
            <div className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-1000" style={{ animationDelay: '100ms' }}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-gray-900 dark:text-white mb-6 leading-tight">
                {event.title}
              </h1>

              {/* Meta Info Grid with Refined Glassmorphism */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {/* Date */}
                <div className="flex items-start gap-4 p-5 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-2xl border border-gray-200/60 dark:border-gray-800 shadow-lg transition-all duration-500 hover:shadow-xl hover:-translate-y-0.5 animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: '200ms' }}>
                  <Calendar className="w-[18px] h-[18px] text-gray-600 dark:text-gray-400 mt-1 shrink-0 stroke-[1.5]" aria-hidden="true" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-gray-500 dark:text-gray-500 uppercase tracking-wider mb-2">Date</div>
                    <time dateTime={event.event_date} className="font-semibold text-gray-900 dark:text-white block leading-snug">
                      {format(eventDate, 'EEEE, MMMM d, yyyy')}
                    </time>
                    {endDate && (
                      <time dateTime={event.end_date!} className="text-sm text-gray-600 dark:text-gray-400 mt-1.5 block font-light">
                        Until {format(endDate, 'MMMM d, yyyy')}
                      </time>
                    )}
                  </div>
                </div>

                {/* Time */}
                {event.time && (
                  <div className="flex items-start gap-4 p-5 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-2xl border border-gray-200/60 dark:border-gray-800 shadow-lg transition-all duration-500 hover:shadow-xl hover:-translate-y-0.5 animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: '250ms' }}>
                    <Clock className="w-[18px] h-[18px] text-gray-600 dark:text-gray-400 mt-1 shrink-0 stroke-[1.5]" aria-hidden="true" />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-gray-500 dark:text-gray-500 uppercase tracking-wider mb-2">Time</div>
                      <div className="font-semibold text-gray-900 dark:text-white">{event.time}</div>
                    </div>
                  </div>
                )}

                {/* Venue */}
                {event.venue && (
                  <div className="flex items-start gap-4 p-5 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-2xl border border-gray-200/60 dark:border-gray-800 shadow-lg transition-all duration-500 hover:shadow-xl hover:-translate-y-0.5 animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: '300ms' }}>
                    <MapPin className="w-[18px] h-[18px] text-gray-600 dark:text-gray-400 mt-1 shrink-0 stroke-[1.5]" aria-hidden="true" />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-gray-500 dark:text-gray-500 uppercase tracking-wider mb-2">Venue</div>
                      <div className="font-semibold text-gray-900 dark:text-white leading-snug">{event.venue}</div>
                      {event.venue_address && (
                        <address className="text-sm text-gray-600 dark:text-gray-400 mt-1.5 not-italic font-light leading-relaxed">
                          {event.venue_address}
                        </address>
                      )}
                      {event.city && (
                        <div className="text-sm text-gray-600 dark:text-gray-400 font-light">
                          {event.city}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Capacity */}
                {event.capacity && (
                  <div className="flex items-start gap-4 p-5 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-2xl border border-gray-200/60 dark:border-gray-800 shadow-lg transition-all duration-500 hover:shadow-xl hover:-translate-y-0.5 animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: '350ms' }}>
                    <Users className="w-[18px] h-[18px] text-gray-600 dark:text-gray-400 mt-1 shrink-0 stroke-[1.5]" aria-hidden="true" />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-gray-500 dark:text-gray-500 uppercase tracking-wider mb-2">Attendance</div>
                      <div className="font-semibold text-gray-900 dark:text-white mb-3 leading-snug">
                        {event.tickets_sold || 0} / {event.capacity.toLocaleString()} tickets sold
                      </div>
                      <EventTicketProgress event={event} showDetails={false} />
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons with Refined Styling */}
              <div className="flex flex-wrap gap-4 animate-in fade-in slide-in-from-bottom-4 duration-1000" style={{ animationDelay: '400ms' }}>
                <Button
                  size="lg"
                  disabled={!hasAvailableTickets(event)}
                  asChild={hasAvailableTickets(event)}
                  className="min-w-[200px] rounded-xl text-base font-semibold transition-all duration-500 hover:shadow-2xl hover:shadow-black/10 dark:hover:shadow-black/40 hover:-translate-y-1"
                >
                  {!hasAvailableTickets(event) ? (
                    <>
                      <Ticket className="w-5 h-5 mr-2 stroke-[1.5]" aria-hidden="true" />
                      Sold Out
                    </>
                  ) : (
                    <Link href={`/events/${event.slug}/checkout`}>
                      <Ticket className="w-5 h-5 mr-2 stroke-[1.5]" aria-hidden="true" />
                      Book Table Reservation
                    </Link>
                  )}
                </Button>

                {/* Show leaderboard if enabled */}
                {event.show_leaderboard && (
                  <Button size="lg" variant="outline" asChild className="rounded-xl text-base font-semibold border-gray-200/60 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-500 hover:shadow-xl hover:-translate-y-1">
                    <Link href={`/events/${event.slug}/leaderboard`}>
                      <TrendingUp className="w-5 h-5 mr-2 stroke-[1.5]" aria-hidden="true" />
                      View Leaderboard
                    </Link>
                  </Button>
                )}
              </div>
            </div>

            {/* Description Section with Refined Design */}
            {(event.description || event.short_description) && (
              <section className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-2xl border border-gray-200/60 dark:border-gray-800 p-8 lg:p-10 mb-8 shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-1000" style={{ animationDelay: '500ms' }} aria-labelledby="event-description-heading">
                <h2 id="event-description-heading" className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-white mb-6">
                  About This Event
                </h2>
                {event.short_description && (
                  <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 font-light mb-6 leading-relaxed">
                    {event.short_description}
                  </p>
                )}
                {event.description && (
                  <div className="prose prose-lg dark:prose-invert max-w-none">
                    <div className="text-lg text-gray-600 dark:text-gray-400 font-light whitespace-pre-wrap leading-relaxed">
                      {event.description}
                    </div>
                  </div>
                )}
              </section>
            )}

            {/* Additional Metadata with Enhanced Layout */}
            {event.metadata && typeof event.metadata === 'object' && Object.keys(event.metadata).length > 0 && (
              <section className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-2xl border border-gray-200/60 dark:border-gray-800 p-8 lg:p-10 shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-1000" style={{ animationDelay: '600ms' }} aria-labelledby="event-details-heading">
                <h2 id="event-details-heading" className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-white mb-6">
                  Event Details
                </h2>
                <dl className="space-y-4">
                  {Object.entries(event.metadata as Record<string, unknown>).map(([key, value]) => (
                    <div key={key} className="flex justify-between gap-6 pb-4 border-b border-gray-200/60 dark:border-gray-800 last:border-0 last:pb-0">
                      <dt className="capitalize font-medium text-gray-600 dark:text-gray-400">{key.replace(/_/g, ' ')}</dt>
                      <dd className="font-semibold text-gray-900 dark:text-white text-right">{String(value)}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            )}
          </div>

          {/* Sidebar - Ticket Info with Premium Design */}
          <aside className="lg:col-span-1 animate-in fade-in slide-in-from-bottom-4 duration-1000" style={{ animationDelay: '200ms' }} aria-labelledby="ticket-info-heading">
            <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-2xl border border-gray-200/60 dark:border-gray-800 p-8 sticky top-8 shadow-2xl shadow-black/10 dark:shadow-black/40">
              <h3 id="ticket-info-heading" className="font-semibold text-2xl tracking-tight text-gray-900 dark:text-white mb-8">
                Ticket Information
              </h3>

              {/* Price with Apple-style Large Number Display */}
              {event.ticket_price !== null && event.ticket_price !== undefined && (
                <div className="mb-8">
                  <div className="text-xs font-medium text-gray-500 dark:text-gray-500 uppercase tracking-wider mb-3">Starting from</div>
                  <div className="text-5xl md:text-6xl font-semibold tracking-tight text-gray-900 dark:text-white" aria-label={`Starting from ${event.ticket_price.toLocaleString()} Naira`}>
                    ₦{event.ticket_price.toLocaleString('en-NG')}
                  </div>
                </div>
              )}

              {/* Availability Status with Refined Background */}
              <div className="mb-8 p-5 bg-gray-50/50 dark:bg-gray-800/50 rounded-xl border border-gray-200/60 dark:border-gray-800">
                <EventTicketProgress event={event} />
              </div>

              {/* CTA Button with Enhanced Hover */}
              <Button
                className="w-full mb-6 rounded-xl text-base font-semibold transition-all duration-500 hover:shadow-2xl hover:shadow-black/10 dark:hover:shadow-black/40 hover:-translate-y-1"
                size="lg"
                disabled={!hasAvailableTickets(event)}
                asChild={hasAvailableTickets(event)}
              >
                {!hasAvailableTickets(event) ? (
                  <>
                    <AlertCircle className="w-[18px] h-[18px] mr-2 stroke-[1.5]" aria-hidden="true" />
                    Sold Out
                  </>
                ) : (
                  <Link href={`/events/${event.slug}/checkout`}>
                    <Ticket className="w-[18px] h-[18px] mr-2 stroke-[1.5]" aria-hidden="true" />
                    Book Table Reservation
                  </Link>
                )}
              </Button>

              {/* Event Stats with Refined Typography */}
              <div className="space-y-4 pt-6 border-t border-gray-200/60 dark:border-gray-800">
                {event.status && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400 font-light">Status</span>
                    <span className="font-semibold text-gray-900 dark:text-white capitalize">{event.status}</span>
                  </div>
                )}
                {event.published_at && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400 font-light">Published</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {format(new Date(event.published_at), 'MMM d, yyyy')}
                    </span>
                  </div>
                )}
              </div>

              {/* Security Note with Icon */}
              <div className="mt-8 pt-6 border-t border-gray-200/60 dark:border-gray-800 text-xs text-center text-gray-500 dark:text-gray-500 font-light leading-relaxed">
                🔒 Secure booking powered by Paystack
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

/**
 * Generate metadata for SEO
 * Optimized for social sharing and search engines
 */
export async function generateMetadata({ params }: EventPageProps) {
  const { slug } = await params
  const { event } = await getEventBySlug(slug)

  if (!event) {
    return {
      title: 'Event Not Found',
      description: 'The event you are looking for could not be found.',
    }
  }

  const eventDate = new Date(event.event_date)
  const formattedDate = format(eventDate, 'MMMM d, yyyy')

  // Create SEO-optimized description
  const description = event.short_description
    || event.description?.slice(0, 160)
    || `Join us for ${event.title} on ${formattedDate} at ${event.venue || 'our venue'}${event.city ? ` in ${event.city}` : ''}. Get your tickets now!`

  // Use cover image with fallback
  const imageUrl = event.cover_image_url || event.image_url
  const images = imageUrl ? [{ url: imageUrl, alt: `${event.title} cover image` }] : []

  return {
    title: `${event.title} - Afromerica Entertainment`,
    description,
    keywords: [
      'African music',
      'live event',
      'concert',
      event.city,
      'Nigerian entertainment',
      'Afromerica',
      ...(event.venue ? [event.venue] : []),
    ].filter((k): k is string => Boolean(k)),
    openGraph: {
      title: event.title,
      description,
      images,
      type: 'website',
      siteName: 'Afromerica Entertainment',
      locale: 'en_NG',
    },
    twitter: {
      card: 'summary_large_image',
      title: event.title,
      description,
      images,
      creator: '@afromerica',
    },
    alternates: {
      canonical: `/events/${event.slug}`,
    },
  }
}