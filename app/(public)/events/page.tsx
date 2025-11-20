/**
 * Events List Page
 * Displays all upcoming published events
 */

import { EventCard } from '@/components/events/EventCard'
import { PageHero } from '@/components/layout/page-hero'
import { getEventsCached } from '@/lib/services/events'
import { Calendar } from 'lucide-react'

export const metadata = {
  title: 'Upcoming Events - Afromerica Entertainment',
  description: 'Experience the best of African and Caribbean music and culture. Browse our upcoming events and get your tickets today.',
  keywords: ['African music events', 'Nigerian concerts', 'live music', 'African entertainment', 'upcoming events'],
}

// Enable ISR with 5-minute revalidation
export const revalidate = 300;

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
    <div className="min-h-screen">
      <PageHero
        title="Upcoming Events"
        description="Experience the best of African and Caribbean music and culture"
        badge="Events"
      />

      <section className="container-wide py-16" aria-label="Event listings">
        {events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Calendar className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" aria-hidden="true" />
            <h2 className="text-2xl font-semibold mb-2">No Upcoming Events</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Check back soon for exciting new events. Follow us on social media to stay updated!
            </p>
          </div>
        )}
      </section>
    </div>
  )
}
