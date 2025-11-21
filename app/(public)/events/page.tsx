/**
 * Events List Page
 * Displays all upcoming published events
 */

import type { Metadata } from 'next'
import { EventCard } from '@/components/events/EventCard'
import { PageHero } from '@/components/layout/page-hero'
import { getEventsCached } from '@/lib/services/events'
import { Calendar } from 'lucide-react'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Upcoming Events - Afromerica Entertainment',
  description: 'Experience the best of African and Caribbean music and culture. Browse our upcoming events and get your tickets today.',
  keywords: ['African music events', 'Nigerian concerts', 'live music', 'African entertainment', 'upcoming events'],
}

export default async function EventsPage() {
  // Fetch upcoming events using cached service layer
  const { events, error } = await getEventsCached({
    filter: 'upcoming',
    sort: 'date-asc',
  })

  if (error) {
    console.error('Error fetching events:', error)
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <PageHero
        title="Upcoming Events"
        description="Experience the best of African and Caribbean music and culture"
        badge="Events"
      />

      <section className="relative py-24 md:py-32 lg:py-40 overflow-hidden" aria-label="Event listings">
        {/* Apple-style gradient background */}
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-gray-50/50 to-gray-50 dark:from-transparent dark:via-gray-900/30 dark:to-gray-900/50" />

        <div className="relative max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16">
          {events.length > 0 ? (
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
          ) : (
            <div className="flex flex-col items-center justify-center py-32 md:py-40 px-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-linear-to-br from-blue-500/20 to-purple-500/20 dark:from-blue-400/10 dark:to-purple-400/10 blur-3xl rounded-full" />
                <Calendar
                  className="relative w-20 h-20 md:w-24 md:h-24 text-gray-300 dark:text-gray-700 stroke-[1.5]"
                  aria-hidden="true"
                />
              </div>

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-gray-900 dark:text-white mb-4 text-center">
                No upcoming events.
              </h2>

              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-center leading-relaxed font-light">
                Check back soon for exciting new events.<br className="hidden sm:block" />
                Follow us on social media to stay updated.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
