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
      {/* Hero Image */}
      <div className="relative h-[50vh] md:h-[60vh] w-full bg-muted overflow-hidden">
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
          <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-primary/20 to-primary/5">
            <Music className="w-32 h-32 text-muted-foreground/30" aria-hidden="true" />
          </div>
        )}
        <div className="absolute inset-0 bg-linear-to-t from-background via-background/80 to-transparent" />
      </div>

      {/* Event Details */}
      <div className="container-wide py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                {event.title}
              </h1>

              {/* Meta Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {/* Date */}
                <div className="flex items-start gap-3 p-4 bg-card rounded-lg border">
                  <Calendar className="w-5 h-5 text-primary mt-1 shrink-0" aria-hidden="true" />
                  <div className="flex-1">
                    <div className="text-sm text-muted-foreground mb-1">Date</div>
                    <time dateTime={event.event_date} className="font-medium block">
                      {format(eventDate, 'EEEE, MMMM d, yyyy')}
                    </time>
                    {endDate && (
                      <time dateTime={event.end_date!} className="text-sm text-muted-foreground mt-1 block">
                        Until {format(endDate, 'MMMM d, yyyy')}
                      </time>
                    )}
                  </div>
                </div>

                {/* Time */}
                {event.time && (
                  <div className="flex items-start gap-3 p-4 bg-card rounded-lg border">
                    <Clock className="w-5 h-5 text-primary mt-1 shrink-0" aria-hidden="true" />
                    <div className="flex-1">
                      <div className="text-sm text-muted-foreground mb-1">Time</div>
                      <div className="font-medium">{event.time}</div>
                    </div>
                  </div>
                )}

                {/* Venue */}
                {event.venue && (
                  <div className="flex items-start gap-3 p-4 bg-card rounded-lg border">
                    <MapPin className="w-5 h-5 text-primary mt-1 shrink-0" aria-hidden="true" />
                    <div className="flex-1">
                      <div className="text-sm text-muted-foreground mb-1">Venue</div>
                      <div className="font-medium">{event.venue}</div>
                      {event.venue_address && (
                        <address className="text-sm text-muted-foreground mt-1 not-italic">
                          {event.venue_address}
                        </address>
                      )}
                      {event.city && (
                        <div className="text-sm text-muted-foreground">
                          {event.city}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Capacity */}
                {event.capacity && (
                  <div className="flex items-start gap-3 p-4 bg-card rounded-lg border">
                    <Users className="w-5 h-5 text-primary mt-1 shrink-0" aria-hidden="true" />
                    <div className="flex-1">
                      <div className="text-sm text-muted-foreground mb-1">Attendance</div>
                      <div className="font-medium mb-2">
                        {event.tickets_sold || 0} / {event.capacity.toLocaleString()} tickets sold
                      </div>
                      <EventTicketProgress event={event} showDetails={false} />
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                <Button
                  size="lg"
                  disabled={!hasAvailableTickets(event)}
                  asChild={hasAvailableTickets(event)}
                  className="min-w-[200px]"
                >
                  {!hasAvailableTickets(event) ? (
                    <>
                      <Ticket className="w-5 h-5 mr-2" aria-hidden="true" />
                      Sold Out
                    </>
                  ) : (
                    <Link href={`/events/${event.slug}/checkout`}>
                      <Ticket className="w-5 h-5 mr-2" aria-hidden="true" />
                      Get Tickets
                    </Link>
                  )}
                </Button>

                {/* Show leaderboard if enabled */}
                {event.show_leaderboard && (
                  <Button size="lg" variant="outline" asChild>
                    <Link href={`/events/${event.slug}/leaderboard`}>
                      <TrendingUp className="w-5 h-5 mr-2" aria-hidden="true" />
                      View Leaderboard
                    </Link>
                  </Button>
                )}
              </div>
            </div>

            {/* Description */}
            {(event.description || event.short_description) && (
              <section className="bg-card rounded-lg border p-8 mb-8" aria-labelledby="event-description-heading">
                <h2 id="event-description-heading" className="text-2xl font-bold mb-4">
                  About This Event
                </h2>
                {event.short_description && (
                  <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
                    {event.short_description}
                  </p>
                )}
                {event.description && (
                  <div className="prose prose-lg dark:prose-invert max-w-none">
                    <div className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                      {event.description}
                    </div>
                  </div>
                )}
              </section>
            )}

            {/* Additional Metadata */}
            {event.metadata && typeof event.metadata === 'object' && Object.keys(event.metadata).length > 0 && (
              <section className="bg-card rounded-lg border p-8" aria-labelledby="event-details-heading">
                <h2 id="event-details-heading" className="text-2xl font-bold mb-4">
                  Event Details
                </h2>
                <dl className="space-y-2 text-muted-foreground">
                  {Object.entries(event.metadata as Record<string, unknown>).map(([key, value]) => (
                    <div key={key} className="flex justify-between gap-4">
                      <dt className="capitalize font-medium">{key.replace(/_/g, ' ')}:</dt>
                      <dd className="font-medium text-foreground text-right">{String(value)}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            )}
          </div>

          {/* Sidebar - Ticket Info */}
          <aside className="lg:col-span-1" aria-labelledby="ticket-info-heading">
            <div className="bg-card rounded-lg border p-6 sticky top-8">
              <h3 id="ticket-info-heading" className="font-semibold text-xl mb-6">
                Ticket Information
              </h3>

              {/* Price */}
              {event.ticket_price !== null && event.ticket_price !== undefined && (
                <div className="mb-6">
                  <div className="text-sm text-muted-foreground mb-2">Starting from</div>
                  <div className="text-4xl font-bold text-primary" aria-label={`Starting from ${event.ticket_price.toLocaleString()} Naira`}>
                    ₦{event.ticket_price.toLocaleString('en-NG')}
                  </div>
                </div>
              )}

              {/* Availability Status */}
              <div className="mb-6 p-4 bg-muted rounded-lg">
                <EventTicketProgress event={event} />
              </div>

              {/* CTA Button */}
              <Button
                className="w-full mb-4"
                size="lg"
                disabled={!hasAvailableTickets(event)}
                asChild={hasAvailableTickets(event)}
              >
                {!hasAvailableTickets(event) ? (
                  <>
                    <AlertCircle className="w-4 h-4 mr-2" aria-hidden="true" />
                    Sold Out
                  </>
                ) : (
                  <Link href={`/events/${event.slug}/checkout`}>
                    <Ticket className="w-4 h-4 mr-2" aria-hidden="true" />
                    Buy Tickets Now
                  </Link>
                )}
              </Button>

              {/* Event Stats */}
              <div className="space-y-3 pt-4 border-t">
                {event.status && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Status</span>
                    <span className="font-medium capitalize">{event.status}</span>
                  </div>
                )}
                {event.published_at && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Published</span>
                    <span className="font-medium">
                      {format(new Date(event.published_at), 'MMM d, yyyy')}
                    </span>
                  </div>
                )}
              </div>

              {/* Security Note */}
              <div className="mt-6 pt-4 border-t text-xs text-center text-muted-foreground">
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