/**
 * Events List Page
 * Shows upcoming published events first, then past events (most recent first)
 */

import type { Metadata } from 'next'
import { EventCard } from '@/components/events/EventCard'
import { PageHero } from '@/components/layout/page-hero'
import { getEventsCached } from '@/lib/services/events'
import type { PublicEvent } from '@/lib/validations/event'
import { Calendar } from 'lucide-react'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Events - Afromerica Entertainment',
  description: 'Experience the best of African and Caribbean music and culture. Browse upcoming events and look back at past shows.',
  keywords: ['African music events', 'Nigerian concerts', 'live music', 'African entertainment', 'upcoming events', 'past events'],
}

// Drafts and cancelled events never appear in either list
const HIDDEN_STATUSES = new Set(['draft', 'cancelled'])

function EventGrid({ events }: { events: PublicEvent[] }) {
  return (
    <div className="flex flex-wrap justify-center gap-8 lg:gap-10">
      {events.map((event, index) => (
        <div
          key={event.id}
          className="w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.75rem)] xl:w-[300px] min-w-[280px] max-w-[400px] animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <EventCard event={event} />
        </div>
      ))}
    </div>
  )
}

export default async function EventsPage() {
  const { events, error } = await getEventsCached({ sort: 'date-asc' })

  if (error) {
    console.error('Error fetching events:', error)
  }

  const listed = events.filter((event) => !HIDDEN_STATUSES.has(event.status))
  const upcomingEvents = listed.filter((event) => !event.is_past)
  const pastEvents = listed.filter((event) => event.is_past).reverse()

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <PageHero
        title="Events"
        description="Experience the best of African and Caribbean music and culture"
        badge="Events"
      />

      <section className="relative pb-24 overflow-hidden" aria-labelledby="upcoming-events-heading">
        {/* Apple-style gradient background */}
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-gray-50/50 to-gray-50 dark:from-transparent dark:via-gray-900/30 dark:to-gray-900/50" />

        <div className="relative max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16">
          <h2
            id="upcoming-events-heading"
            className="text-2xl md:text-3xl font-semibold tracking-tight text-gray-900 dark:text-white mb-10 text-center"
          >
            Upcoming Events
          </h2>

          {upcomingEvents.length > 0 ? (
            <EventGrid events={upcomingEvents} />
          ) : (
            <div className="mx-auto max-w-2xl flex items-center gap-4 rounded-2xl border border-gray-200/60 dark:border-gray-800 bg-white/70 dark:bg-gray-900/70 px-6 py-5">
              <Calendar className="w-8 h-8 shrink-0 text-gray-400 dark:text-gray-500 stroke-[1.5]" aria-hidden="true" />
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">No upcoming events right now.</p>
                <p className="text-gray-600 dark:text-gray-400 font-light">
                  New events are on the way. Follow us on social media to hear first.
                </p>
              </div>
            </div>
          )}

          {pastEvents.length > 0 && (
            <section aria-labelledby="past-events-heading" className="mt-16 pt-12 border-t border-gray-200/60 dark:border-gray-800">
              <h2
                id="past-events-heading"
                className="text-2xl md:text-3xl font-semibold tracking-tight text-gray-900 dark:text-white mb-3 text-center"
              >
                Past Events
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-center font-light mb-10">
                Relive the shows, results and winners.
              </p>
              <EventGrid events={pastEvents} />
            </section>
          )}
        </div>
      </section>
    </div>
  )
}
