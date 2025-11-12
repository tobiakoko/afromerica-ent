'use client'

import React from 'react'
import { useEvents } from '../hooks/use-events'
import { EventCard } from './event-card'
import { EventCardSkeleton } from './event-card-skeleton'
import { EventFilters } from './event-filters'
import { FeaturedEvent } from './featured-event'
import type { Event, PaginatedResponse } from '@/types'
import type { EventFilter, EventCategoryFilter } from '../types/event.types'

interface EventsPageClientProps {
  initialEvents: PaginatedResponse<Event>
  featuredEvent: Event
}

export function EventsPageClient({ initialEvents, featuredEvent }: EventsPageClientProps) {
  const [activeFilter, setActiveFilter] = React.useState<EventFilter>('all')
  const [categoryFilter, setCategoryFilter] = React.useState<EventCategoryFilter>('all')
  const [searchQuery, setSearchQuery] = React.useState('')
  
  const { data, isLoading } = useEvents({
    filter: activeFilter,
    category: categoryFilter === 'all' ? undefined : categoryFilter,
    search: searchQuery || undefined
  })

  const events = data?.data || initialEvents.data

  return (
    <div className="min-h-screen bg-black">
      <FeaturedEvent event={featuredEvent} />

      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-8">
          <EventFilters
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            categoryFilter={categoryFilter}
            onCategoryChange={setCategoryFilter}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {[...Array(6)].map((_, i) => (
                <EventCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}